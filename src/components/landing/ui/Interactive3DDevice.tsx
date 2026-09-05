"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LuUtensils,
  LuQrCode,
  LuCreditCard,
  LuTrendingUp,
  LuSparkles,
  LuCheck,
  LuStar,
  LuPlus,
  LuMinus,
  LuFlame,
  LuLeaf,
  LuClock,
  LuDownload,
  LuArrowRight,
} from "react-icons/lu";

type DeviceTab = "menu" | "qrcode" | "payment" | "analytics";

const DISHES = [
  {
    id: 1,
    name: "Truffle Porcini Risotto",
    desc: "Carnaroli rice, winter black truffle, 24-month parmesan",
    price: 24,
    badge: "Chef's Choice",
    isVeg: true,
    isSpicy: false,
    calories: "520 kcal",
  },
  {
    id: 2,
    name: "Woodfired Ribeye Steak",
    desc: "Aged black angus, rosemary bone marrow butter, confit garlic",
    price: 38,
    badge: "Popular",
    isVeg: false,
    isSpicy: true,
    calories: "780 kcal",
  },
  {
    id: 3,
    name: "Matcha Yuzu Tart",
    desc: "Kyoto matcha ganache, citrus gelée, candied pistachio",
    price: 14,
    badge: "Dessert",
    isVeg: true,
    isSpicy: false,
    calories: "340 kcal",
  },
];

const QR_THEMES = [
  { name: "Obsidian", color: "#090d16", bg: "#ffffff" },
  { name: "Indigo", color: "#4f46e5", bg: "#eef2ff" },
  { name: "Emerald", color: "#059669", bg: "#ecfdf5" },
  { name: "Sunset", color: "#e11d48", bg: "#fff1f2" },
];

export function Interactive3DDevice() {
  const [activeTab, setActiveTab] = useState<DeviceTab>("menu");

  // Menu interactive state
  const [cartCount, setCartCount] = useState<Record<number, number>>({ 1: 1 });
  const [activeCategory, setActiveCategory] = useState("Mains");

  // QR interactive state
  const [selectedTable, setSelectedTable] = useState("Table 04");
  const [selectedThemeIndex, setSelectedThemeIndex] = useState(1);

  // Payment interactive state
  const [tipPercentage, setTipPercentage] = useState(18);
  const [isPaid, setIsPaid] = useState(false);

  const cartTotal = Object.entries(cartCount).reduce((total, [id, count]) => {
    const dish = DISHES.find((d) => d.id === Number(id));
    return total + (dish ? dish.price * count : 0);
  }, 0);

  const handleUpdateCart = (id: number, delta: number) => {
    setCartCount((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const handlePay = () => {
    setIsPaid(true);
    setTimeout(() => setIsPaid(false), 4000);
  };

  return (
    <div className="relative mx-auto w-full max-w-[480px] lg:max-w-[460px]">
      {/* Floating 3D Micro-Badges around the device */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="hidden sm:flex absolute -left-12 -top-6 z-30 items-center gap-3 rounded-2xl border border-white/10 bg-zinc-900/90 p-3.5 shadow-2xl backdrop-blur-xl"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
          <LuCheck className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[11px] font-semibold text-zinc-400">Table 08 • Just Paid</p>
          <p className="text-xs font-bold text-white">$68.40 via Apple Pay</p>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="hidden sm:flex absolute -right-10 top-1/3 z-30 items-center gap-3 rounded-2xl border border-white/10 bg-zinc-900/90 p-3.5 shadow-2xl backdrop-blur-xl"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
          <LuStar className="h-5 w-5 fill-amber-400" />
        </div>
        <div>
          <div className="flex items-center gap-1 text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <LuStar key={i} className="h-3 w-3 fill-current" />
            ))}
          </div>
          <p className="mt-0.5 text-xs font-bold text-white">“Scanned & ordered in 20s!”</p>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="hidden sm:flex absolute -left-8 -bottom-4 z-30 items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/80 px-4 py-2 shadow-xl backdrop-blur-xl"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
        </span>
        <span className="text-[11px] font-bold text-indigo-200">100% Live In-App Sync</span>
      </motion.div>

      {/* Device Outer Frame with 3D Bevel & Shadow */}
      <div className="relative rounded-[3rem] border-4 border-zinc-700/60 bg-zinc-950 p-3 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.9),0_0_50px_rgba(99,102,241,0.15)] ring-1 ring-white/10">
        {/* Device Inner Chassis */}
        <div className="relative h-[650px] w-full overflow-hidden rounded-[2.35rem] bg-zinc-950 text-white flex flex-col justify-between border border-white/5">
          {/* Top Notch & Dynamic Island */}
          <div className="relative z-20 flex items-center justify-between border-b border-white/5 bg-zinc-900/60 px-6 py-3 backdrop-blur-md">
            <span className="text-xs font-semibold text-zinc-400">9:41</span>
            <div className="h-5 w-24 rounded-full bg-black/80 flex items-center justify-center gap-2 px-2 border border-white/10">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[9px] font-medium text-zinc-300">Sunset Bistro</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
              <span className="text-[10px] font-bold">5G</span>
              <div className="h-2.5 w-5 rounded-sm border border-zinc-400 p-0.5">
                <div className="h-full w-3/4 rounded-2xs bg-emerald-400" />
              </div>
            </div>
          </div>

          {/* Device Screen Content (Scrollable / Switchable Area) */}
          <div className="relative flex-1 overflow-y-auto px-4 py-3 scrollbar-none">
            <AnimatePresence mode="wait">
              {/* TAB 1: LIVE DIGITAL MENU */}
              {activeTab === "menu" && (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  {/* Restaurant Banner Header */}
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-600/30 via-rose-600/30 to-purple-600/30 p-4 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-400">
                          Open Now
                        </span>
                        <h3 className="mt-1 text-base font-bold text-white font-serif">Sunset Bistro & Bar</h3>
                        <p className="text-[10px] text-zinc-300">Table #04 • Contemporary Gastronomy</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="flex items-center gap-1 text-xs font-bold text-amber-400">
                          <LuStar className="h-3 w-3 fill-amber-400" /> 4.9 (420+)
                        </span>
                        <span className="text-[9px] text-zinc-400">~15m prep time</span>
                      </div>
                    </div>
                  </div>

                  {/* Menu Category Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                    {["Mains", "Starters", "Cocktails", "Desserts"].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-all ${
                          activeCategory === cat
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                            : "bg-zinc-900 text-zinc-400 hover:text-white border border-white/5"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Dishes List */}
                  <div className="space-y-2.5">
                    {DISHES.map((dish) => {
                      const count = cartCount[dish.id] || 0;
                      return (
                        <div
                          key={dish.id}
                          className="group relative flex items-center justify-between rounded-xl border border-white/5 bg-zinc-900/70 p-3 transition-all hover:border-indigo-500/30 hover:bg-zinc-900"
                        >
                          <div className="flex-1 pr-3">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-white">{dish.name}</span>
                              {dish.isVeg && (
                                <span title="Plant-based" className="text-emerald-400">
                                  <LuLeaf className="h-3 w-3" />
                                </span>
                              )}
                              {dish.isSpicy && (
                                <span title="Spicy" className="text-rose-400">
                                  <LuFlame className="h-3 w-3" />
                                </span>
                              )}
                            </div>
                            <p className="mt-0.5 line-clamp-1 text-[10px] text-zinc-400">{dish.desc}</p>
                            <div className="mt-1.5 flex items-center gap-2">
                              <span className="text-xs font-bold text-indigo-400">${dish.price}</span>
                              <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[9px] text-zinc-400">
                                {dish.badge}
                              </span>
                            </div>
                          </div>

                          {/* Add / Quantity Button */}
                          <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-zinc-800/80 p-1">
                            {count > 0 ? (
                              <>
                                <button
                                  onClick={() => handleUpdateCart(dish.id, -1)}
                                  className="flex h-6 w-6 items-center justify-center rounded bg-zinc-700 text-xs text-white hover:bg-zinc-600 transition"
                                >
                                  <LuMinus className="h-3 w-3" />
                                </button>
                                <span className="w-5 text-center text-xs font-bold text-white">{count}</span>
                                <button
                                  onClick={() => handleUpdateCart(dish.id, 1)}
                                  className="flex h-6 w-6 items-center justify-center rounded bg-indigo-600 text-xs text-white hover:bg-indigo-500 transition"
                                >
                                  <LuPlus className="h-3 w-3" />
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => handleUpdateCart(dish.id, 1)}
                                className="flex items-center gap-1 rounded bg-indigo-600 px-2 py-1 text-[10px] font-bold text-white hover:bg-indigo-500 transition"
                              >
                                <LuPlus className="h-3 w-3" /> Add
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Cart Bar */}
                  {cartTotal > 0 && (
                    <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/60 p-3 backdrop-blur-md">
                      <div className="flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-white">Your Order • {Object.values(cartCount).reduce((a, b) => a + b, 0)} Items</p>
                          <p className="text-[10px] text-indigo-200">Sends directly to kitchen</p>
                        </div>
                        <button
                          onClick={() => setActiveTab("payment")}
                          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition"
                        >
                          <span>${cartTotal}</span>
                          <LuArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB 2: SMART QR GENERATOR */}
              {activeTab === "qrcode" && (
                <motion.div
                  key="qrcode"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  <div className="text-center">
                    <span className="rounded-full bg-purple-500/20 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-purple-400">
                      Smart Table Studio
                    </span>
                    <h3 className="mt-1 text-sm font-bold text-white">Dynamic Table QR</h3>
                    <p className="text-[10px] text-zinc-400">Scans auto-route guests to Table #{selectedTable.replace("Table ", "")}</p>
                  </div>

                  {/* Table Selector */}
                  <div className="grid grid-cols-4 gap-1.5">
                    {["Table 01", "Table 04", "Table 12", "Table 24"].map((table) => (
                      <button
                        key={table}
                        onClick={() => setSelectedTable(table)}
                        className={`rounded-lg py-1.5 text-[10px] font-bold transition-all ${
                          selectedTable === table
                            ? "bg-indigo-600 text-white shadow-sm"
                            : "bg-zinc-900 text-zinc-400 hover:text-white border border-white/5"
                        }`}
                      >
                        {table}
                      </button>
                    ))}
                  </div>

                  {/* Live QR Display Box */}
                  <div className="mx-auto flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-zinc-900 p-5 shadow-inner">
                    <div
                      className="relative flex aspect-square w-40 items-center justify-center rounded-xl p-3 shadow-xl transition-all"
                      style={{ backgroundColor: QR_THEMES[selectedThemeIndex].bg }}
                    >
                      {/* Stylized QR Code SVG Simulation */}
                      <svg
                        viewBox="0 0 100 100"
                        className="h-full w-full"
                        style={{ fill: QR_THEMES[selectedThemeIndex].color }}
                      >
                        {/* Finder Top-Left */}
                        <rect x="5" y="5" width="28" height="28" rx="4" />
                        <rect x="9" y="9" width="20" height="20" rx="2" fill={QR_THEMES[selectedThemeIndex].bg} />
                        <rect x="13" y="13" width="12" height="12" rx="2" />

                        {/* Finder Top-Right */}
                        <rect x="67" y="5" width="28" height="28" rx="4" />
                        <rect x="71" y="9" width="20" height="20" rx="2" fill={QR_THEMES[selectedThemeIndex].bg} />
                        <rect x="75" y="13" width="12" height="12" rx="2" />

                        {/* Finder Bottom-Left */}
                        <rect x="5" y="67" width="28" height="28" rx="4" />
                        <rect x="9" y="71" width="20" height="20" rx="2" fill={QR_THEMES[selectedThemeIndex].bg} />
                        <rect x="13" y="75" width="12" height="12" rx="2" />

                        {/* Data Modules */}
                        <rect x="38" y="8" width="8" height="8" rx="1" />
                        <rect x="50" y="8" width="8" height="8" rx="1" />
                        <rect x="38" y="20" width="8" height="8" rx="1" />
                        <rect x="50" y="24" width="8" height="8" rx="1" />
                        <rect x="8" y="38" width="8" height="8" rx="1" />
                        <rect x="20" y="38" width="8" height="8" rx="1" />
                        <rect x="8" y="50" width="8" height="8" rx="1" />
                        <rect x="38" y="38" width="10" height="10" rx="2" />
                        <rect x="52" y="38" width="8" height="8" rx="1" />
                        <rect x="68" y="38" width="8" height="8" rx="1" />
                        <rect x="80" y="38" width="8" height="8" rx="1" />
                        <rect x="38" y="52" width="8" height="8" rx="1" />
                        <rect x="50" y="52" width="12" height="8" rx="1" />
                        <rect x="68" y="52" width="8" height="8" rx="1" />
                        <rect x="80" y="52" width="8" height="8" rx="1" />
                        <rect x="38" y="68" width="8" height="8" rx="1" />
                        <rect x="50" y="68" width="8" height="8" rx="1" />
                        <rect x="68" y="68" width="8" height="8" rx="1" />
                        <rect x="80" y="68" width="8" height="8" rx="1" />
                        <rect x="38" y="80" width="8" height="8" rx="1" />
                        <rect x="52" y="80" width="8" height="8" rx="1" />
                        <rect x="68" y="80" width="8" height="8" rx="1" />
                        <rect x="80" y="80" width="8" height="8" rx="1" />
                      </svg>
                      {/* Center Brand Badge */}
                      <div className="absolute inset-0 m-auto flex h-9 w-9 items-center justify-center rounded-lg border-2 border-white bg-indigo-600 shadow-md">
                        <LuUtensils className="h-4 w-4 text-white" />
                      </div>
                    </div>

                    <p className="mt-3 text-xs font-bold text-white font-mono">{selectedTable}</p>
                    <p className="text-[9px] text-zinc-400">Scan to view menu & order</p>
                  </div>

                  {/* Theme Color Swatches */}
                  <div>
                    <p className="text-[10px] font-semibold text-zinc-400 mb-1.5">Brand Theme & Finish</p>
                    <div className="flex items-center justify-between gap-2">
                      {QR_THEMES.map((th, idx) => (
                        <button
                          key={th.name}
                          onClick={() => setSelectedThemeIndex(idx)}
                          className={`flex-1 rounded-lg border p-1.5 text-center transition-all ${
                            selectedThemeIndex === idx
                              ? "border-indigo-500 bg-indigo-950/40"
                              : "border-white/5 bg-zinc-900/60"
                          }`}
                        >
                          <div
                            className="mx-auto h-4 w-4 rounded-full border border-white/20"
                            style={{ backgroundColor: th.color }}
                          />
                          <span className="mt-1 block text-[9px] text-zinc-300">{th.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Download Standee Button */}
                  <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-800 py-2.5 text-xs font-bold text-white border border-white/10 hover:bg-zinc-700 transition">
                    <LuDownload className="h-3.5 w-3.5" /> Download Print-Ready Standee
                  </button>
                </motion.div>
              )}

              {/* TAB 3: CONTACTLESS TABLE PAYMENT */}
              {activeTab === "payment" && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  <div className="text-center">
                    <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-400">
                      Zero-Wait Checkout
                    </span>
                    <h3 className="mt-1 text-sm font-bold text-white">Table Bill #04</h3>
                    <p className="text-[10px] text-zinc-400">No waiting for the server with the card machine</p>
                  </div>

                  {/* Bill Breakdown Card */}
                  <div className="rounded-2xl border border-white/5 bg-zinc-900 p-4 space-y-2 text-xs">
                    <div className="flex justify-between text-zinc-400 text-[11px]">
                      <span>1x Truffle Porcini Risotto</span>
                      <span>$24.00</span>
                    </div>
                    <div className="flex justify-between text-zinc-400 text-[11px]">
                      <span>1x Woodfired Ribeye Steak</span>
                      <span>$38.00</span>
                    </div>
                    <div className="flex justify-between text-zinc-400 text-[11px]">
                      <span>1x Matcha Yuzu Tart</span>
                      <span>$14.00</span>
                    </div>
                    <div className="border-t border-white/10 pt-2 flex justify-between text-zinc-300 text-[11px]">
                      <span>Subtotal</span>
                      <span>$76.00</span>
                    </div>
                    <div className="flex justify-between text-zinc-300 text-[11px]">
                      <span>Tax (8%)</span>
                      <span>$6.08</span>
                    </div>
                    <div className="flex justify-between text-zinc-300 text-[11px]">
                      <span>Tip ({tipPercentage}%)</span>
                      <span>${((76 * tipPercentage) / 100).toFixed(2)}</span>
                    </div>
                    <div className="border-t border-white/10 pt-2 flex justify-between text-sm font-bold text-white">
                      <span>Total Due</span>
                      <span className="text-emerald-400">
                        ${(76 + 6.08 + (76 * tipPercentage) / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Tip Selector */}
                  <div>
                    <p className="text-[10px] font-semibold text-zinc-400 mb-1.5">Add Server Gratuity</p>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[15, 18, 20, 25].map((tip) => (
                        <button
                          key={tip}
                          onClick={() => setTipPercentage(tip)}
                          className={`rounded-lg py-1.5 text-xs font-bold transition-all ${
                            tipPercentage === tip
                              ? "bg-emerald-600 text-white shadow-sm"
                              : "bg-zinc-900 text-zinc-400 hover:text-white border border-white/5"
                          }`}
                        >
                          {tip}%
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pay Action Button */}
                  {isPaid ? (
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/60 p-4 text-center">
                      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg">
                        <LuCheck className="h-6 w-6" />
                      </div>
                      <p className="mt-2 text-xs font-bold text-white">Payment Received!</p>
                      <p className="text-[10px] text-emerald-200">Receipt sent to guest • Table marked clean</p>
                    </div>
                  ) : (
                    <button
                      onClick={handlePay}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 transition active:scale-98"
                    >
                      <LuCreditCard className="h-4 w-4" /> Tap to Pay ${(76 + 6.08 + (76 * tipPercentage) / 100).toFixed(2)}
                    </button>
                  )}
                </motion.div>
              )}

              {/* TAB 4: REAL-TIME ANALYTICS */}
              {activeTab === "analytics" && (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-3.5"
                >
                  <div className="text-center">
                    <span className="rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-indigo-400">
                      Live Telemetry
                    </span>
                    <h3 className="mt-1 text-sm font-bold text-white">Dining Insights</h3>
                    <p className="text-[10px] text-zinc-400">Real-time scan velocity & ordering behaviour</p>
                  </div>

                  {/* Metric Tiles */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-xl border border-white/5 bg-zinc-900 p-3">
                      <p className="text-[9px] text-zinc-400 uppercase tracking-wider">Total Scans Today</p>
                      <p className="mt-1 text-xl font-bold text-white">1,482</p>
                      <span className="text-[9px] font-semibold text-emerald-400">+28.4% vs last week</span>
                    </div>
                    <div className="rounded-xl border border-white/5 bg-zinc-900 p-3">
                      <p className="text-[9px] text-zinc-400 uppercase tracking-wider">Avg Turnover</p>
                      <p className="mt-1 text-xl font-bold text-white">34 min</p>
                      <span className="text-[9px] font-semibold text-emerald-400">12m faster per table</span>
                    </div>
                  </div>

                  {/* Hourly Scans Chart Simulation */}
                  <div className="rounded-2xl border border-white/5 bg-zinc-900 p-3.5">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-bold text-zinc-200">Peak Dining Heatmap</span>
                      <span className="text-[10px] text-amber-400 font-semibold">Rush: 7:30 PM</span>
                    </div>
                    <div className="flex h-20 items-end gap-1.5 pt-2">
                      {[25, 40, 30, 65, 88, 95, 75, 45, 20].map((val, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                          <div
                            className={`w-full rounded-t transition-all ${
                              idx === 5 ? "bg-indigo-500 shadow-md shadow-indigo-500/50" : "bg-zinc-700"
                            }`}
                            style={{ height: `${val}%` }}
                          />
                          <span className="text-[8px] text-zinc-500">
                            {idx === 0 ? "12p" : idx === 4 ? "6p" : idx === 8 ? "10p" : ""}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Search Queries Trend */}
                  <div className="rounded-xl border border-white/5 bg-zinc-900 p-3">
                    <p className="text-[9px] font-semibold text-zinc-400 uppercase mb-2">Top Guest Searches</p>
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex justify-between items-center text-zinc-300">
                        <span>1. “Gluten Free”</span>
                        <span className="font-mono text-zinc-400">84 scans</span>
                      </div>
                      <div className="flex justify-between items-center text-zinc-300">
                        <span>2. “Mocktails & Non-Alcoholic”</span>
                        <span className="font-mono text-zinc-400">62 scans</span>
                      </div>
                      <div className="flex justify-between items-center text-zinc-300">
                        <span>3. “Truffle Pasta”</span>
                        <span className="font-mono text-zinc-400">51 scans</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Dock Navigation for the Demo Device */}
          <div className="relative z-20 border-t border-white/5 bg-zinc-900/80 px-2 py-2 backdrop-blur-md">
            <div className="grid grid-cols-4 gap-1 text-center">
              <button
                onClick={() => setActiveTab("menu")}
                className={`flex flex-col items-center justify-center rounded-xl py-1.5 transition-all ${
                  activeTab === "menu" ? "bg-indigo-600/20 text-indigo-400" : "text-zinc-400 hover:text-white"
                }`}
              >
                <LuUtensils className="h-4 w-4" />
                <span className="mt-1 text-[9px] font-semibold">Menu</span>
              </button>

              <button
                onClick={() => setActiveTab("qrcode")}
                className={`flex flex-col items-center justify-center rounded-xl py-1.5 transition-all ${
                  activeTab === "qrcode" ? "bg-purple-600/20 text-purple-400" : "text-zinc-400 hover:text-white"
                }`}
              >
                <LuQrCode className="h-4 w-4" />
                <span className="mt-1 text-[9px] font-semibold">QR Studio</span>
              </button>

              <button
                onClick={() => setActiveTab("payment")}
                className={`flex flex-col items-center justify-center rounded-xl py-1.5 transition-all ${
                  activeTab === "payment" ? "bg-emerald-600/20 text-emerald-400" : "text-zinc-400 hover:text-white"
                }`}
              >
                <LuCreditCard className="h-4 w-4" />
                <span className="mt-1 text-[9px] font-semibold">Pay</span>
              </button>

              <button
                onClick={() => setActiveTab("analytics")}
                className={`flex flex-col items-center justify-center rounded-xl py-1.5 transition-all ${
                  activeTab === "analytics" ? "bg-amber-600/20 text-amber-400" : "text-zinc-400 hover:text-white"
                }`}
              >
                <LuTrendingUp className="h-4 w-4" />
                <span className="mt-1 text-[9px] font-semibold">Metrics</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
