import { describe, expect, test } from "bun:test";
import { parsePageRanges, pageNumberSet } from "../src/lib/ranges";

describe("parsePageRanges", () => {
  test("temel aralıklar", () => {
    expect(parsePageRanges("1-3, 5, 8-10", 10)).toEqual([[0, 1, 2], [4], [7, 8, 9]]);
  });
  test("boşluklar ve boş parçalar", () => {
    expect(parsePageRanges(" 2 - 4 ,, 6", 10)).toEqual([[1, 2, 3], [5]]);
  });
  test("Word/telefon tireleri ve noktalı virgül", () => {
    expect(parsePageRanges("1–3; 5—6", 10)).toEqual([[0, 1, 2], [4, 5]]);
  });
  test("geçersiz girişler hata verir", () => {
    for (const bad of ["", "0", "11", "3-1", "a", "1-", "-2", "1.5"]) {
      expect(() => parsePageRanges(bad, 10)).toThrow();
    }
  });
});

describe("pageNumberSet", () => {
  test("1 tabanlı sayfa kümesi", () => {
    expect([...pageNumberSet("1-3, 3, 5", 5)].sort()).toEqual([1, 2, 3, 5]);
  });
});
