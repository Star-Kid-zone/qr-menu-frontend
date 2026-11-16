import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { INLINE_WORKSPACE_FORM_ID } from "../../types";

const submitted = vi.hoisted(() => vi.fn());

// Stand-in for the real settings form: a <form> with the id the header's Save button targets.
vi.mock("@/features/workspace", () => ({
  WorkspaceSettingsForm: ({ formId }: { formId: string }) => (
    <form
      id={formId}
      onSubmit={(e) => {
        e.preventDefault();
        submitted();
      }}
    />
  ),
}));
vi.mock("@/features/workspace/components/SiteHistoryModal", () => ({ SiteHistoryModal: () => null }));

import { WebsiteTab } from "./WebsiteTab";

function Harness() {
  const [edit, setEdit] = useState(false);
  return (
    <WebsiteTab
      workspace={{ id: 1 } as never}
      workspaceEditMode={edit}
      setWorkspaceEditMode={setEdit}
      workspaceActiveSubSection={null}
      setWorkspaceActiveSubSection={() => {}}
      workspaceSaveLoading={false}
      workspaceSaveError={null}
      setWorkspaceSaveError={() => {}}
      workspaceDesignSection="landing"
      setWorkspaceDesignSection={() => {}}
      workspaceFormInitialValues={{} as never}
      handleWorkspaceSave={async () => {}}
      workspaceCurrencies={[]}
      setWorkspaceDraft={() => {}}
      onOpenAddWorkspaceModal={() => {}}
    />
  );
}

describe("WebsiteTab header", () => {
  it("clicking Edit only enters edit mode — it must not submit (save) the form", () => {
    render(<Harness />);
    expect(document.getElementById(INLINE_WORKSPACE_FORM_ID)).toBeTruthy();
    const edit = screen.getByRole("button", { name: "Edit" });
    fireEvent.click(edit);
    const save = screen.getByRole("button", { name: "Save" });
    // The real-browser failure: React reused the Edit <button> node as Save (type="submit"),
    // so the browser's post-click activation submitted the form. happy-dom doesn't replay that
    // activation step, so assert the cause directly — Save must be a brand-new node.
    expect(save).not.toBe(edit);
    expect(edit.isConnected).toBe(false);
    expect(submitted).not.toHaveBeenCalled();

    // Save itself still submits the form.
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(submitted).toHaveBeenCalledTimes(1);
  });
});
