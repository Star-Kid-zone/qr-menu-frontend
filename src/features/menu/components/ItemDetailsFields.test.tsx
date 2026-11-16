import { describe, it, expect, vi } from "vitest";
import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { getBusinessType } from "@/components/site-system/business-types";
import { ItemDetailsFields, cleanAttributes, cleanPriceOptions, lowestOptionPrice, type ItemAttributes, type PriceOptionRow } from "./ItemDetailsFields";

describe("item details helpers", () => {
  it("keeps only what the owner filled in", () => {
    expect(cleanAttributes({ wine: { grape: "", colour: "red", body: undefined }, beer: { style: "" }, grill: { doneness: [] } })).toEqual({ wine: { colour: "red" } });
    expect(cleanAttributes({ cheese: { pasteurised: false } })).toEqual({ cheese: { pasteurised: false } });
  });

  it("drops unfinished size rows and finds the lowest price", () => {
    const rows = [{ label: "Pint", price: "380" }, { label: " Half ", price: "220" }, { label: "", price: "10" }, { label: "Jug", price: "" }];
    expect(cleanPriceOptions(rows)).toEqual([{ label: "Pint", price: "380" }, { label: "Half", price: "220" }]);
    expect(lowestOptionPrice(rows)).toBe("220");
    expect(lowestOptionPrice([])).toBeNull();
  });
});

function Harness({ type, onChange }: { type: string; onChange?: (a: ItemAttributes, p: PriceOptionRow[]) => void }) {
  const [attrs, setAttrs] = useState<ItemAttributes>({});
  const [prices, setPrices] = useState<PriceOptionRow[]>([]);
  return (
    <ItemDetailsFields
      business={getBusinessType(type)!}
      attributes={attrs}
      onAttributesChange={(a) => { setAttrs(a); onChange?.(a, prices); }}
      priceOptions={prices}
      onPriceOptionsChange={(p) => { setPrices(p); onChange?.(attrs, p); }}
      currencySymbol="₹"
    />
  );
}

describe("ItemDetailsFields", () => {
  it("shows the fields for the business type: a pub gets beer, spirits and wine", () => {
    render(<Harness type="pub" />);
    expect(screen.getByText("Drink details")).toBeInTheDocument();
    expect(screen.getByText("Beer and cider")).toBeInTheDocument();
    expect(screen.getByText("Spirits and cocktails")).toBeInTheDocument();
    expect(screen.getByText("Wine")).toBeInTheDocument();
    expect(screen.queryByText("Cheese")).not.toBeInTheDocument();
  });

  it("a cheese deli gets cheese fields and weight presets", () => {
    render(<Harness type="cheese-deli" />);
    expect(screen.getByText("Cheese")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Use 100g / 250g / 500g" })).toBeInTheDocument();
  });

  it("a size preset adds named rows; choices update the attributes", () => {
    const onChange = vi.fn();
    render(<Harness type="pub" onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Use Half / Pint" }));
    expect(screen.getByLabelText("Size 1 name")).toHaveValue("Half");
    expect(screen.getByLabelText("Size 2 name")).toHaveValue("Pint");
    fireEvent.click(screen.getByRole("button", { name: "On tap" }));
    expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ beer: { serve: "tap" } }), expect.anything());
    fireEvent.click(screen.getByRole("button", { name: "Remove Pint" }));
    expect(screen.queryByLabelText("Size 2 name")).not.toBeInTheDocument();
  });
});
