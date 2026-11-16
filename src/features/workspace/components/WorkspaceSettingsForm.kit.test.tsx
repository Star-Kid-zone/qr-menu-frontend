import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { getDefaultWorkspaceSettings } from "@/utils/workspace.utils";
import { kitRecipe, RESTAURANT_KIT_MAP } from "@/components/templates/sections/kits/kits";
import { getSkin } from "@/components/site-system/skins";
import type { WorkspaceSettingsFormValues } from "@/types/workspace.types";
import { WorkspaceSettingsForm } from "./WorkspaceSettingsForm";

/**
 * Regression: the form re-applies a style template's own palette whenever the
 * template changes. A kit changes the template *and* sets its own colours, so
 * that sync used to overwrite every kit colour (found in a real-browser check:
 * "Japanese" previewed with green buttons, "Café" saved tan instead of brown).
 */
describe("applying a restaurant kit in the real settings form", () => {
  it("keeps the recipe's style colours and font after the template-palette sync runs", async () => {
    const onValuesChange = vi.fn();
    render(
      <WorkspaceSettingsForm
        formId="ws"
        isOpen
        section="landing"
        initialValues={{ ...getDefaultWorkspaceSettings(), landing_theme: "swiss-international" }}
        onSubmit={vi.fn()}
        onValuesChange={onValuesChange}
      />,
    );

    fireEvent.click(screen.getByRole("tab", { name: "Quick start" }));
    fireEvent.click(screen.getByRole("button", { name: /^Café & bakery:/ }));
    fireEvent.click(await screen.findByRole("button", { name: "Use this look" }));

    const recipe = kitRecipe(RESTAURANT_KIT_MAP.get("cafe")!);
    const skin = getSkin(recipe.skinId)!;
    await waitFor(() => {
      const last = onValuesChange.mock.calls.at(-1)?.[0] as WorkspaceSettingsFormValues | undefined;
      expect(last?.skin_id).toBe(recipe.skinId);
    });
    // Let any palette-sync effect for the new template run.
    await new Promise((r) => setTimeout(r, 50));
    const values = onValuesChange.mock.calls.at(-1)?.[0] as WorkspaceSettingsFormValues;
    expect(values.primary_color).toBe(skin.palette.accent);
    expect(values.accent_color).toBe(skin.palette.bg);
    expect(values.font_family).toBe(skin.fonts.body);
    expect(values.landing_structure).toBe(recipe.layout);
    expect(values.business_type).toBe(recipe.businessType);
    expect(values.site_document?.kit).toBe("cafe");
  });
});
