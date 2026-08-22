"use client";

import { useContext, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FingerprintContext } from "@/contexts/fingerprint-context";
import { analyticsService } from "@/services/analytics.service";
import { playLottery, getLotteryWinners, type LotteryWinner } from "@/services/publicLottery.service";
import { getApiErrorMessage } from "@/utils/errors";
import { SlotMachine } from "../SlotMachine";
import type { LotteryReward } from "../defaults";

const LOSE_SYMBOLS = ["🍒", "🍋", "🔔", "⭐", "7️⃣", "🍇", "💎"];

function lastPlayedKey(workspaceId: string | number) {
  return `lottery_last_played_${workspaceId}`;
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

/** Whether this browser has already played today's lottery for this workspace. */
export function hasPlayedLotteryToday(workspaceId: string | number | null | undefined): boolean {
  if (!workspaceId || typeof window === "undefined") return false;
  return window.localStorage.getItem(lastPlayedKey(workspaceId)) === todayIso();
}

/**
 * Guest-facing Lucky Draw: a slot-machine cabinet with a pull-lever. No name
 * or any guest identity is collected — the only identifier sent is an
 * anonymous, device-stable visitor id, purely to enforce one play per day.
 * All outcomes are decided server-side by `POST /public/lottery/:workspaceId/play`
 * — the reels only visualize an already-determined result.
 */
export function LotteryGame({
  workspaceId,
  rewards,
  accent,
  textPrimary,
  textSecondary,
  border,
  onPlayed,
}: {
  workspaceId: string | number | null | undefined;
  rewards: LotteryReward[];
  accent: string;
  accentText: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  surface: string;
  /** Fires once this browser is marked as having played today (win, loss, or an already-played 409). */
  onPlayed?: () => void;
}) {
  const fingerprint = useContext(FingerprintContext);
  const [winners, setWinners] = useState<LotteryWinner[]>([]);
  const [spinKey, setSpinKey] = useState(0);
  const [targetSymbols, setTargetSymbols] = useState<[string, string, string]>(["🍒", "🍋", "🔔"]);
  const [status, setStatus] = useState<"idle" | "waiting" | "spinning" | "revealed">("idle");
  const [result, setResult] = useState<{ won: boolean; reward: { label: string; emoji: string } | null } | null>(null);
  const [error, setError] = useState("");
  const [playedToday, setPlayedToday] = useState(false);

  useEffect(() => {
    if (!workspaceId) return;
    // Lock the lever immediately on load if this browser already played today —
    // no need to wait for a failed request to find that out.
    setPlayedToday(window.localStorage.getItem(lastPlayedKey(workspaceId)) === todayIso());
    getLotteryWinners(workspaceId).then((res) => setWinners(res.data.data || [])).catch(() => {});
  }, [workspaceId]);

  if (!workspaceId) return null;

  const handlePull = async () => {
    if (playedToday || status === "waiting" || status === "spinning") return;
    setError("");
    setStatus("waiting");
    try {
      const visitorId = fingerprint || analyticsService.getVisitorId();
      const res = await playLottery(workspaceId, visitorId);
      const outcome = res.data;

      const symbols: [string, string, string] = outcome.won && outcome.reward
        ? [outcome.reward.emoji, outcome.reward.emoji, outcome.reward.emoji]
        : [
            LOSE_SYMBOLS[Math.floor(Math.random() * LOSE_SYMBOLS.length)],
            LOSE_SYMBOLS[Math.floor(Math.random() * LOSE_SYMBOLS.length)],
            LOSE_SYMBOLS[Math.floor(Math.random() * LOSE_SYMBOLS.length)],
          ];
      // Guard against an accidental 3-of-a-kind on a loss (would look like a false win).
      if (!outcome.won && symbols[0] === symbols[1] && symbols[1] === symbols[2]) {
        symbols[2] = LOSE_SYMBOLS[(LOSE_SYMBOLS.indexOf(symbols[2]) + 1) % LOSE_SYMBOLS.length];
      }

      window.localStorage.setItem(lastPlayedKey(workspaceId), todayIso());
      setPlayedToday(true);
      onPlayed?.();
      setTargetSymbols(symbols);
      setResult({ won: outcome.won, reward: outcome.reward });
      setStatus("spinning");
      setSpinKey((k) => k + 1);
    } catch (err) {
      // A 409 here means another tab/device for this same visitor already
      // played today between page load and this pull — treat it the same as
      // the locked-on-load case instead of just showing a raw error.
      window.localStorage.setItem(lastPlayedKey(workspaceId), todayIso());
      setPlayedToday(true);
      onPlayed?.();
      setStatus("idle");
      setError(getApiErrorMessage(err, "Something went wrong — please try again."));
    }
  };

  const handleSettled = () => {
    setStatus("revealed");
    if (result?.won) {
      getLotteryWinners(workspaceId).then((res) => setWinners(res.data.data || [])).catch(() => {});
    }
  };

  return (
    <div className="mx-auto max-w-lg text-center">
      {rewards.length > 0 && (
        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {rewards.map((r) => (
            <span key={r.id} style={{ borderColor: border, color: textPrimary }} className="rounded-full border px-3 py-1.5 text-xs font-semibold">
              {r.emoji} {r.label} — 1 in {Math.round(r.ratioPlays / r.ratioWins)}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-col items-center gap-4">
        <SlotMachine
          targetSymbols={targetSymbols}
          spinKey={spinKey}
          disabled={playedToday}
          waiting={status === "waiting"}
          onPull={handlePull}
          onSettled={handleSettled}
        />
        <p style={{ color: textSecondary }} className="text-xs font-semibold uppercase tracking-widest">
          {playedToday && status !== "spinning" && status !== "revealed"
            ? "Come back tomorrow for another spin"
            : status === "waiting"
              ? "Rolling…"
              : "Pull the lever to play"}
        </p>
      </div>

      {error && <p className="mt-4 text-xs font-medium text-destructive">{error}</p>}

      <AnimatePresence>
        {status === "revealed" && result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            {result.won ? (
              <>
                <p style={{ color: accent }} className="text-2xl font-bold">🎉 You won {result.reward?.label}!</p>
                <p style={{ color: textSecondary }} className="mt-1 text-sm">Show this screen to a staff member to claim your prize.</p>
              </>
            ) : (
              <p style={{ color: textSecondary }} className="text-sm">No luck this time — try again tomorrow!</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {winners.length > 0 && (
        <div className="mt-10 text-left">
          <p style={{ color: accent }} className="mb-3 text-[10px] font-bold uppercase tracking-widest">Recent Winners</p>
          <div className="space-y-1.5">
            {winners.slice(0, 5).map((w) => (
              <div key={w.id} className="flex items-center justify-between text-xs" style={{ color: textSecondary }}>
                <span>{w.rewardEmoji} Someone won {w.rewardLabel}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
