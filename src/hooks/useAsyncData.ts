"use client";

import { useCallback, useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { getApiErrorMessage } from "@/utils/errors";

export interface UseAsyncDataResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  /** Re-runs `fetcher` without waiting for `deps` to change. */
  refetch: () => Promise<void>;
  /** Local update after a create/edit/delete on the page, without refetching. */
  setData: Dispatch<SetStateAction<T | null>>;
}

/**
 * Generic loading/error/data + refetch wrapper for the "fetch on mount, show
 * a spinner, toast/render on failure" pattern hand-rolled across list/detail
 * pages (see `listmenu`, `staff`, `analytics`). Not a replacement for a real
 * caching library (React Query, SWR) — just removes the boilerplate for
 * pages that fetch once and don't need caching/revalidation.
 *
 * `fetcher` is called again whenever an entry in `deps` changes, mirroring
 * `useEffect`'s dependency array.
 */
export function useAsyncData<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = [],
  errorMessage = "Failed to load data",
): UseAsyncDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Always call the latest fetcher without forcing callers to memoize it.
  // Updated in an effect (not during render) so refs aren't mutated on the
  // render path itself.
  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcherRef.current();
      setData(result);
    } catch (err) {
      setError(getApiErrorMessage(err, errorMessage));
    } finally {
      setLoading(false);
    }
  }, [errorMessage]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetcherRef.current();
        if (mounted) setData(result);
      } catch (err) {
        if (mounted) setError(getApiErrorMessage(err, errorMessage));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, refetch: run, setData };
}
