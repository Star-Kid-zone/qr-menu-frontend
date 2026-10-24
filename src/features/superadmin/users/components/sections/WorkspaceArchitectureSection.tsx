'use client';

import React from 'react';
import {
  Card,
  Badge,
  Button,
  Input,
  FormField,
  Checkbox,
} from '@/shared/components';
import {
  PiPencilSimpleBold,
  PiSquaresFourBold,
  PiFloppyDiskBold,
  PiArrowSquareOutBold,
} from 'react-icons/pi';
import { buildPublicLandingUrl, buildPublicMenuUrl } from '@/utils/tenantHost';
import type { WorkspaceFormData, UserDetailResponse } from '../../types';

interface WorkspaceArchitectureSectionProps {
  workspaces: UserDetailResponse['workspaces'];
  workspaceForm: WorkspaceFormData;
  setWorkspaceForm: React.Dispatch<React.SetStateAction<WorkspaceFormData>>;
  isEditingWorkspace: boolean;
  setIsEditingWorkspace: (val: boolean) => void;
  workspaceSaving: boolean;
  handleSaveWorkspaceFeatures: (e?: React.FormEvent) => Promise<void>;
}

export function WorkspaceArchitectureSection({
  workspaces,
  workspaceForm,
  setWorkspaceForm,
  isEditingWorkspace,
  setIsEditingWorkspace,
  workspaceSaving,
  handleSaveWorkspaceFeatures,
}: WorkspaceArchitectureSectionProps) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-2.5 border-b border-border bg-muted/30 px-6 py-4">
        <PiSquaresFourBold className="size-5 text-primary" />
        <h2 className="text-h3 font-bold text-foreground">
          Workspace Architecture &amp; Theme Palette
        </h2>
      </div>
      <div className="p-6">
        {workspaces.length === 0 ? (
          <p className="text-body text-muted-foreground">
            No workspace linked to this user.
          </p>
        ) : (
          <div className="space-y-6">
            {workspaces.map((ws) => (
              <div key={ws.id} className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-base font-bold text-foreground">
                      Workspace #{String(ws.id)}
                    </span>
                    <span className="rounded-full bg-primary/10 px-3 py-0.5 font-mono text-xs font-bold text-primary">
                      Subdomain: {ws.public_slug || 'unconfigured'}
                    </span>
                    {Boolean(ws.landingTheme) && (
                      <span className="rounded-md border border-border bg-card px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                        Landing: {String(ws.landingTheme)}
                      </span>
                    )}
                    {Boolean(ws.menuTheme) && (
                      <span className="rounded-md border border-border bg-card px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                        Menu: {String(ws.menuTheme)}
                      </span>
                    )}
                  </div>

                  {ws.public_slug && (
                    <div className="flex shrink-0 items-center gap-2">
                      <a
                        href={buildPublicLandingUrl(ws.public_slug)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                      >
                        Landing Site <PiArrowSquareOutBold size={13} />
                      </a>
                      <a
                        href={buildPublicMenuUrl(ws.public_slug)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
                      >
                        Digital Menu <PiArrowSquareOutBold size={13} />
                      </a>
                    </div>
                  )}
                </div>

                {/* Theme Tokens Swatches */}
                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                  <div className="rounded-xl border border-border bg-muted/20 p-3 flex items-center gap-3">
                    <span
                      className="size-8 rounded-lg border border-border shrink-0 shadow-sm"
                      style={{
                        backgroundColor: String(ws.primaryColor || '#D35400'),
                      }}
                    />
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground">
                        Primary Brand
                      </p>
                      <p className="font-mono text-xs font-bold text-foreground truncate">
                        {String(ws.primaryColor || '#D35400')}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border bg-muted/20 p-3 flex items-center gap-3">
                    <span
                      className="size-8 rounded-lg border border-border shrink-0 shadow-sm"
                      style={{
                        backgroundColor: String(ws.secondaryColor || '#E67E22'),
                      }}
                    />
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground">
                        Secondary Brand
                      </p>
                      <p className="font-mono text-xs font-bold text-foreground truncate">
                        {String(ws.secondaryColor || '#E67E22')}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border bg-muted/20 p-3 flex items-center gap-3">
                    <span
                      className="size-8 rounded-lg border border-border shrink-0 shadow-sm"
                      style={{
                        backgroundColor: String(ws.accentColor || '#F39C12'),
                      }}
                    />
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground">
                        Accent Brand
                      </p>
                      <p className="font-mono text-xs font-bold text-foreground truncate">
                        {String(ws.accentColor || '#F39C12')}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border bg-muted/20 p-3 flex items-center gap-3">
                    <span
                      className="size-8 rounded-lg border border-border shrink-0 shadow-sm"
                      style={{
                        backgroundColor: String(ws.menuPrimaryColor || '#E8500A'),
                      }}
                    />
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground">
                        Menu Accent
                      </p>
                      <p className="font-mono text-xs font-bold text-foreground truncate">
                        {String(ws.menuPrimaryColor || '#E8500A')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feature Flags & Navigation Controls */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                        Feature Flags &amp; Navigation Modules
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Control which customer-facing features and actions are active on the visitor landing page
                      </p>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setIsEditingWorkspace(!isEditingWorkspace)}
                      leftIcon={<PiPencilSimpleBold size={13} />}
                    >
                      {isEditingWorkspace ? 'Cancel' : 'Configure Features'}
                    </Button>
                  </div>

                  {!isEditingWorkspace ? (
                    <>
                      <div className="flex flex-wrap gap-2 pt-1">
                        <Badge tone={ws.menubtnStatus ? 'success' : 'neutral'}>
                          Digital Menu: {ws.menubtnStatus ? 'Active' : 'Hidden'}
                        </Badge>
                        <Badge tone={ws.paybtnStatus ? 'success' : 'neutral'}>
                          Pay Bill: {ws.paybtnStatus ? 'Active' : 'Hidden'}
                        </Badge>
                        <Badge tone={ws.reviewbtnStatus ? 'success' : 'neutral'}>
                          Review Link: {ws.reviewbtnStatus ? 'Active' : 'Hidden'}
                        </Badge>
                        <Badge tone={ws.specialOfferStatus ? 'success' : 'neutral'}>
                          Special Offers: {ws.specialOfferStatus ? 'Active' : 'Hidden'}
                        </Badge>
                        <Badge tone={ws.socialApprovalRequired ? 'warning' : 'neutral'}>
                          Staff Post Approval: {ws.socialApprovalRequired ? 'Required' : 'Not Required'}
                        </Badge>
                      </div>

                      {Boolean(ws.announcementText) && (
                        <div className="rounded-xl border border-amber-500/20 bg-amber-950/20 p-3">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                            Customer Announcement Banner {ws.announcementEnabled ? '(Active)' : '(Disabled)'}
                          </p>
                          <p className="mt-1 text-xs font-medium text-amber-200">
                            &quot;{String(ws.announcementText)}&quot;
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <form onSubmit={handleSaveWorkspaceFeatures} className="space-y-4 pt-2 border-t border-border">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Checkbox
                          id="flag-menu"
                          label="Digital Menu View"
                          checked={workspaceForm.menubtnStatus}
                          onChange={(e) =>
                            setWorkspaceForm({ ...workspaceForm, menubtnStatus: e.target.checked })
                          }
                        />
                        <Checkbox
                          id="flag-pay"
                          label="Pay Bill Button"
                          checked={workspaceForm.paybtnStatus}
                          onChange={(e) =>
                            setWorkspaceForm({ ...workspaceForm, paybtnStatus: e.target.checked })
                          }
                        />
                        <Checkbox
                          id="flag-review"
                          label="Google Review Button"
                          checked={workspaceForm.reviewbtnStatus}
                          onChange={(e) =>
                            setWorkspaceForm({ ...workspaceForm, reviewbtnStatus: e.target.checked })
                          }
                        />
                        <Checkbox
                          id="flag-offers"
                          label="Special Offers Modal"
                          checked={workspaceForm.specialOfferStatus}
                          onChange={(e) =>
                            setWorkspaceForm({ ...workspaceForm, specialOfferStatus: e.target.checked })
                          }
                        />
                        <Checkbox
                          id="flag-approval"
                          label="Require Approval for Social Media Posts"
                          checked={workspaceForm.socialApprovalRequired}
                          onChange={(e) =>
                            setWorkspaceForm({ ...workspaceForm, socialApprovalRequired: e.target.checked })
                          }
                        />
                      </div>

                      <div className="space-y-2 rounded-xl border border-border bg-muted/20 p-3">
                        <Checkbox
                          id="flag-announcement-enabled"
                          label="Enable Customer Landing Marquee Announcement"
                          checked={workspaceForm.announcementEnabled}
                          onChange={(e) =>
                            setWorkspaceForm({ ...workspaceForm, announcementEnabled: e.target.checked })
                          }
                        />
                        <FormField label="Announcement Marquee Text">
                          <Input
                            value={workspaceForm.announcementText}
                            onChange={(e) =>
                              setWorkspaceForm({ ...workspaceForm, announcementText: e.target.value })
                            }
                            placeholder="e.g. Happy Hour 5PM-7PM • 20% Off All Appetizers!"
                          />
                        </FormField>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => setIsEditingWorkspace(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          variant="primary"
                          size="sm"
                          loading={workspaceSaving}
                          leftIcon={<PiFloppyDiskBold size={14} />}
                        >
                          Save Features
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
