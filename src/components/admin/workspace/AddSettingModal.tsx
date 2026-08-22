'use client';

import { useEffect, useMemo, useState } from 'react';
import { WorkspaceSettingsForm } from '@/components/admin/workspace/WorkspaceSettingsForm';
import type { WorkspaceSettingsFormValues } from '@/types/workspace.types';
import { getDefaultWorkspaceSettings } from '@/utils/workspace.utils';
import { Button, ModalFooter } from '@/components/ui';
import { workspaceService } from '@/services/workspace.service';
import { Modal } from '@/components/Modal';
import { ADD_WORKSPACE_FORM_ID } from "@/constants/components/admin/workspace/AddSettingModal.constants";
import { getApiErrorMessage } from '@/utils/errors';

export function AddSettingModal({
  isOpen,
  onClose,
  onSettingAdded,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSettingAdded: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const initialValues = useMemo(() => getDefaultWorkspaceSettings(), []);

  useEffect(() => {
    if (isOpen) {
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = async (values: WorkspaceSettingsFormValues) => {
    setLoading(true);
    setError(null);

    try {
      await workspaceService.updateWorkspace({
        theme: {
          themeColour:        values.theme_colour,
          primaryColor:       values.primary_color,
          secondaryColor:     values.secondary_color,
          accentColor:        values.accent_color,
          textPrimaryColor:   values.text_primary_color,
          textSecondaryColor: values.text_secondary_color,
          accentTextColor:    values.accent_text_color,
          borderColor:        values.border_color,
          footerBgColor:      values.footer_bg_color,
          sectionBgColor:     values.section_bg_color,
          fontFamily:         values.font_family,
          cardStyle:          values.card_style,
          heroOverlay:        values.hero_overlay,
          themeBadge:         values.theme_badge,
          themeMarquee:       values.theme_marquee,
          menuTheme:          values.menu_theme,
          landingTheme:       values.landing_theme,
          landingStructure:   values.landing_structure,
          loadingScreenTheme: values.loading_screen_theme,
          menuPrimaryColor:        values.menu_primary_color,
          menuSecondaryColor:      values.menu_secondary_color,
          menuAccentColor:         values.menu_accent_color,
          menuTextPrimaryColor:    values.menu_text_primary_color,
          menuTextSecondaryColor:  values.menu_text_secondary_color,
          menuAccentTextColor:     values.menu_accent_text_color,
          menuBorderColor:         values.menu_border_color,
          menuFooterBgColor:       values.menu_footer_bg_color,
          menuSectionBgColor:      values.menu_section_bg_color,
          menuFontFamily:          values.menu_font_family,
          menuCardStyle:           values.menu_card_style,
          menuStructure:           values.menu_structure,
        },
        buttons: {
          menubtnStatus:      values.menubtn_status,
          paybtnStatus:       values.paybtn_status,
          reviewbtnStatus:    values.reviewbtn_status,
          specialOfferStatus: values.special_offerstatus,
          lotteryStatus:      values.lottery_status,
        },
        announcement: {
          enabled: values.announcement_enabled,
          text:    values.announcement_text,
        },
        currencyId: values.currency_id?.toString() || null,
      });
      onSettingAdded();
      onClose();
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Failed to create workspace settings'));
    } finally {
      setLoading(false);
    }
  };

  const footer = (
    <ModalFooter>
      <Button variant="secondary" onClick={onClose} disabled={loading}>
        Cancel
      </Button>
      <Button form={ADD_WORKSPACE_FORM_ID} type="submit" loading={loading}>
        Create Workspace
      </Button>
    </ModalFooter>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Workspace"
      maxWidth="max-w-4xl"
      footer={footer}
    >
      <WorkspaceSettingsForm
        formId={ADD_WORKSPACE_FORM_ID}
        isOpen={isOpen}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        error={error}
        loading={loading}
      />
    </Modal>
  );
}
