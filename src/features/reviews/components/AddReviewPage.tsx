"use client";

import { loadWorkspace as loadCachedWorkspace } from '@/hooks/useWorkspace';
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactQRCode } from "@lglab/react-qr-code";
import { toast } from "@/components/ui/toast";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Notice } from "@/components/ui/Notice";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageContainer } from "@/components/ui/PageContainer";
import {
  workspaceService,
  type GooglePlaceResult,
} from "@/services/workspace.service";
import { googleService } from "@/services/google.service";
import { getApiErrorMessage } from "@/utils/errors";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { cn } from "@/utils/cn";
import { ADD_REVIEW_STEPS } from "@/constants/reviews.constants";
import {
  PiArrowRightBold,
  PiCheckBold,
  PiCheckCircleFill,
  PiCopyBold,
  PiMagnifyingGlassBold,
  PiMapPinBold,
} from "react-icons/pi";

type Step = "find" | "confirm" | "import" | "done";

const STEPS: readonly { id: Step; label: string }[] = ADD_REVIEW_STEPS;

function stepIndex(step: Step) {
  return step === "done" ? STEPS.length : STEPS.findIndex((s) => s.id === step);
}

function Stepper({ step }: { step: Step }) {
  const current = stepIndex(step);
  return (
    <ol className="flex items-center gap-2" aria-label="Progress">
      {STEPS.map((s, i) => {
        const complete = i < current;
        const active = i === current;
        return (
          <li key={s.id} className="flex items-center gap-2" aria-current={active ? "step" : undefined}>
            <span
              className={cn(
                "flex size-6 items-center justify-center rounded-full text-caption font-bold",
                complete || active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}
            >
              {complete ? <PiCheckBold size={12} aria-hidden /> : i + 1}
            </span>
            <span className={cn("text-body", active ? "font-medium text-foreground" : "text-muted-foreground")}>
              {s.label}
            </span>
            {i < STEPS.length - 1 ? <span aria-hidden className="mx-1 h-px w-6 bg-border" /> : null}
          </li>
        );
      })}
    </ol>
  );
}

function AddReviewPageContent() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("find");
  const [reviewLink, setReviewLink] = useState("");
  const [placeQuery, setPlaceQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [placeResults, setPlaceResults] = useState<GooglePlaceResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<GooglePlaceResult | null>(null);
  const [importStage, setImportStage] = useState<"saving" | "importing">("saving");
  const [importedCount, setImportedCount] = useState<number | null>(null);
  const [importFailed, setImportFailed] = useState(false);
  const [googleConnected, setGoogleConnected] = useState<boolean | null>(null);
  const [copied, setCopied] = useState(false);
  const searchRequestRef = useRef(0);

  useEffect(() => {
    let mounted = true;
    async function loadWorkspace() {
      try {
        const ws = await loadCachedWorkspace();
        if (mounted) {
          setReviewLink(ws.review?.googleReviewLink || "");
        }
      } catch (error) {
        console.error(error);
        toast.error(getApiErrorMessage(error, "Failed to load review configuration."));
      }
    }
    loadWorkspace();
    return () => {
      mounted = false;
    };
  }, []);

  // Search status follows the typed query; the effect below only runs the debounced request.
  const handlePlaceQueryChange = (value: string) => {
    setPlaceQuery(value);
    if (value.trim().length < 2) {
      setPlaceResults([]);
      setHasSearched(false);
      setSearching(false);
    } else {
      setSearching(true);
    }
  };

  useEffect(() => {
    const trimmed = placeQuery.trim();
    const requestId = ++searchRequestRef.current;
    if (trimmed.length < 2) return;

    const timer = setTimeout(async () => {
      try {
        const res = await workspaceService.searchPlaces(trimmed);
        if (requestId !== searchRequestRef.current) return;
        setPlaceResults(res.data.results);
        setHasSearched(true);
      } catch (error) {
        if (requestId !== searchRequestRef.current) return;
        toast.error(getApiErrorMessage(error, "Failed to search Google Places"));
        setPlaceResults([]);
        setHasSearched(true);
      } finally {
        if (requestId === searchRequestRef.current) setSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [placeQuery]);

  const handleSelectPlace = (place: GooglePlaceResult) => {
    setSelectedPlace(place);
    setStep("confirm");
  };

  const importReviews = async () => {
    setImportStage("importing");
    setImportFailed(false);
    try {
      const res = await workspaceService.syncGoogleReviews();
      setImportedCount(res.data.reviews.length);
    } catch (error) {
      setImportFailed(true);
      toast.error(getApiErrorMessage(error, "Link saved, but importing reviews failed."));
    }
  };

  const handleLinkAndImport = async () => {
    if (!selectedPlace) return;
    setStep("import");
    setImportStage("saving");
    try {
      await workspaceService.updateWorkspace({
        review: { googleReviewLink: selectedPlace.reviewLink },
      });
      setReviewLink(selectedPlace.reviewLink);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to save review link"));
      setStep("confirm");
      return;
    }
    await importReviews();
    setStep("done");
    // Best effort: only used to suggest the next step.
    googleService
      .getStatus()
      .then((status) => setGoogleConnected(status.isConnected))
      .catch(() => setGoogleConnected(null));
  };

  const handleRetryImport = async () => {
    setStep("import");
    await importReviews();
    setStep("done");
  };

  const handleCopyReviewLink = async () => {
    try {
      await navigator.clipboard.writeText(reviewLink);
      setCopied(true);
      toast.success("Review link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to copy review link"));
    }
  };

  const linkRow = (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 p-3">
      <p className="min-w-0 flex-1 truncate text-xs text-foreground">{reviewLink}</p>
      <button
        type="button"
        onClick={handleCopyReviewLink}
        title="Copy review link"
        aria-label="Copy review link"
        className="inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded border border-border bg-card text-foreground transition hover:bg-muted focus-visible:outline-2 focus-visible:outline-primary"
      >
        {copied ? <PiCheckBold size={12} /> : <PiCopyBold size={12} />}
      </button>
    </div>
  );

  return (
    <PageContainer>
      <PageHeader
        title="Find your business on Google"
        onBack={() => router.push("/admin/listreview")}
        backLabel="Back to reviews"
      />
      {step === "done" ? null : (
        <div className="flex justify-center">
          <Stepper step={step} />
        </div>
      )}

      {step === "find" ? (
        <div className="mx-auto w-full max-w-2xl space-y-4">
          <div className="text-center">
            <h2 className="text-lg font-bold text-foreground">Which business are your guests reviewing?</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Search Google Maps. We&apos;ll import your reviews and make a QR code guests can scan to leave one.
            </p>
          </div>

          <div className="relative">
            <label htmlFor="place-search" className="sr-only">
              Search your business
            </label>
            <PiMagnifyingGlassBold
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <Input
              id="place-search"
              value={placeQuery}
              onChange={(e) => handlePlaceQueryChange(e.target.value)}
              placeholder="Business name and city, e.g. The Spice Garden, Chennai"
              className="h-12 pl-11 pr-28 text-base"
              autoComplete="off"
              autoFocus
            />
            {searching ? (
              <span className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-2 text-xs text-muted-foreground">
                <span className="size-3 animate-spin rounded-full border border-muted-foreground border-t-transparent" />
                Searching
              </span>
            ) : null}
          </div>

          <div aria-live="polite">
            {hasSearched && !searching && placeResults.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                No places found. Try a more specific name or add your city.
              </p>
            ) : placeResults.length > 0 ? (
              <ul className="max-h-[46vh] space-y-2 overflow-y-auto pr-0.5">
                {placeResults.map((place) => (
                  <li key={place.placeId}>
                    <button
                      type="button"
                      onClick={() => handleSelectPlace(place)}
                      className="flex w-full items-center gap-3 rounded-xl border border-border bg-card p-3 text-left transition-colors hover:border-primary/50 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <PiMapPinBold size={16} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">{place.name}</p>
                        {place.address ? (
                          <p className="truncate text-xs text-muted-foreground">{place.address}</p>
                        ) : null}
                      </div>
                      <PiArrowRightBold size={14} className="shrink-0 text-muted-foreground" aria-hidden />
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {reviewLink ? (
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
              <PiCheckCircleFill size={16} className="shrink-0 text-success" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-foreground">A business is already linked</p>
                <p className="truncate text-caption text-muted-foreground">{reviewLink}</p>
              </div>
              <button
                type="button"
                onClick={handleCopyReviewLink}
                title="Copy review link"
                aria-label="Copy review link"
                className="inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded border border-border bg-card text-foreground transition hover:bg-muted focus-visible:outline-2 focus-visible:outline-primary"
              >
                {copied ? <PiCheckBold size={12} /> : <PiCopyBold size={12} />}
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      {step === "confirm" && selectedPlace ? (
        <div className="mx-auto w-full max-w-xl space-y-4">
          <div className="rounded-xl border border-border bg-card p-6">
            <p className="mb-3 text-overline text-muted-foreground">Is this your business?</p>
            <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <PiMapPinBold size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-foreground">{selectedPlace.name}</p>
                {selectedPlace.address ? (
                  <p className="mt-0.5 text-xs text-muted-foreground">{selectedPlace.address}</p>
                ) : null}
              </div>
            </div>
            {reviewLink && reviewLink !== selectedPlace.reviewLink ? (
              <div className="mt-4">
                <Notice tone="warning" title="This replaces your current business">
                  Reviews shown on this page will switch to the business above.
                </Notice>
              </div>
            ) : null}
            <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button type="button" variant="secondary" onClick={() => setStep("find")}>
                Choose a different one
              </Button>
              <Button
                type="button"
                onClick={() => void handleLinkAndImport()}
                rightIcon={<PiArrowRightBold size={14} />}
              >
                Link &amp; import reviews
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {step === "import" ? (
        <div className="mx-auto w-full max-w-xl rounded-xl border border-border bg-card p-8 text-center" role="status">
          <span className="mx-auto block size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="mt-4 text-sm font-semibold text-foreground">
            {importStage === "saving" ? "Saving your review link…" : "Importing your Google reviews…"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">This usually takes a few seconds.</p>
        </div>
      ) : null}

      {step === "done" ? (
        <div className="mx-auto w-full max-w-xl space-y-4">
          <div className="rounded-xl border border-border bg-card p-6 text-center">
            <PiCheckCircleFill size={36} className="mx-auto text-success" aria-hidden />
            <h2 className="mt-3 text-lg font-bold text-foreground">
              {selectedPlace?.name ?? "Your business"} is linked
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {importFailed
                ? "Your link is saved, but we couldn't import reviews yet."
                : importedCount === 0
                  ? "No reviews to import yet. New ones will appear after your next sync."
                  : `Imported ${importedCount} review${importedCount === 1 ? "" : "s"}.`}
            </p>
            {importFailed ? (
              <Button type="button" variant="secondary" size="sm" className="mt-3" onClick={() => void handleRetryImport()}>
                Try importing again
              </Button>
            ) : null}
          </div>

          {reviewLink ? (
            <div className="rounded-xl border border-border bg-card p-6">
              <p className="mb-1 text-sm font-semibold text-foreground">Ask guests for a review</p>
              <p className="mb-4 text-xs text-muted-foreground">
                Print this QR code on tables or receipts. Scanning it opens your Google review form.
              </p>
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <div className="size-36 shrink-0 overflow-hidden rounded-lg border border-border bg-white p-1 [&>svg]:block [&>svg]:size-full">
                  <ReactQRCode value={reviewLink} size={144} level="M" marginSize={1} />
                </div>
                <div className="w-full min-w-0 flex-1">{linkRow}</div>
              </div>
            </div>
          ) : null}

          {googleConnected === false ? (
            <Notice
              tone="info"
              title="Connect Google to reply from here"
              action={
                <Link href="/admin/settings?tab=accounts" className={buttonVariants({ variant: "secondary", size: "sm" })}>
                  Connect Google
                </Link>
              }
            >
              You can already read your reviews. Replying needs your Google Business account.
            </Notice>
          ) : null}

          <div className="flex justify-end">
            <Link href="/admin/listreview" className={buttonVariants({ variant: "primary" })}>
              View reviews
            </Link>
          </div>
        </div>
      ) : null}
    </PageContainer>
  );
}

export function AddReviewPage() {
  return (
    <PermissionGuard requiredUnit="reviews">
      <AddReviewPageContent />
    </PermissionGuard>
  );
}
