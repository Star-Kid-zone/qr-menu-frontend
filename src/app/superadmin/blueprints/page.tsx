'use client';

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  PiBookBookmarkBold,
  PiSparkleBold,
  PiArrowRightBold,
  PiCheckBold,
  PiWarningBold,
  PiMagnifyingGlassBold,
  PiXBold,
  PiUserBold,
  PiForkKnifeBold,
  PiStorefrontBold,
} from 'react-icons/pi';
import {
  superadminService,
  type MenuBlueprint,
  type BlueprintMenuItem,
  type UserListRow,
} from '@/services/superadmin.service';
import { Badge, Button, Card, EmptyState, Input, toast } from '@/components/ui';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/motion';
import { routes } from '@/config/routes';

export default function SuperadminBlueprintsPage() {
  const reduceMotion = useReducedMotion();
  const [blueprints, setBlueprints] = useState<MenuBlueprint[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBlueprint, setSelectedBlueprint] = useState<MenuBlueprint | null>(null);

  // Apply Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tenants, setTenants] = useState<UserListRow[]>([]);
  const [loadingTenants, setLoadingTenants] = useState(false);
  const [selectedTenantId, setSelectedTenantId] = useState<number | null>(null);
  const [applyMode, setApplyMode] = useState<'append' | 'replace'>('append');
  const [applying, setApplying] = useState(false);
  const [tenantSearch, setTenantSearch] = useState('');

  useEffect(() => {
    async function loadBlueprints() {
      try {
        setLoading(true);
        const list = await superadminService.getBlueprints();
        setBlueprints(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load menu blueprints');
      } finally {
        setLoading(false);
      }
    }
    loadBlueprints();
  }, []);

  const openApplyModal = async (bp: MenuBlueprint) => {
    setSelectedBlueprint(bp);
    setIsModalOpen(true);
    if (tenants.length === 0) {
      try {
        setLoadingTenants(true);
        const res = await superadminService.listUsers({ page_size: 100 });
        setTenants(Array.isArray(res?.users) ? res.users : []);
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch tenants');
      } finally {
        setLoadingTenants(false);
      }
    }
  };

  const handleApply = async () => {
    if (!selectedBlueprint || !selectedTenantId) {
      toast.error('Please select a target tenant');
      return;
    }

    try {
      setApplying(true);
      const res = await superadminService.applyBlueprint(selectedTenantId, selectedBlueprint.id, applyMode);
      toast.success(res.message);
      setIsModalOpen(false);
      setSelectedTenantId(null);
    } catch (err) {
      console.error(err);
      toast.error('Failed to apply blueprint to tenant');
    } finally {
      setApplying(false);
    }
  };

  const filteredBlueprints = useMemo(() => {
    const safeBlueprints = Array.isArray(blueprints) ? blueprints : [];
    if (!searchQuery.trim()) return safeBlueprints;
    const q = searchQuery.toLowerCase();
    return safeBlueprints.filter(
      (b) =>
        b.name?.toLowerCase().includes(q) ||
        b.tagline?.toLowerCase().includes(q) ||
        b.categoryNames?.some((c) => c.toLowerCase().includes(q))
    );
  }, [blueprints, searchQuery]);

  const filteredTenants = useMemo(() => {
    const safeTenants = Array.isArray(tenants) ? tenants : [];
    if (!tenantSearch.trim()) return safeTenants;
    const q = tenantSearch.toLowerCase();
    return safeTenants.filter(
      (t) => t.name?.toLowerCase().includes(q) || t.phone?.toLowerCase().includes(q) || t.id?.toString().includes(q)
    );
  }, [tenants, tenantSearch]);

  const totalDishes = useMemo(() => {
    const safeBlueprints = Array.isArray(blueprints) ? blueprints : [];
    return safeBlueprints.reduce((acc, b) => acc + (b.items?.length || 0), 0);
  }, [blueprints]);

  return (
    <motion.div
      className="flex h-full flex-col gap-6 overflow-y-auto pb-10"
      initial={reduceMotion ? false : 'hidden'}
      animate="visible"
      variants={fadeIn}
    >
      {/* Header */}
      <div className="flex shrink-0 flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge tone="success">Catalog Presets</Badge>
            <span className="text-caption uppercase tracking-wide text-muted-foreground">Onboarding Accelerators</span>
          </div>
          <h1 className="text-display text-foreground">Starter Blueprints & Menu Packs</h1>
          <p className="text-body max-w-2xl text-muted-foreground">
            Pre-curated menu templates with HD food photography, realistic prices, and categories to seed new restaurants in seconds.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm shadow-sm">
            <PiForkKnifeBold className="size-4 text-primary" />
            <span className="font-semibold text-foreground">{totalDishes}</span>
            <span className="text-muted-foreground">Dishes in {blueprints.length} Packs</span>
          </div>
        </div>
      </div>

      {/* Search Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <PiMagnifyingGlassBold className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search blueprints by name, category, or dish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Blueprint Cards */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-96 animate-pulse rounded-2xl border border-border bg-card/60" />
          ))}
        </div>
      ) : filteredBlueprints.length === 0 ? (
        <EmptyState
          title="No blueprints found"
          description="Try refining your search keyword."
          action={
            <Button variant="secondary" onClick={() => setSearchQuery('')}>
              Clear Search
            </Button>
          }
        />
      ) : (
        <motion.div
          className="grid gap-6 sm:grid-cols-2"
          initial={reduceMotion ? false : 'hidden'}
          animate="visible"
          variants={staggerContainer(0.08)}
        >
          {filteredBlueprints.map((bp) => (
            <motion.div key={bp.id} variants={fadeInUp}>
              <Card className="flex h-full flex-col overflow-hidden border border-border transition-all hover:border-primary/40 hover:shadow-lg">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-border bg-muted/20 p-5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded-lg bg-primary/10 p-1.5 text-primary">
                        <PiBookBookmarkBold className="size-5" />
                      </span>
                      <h2 className="text-h3 font-bold text-foreground">{bp.name}</h2>
                    </div>
                    <p className="text-caption text-muted-foreground">{bp.tagline}</p>
                  </div>
                  <Badge tone={bp.badge === 'Most Popular' ? 'success' : 'primary'}>{bp.badge}</Badge>
                </div>

                {/* Categories */}
                <div className="border-b border-border px-5 py-3 bg-card">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Categories Included</p>
                  <div className="flex flex-wrap gap-1.5">
                    {bp.categoryNames.map((cat) => (
                      <span
                        key={cat}
                        className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-foreground"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sample Dishes Grid */}
                <div className="flex-1 p-5">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Sample Dishes ({bp.items.length} Total)
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {bp.items.slice(0, 4).map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 rounded-xl border border-border/80 bg-muted/10 p-2.5 transition hover:bg-muted/30"
                      >
                        <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                          <Image
                            src={item.imageUrl}
                            alt={item.item}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-semibold text-foreground">{item.item}</p>
                          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                            <span className="font-mono font-bold text-primary">${item.price}</span>
                            <span>•</span>
                            <span className={item.type === 'Veg' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600'}>
                              {item.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {bp.items.length > 4 && (
                    <p className="mt-2.5 text-center text-caption text-muted-foreground">
                      + {bp.items.length - 4} more dishes with photos & descriptions
                    </p>
                  )}
                </div>

                {/* Footer Action */}
                <div className="flex items-center justify-between border-t border-border bg-muted/10 p-4">
                  <span className="text-caption font-medium text-muted-foreground">
                    Ready to deploy
                  </span>
                  <Button
                    onClick={() => openApplyModal(bp)}
                    variant="primary"
                    size="sm"
                    rightIcon={<PiArrowRightBold size={14} />}
                  >
                    Apply to Tenant
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Apply to Tenant Modal */}
      <AnimatePresence>
        {isModalOpen && selectedBlueprint && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl"
            >
              <div className="flex items-start justify-between border-b border-border pb-4">
                <div>
                  <h3 className="text-h3 font-bold text-foreground">Apply Starter Blueprint</h3>
                  <p className="text-caption text-muted-foreground">
                    Deploy <strong>{selectedBlueprint.name}</strong> ({selectedBlueprint.items.length} items) into a restaurant workspace.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <PiXBold className="size-5" />
                </button>
              </div>

              <div className="space-y-4 py-4">
                {/* Mode Selector */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Seeding Strategy
                  </label>
                  <div className="mt-2 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setApplyMode('append')}
                      className={`flex flex-col items-start rounded-xl border p-3 text-left transition ${
                        applyMode === 'append'
                          ? 'border-primary bg-primary/10 text-primary font-semibold'
                          : 'border-border bg-muted/20 text-foreground hover:bg-muted/40'
                      }`}
                    >
                      <span className="text-sm font-bold">Append Items</span>
                      <span className="text-[11px] text-muted-foreground">Keep existing menu & add new items</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setApplyMode('replace')}
                      className={`flex flex-col items-start rounded-xl border p-3 text-left transition ${
                        applyMode === 'replace'
                          ? 'border-destructive bg-destructive/10 text-destructive font-semibold'
                          : 'border-border bg-muted/20 text-foreground hover:bg-muted/40'
                      }`}
                    >
                      <span className="text-sm font-bold">Replace Menu</span>
                      <span className="text-[11px] text-muted-foreground">Clear current menu & start fresh</span>
                    </button>
                  </div>
                </div>

                {/* Tenant Search & Selector */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Select Target Tenant
                  </label>
                  <div className="mt-1.5">
                    <input
                      type="text"
                      placeholder="Search tenant by business name or phone..."
                      value={tenantSearch}
                      onChange={(e) => setTenantSearch(e.target.value)}
                      className="w-full rounded-xl border border-border bg-muted/20 px-3.5 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="mt-2 max-h-48 overflow-y-auto rounded-xl border border-border p-1 space-y-1">
                    {loadingTenants ? (
                      <p className="p-3 text-center text-xs text-muted-foreground">Loading tenants...</p>
                    ) : filteredTenants.length === 0 ? (
                      <p className="p-3 text-center text-xs text-muted-foreground">No matching tenants found.</p>
                    ) : (
                      filteredTenants.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setSelectedTenantId(t.id)}
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition ${
                            selectedTenantId === t.id
                              ? 'bg-primary font-semibold text-primary-foreground'
                              : 'hover:bg-muted text-foreground'
                          }`}
                        >
                          <div>
                            <p className="font-medium">{t.name || 'Unnamed Business'}</p>
                            <p className={`text-[11px] ${selectedTenantId === t.id ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                              Phone: {t.phone} • Menu items: {t.menu_count}
                            </p>
                          </div>
                          {selectedTenantId === t.id && <PiCheckBold className="size-4" />}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleApply}
                  loading={applying}
                  disabled={!selectedTenantId}
                  variant={applyMode === 'replace' ? 'destructive' : 'primary'}
                >
                  {applyMode === 'replace' ? 'Replace & Seed Menu' : 'Append Blueprint'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
