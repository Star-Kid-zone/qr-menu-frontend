'use client';

import { useEffect, useMemo, useState } from 'react';
import { PiPencilSimpleBold, PiPlusBold, PiSparkleBold, PiTrashBold } from 'react-icons/pi';
import { toast } from "@/components/ui/toast";
import { industryService } from '@/services/industry.service';
import { workspaceService } from '@/services/workspace.service';
import { Setting } from '@/types';
import { usePagination } from '@/hooks/usePagination';
import { Pagination } from '@/components/ui/Pagination';
import { WorkspaceFeatureLibrarySectionProps, FeatureItem, FeatureCatalog } from "@/types/components/admin/workspace/WorkspaceFeatureLibrarySection.types";

export function WorkspaceFeatureLibrarySection({
  workspace,
  onSaved,
}: WorkspaceFeatureLibrarySectionProps) {
  const [industries, setIndustries] = useState<Array<{ id: number; name: string }>>([]);
  const [selectedIndustryId, setSelectedIndustryId] = useState('');
  const [catalog, setCatalog] = useState<FeatureCatalog>(workspace.industry_feature_catalog || {});
  const [selectedSectionName, setSelectedSectionName] = useState('');
  const [newSectionName, setNewSectionName] = useState('');
  const [sectionDraftName, setSectionDraftName] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editingItemName, setEditingItemName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setCatalog(workspace.industry_feature_catalog || {});
  }, [workspace.id, workspace.industry_feature_catalog]);

  useEffect(() => {
    const loadIndustries = async () => {
      try {
        setLoading(true);
        const response = await industryService.getIndustries();
        const nextIndustries = response.data || [];
        setIndustries(nextIndustries);
        if (nextIndustries.length > 0) {
          setSelectedIndustryId((current) => current || String(nextIndustries[0].id));
        }
      } catch (error) {
        console.error('Failed to load industries for workspace feature library', error);
        toast.error('Failed to load industries.');
      } finally {
        setLoading(false);
      }
    };

    loadIndustries();
  }, []);

  const selectedSections = useMemo(
    () => catalog[selectedIndustryId] || {},
    [catalog, selectedIndustryId]
  );

  const selectedItems = useMemo(
    () => selectedSections[selectedSectionName] || [],
    [selectedSections, selectedSectionName]
  );

  const sectionEntries = useMemo(() => Object.entries(selectedSections), [selectedSections]);
  const sectionsPg = usePagination(sectionEntries, 6);
  const itemsPg = usePagination(selectedItems, 8);

  useEffect(() => {
    const sectionNames = Object.keys(selectedSections);

    if (sectionNames.length === 0) {
      setSelectedSectionName('');
      setSectionDraftName('');
      return;
    }

    if (!selectedSectionName || !selectedSections[selectedSectionName]) {
      const firstSection = sectionNames[0] || '';
      setSelectedSectionName(firstSection);
      setSectionDraftName(firstSection);
    }
  }, [selectedSectionName, selectedSections]);

  const persistCatalog = async (nextCatalog: FeatureCatalog, successMessage: string) => {
    try {
      setSaving(true);
      await workspaceService.updateWorkspace({
        industry_feature_catalog: nextCatalog,
      });
      const savedCatalog = nextCatalog;
      setCatalog(savedCatalog);
      toast.success(successMessage);
      await onSaved();
    } catch (error) {
      console.error('Failed to save workspace feature library', error);
      toast.error('Failed to save feature library.');
    } finally {
      setSaving(false);
    }
  };

  const updateSelectedIndustry = (
    updater: (sections: Record<string, FeatureItem[]>) => Record<string, FeatureItem[]>
  ) => {
    if (!selectedIndustryId) return null;

    return {
      ...catalog,
      [selectedIndustryId]: updater({ ...(catalog[selectedIndustryId] || {}) }),
    };
  };

  const addSection = async () => {
    const normalizedName = newSectionName.trim();
    if (!normalizedName) return;

    const nextCatalog = updateSelectedIndustry((sections) => {
      if (sections[normalizedName]) {
        return sections;
      }

      return {
        ...sections,
        [normalizedName]: [],
      };
    });

    if (!nextCatalog) return;

    await persistCatalog(nextCatalog, 'Section added.');
    setNewSectionName('');
    setSelectedSectionName(normalizedName);
    setSectionDraftName(normalizedName);
  };

  const renameSection = async () => {
    const normalizedName = sectionDraftName.trim();
    if (!selectedSectionName || !normalizedName || normalizedName === selectedSectionName) return;

    const nextCatalog = updateSelectedIndustry((sections) => {
      const existingItems = sections[selectedSectionName];
      if (!existingItems) {
        return sections;
      }

      const updatedSections = { ...sections };
      updatedSections[normalizedName] = existingItems;
      delete updatedSections[selectedSectionName];

      return updatedSections;
    });

    if (!nextCatalog) return;

    await persistCatalog(nextCatalog, 'Section renamed.');
    setSelectedSectionName(normalizedName);
    setSectionDraftName(normalizedName);
  };

  const deleteSection = async () => {
    if (!selectedSectionName || !window.confirm(`Delete section "${selectedSectionName}"?`)) return;

    const nextCatalog = updateSelectedIndustry((sections) => {
      const updatedSections = { ...sections };
      delete updatedSections[selectedSectionName];
      return updatedSections;
    });

    if (!nextCatalog) return;

    await persistCatalog(nextCatalog, 'Section deleted.');
    setSelectedSectionName('');
    setSectionDraftName('');
  };

  const addFeatureItem = async () => {
    const normalizedName = newItemName.trim();
    if (!selectedSectionName || !normalizedName) return;

    const nextCatalog = updateSelectedIndustry((sections) => {
      const items = [...(sections[selectedSectionName] || [])];
      const nextId = (items.map((item) => item.id).sort((a, b) => b - a)[0] || 0) + 1;

      if (items.some((item) => item.name.toLowerCase() === normalizedName.toLowerCase())) {
        return sections;
      }

      return {
        ...sections,
        [selectedSectionName]: [...items, { id: nextId, name: normalizedName }],
      };
    });

    if (!nextCatalog) return;

    await persistCatalog(nextCatalog, 'Feature added.');
    setNewItemName('');
  };

  const beginEditItem = (item: FeatureItem) => {
    setEditingItemId(item.id);
    setEditingItemName(item.name);
  };

  const renameFeatureItem = async (itemId: number) => {
    const normalizedName = editingItemName.trim();
    if (!selectedSectionName || !normalizedName) return;

    const nextCatalog = updateSelectedIndustry((sections) => ({
      ...sections,
      [selectedSectionName]: (sections[selectedSectionName] || []).map((item) =>
        item.id === itemId ? { ...item, name: normalizedName } : item
      ),
    }));

    if (!nextCatalog) return;

    await persistCatalog(nextCatalog, 'Feature renamed.');
    setEditingItemId(null);
    setEditingItemName('');
  };

  const deleteFeatureItem = async (itemId: number, itemName: string) => {
    if (!selectedSectionName || !window.confirm(`Delete feature "${itemName}"?`)) return;

    const nextCatalog = updateSelectedIndustry((sections) => ({
      ...sections,
      [selectedSectionName]: (sections[selectedSectionName] || []).filter((item) => item.id !== itemId),
    }));

    if (!nextCatalog) return;

    await persistCatalog(nextCatalog, 'Feature deleted.');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 rounded-full animate-spin border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-end gap-4">


        <select
          value={selectedIndustryId}
          onChange={(event) => setSelectedIndustryId(event.target.value)}
          className="min-w-[240px] rounded-lg border border-border bg-card px-4 py-3 text-body font-semibold text-foreground outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary"
          disabled={saving || industries.length === 0}
        >
          {industries.map((industry) => (
            <option key={industry.id} value={industry.id}>
              {industry.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-6">
        <div className="rounded-lg border border-border bg-card p-5 space-y-4">
          <div className="space-y-2">
            <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
              Sections
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSectionName}
                onChange={(event) => setNewSectionName(event.target.value)}
                placeholder="Add section name"
                className="min-w-0 flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                disabled={saving || !selectedIndustryId}
              />
              <button
                type="button"
                onClick={addSection}
                disabled={!selectedIndustryId || saving || !newSectionName.trim()}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-caption font-semibold uppercase tracking-wide text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-60"
              >
                <PiPlusBold className="size-4" />
                Add
              </button>
            </div>
          </div>

          {sectionEntries.length > 0 ? (
            <div className="space-y-2">
              {sectionsPg.pageItems.map(([sectionName, items]) => (
                <button
                  key={sectionName}
                  type="button"
                  onClick={() => {
                    setSelectedSectionName(sectionName);
                    setSectionDraftName(sectionName);
                    setEditingItemId(null);
                    setEditingItemName('');
                  }}
                  className={`w-full rounded-lg border p-4 text-left transition-all ${
                    selectedSectionName === sectionName
                      ? 'border-primary/30 bg-primary/5'
                      : 'border-border bg-background hover:border-primary/20'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-h3 text-foreground">{sectionName}</span>
                    <span className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
                      {items.length} items
                    </span>
                  </div>
                </button>
              ))}
              <Pagination
                page={sectionsPg.page}
                pageCount={sectionsPg.pageCount}
                onPageChange={sectionsPg.setPage}
                totalItems={sectionsPg.totalItems}
                pageSize={sectionsPg.pageSize}
              />
            </div>
          ) : (
            <div className="rounded-lg border-2 border-dashed border-border bg-background p-6 text-center">
              <p className="text-body font-semibold text-foreground">No sections yet.</p>
              <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground mt-2">
                Add the first section for this industry
              </p>
            </div>
          )}
        </div>

        <div className="rounded-lg border border-border bg-card p-5 space-y-5">
          {selectedSectionName ? (
            <>
              <div className="flex flex-col lg:flex-row lg:items-end gap-3">
                <div className="flex-1 space-y-2">
                  <label className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
                    Section name
                  </label>
                  <input
                    type="text"
                    value={sectionDraftName}
                    onChange={(event) => setSectionDraftName(event.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                    disabled={saving}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={renameSection}
                    disabled={
                      saving ||
                      !sectionDraftName.trim() ||
                      sectionDraftName.trim() === selectedSectionName
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-caption font-semibold uppercase tracking-wide text-foreground hover:border-primary/30 hover:text-primary transition-all disabled:opacity-60"
                  >
                    <PiPencilSimpleBold className="size-4" />
                    Rename
                  </button>
                  <button
                    type="button"
                    onClick={deleteSection}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-caption font-semibold uppercase tracking-wide text-destructive hover:bg-destructive/10 transition-all disabled:opacity-60"
                  >
                    <PiTrashBold className="size-4" />
                    Delete
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
                  Add feature item
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(event) => setNewItemName(event.target.value)}
                    placeholder={`Add a new item to ${selectedSectionName}`}
                    className="min-w-0 flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                    disabled={saving}
                  />
                  <button
                    type="button"
                    onClick={addFeatureItem}
                    disabled={saving || !newItemName.trim()}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-caption font-semibold uppercase tracking-wide text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-60"
                  >
                    <PiPlusBold className="size-4" />
                    Add item
                  </button>
                </div>
              </div>

              {selectedItems.length > 0 ? (
                <div className="space-y-3">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {itemsPg.pageItems.map((item) => (
                    <div
                      key={`${selectedSectionName}-${item.id}`}
                      className="rounded-lg border border-border bg-background p-4"
                    >
                      {editingItemId === item.id ? (
                        <div className="flex flex-col sm:flex-row gap-3">
                          <input
                            type="text"
                            value={editingItemName}
                            onChange={(event) => setEditingItemName(event.target.value)}
                            className="min-w-0 flex-1 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                            disabled={saving}
                          />
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => renameFeatureItem(item.id)}
                              disabled={
                                saving ||
                                !editingItemName.trim() ||
                                editingItemName.trim() === item.name
                              }
                              className="rounded-xl bg-primary px-4 py-3 text-caption font-semibold uppercase tracking-wide text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-60"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingItemId(null);
                                setEditingItemName('');
                              }}
                              className="rounded-xl border border-border px-4 py-3 text-caption font-semibold uppercase tracking-wide text-foreground hover:border-primary/30 hover:text-primary transition-all"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <span className="min-w-0 break-words text-body font-semibold text-foreground">{item.name}</span>
                          <div className="flex shrink-0 flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => beginEditItem(item)}
                              className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-caption font-semibold uppercase tracking-wide text-foreground hover:border-primary/30 hover:text-primary transition-all"
                            >
                              <PiPencilSimpleBold className="size-4" />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteFeatureItem(item.id, item.name)}
                              className="inline-flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-caption font-semibold uppercase tracking-wide text-destructive hover:bg-destructive/10 transition-all"
                            >
                              <PiTrashBold className="size-4" />
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <Pagination
                  page={itemsPg.page}
                  pageCount={itemsPg.pageCount}
                  onPageChange={itemsPg.setPage}
                  totalItems={itemsPg.totalItems}
                  pageSize={itemsPg.pageSize}
                />
                </div>
              ) : (
                <div className="rounded-lg border-2 border-dashed border-border bg-background p-8 text-center">
                  <p className="text-body font-semibold text-foreground">No features in this section yet.</p>
                  <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground mt-2">
                    Add an item to make it available in the business editor
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-lg border-2 border-dashed border-border bg-background p-10 text-center">
              <p className="text-h2 text-foreground">Pick a section to manage its items.</p>
              <p className="text-body text-muted-foreground mt-2">
                This keeps the workspace feature library organized instead of showing everything at once.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
