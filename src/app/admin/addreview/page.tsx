"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/ui/PageHeader";
import { workspaceService, type GooglePlaceResult } from "@/services/workspace.service";
import { getApiErrorMessage } from "@/utils/errors";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import {
  PiCheckBold,
  PiCopyBold,
  PiMagnifyingGlassBold,
  PiMapPinBold,
  PiGoogleLogoBold,
  PiArrowRightBold,
  PiCheckCircleFill,
} from "react-icons/pi";

function AddReviewPageContent() {
  const router = useRouter();
  const [reviewLink, setReviewLink] = useState("");
  const [placeQuery, setPlaceQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [placeResults, setPlaceResults] = useState<GooglePlaceResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<GooglePlaceResult | null>(null);
  const [discoverySaving, setDiscoverySaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const searchRequestRef = useRef(0);

  useEffect(() => {
    let mounted = true;
    async function loadWorkspace() {
      try {
        const res = await workspaceService.getWorkspace();
        if (mounted) {
          setReviewLink(res.data.review?.googleReviewLink || "");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load review configuration.");
      }
    }
    loadWorkspace();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const trimmed = placeQuery.trim();
    if (trimmed.length < 2) {
      searchRequestRef.current += 1;
      setPlaceResults([]);
      setHasSearched(false);
      setSearching(false);
      return;
    }

    const requestId = ++searchRequestRef.current;
    setSearching(true);

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
    setSelectedPlace((current) => (current?.placeId === place.placeId ? null : place));
  };

  const handleSynchronizeDiscovery = async () => {
    if (!selectedPlace) return;
    try {
      setDiscoverySaving(true);
      await workspaceService.updateWorkspace({
        review: { googleReviewLink: selectedPlace.reviewLink },
      });
      setReviewLink(selectedPlace.reviewLink);
      toast.success("Review link saved");

      // Pull the linked place's reviews right away, so the admin lands on
      // Reviews with real data already there instead of an empty list they'd
      // have to remember to hit "Sync Now" for.
      try {
        await workspaceService.syncGoogleReviews();
        toast.success("Google reviews synced");
      } catch (syncError) {
        toast.error(getApiErrorMessage(syncError, "Link saved, but review sync failed — try Sync Now on the Reviews page."));
      }

      router.push("/admin/listreview");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to save review link"));
    } finally {
      setDiscoverySaving(false);
    }
  };

  const handleCopyReviewLink = async () => {
    try {
      await navigator.clipboard.writeText(reviewLink);
      setCopied(true);
      toast.success("Review link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy review link");
    }
  };

  return (
    <div className="flex h-full flex-col gap-3 sm:gap-4">
      <PageHeader
        title="Add Review Link"
        onBack={() => router.push("/admin/listreview")}
        backLabel="Back to reviews"
      />

      <div className="min-h-0 flex-1 overflow-y-auto pr-0.5 pb-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        {/* Left — Search panel */}
        <div className="flex flex-col gap-4 lg:col-span-3">
          {/* Heading card */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                <PiGoogleLogoBold size={16} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Google Map Intelligence</p>
                <p className="text-sm font-bold text-foreground">Place Discovery</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Search Google's database to find your business and automatically generate your review link. Type your restaurant or business name to get started.
            </p>
          </div>

          {/* Search input */}
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="mb-2 text-xs font-semibold text-foreground">Search your business</p>
            <div className="relative">
              <PiMagnifyingGlassBold
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={16}
              />
              <Input
                value={placeQuery}
                onChange={(e) => setPlaceQuery(e.target.value)}
                placeholder="e.g. The Spice Garden, Chennai"
                className="h-10 pl-9 pr-20"
                autoComplete="off"
              />
              {searching ? (
                <span className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="size-3 animate-spin rounded-full border border-muted-foreground border-t-transparent" />
                  Searching
                </span>
              ) : null}
            </div>
          </div>

          {/* Results */}
          <div className="min-h-0 flex-1 overflow-y-auto rounded-xl border border-border bg-card">
            {!hasSearched && !searching ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
                <div className="flex size-12 items-center justify-center rounded-xl border border-border bg-muted text-muted-foreground">
                  <PiMapPinBold size={22} />
                </div>
                <p className="text-sm font-semibold text-foreground">Search for your business</p>
                <p className="max-w-xs text-xs text-muted-foreground">
                  Results appear here — pick your listing, then click Synchronize below.
                </p>
              </div>
            ) : hasSearched && !searching && placeResults.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
                <div className="flex size-12 items-center justify-center rounded-xl border border-border bg-muted text-muted-foreground">
                  <PiMapPinBold size={22} />
                </div>
                <p className="text-sm font-semibold text-foreground">No places found</p>
                <p className="text-xs text-muted-foreground">Try a more specific name or add your city.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-px p-2">
                {placeResults.map((place) => {
                  const isSelected = selectedPlace?.placeId === place.placeId;
                  return (
                    <button
                      key={place.placeId}
                      type="button"
                      onClick={() => handleSelectPlace(place)}
                      className={`flex items-start gap-3 rounded-lg border p-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-transparent hover:border-border hover:bg-muted/50"
                      }`}
                    >
                      <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors ${isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                        <PiMapPinBold size={14} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">{place.name}</p>
                        {place.address ? (
                          <p className="truncate text-xs text-muted-foreground">{place.address}</p>
                        ) : null}
                      </div>
                      {isSelected && (
                        <PiCheckCircleFill size={16} className="mt-0.5 shrink-0 text-primary" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right — Confirm + current link panel */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          {/* Selected place confirmation */}
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">Selected Business</p>
            {selectedPlace ? (
              <div className="mb-4 rounded-lg border border-primary/20 bg-primary/5 p-3">
                <p className="truncate text-sm font-bold text-foreground">{selectedPlace.name}</p>
                <p className="mt-0.5 truncate text-[10px] text-muted-foreground">{selectedPlace.reviewLink}</p>
              </div>
            ) : (
              <div className="mb-4 rounded-lg border border-dashed border-border p-3 text-center">
                <p className="text-xs text-muted-foreground">No business selected yet</p>
              </div>
            )}
            <Button
              className="w-full"
              onClick={handleSynchronizeDiscovery}
              loading={discoverySaving}
              disabled={!selectedPlace}
              rightIcon={!discoverySaving ? <PiArrowRightBold size={14} /> : undefined}
            >
              Synchronize Review
            </Button>
          </div>

          {/* Current review link (if set) */}
          {reviewLink ? (
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">Current Review Link</p>
              <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-950/40">
                <PiCheckBold size={13} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                <p className="min-w-0 flex-1 truncate text-xs text-emerald-700 dark:text-emerald-300">{reviewLink}</p>
                <button
                  type="button"
                  onClick={handleCopyReviewLink}
                  title="Copy review link"
                  aria-label="Copy review link"
                  className="inline-flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded border border-emerald-200 bg-white text-emerald-600 transition hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-900 dark:text-emerald-400"
                >
                  {copied ? <PiCheckBold size={11} /> : <PiCopyBold size={11} />}
                </button>
              </div>
            </div>
          ) : null}

          {/* How it works */}
          <div className="flex-1 rounded-xl border border-border bg-card p-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">How it works</p>
            <div className="space-y-3">
              {[
                "Search your business name to find it on Google Maps",
                "Select the correct listing from the results",
                "Click Synchronize to save and activate your review link",
                "Reviews sync automatically from your Google listing",
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                    {i + 1}
                  </span>
                  <p className="text-xs text-muted-foreground">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default function AddReviewPage() {
  return (
    <PermissionGuard requiredUnit="reviews">
      <AddReviewPageContent />
    </PermissionGuard>
  );
}
