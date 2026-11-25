const axios = require("axios");
const { parseHTML } = require("../utils/parser");

const weights = {
  title: 12,
  description: 12,
  h1: 10,
  canonical: 10,
  viewport: 10,
  robots: 8,
  language: 8,
  openGraph: 10,
  images: 10,
  content: 10,
};

function createCheck(id, name, passed, weight, details, recommendation) {
  return {
    id,
    name,
    status: passed ? "passed" : "warning",
    weight,
    details,
    recommendation: passed ? null : recommendation,
  };
}

function generateSEOChecks(data) {
  return [
    createCheck(
      "title",
      "SEO Title",
      data.titleLength >= 30 && data.titleLength <= 60,
      weights.title,
      data.title
        ? `Title contains ${data.titleLength} characters`
        : "Page title is missing",
      "Add a descriptive title between 30 and 60 characters."
    ),

    createCheck(
      "description",
      "Meta Description",
      data.descriptionLength >= 120 && data.descriptionLength <= 160,
      weights.description,
      data.metaDescription
        ? `Description contains ${data.descriptionLength} characters`
        : "Meta description is missing",
      "Add a relevant meta description between 120 and 160 characters."
    ),

    createCheck(
      "h1",
      "Heading Structure",
      data.h1Count === 1,
      weights.h1,
      `${data.h1Count} H1 heading(s) detected`,
      "Use exactly one descriptive H1 heading for the main page topic."
    ),

    createCheck(
      "canonical",
      "Canonical URL",
      Boolean(data.canonical),
      weights.canonical,
      data.canonical || "Canonical URL is missing",
      "Add a canonical link tag to identify the preferred page URL."
    ),

    createCheck(
      "viewport",
      "Mobile Viewport",
      Boolean(data.viewport),
      weights.viewport,
      data.viewport || "Viewport meta tag is missing",
      "Add a responsive viewport meta tag."
    ),

    createCheck(
      "robots",
      "Robots Directive",
      !/noindex/i.test(data.robots),
      weights.robots,
      data.robots || "No explicit robots directive found",
      "Review robots directives and ensure important pages are indexable."
    ),

    createCheck(
      "language",
      "HTML Language",
      Boolean(data.language),
      weights.language,
      data.language || "HTML language attribute is missing",
      "Add an appropriate lang attribute to the HTML element."
    ),

    createCheck(
      "openGraph",
      "Open Graph Metadata",
      Boolean(data.ogTitle && data.ogDescription && data.ogImage),
      weights.openGraph,
      `${[
        data.ogTitle && "Title",
        data.ogDescription && "Description",
        data.ogImage && "Image",
      ].filter(Boolean).join(", ") || "No Open Graph tags"} detected`,
      "Add Open Graph title, description and image metadata."
    ),

    createCheck(
      "images",
      "Image Accessibility",
      data.imagesMissingAlt === 0,
      weights.images,
      `${data.imagesMissingAlt} of ${data.images} images missing ALT text`,
      "Add meaningful ALT attributes to informative images."
    ),

    createCheck(
      "content",
      "Content Depth",
      data.wordCount >= 300,
      weights.content,
      `${data.wordCount} words detected`,
      "Consider adding useful, relevant content to improve page coverage."
    ),
  ];
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

    const seoScore = checks.reduce(
      (score, check) => score +
        (check.status === "passed" ? check.weight : 0),
      0
    );

    const recommendations = checks
      .filter((check) => check.recommendation)
      .map((check) => ({
        category: check.id,
        priority: check.status === "warning" ? "Improve" : "Passed",
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
};
