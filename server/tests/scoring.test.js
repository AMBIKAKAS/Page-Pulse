import { describe, it, expect } from "vitest";
const {
  generateSEOChecks,
  calculateSEOScore,
} = require("../services/auditService");

const baseData = {
  title: "A descriptive website title for testing",
  titleLength: 39,
  metaDescription: "A".repeat(140),
  descriptionLength: 140,
  h1Count: 1,
  canonical: "https://example.com/",
  viewport: "width=device-width, initial-scale=1",
  robots: "",
  language: "en",
  ogTitle: "Example",
  ogDescription: "Example description",
  ogImage: "https://example.com/image.jpg",
  images: 2,
  imagesMissingAlt: 0,
  wordCount: 650,
};

describe("Page Pulse SEO Scoring", () => {
  it("awards 100 points for ideal checks", () => {
    expect(calculateSEOScore(generateSEOChecks(baseData))).toBe(100);
  });

  it("awards partial points for incomplete Open Graph tags", () => {
    const checks = generateSEOChecks({ ...baseData, ogImage: "" });
    const check = checks.find((item) => item.id === "openGraph");

    expect(check.earnedPoints).toBe(7);
    expect(check.status).toBe("partial");
  });

  it("awards zero title points when title is missing", () => {
    const checks = generateSEOChecks({
      ...baseData,
      title: "",
      titleLength: 0,
    });
    const check = checks.find((item) => item.id === "title");

    expect(check.earnedPoints).toBe(0);
    expect(check.status).toBe("warning");
  });

  it("deducts robots points for noindex", () => {
    const checks = generateSEOChecks({
      ...baseData,
      robots: "noindex, nofollow",
    });
    const check = checks.find((item) => item.id === "robots");

    expect(check.earnedPoints).toBe(0);
  });

  it("keeps total maximum weight at 100", () => {
    const checks = generateSEOChecks(baseData);
    expect(checks.reduce((sum, item) => sum + item.weight, 0)).toBe(100);
  });
});
