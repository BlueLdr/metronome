import { RollingAverage } from "../index.ts";

//================================================

describe("RollingAverage", () => {
  test("should work", () => {
    const avg = new RollingAverage(10, 4);
    expect(avg.value).toBe(4);
    expect(avg.next(6)).toBe(5);
    expect(avg.next(8)).toBe(6);
    expect(avg.next(6)).toBe(6);
    expect(avg.next(6)).toBe(6);
    expect(avg.next(6)).toBe(6);
    expect(avg.next(6)).toBe(6);
    expect(avg.next(6)).toBe(6);
    expect(avg.next(6)).toBe(6);
    expect(avg.next(6)).toBe(6);
    expect(avg.next(4)).toBe(6);
  });
});
