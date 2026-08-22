"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { fadeIn, fadeInUp } from "@/lib/motion";
import { workspaceService, type GooglePlaceResult } from "@/services/workspace.service";
import { getApiErrorMessage } from "@/utils/errors";
import {
  PiCheckBold,
  PiCopyBold,
  PiMagnifyingGlassBold,
  PiMapPinBold,
} from "react-icons/pi";

export default function AddReviewPage() {
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
  const shouldReduceMotion = useReducedMotion();
  const cardVariants = shouldReduceMotion ? fadeIn : fadeInUp;

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
    return () => {
      mounted = false;
    };
  }, []);

  // Live, debounced search — fires automatically as the admin types instead
  // of requiring a button click. Stale in-flight requests are dropped via
  // searchRequestRef so a fast typist never sees an older query's results
  // flash in after a newer one already resolved.
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
    } catch (error) {
      toast.error("Failed to copy review link");
    }
  };

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto">
      <PageHeader
        title="Add Review Link"
        onBack={() => router.push("/admin/listreview")}
        backLabel="Back"
      />

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto w-full max-w-3xl"
      >
        <Card>
          <CardHeader className="pb-2">
            <div className="mb-1 flex items-center gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-clay-gradient text-primary-foreground shadow-neu-sm">
                <PiMagnifyingGlassBold size={20} />
              </span>
              <p className="text-caption font-semibold uppercase tracking-[0.2em] text-primary">Google Map Intelligence</p>
            </div>
            <CardTitle className="text-h2 text-foreground">Place Discovery</CardTitle>
            <p className="text-body text-muted-foreground">
              Search Google’s database to find your business and automatically generate its review link.
            </p>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {reviewLink ? (
              <div>
                <p className="mb-1.5 text-caption font-semibold text-foreground">Current Review Link</p>
                <div className="clay-inset flex items-center gap-2 border border-border/60 bg-muted/40 p-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-success/15 text-success">
                    <PiCheckBold size={14} />
                  </span>
                  <p className="min-w-0 flex-1 truncate text-caption text-muted-foreground">{reviewLink}</p>
                  <button
                    type="button"
                    onClick={handleCopyReviewLink}
                    title="Copy review link"
                    aria-label="Copy review link"
                    className="inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md border border-border bg-card text-muted-foreground shadow-neu-sm transition-[color,background-color,border-color,transform] duration-150 ease-out hover:border-primary/30 hover:bg-accent hover:text-primary active:scale-[0.95]"
                  >
                    {copied ? <PiCheckBold size={14} className="text-success" /> : <PiCopyBold size={14} />}
                  </button>
                </div>
              </div>
            ) : null}

            <div className="relative">
              <label className="sr-only">Business name or location</label>
              <PiMagnifyingGlassBold
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <Input
                value={placeQuery}
                onChange={(e) => setPlaceQuery(e.target.value)}
                placeholder="Start typing your restaurant's name…"
                className="pl-10"
                autoComplete="off"
              />
              {searching ? (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-caption text-muted-foreground">
                  Searching…
                </span>
              ) : null}
            </div>

            {hasSearched && !searching && placeResults.length === 0 ? (
              <EmptyState
                icon={<PiMapPinBold size={28} />}
                title="No places found"
                description="Try a more specific business name or add your city."
                className="rounded-2xl py-10"
              />
            ) : null}

            {placeResults.length > 0 ? (
              <div className="flex max-h-[26rem] flex-col gap-2 overflow-y-auto">
                {placeResults.map((place) => {
                  const isSelected = selectedPlace?.placeId === place.placeId;
                  return (
                    <button
                      key={place.placeId}
                      type="button"
                      onClick={() => handleSelectPlace(place)}
                      className={`flex items-start gap-3 rounded-xl border p-3 text-left transition-all duration-150 ease-out ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-neu-sm"
                          : "border-border bg-card hover:border-primary/30 hover:bg-accent hover:shadow-neu-sm"
                      }`}
                    >
                      <PiMapPinBold size={18} className="mt-0.5 shrink-0 text-primary" />
                      <div className="min-w-0">
                        <p className="truncate text-body font-semibold text-foreground">{place.name}</p>
                        {place.address ? (
                          <p className="truncate text-caption text-muted-foreground">{place.address}</p>
                        ) : null}
                      </div>
                      {isSelected ? (
                        <Badge tone="success" className="ml-auto shrink-0">Selected</Badge>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            ) : null}

            {!hasSearched ? (
              <EmptyState
                icon={<PiMapPinBold size={28} />}
                title="Search for your business"
                description="Results appear here — pick your listing, then synchronize below."
                className="rounded-2xl py-10"
              />
            ) : null}

            {selectedPlace ? (
              <div className="clay-inset flex items-center gap-2 border border-primary/30 bg-primary/5 p-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-caption font-semibold text-foreground">{selectedPlace.name}</p>
                  <p className="truncate text-caption text-muted-foreground">{selectedPlace.reviewLink}</p>
                </div>
                <Badge tone="success" className="shrink-0">Selected</Badge>
              </div>
            ) : null}

            <Button
              className="w-full"
              onClick={handleSynchronizeDiscovery}
              loading={discoverySaving}
              disabled={!selectedPlace}
            >
              Synchronize Review
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
