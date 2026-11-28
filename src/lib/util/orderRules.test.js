import { describe, it, expect } from "vitest";
import {
  calcServiceCharge,
  amountToMinimum,
  meetsMinimumOrder,
  MIN_ORDER_SUBTOTAL,
} from "./orderRules";

describe("orderRules", () => {
  it("minimum order is 5,000", () => {
    expect(MIN_ORDER_SUBTOTAL).toBe(5000);
  });

  it("rounds the service charge like the backend (2,732 -> 410, not 409.8)", () => {
    expect(calcServiceCharge(2732)).toBe(410);
  });

  it("treats exactly the minimum as acceptable", () => {
    expect(meetsMinimumOrder(5000)).toBe(true);
    expect(meetsMinimumOrder(4999)).toBe(false);
    expect(meetsMinimumOrder(0)).toBe(false);
  });

  it("reports how much more is needed", () => {
    expect(amountToMinimum(2732)).toBe(2268);
    expect(amountToMinimum(5000)).toBe(0);
    expect(amountToMinimum(9000)).toBe(0);
  });
});
