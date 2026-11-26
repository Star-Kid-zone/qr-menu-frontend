"use client";

import { loadWorkspace } from '@/hooks/useWorkspace';
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { PiGoogleLogo } from "react-icons/pi";
import { Button, buttonVariants } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import { Notice } from "@/components/ui/Notice";
import { toast } from "@/components/ui/toast";
import { routes } from "@/config/routes";
import { usePermissions } from "@/hooks/usePermissions";
import { googleService, type GoogleBusinessStatus } from "@/services/google.service";
import { socialService, type SocialAccount, type SocialPlatform } from "@/services/social.service";
import { AccountsTab } from "@/features/social";
import { getApiErrorMessage } from "@/utils/errors";

const requestGoogle = () =>
  Promise.all([googleService.getStatus(), loadWorkspace()]);

/**
 * Every outside account the restaurant links: Google Business (reviews) and
 * the social networks (posting). Same calls the Reviews and Social posts pages
 * used before; they now link here.
 */
export function ConnectedAccounts() {
  const { ready, hasPermission } = usePermissions();
  const canReviews = ready && hasPermission("reviews");
  const canSocial = ready && hasPermission("marketing");

  const [google, setGoogle] = useState<GoogleBusinessStatus | null>(null);
  const [reviewLink, setReviewLink] = useState<string | null>(null);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [connectingGoogle, setConnectingGoogle] = useState(false);
  const [confirmGoogleDisconnect, setConfirmGoogleDisconnect] = useState(false);
  const [disconnectingGoogle, setDisconnectingGoogle] = useState(false);

  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [accountToDisconnect, setAccountToDisconnect] = useState<SocialAccount | null>(null);

  const applyGoogle = useCallback(([status, ws]: Awaited<ReturnType<typeof requestGoogle>>) => {
    setGoogle(status);
    setReviewLink(ws.review?.googleReviewLink?.trim() || null);
  }, []);

  const handleGoogleError = useCallback((err: unknown) => {
    setGoogleError(getApiErrorMessage(err, "Check your connection and try again."));
  }, []);

  const loadGoogle = useCallback(async () => {
    if (!canReviews) return;
    try {
      setGoogleError(null);
      applyGoogle(await requestGoogle());
    } catch (err) {
      handleGoogleError(err);
    }
  }, [canReviews, applyGoogle, handleGoogleError]);

  const handleAccountsError = useCallback((err: unknown) => {
    toast.error(getApiErrorMessage(err, "Couldn't load your social accounts."));
  }, []);

  const loadAccounts = useCallback(async () => {
    if (!canSocial) return;
    try {
      setAccountsLoading(true);
      const res = await socialService.getAccounts();
      setAccounts(res.data || []);
    } catch (err) {
      handleAccountsError(err);
    } finally {
      setAccountsLoading(false);
    }
  }, [canSocial, handleAccountsError]);

  // Initial loads (`googleError` starts null, `accountsLoading` starts true);
  // loadGoogle / loadAccounts handle the retry and refresh buttons.
  useEffect(() => {
    if (!canReviews) return;
    requestGoogle().then(applyGoogle).catch(handleGoogleError);
  }, [canReviews, applyGoogle, handleGoogleError]);

  useEffect(() => {
    if (!canSocial) return;
    socialService
      .getAccounts()
      .then((res) => setAccounts(res.data || []))
      .catch(handleAccountsError)
      .finally(() => setAccountsLoading(false));
  }, [canSocial, handleAccountsError]);

  const connectGoogle = async () => {
    try {
      setConnectingGoogle(true);
      const res = await googleService.getOAuthUrl();
      if (res.url) window.location.href = res.url;
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Couldn't start connecting Google. Try again."));
      setConnectingGoogle(false);
    }
  };

  const disconnectGoogle = async () => {
    try {
      setDisconnectingGoogle(true);
      await googleService.disconnect();
      toast.success("Google Business disconnected");
      setConfirmGoogleDisconnect(false);
      await loadGoogle();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Couldn't disconnect Google. Try again."));
    } finally {
      setDisconnectingGoogle(false);
    }
  };

  const connectPlatform = async (platform: SocialPlatform) => {
    try {
      const { data } = await socialService.startOAuth(platform);
      if (data?.url) window.location.assign(data.url);
      else toast.error("Couldn't start connecting that account. Try again.");
    } catch (err) {
      toast.error(getApiErrorMessage(err, `Couldn't connect ${platform}. Try again.`));
    }
  };

  return (
    <div className="space-y-8">
      {canReviews && (
        <section aria-labelledby="google-heading" className="space-y-3">
          <h2 id="google-heading" className="text-h2 text-foreground">Google Business</h2>

          {googleError ? (
            <Notice
              tone="error"
              title="We couldn't check your Google connection"
              action={<Button size="sm" variant="secondary" onClick={() => void loadGoogle()}>Try again</Button>}
            >
              {googleError}
            </Notice>
          ) : null}

          <div className="divide-y divide-border rounded-lg border border-border bg-card">
            <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <PiGoogleLogo aria-hidden className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-body-medium text-foreground">Your business on Google Maps</p>
                  <p className="text-body text-muted-foreground">
                    {reviewLink ? "Linked. Reviews are read from this business." : "Not linked yet. Needed to show your reviews."}
                  </p>
                </div>
              </div>
              <Link href={routes.admin.addReview} className={buttonVariants({ variant: "secondary" })}>
                {reviewLink ? "Change business" : "Find your business"}
              </Link>
            </div>

            <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-body-medium text-foreground">Google account</p>
                <p className="text-body text-muted-foreground">
                  {google?.isConnected
                    ? `Connected${google.accountName ? ` as ${google.accountName}` : ""}. You can reply to reviews.`
                    : "Not connected. Connect to reply to reviews from here."}
                </p>
              </div>
              {google?.isConnected ? (
                <Button variant="secondary" onClick={() => setConfirmGoogleDisconnect(true)}>
                  Disconnect
                </Button>
              ) : (
                <Button onClick={() => void connectGoogle()} loading={connectingGoogle} disabled={!google && !googleError}>
                  Connect Google
                </Button>
              )}
            </div>
          </div>
        </section>
      )}

      {canSocial && (
        <section aria-labelledby="social-heading" className="space-y-3">
          <h2 id="social-heading" className="text-h2 text-foreground">Social accounts</h2>
          <AccountsTab
            accounts={accounts}
            loading={accountsLoading}
            onRefresh={() => void loadAccounts()}
            onConnect={(platform) => void connectPlatform(platform)}
            onDisconnectRequest={setAccountToDisconnect}
            embedded
          />
        </section>
      )}

      <ConfirmationDialog
        isOpen={confirmGoogleDisconnect}
        onClose={() => setConfirmGoogleDisconnect(false)}
        onConfirm={() => void disconnectGoogle()}
        loading={disconnectingGoogle}
        title="Disconnect Google?"
        description="You'll still see your reviews, but you won't be able to reply to them or use automatic replies until you connect again."
        confirmLabel="Disconnect"
      />

      {accountToDisconnect && (
        <ConfirmDeleteModal
          isOpen
          onClose={() => setAccountToDisconnect(null)}
          onConfirm={async () => {
            await socialService.disconnect(accountToDisconnect.id);
            setAccounts((prev) => prev.filter((a) => a.id !== accountToDisconnect.id));
          }}
          entityName={accountToDisconnect.displayName}
          successMessage={`${accountToDisconnect.displayName} disconnected`}
          title={`Disconnect ${accountToDisconnect.displayName}?`}
          description="You won't be able to post to this account until you connect it again."
          confirmLabel="Disconnect"
        />
      )}
    </div>
  );
}
