"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { LuCalculator, LuDollarSign, LuTrendingUp, LuClock, LuReceipt, LuSparkles } from "react-icons/lu";

export function RoiCalculator() {
  const [tables, setTables] = useState(24);
  const [avgCheck, setAvgCheck] = useState(65);

  // Business calculations
  // Extra turns per day approx: 0.4 extra turn per table due to 12m saved
  const extraTurnoverPerTablePerDay = 0.35;
  const extraDailyRevenue = Math.round(tables * extraTurnoverPerTablePerDay * avgCheck);
  const annualRevenueGain = Math.round(extraDailyRevenue * 310); // 310 operational days
  const printingCostsSaved = Math.round(tables * 95); // ~$95/table/year in reprints and laminates
  const serverHoursSaved = Math.round(tables * 0.6 * 7); // ~0.6 hrs saved per table per week

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-zinc-900/90 via-zinc-950 to-zinc-950 p-8 sm:p-12 lg:p-16 backdrop-blur-2xl shadow-2xl">
        {/* Ambient Glows */}
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Controls Column */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400 mb-3">
                <LuCalculator className="h-3.5 w-3.5" />
                <span>Interactive ROI Calculator</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white font-serif tracking-tight">
                Calculate your restaurant&apos;s annual lift.
              </h3>
              <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                See how much revenue you unlock by cutting table turn times by 12 minutes and eliminating reprinting overhead.
              </p>
            </div>

            {/* Slider 1: Tables */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-zinc-300">Number of Dining Tables</span>
                <span className="font-mono text-base font-bold text-white bg-zinc-800/80 px-3 py-1 rounded-lg border border-white/10">
                  {tables} Tables
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="1"
                value={tables}
                onChange={(e) => setTables(Number(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[11px] text-zinc-400 font-mono">
                <span>5 tables</span>
                <span>50 tables</span>
                <span>100 tables</span>
              </div>
            </div>

            {/* Slider 2: Average Check */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-zinc-300">Average Check Size ($)</span>
                <span className="font-mono text-base font-bold text-white bg-zinc-800/80 px-3 py-1 rounded-lg border border-white/10">
                  ${avgCheck}
                </span>
              </div>
              <input
                type="range"
                min="15"
                max="250"
                step="5"
                value={avgCheck}
                onChange={(e) => setAvgCheck(Number(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[11px] text-zinc-400 font-mono">
                <span>$15 (Casual)</span>
                <span>$120 (Fine Dining)</span>
                <span>$250+</span>
              </div>
            </div>
          </div>

          {/* Results Summary Column */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="border-b border-white/10 pb-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Estimated Annual Revenue Gain
                </p>
                <div className="mt-2 flex items-baseline gap-3">
                  <span className="text-4xl sm:text-5xl font-black text-emerald-400 font-mono">
                    +${annualRevenueGain.toLocaleString()}
                  </span>
                  <span className="text-xs font-semibold text-zinc-400">/ year</span>
                </div>
                <p className="mt-2 text-xs text-emerald-400/90 font-medium">
                  Based on +0.35 extra turns per table/day from zero-wait ordering and tap-to-pay.
                </p>
              </div>

              {/* Secondary Perks Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-4">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-1">
                    <LuReceipt className="h-4 w-4" />
                    <span>Print Costs Saved</span>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-white font-mono">
                    ${printingCostsSaved.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-zinc-400 mt-1">Zero reprint charges for 86&apos;d dishes</p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-4">
                  <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold mb-1">
                    <LuClock className="h-4 w-4" />
                    <span>Staff Hours Saved</span>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-white font-mono">
                    {serverHoursSaved} hrs
                  </p>
                  <p className="text-[10px] text-zinc-400 mt-1">Saved per week in manual bill steps</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
