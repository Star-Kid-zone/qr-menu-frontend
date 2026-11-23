import { describe, expect, it } from "vitest";
import { QR_PRINT_SIZES, QR_PRINT_TABLE_TOKEN, QR_PRINT_UID_TOKEN } from "@/constants/qrCodes.constants";
import { mmToPx, sheetLayout } from "./print";
import { buildSheetHtml, sheetCopies, tableRange } from "./printSheet";

const size = (layout: keyof typeof QR_PRINT_SIZES, id: string) => QR_PRINT_SIZES[layout].find((s) => s.id === id)!;

describe("sheetLayout", () => {
  it.each([
    ["card", "a6", 2, 2],
    ["card", "a5", 1, 1],
    ["card", "a4", 1, 1],
    ["sticker", "s50", 3, 5],
    ["sticker", "s75", 2, 3],
    ["sticker", "s100", 2, 2],
  ] as const)("%s %s fits %i × %i on A4", (layout, id, columns, rows) => {
    expect(sheetLayout(layout, size(layout, id))).toEqual({ columns, rows });
  });
});

describe("mmToPx", () => {
  it("is 300 dpi", () => {
    expect(mmToPx(105)).toBe(1240);
    expect(mmToPx(25.4)).toBe(300);
  });
});

describe("sheetCopies", () => {
  it("swaps the table placeholder and gives each copy its own ids", () => {
    const template = `<svg><clipPath id="${QR_PRINT_UID_TOKEN}-c"/><use href="#${QR_PRINT_UID_TOKEN}-c"/><text>Table ${QR_PRINT_TABLE_TOKEN}</text></svg>`;
    const [a, b] = sheetCopies(template, ["1", "12"]);
    expect(a).toContain("Table 1<");
    expect(b).toContain("Table 12<");
    expect(a).toContain('id="c0-c"');
    expect(b).toContain('href="#c1-c"');
    expect(b).not.toContain(QR_PRINT_UID_TOKEN);
  });
});

describe("tableRange", () => {
  it("counts up from the first to the last number", () => {
    expect(tableRange(3, 6)).toEqual(["3", "4", "5", "6"]);
  });

  it("caps a sheet at 200 copies", () => {
    expect(tableRange(1, 999)).toHaveLength(200);
  });
});

describe("buildSheetHtml", () => {
  it("lays copies out on A4 pages at true size", () => {
    const html = buildSheetHtml(Array.from({ length: 5 }, () => "<svg></svg>"), "card", size("card", "a6"), "", "Roma <QR>");
    expect(html.match(/class="page"/g)).toHaveLength(2); // 4 per page
    expect(html).toContain("grid-template-columns: repeat(2, 105mm)");
    expect(html).toContain("@page { size: A4 portrait; margin: 0; }");
    expect(html).toContain("<title>Roma QR</title>");
  });
});
