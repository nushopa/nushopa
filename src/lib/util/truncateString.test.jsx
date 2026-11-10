import { describe, expect, it } from "vitest";
import { truncateString } from "./truncateString";

describe("truncateString", () => {
  it("removes markup and leaves short text unchanged", () => {
    expect(truncateString("<p>Fresh produce</p>", 20)).toBe("Fresh produce");
  });

  it("truncates plain text at the requested length", () => {
    expect(truncateString("<p>Fresh produce</p>", 5)).toBe("Fresh...");
  });
});
