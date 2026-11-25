const cheerio = require("cheerio");

function parseHTML(html, pageUrl) {
  const $ = cheerio.load(html);

  const title = $("title").first().text().trim();
  const metaDescription =
    $('meta[name="description"]').attr("content") || "";

  const canonical = $('link[rel="canonical"]').attr("href") || "";
  const robots = $('meta[name="robots"]').attr("content") || "";
  const viewport = $('meta[name="viewport"]').attr("content") || "";
  const language = $("html").attr("lang") || "";

  const ogTitle = $('meta[property="og:title"]').attr("content") || "";
  const ogDescription =
    $('meta[property="og:description"]').attr("content") || "";
  const ogImage = $('meta[property="og:image"]').attr("content") || "";

  const twitterCard =
    $('meta[name="twitter:card"]').attr("content") || "";

  const headings = {
    h1: $("h1").length,
    h2: $("h2").length,
    h3: $("h3").length,
  };

  const images = $("img").length;
  let imagesMissingAlt = 0;

  $("img").each((_, image) => {
    const alt = $(image).attr("alt");
    if (alt === undefined || alt.trim() === "") {
      imagesMissingAlt++;
    }
  });

  const bodyText = $("body").text().replace(/\s+/g, " ").trim();
  const wordCount = bodyText ? bodyText.split(" ").length : 0;

  const links = [];

  $("a[href]").each((_, element) => {
    const href = $(element).attr("href");

    try {
      const absoluteUrl = new URL(href, pageUrl);

      if (["http:", "https:"].includes(absoluteUrl.protocol)) {
        links.push({
          url: absoluteUrl.href,
          text: $(element).text().trim().slice(0, 100),
          type: absoluteUrl.hostname === new URL(pageUrl).hostname
            ? "internal"
            : "external",
        });
      }
    } catch {
      // Ignore invalid links
    }
  });

  return {
    title,
    titleLength: title.length,
    metaDescription,
    descriptionLength: metaDescription.length,
    canonical,
    robots,
    viewport,
    language,
    ogTitle,
    ogDescription,
    ogImage,
    twitterCard,
    headings,
    h1Count: headings.h1,
    images,
    imagesMissingAlt,
    wordCount,
    links: links.slice(0, 100),
    totalLinks: links.length,
  };
}

module.exports = { parseHTML };
