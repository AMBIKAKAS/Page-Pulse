const cheerio = require("cheerio");

function parseHTML(html) {
  const $ = cheerio.load(html);

  const title = $("title").text().trim();

  const metaDescription =
    $('meta[name="description"]').attr("content") || "Not Found";

  const h1Count = $("h1").length;

  let imagesMissingAlt = 0;

  $("img").each((i, img) => {
    const alt = $(img).attr("alt");

    if (!alt || alt.trim() === "") {
      imagesMissingAlt++;
    }
  });

  const bodyText = $("body")
    .text()
    .replace(/\s+/g, " ")
    .trim();

  const wordCount = bodyText.length
    ? bodyText.split(" ").length
    : 0;

  return {
    title,
    metaDescription,
    h1Count,
    imagesMissingAlt,
    wordCount,
  };
}

module.exports = {
  parseHTML,
};