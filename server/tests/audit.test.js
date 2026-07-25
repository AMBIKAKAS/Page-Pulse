import { describe, it, expect } from "vitest";
import validator from "validator";

describe("Page Pulse URL Validation", () => {

  it("should accept a valid URL", () => {
    expect(
      validator.isURL("https://example.com")
    ).toBe(true);
  });


  it("should reject an invalid URL", () => {
    expect(
      validator.isURL("google")
    ).toBe(false);
  });


  it("should reject an empty URL", () => {
    expect(
      validator.isURL("")
    ).toBe(false);
  });

});