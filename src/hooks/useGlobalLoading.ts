"use client";

import { useSyncExternalStore } from "react";
import {
  getGlobalLoadingServerSnapshot,
  getGlobalLoadingSnapshot,
  subscribeGlobalLoading,
} from "@/utils/globalLoading.store";

/** True whenever at least one API request (any service, any page) is in flight. */
export function useGlobalLoading(): boolean {
  return useSyncExternalStore(
    subscribeGlobalLoading,
    getGlobalLoadingSnapshot,
    getGlobalLoadingServerSnapshot,
  );
}
