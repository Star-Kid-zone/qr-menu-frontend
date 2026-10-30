'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  superadminService,
  type DateRange,
  type UserDetailResponse,
  type TenantMenuItem,
  type TenantAnalyticsData,
  type MenuBlueprint,
} from '@/services/superadmin.service';
import { routes } from '@/config/routes';
import { toast } from '@/components/ui';
import { setStoredUserRole, setImpersonationSession } from '@/utils/storage';
import type { UserDetailTabId, BusinessFormData, PaymentFormData, WorkspaceFormData } from '../types';

interface UseUserDetailStateProps {
  userId: number;
}

export function useUserDetailState({ userId }: UseUserDetailStateProps) {
  const router = useRouter();

  const [detail, setDetail] = useState<UserDetailResponse | null>(null);
  const [tenantAnalytics, setTenantAnalytics] = useState<TenantAnalyticsData | null>(null);
  const [range, setRange] = useState<DateRange>('last_7_days');
  const [activeTab, setActiveTab] = useState<UserDetailTabId>('overview');
  const [feedbackSubTab, setFeedbackSubTab] = useState<'google' | 'faqs'>('google');
  const [loading, setLoading] = useState(true);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [impersonating, setImpersonating] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  // Gallery Lightbox Modal State
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Menu Search & Category Filter
  const [menuSearch, setMenuSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Editing Menu Modal State
  const [editingItem, setEditingItem] = useState<TenantMenuItem | null>(null);
  const [menuSaving, setMenuSaving] = useState(false);

  // Blueprint Seeding Modal
  const [blueprintModalOpen, setBlueprintModalOpen] = useState(false);
  const [availableBlueprints, setAvailableBlueprints] = useState<MenuBlueprint[]>([]);
  const [selectedBpId, setSelectedBpId] = useState<string>('cafe_bakery');
  const [bpMode, setBpMode] = useState<'append' | 'replace'>('append');
  const [applyingBp, setApplyingBp] = useState(false);

  // Editing Business Settings State
  const [isEditingBusiness, setIsEditingBusiness] = useState(false);
  const [businessForm, setBusinessForm] = useState<BusinessFormData>({
    businessName: '',
    phone: '',
    whatsappNumber: '',
    address: '',
    websiteUrl: '',
    locationUrl: '',
    businessHours: '',
  });
  const [businessSaving, setBusinessSaving] = useState(false);

  // Editing Payment & Review Settings State
  const [paymentForm, setPaymentForm] = useState<PaymentFormData>({
    paymentType: 'url',
    paymentLink: '',
    reviewLink: '',
  });
  const [paymentSaving, setPaymentSaving] = useState(false);

  // Editing Workspace Feature Flags & Navigation State
  const [isEditingWorkspace, setIsEditingWorkspace] = useState(false);
  const [workspaceForm, setWorkspaceForm] = useState<WorkspaceFormData>({
    specialOfferStatus: false,
    menubtnStatus: true,
    paybtnStatus: true,
    reviewbtnStatus: true,
    socialApprovalRequired: false,
    announcementEnabled: false,
    announcementText: '',
  });
  const [workspaceSaving, setWorkspaceSaving] = useState(false);

  const loadDetail = useCallback(async () => {
    if (!Number.isFinite(userId)) {
      setError('Invalid user identification token.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await superadminService.getUser(userId);
      setDetail(res);

      // Seed business edit form
      const primaryBiz = res.businesses?.[0];
      if (primaryBiz) {
        setBusinessForm({
          businessName: primaryBiz.businessName || '',
          phone: primaryBiz.phone || '',
          whatsappNumber: primaryBiz.whatsappNumber || '',
          address: primaryBiz.address || '',
          websiteUrl: primaryBiz.websiteUrl || '',
          locationUrl: primaryBiz.locationUrl || '',
          businessHours: primaryBiz.businessHours || '',
        });
      }

      // Seed payment & review form and workspace features
      const primaryWs = res.workspaces?.[0];
      if (primaryWs) {
        setPaymentForm({
          paymentType: primaryWs.paymentType || 'url',
          paymentLink: primaryWs.paymentLink || '',
          reviewLink: primaryWs.reviewLink || '',
        });
        setWorkspaceForm({
          specialOfferStatus: Boolean(primaryWs.specialOfferStatus),
          menubtnStatus: Boolean(primaryWs.menubtnStatus),
          paybtnStatus: Boolean(primaryWs.paybtnStatus),
          reviewbtnStatus: Boolean(primaryWs.reviewbtnStatus),
          socialApprovalRequired: Boolean(primaryWs.socialApprovalRequired),
          announcementEnabled: Boolean(primaryWs.announcementEnabled),
          announcementText: primaryWs.announcementText || '',
        });
      }
    } catch (e) {
      console.error(e);
      setError('Account not found or access restricted.');
      setDetail(null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const loadAnalytics = useCallback(async () => {
    if (!Number.isFinite(userId)) return;
    try {
      setLoadingAnalytics(true);
      const res = await superadminService.getTenantAnalytics(userId, range);
      setTenantAnalytics(res);
    } catch (e) {
      console.error(e);
      setTenantAnalytics(null);
    } finally {
      setLoadingAnalytics(false);
    }
  }, [userId, range]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  useEffect(() => {
    if (activeTab === 'analytics' && detail) {
      loadAnalytics();
    }
  }, [activeTab, detail, loadAnalytics]);

  // Freeze / Unfreeze user account
  const handleToggleStatus = async () => {
    if (!detail) return;
    const newActiveState = !detail.user.active;
    try {
      setStatusUpdating(true);
      await superadminService.toggleUserStatus(userId, newActiveState);
      setDetail((prev) =>
        prev
          ? {
              ...prev,
              user: {
                ...prev.user,
                active: newActiveState,
              },
            }
          : prev
      );
      toast.success(
        `Account has been ${newActiveState ? 'activated' : 'frozen'} successfully.`
      );
    } catch (e) {
      console.error(e);
      toast.error('Failed to change account status.');
    } finally {
      setStatusUpdating(false);
    }
  };

  // Impersonate / Login as tenant (Support Mode)
  const handleImpersonate = async () => {
    if (!detail) return;
    try {
      setImpersonating(true);
      const res = await superadminService.impersonateTenant(userId);
      setImpersonationSession(res.impersonation);
      setStoredUserRole('admin');
      toast.success(`Entering ${res.targetUser.name}'s workspace (Support Mode)...`);
      router.push(routes.admin.home);
    } catch (e) {
      console.error(e);
      toast.error('Failed to start impersonation session.');
      setImpersonating(false);
    }
  };

  // Save Workspace Features & Navigation Settings
  const handleSaveWorkspaceFeatures = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userId) return;
    try {
      setWorkspaceSaving(true);
      await superadminService.updateTenantWorkspace(userId, workspaceForm);
      toast.success('Website features and navigation controls saved.');
      setIsEditingWorkspace(false);
      await loadDetail();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update workspace features.');
    } finally {
      setWorkspaceSaving(false);
    }
  };

  // Toggle menu availability
  const handleToggleMenuAvailability = async (
    menuId: number,
    currentAvailability: boolean
  ) => {
    const newAvailability = !currentAvailability;
    try {
      await superadminService.toggleTenantMenuAvailability(
        userId,
        menuId,
        newAvailability
      );
      setDetail((prev) =>
        prev
          ? {
              ...prev,
              menus: prev.menus.map((m) =>
                m.id === menuId ? { ...m, availability: newAvailability } : m
              ),
            }
          : prev
      );
      toast.success(
        `Dish marked as ${newAvailability ? 'Available' : 'Unavailable'}.`
      );
    } catch (e) {
      console.error(e);
      toast.error('Failed to update dish availability.');
    }
  };

  // Save Menu Item Changes
  const handleSaveMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      setMenuSaving(true);
      await superadminService.updateTenantMenu(userId, editingItem.id, {
        item: editingItem.item,
        price: editingItem.price,
        imageUrl: editingItem.imageUrl,
        description: editingItem.description,
        category: editingItem.category,
        type: editingItem.type,
        popular: editingItem.popular,
        availability: editingItem.availability,
        availabilityTime: editingItem.availabilityTime,
      });

      setDetail((prev) =>
        prev
          ? {
              ...prev,
              menus: prev.menus.map((m) =>
                m.id === editingItem.id ? { ...editingItem } : m
              ),
            }
          : prev
      );

      toast.success('Menu item updated successfully.');
      setEditingItem(null);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update menu item.');
    } finally {
      setMenuSaving(false);
    }
  };

  const handleOpenBlueprintModal = async () => {
    setBlueprintModalOpen(true);
    if (availableBlueprints.length === 0) {
      try {
        const bps = await superadminService.getBlueprints();
        setAvailableBlueprints(bps);
        if (bps.length > 0) setSelectedBpId(bps[0].id);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleApplyBlueprint = async () => {
    if (!selectedBpId) return;
    try {
      setApplyingBp(true);
      const res = await superadminService.applyBlueprint(userId, selectedBpId, bpMode);
      toast.success(res.message);
      setBlueprintModalOpen(false);
      await loadDetail();
    } catch (e) {
      console.error(e);
      toast.error('Failed to apply blueprint.');
    } finally {
      setApplyingBp(false);
    }
  };

  // Save Business Settings Changes
  const handleSaveBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setBusinessSaving(true);
      await superadminService.updateTenantBusiness(userId, businessForm);
      toast.success('Business profile saved successfully.');
      setIsEditingBusiness(false);
      loadDetail();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save business settings.');
    } finally {
      setBusinessSaving(false);
    }
  };

  // Save Payment & Review Settings Changes
  const handleSavePaymentReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setPaymentSaving(true);
      await superadminService.updateTenantPaymentReview(userId, paymentForm);
      toast.success('Payment and review settings saved.');
      loadDetail();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update payment/review settings.');
    } finally {
      setPaymentSaving(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${label} to clipboard!`);
  };

  return {
    detail,
    setDetail,
    tenantAnalytics,
    range,
    setRange,
    activeTab,
    setActiveTab,
    feedbackSubTab,
    setFeedbackSubTab,
    loading,
    loadingAnalytics,
    error,
    impersonating,
    statusUpdating,
    previewImage,
    setPreviewImage,
    menuSearch,
    setMenuSearch,
    selectedCategory,
    setSelectedCategory,
    editingItem,
    setEditingItem,
    menuSaving,
    blueprintModalOpen,
    setBlueprintModalOpen,
    availableBlueprints,
    selectedBpId,
    setSelectedBpId,
    bpMode,
    setBpMode,
    applyingBp,
    isEditingBusiness,
    setIsEditingBusiness,
    businessForm,
    setBusinessForm,
    businessSaving,
    paymentForm,
    setPaymentForm,
    paymentSaving,
    isEditingWorkspace,
    setIsEditingWorkspace,
    workspaceForm,
    setWorkspaceForm,
    workspaceSaving,
    loadDetail,
    loadAnalytics,
    handleToggleStatus,
    handleImpersonate,
    handleSaveWorkspaceFeatures,
    handleToggleMenuAvailability,
    handleSaveMenuItem,
    handleOpenBlueprintModal,
    handleApplyBlueprint,
    handleSaveBusiness,
    handleSavePaymentReview,
    copyToClipboard,
  };
}
