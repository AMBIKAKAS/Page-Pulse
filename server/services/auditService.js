const axios = require("axios");
const { parseHTML } = require("../utils/parser");

const weights = {
  title: 10,
  description: 10,
  h1: 10,
  canonical: 10,
  viewport: 10,
  robots: 10,
  language: 5,
  openGraph: 10,
  images: 10,
  content: 15,
};

function createCheck(id, name, earnedPoints, weight, details, recommendation) {
  const earned = Math.max(0, Math.min(weight, earnedPoints));

  return {
    id,
    name,
    status: earned >= weight ? "passed" : earned > 0 ? "partial" : "warning",
    weight,
    earnedPoints: earned,
    details,
    recommendation: earned >= weight ? null : recommendation,
  };
}

function generateSEOChecks(data) {
  const titleLength = data.titleLength || 0;
  const descriptionLength = data.descriptionLength || 0;

  const titlePoints =
    titleLength >= 30 && titleLength <= 60 ? 10 :
    titleLength >= 20 && titleLength <= 70 ? 7 :
    titleLength > 0 ? 4 : 0;

  const descriptionPoints =
    descriptionLength >= 120 && descriptionLength <= 160 ? 10 :
    descriptionLength >= 70 && descriptionLength <= 180 ? 7 :
    descriptionLength > 0 ? 4 : 0;

  const headingPoints =
    data.h1Count === 1 ? 10 :
    data.h1Count > 1 ? 6 : 0;

  const ogCount = [
    data.ogTitle,
    data.ogDescription,
    data.ogImage,
  ].filter(Boolean).length;

  const imagePoints = data.images === 0
    ? 10
    : Math.round(((data.images - data.imagesMissingAlt) / data.images) * 10);

  const contentPoints =
    data.wordCount >= 600 ? 15 :
    data.wordCount >= 300 ? 12 :
    data.wordCount >= 150 ? 8 :
    data.wordCount > 0 ? 4 : 0;

  return [
    createCheck(
      "title", "SEO Title", titlePoints, weights.title,
      data.title
        ? `Title contains ${titleLength} characters`
        : "Page title is missing",
      "Use a descriptive, relevant title. Around 30–60 characters is a useful guideline."
    ),

    createCheck(
      "description", "Meta Description", descriptionPoints, weights.description,
      data.metaDescription
        ? `Description contains ${descriptionLength} characters`
        : "Meta description is missing",
      "Write a useful meta description. Around 120–160 characters is a practical guideline."
    ),

    createCheck(
      "h1", "Heading Structure", headingPoints, weights.h1,
      `${data.h1Count} H1 heading(s) detected`,
      "Use a clear main heading that describes the page topic. Avoid multiple competing H1 headings."
    ),

    createCheck(
      "canonical", "Canonical URL",
      data.canonical ? 10 : 0, weights.canonical,
      data.canonical || "Canonical URL is missing",
      "Add a canonical link tag when the page has a preferred URL."
    ),

    createCheck(
      "viewport", "Mobile Viewport",
      data.viewport ? 10 : 0, weights.viewport,
      data.viewport || "Viewport meta tag is missing",
      "Add a responsive viewport meta tag for mobile devices."
    ),

    createCheck(
      "robots", "Robots Directive",
      /noindex/i.test(data.robots) ? 0 : 10, weights.robots,
      data.robots || "No explicit robots directive found",
      "Review robots directives and ensure pages intended for search engines are indexable."
    ),

    createCheck(
      "language", "HTML Language",
      data.language ? 5 : 0, weights.language,
      data.language || "HTML language attribute is missing",
      "Add an appropriate lang attribute to the HTML element."
    ),

    createCheck(
      "openGraph", "Open Graph Metadata",
      Math.round((ogCount / 3) * weights.openGraph), weights.openGraph,
      `${[
        data.ogTitle && "Title",
        data.ogDescription && "Description",
        data.ogImage && "Image",
      ].filter(Boolean).join(", ") || "No Open Graph tags"} detected`,
      "Add Open Graph title, description and image metadata for better social sharing."
    ),

    createCheck(
      "images", "Image Accessibility",
      imagePoints, weights.images,
      `${data.imagesMissingAlt} of ${data.images} images missing ALT text`,
      "Add meaningful ALT text to informative images. Decorative images can use empty ALT text."
    ),

    createCheck(
      "content", "Content Depth",
      contentPoints, weights.content,
      `${data.wordCount} words detected`,
      "Create useful, relevant content that satisfies the page's purpose. Word count alone does not determine content quality."
    ),
  ];
}

function calculateSEOScore(checks) {
  return Math.round(
    checks.reduce((total, check) => total + check.earnedPoints, 0)
  );
}

async function checkBrokenLinks(links) {
  const selected = links.slice(0, 20);

  const results = await Promise.all(
    selected.map(async (link) => {
      try {
        const response = await axios.head(link.url, {
          timeout: 4000,
          maxRedirects: 3,
          validateStatus: () => true,
          headers: {
            "User-Agent": "PagePulse SEO Auditor/1.0",
          },
        });

        return {
          ...link,
          status: response.status,
          broken: response.status >= 400,
        };
      } catch (error) {
        return {
          ...link,
          status: null,
          broken: false,
          error: "Could not verify link",
        };
      }
    })
  );

  return {
    checked: results.length,
    broken: results.filter((link) => link.broken).length,
    results,
  };
}

const auditWebsiteService = async (url) => {
  const start = Date.now();

  try {
    const response = await axios.get(url, {
      timeout: 10000,
      maxRedirects: 3,
      validateStatus: () => true,
      headers: {
        "User-Agent": "PagePulse SEO Auditor/1.0",
      },
    });

    const responseTime = Date.now() - start;
    const contentType = response.headers["content-type"] || "";

    if (!contentType.includes("text/html")) {
      throw new Error("The website did not return HTML content.");
    }

    const parsed = parseHTML(response.data, url);
    const checks = generateSEOChecks(parsed);

    const seoScore = calculateSEOScore(checks);

    const recommendations = checks
      .filter((check) => check.recommendation)
      .map((check) => ({
        category: check.id,
        priority: check.status === "warning" ? "High" : check.status === "partial" ? "Medium" : "Passed",
        title: check.name,
        description: check.recommendation,
      }));

    const brokenLinks = await checkBrokenLinks(parsed.links);

    return {
      url,
      status: response.status,
      responseTime: `${responseTime} ms`,
      seoScore,
      seoGrade:
        seoScore >= 90 ? "Excellent" :
        seoScore >= 70 ? "Good" :
        seoScore >= 50 ? "Needs Improvement" : "Poor",
      checks,
      recommendations,
      brokenLinks,
      ...parsed,
    };
  } catch (error) {
    if (error.code === "ECONNABORTED") {
      throw new Error("Website request timed out.");
    }

    throw error;
  }
};

module.exports = {
  auditWebsiteService,
  generateSEOChecks,
  calculateSEOScore,
};
