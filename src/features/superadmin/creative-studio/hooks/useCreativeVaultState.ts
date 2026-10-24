'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  superadminService,
  type PlatformMarketingAsset,
} from '@/services/superadmin.service';
import { industryService } from '@/services/industry.service';
import { toast } from '@/shared/components';
import type { IndustryItem } from '../types';

export function useCreativeVaultState() {
  const [assets, setAssets] = useState<PlatformMarketingAsset[]>([]);
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [industries, setIndustries] = useState<IndustryItem[]>([]);

  // Vault Filters
  const [typeFilter, setTypeFilter] = useState<'all' | 'image' | 'video' | 'poster_spec'>('all');
  const [publishedFilter, setPublishedFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [previewAsset, setPreviewAsset] = useState<PlatformMarketingAsset | null>(null);
  const [publishModalAsset, setPublishModalAsset] = useState<PlatformMarketingAsset | null>(null);
  const [publishTarget, setPublishTarget] = useState<'all' | 'industry' | 'selected_tenants'>('all');
  const [selectedIndustryId, setSelectedIndustryId] = useState<string>('');
  const [targetWorkspaceIds, setTargetWorkspaceIds] = useState<string>('');
  const [publishing, setPublishing] = useState(false);

  // Load Assets from Backend
  const loadAssets = useCallback(async () => {
    try {
      setLoadingAssets(true);
      const res = await superadminService.listMarketingAssets();
      setAssets(Array.isArray(res.data) ? res.data : []);
    } catch (err: unknown) {
      console.error(err);
      toast.error('Failed to load marketing assets from Vault');
    } finally {
      setLoadingAssets(false);
    }
  }, []);

  // Load Industries & Initial Assets
  useEffect(() => {
    industryService
      .getIndustries()
      .then((res: { data?: IndustryItem[] } | IndustryItem[]) => {
        const list = Array.isArray((res as { data?: IndustryItem[] }).data)
          ? (res as { data: IndustryItem[] }).data
          : Array.isArray(res)
          ? res
          : [];
        setIndustries(list);
      })
      .catch(() => {});
    loadAssets();
  }, [loadAssets]);

  // Filtered Assets
  const filteredAssets = useMemo(() => {
    return assets.filter((a) => {
      if (typeFilter !== 'all' && a.type !== typeFilter) return false;
      if (publishedFilter === 'published' && !a.isPublishedToTenants) return false;
      if (publishedFilter === 'draft' && a.isPublishedToTenants) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = a.title?.toLowerCase().includes(q);
        const matchesCategory = a.categoryTag?.toLowerCase().includes(q);
        const matchesCaption = a.captionSuggestion?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCategory && !matchesCaption) return false;
      }
      return true;
    });
  }, [assets, typeFilter, publishedFilter, searchQuery]);

  // Vault Stats
  const vaultStats = useMemo(() => {
    return {
      total: assets.length,
      published: assets.filter((a) => a.isPublishedToTenants).length,
      images: assets.filter((a) => a.type === 'image').length,
      videos: assets.filter((a) => a.type === 'video').length,
      specs: assets.filter((a) => a.type === 'poster_spec').length,
    };
  }, [assets]);

  // Handle Publish / Dispatch
  const handlePublishAsset = async () => {
    if (!publishModalAsset) return;
    try {
      setPublishing(true);
      const workspaceIds =
        publishTarget === 'selected_tenants'
          ? targetWorkspaceIds
              .split(',')
              .map((id) => id.trim())
              .filter(Boolean)
          : undefined;

      await superadminService.publishAssetToTenants(publishModalAsset.id, {
        targetAudience: publishTarget,
        targetIndustryId: publishTarget === 'industry' ? selectedIndustryId : undefined,
        workspaceIds,
      });

      toast.success(
        `Asset successfully published to ${
          publishTarget === 'all'
            ? 'all tenants'
            : publishTarget === 'industry'
            ? 'targeted industry'
            : 'selected tenants'
        }!`
      );
      setPublishModalAsset(null);
      await loadAssets();
    } catch (err: unknown) {
      console.error(err);
      const errorMsg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        'Failed to publish asset';
      toast.error(errorMsg);
    } finally {
      setPublishing(false);
    }
  };

  // Handle Delete Asset
  const handleDeleteAsset = async (id: string | number) => {
    if (!confirm('Are you sure you want to remove this asset from the Vault?')) return;
    try {
      await superadminService.deleteMarketingAsset(String(id));
      toast.success('Asset removed from Vault');
      setAssets((prev) => prev.filter((a) => a.id !== id));
      if (previewAsset?.id === id) setPreviewAsset(null);
    } catch (err: unknown) {
      console.error(err);
      toast.error('Failed to delete asset');
    }
  };

  return {
    assets,
    setAssets,
    loadingAssets,
    loadAssets,
    industries,
    typeFilter,
    setTypeFilter,
    publishedFilter,
    setPublishedFilter,
    searchQuery,
    setSearchQuery,
    filteredAssets,
    vaultStats,
    previewAsset,
    setPreviewAsset,
    publishModalAsset,
    setPublishModalAsset,
    publishTarget,
    setPublishTarget,
    selectedIndustryId,
    setSelectedIndustryId,
    targetWorkspaceIds,
    setTargetWorkspaceIds,
    publishing,
    handlePublishAsset,
    handleDeleteAsset,
  };
}
