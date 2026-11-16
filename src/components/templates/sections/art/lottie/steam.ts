/**
 * "Steam" — a cup with three wisps rising and fading, 2 s loop (60 frames @ 30fps).
 * Hand-authored Lottie (Bodymovin 5.7 schema). Every stroke uses the `accent`
 * colour slot, so ThemedLottie recolours it to the site's accent at runtime.
 */

type Kf = { t: number; s: number[]; i?: { x: number[]; y: number[] }; o?: { x: number[]; y: number[] } };

const ease = (dims: number) => ({
  i: { x: Array(dims).fill(0.4), y: Array(dims).fill(1) },
  o: { x: Array(dims).fill(0.6), y: Array(dims).fill(0) },
});
const kf = (t: number, s: number[], last = false): Kf => (last ? { t, s } : { t, s, ...ease(s.length) });

const ACCENT = { a: 0, k: [0.8, 0.4, 0.1, 1], sid: "accent" };

const stroke = (width: number) => ({ ty: "st", c: ACCENT, o: { a: 0, k: 100 }, w: { a: 0, k: width }, lc: 2, lj: 2, nm: "Stroke" });
const groupTransform = { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 }, nm: "Transform" };

/** A gentle S-curve, drawn upwards from the origin. */
const wispPath = {
  ty: "sh",
  nm: "Wisp",
  ks: {
    a: 0,
    k: {
      c: false,
      v: [[0, 0], [5, -10], [-5, -20], [0, -30]],
      i: [[0, 0], [-4, 4], [4, 4], [-4, 4]],
      o: [[4, -4], [-4, -4], [4, -4], [0, 0]],
    },
  },
};

function wisp(index: number, x: number, delay: number) {
  const t0 = delay;
  return {
    ddd: 0,
    ind: index,
    ty: 4,
    nm: `Wisp ${index}`,
    sr: 1,
    ip: 0,
    op: 60,
    st: 0,
    bm: 0,
    ks: {
      o: { a: 1, k: [kf(t0, [0]), kf(t0 + 15, [100]), kf(t0 + 40, [0], true)] },
      r: { a: 0, k: 0 },
      p: { a: 1, k: [kf(t0, [x, 62, 0]), kf(t0 + 40, [x, 44, 0], true)] },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 0, k: [100, 100, 100] },
    },
    shapes: [{ ty: "gr", nm: "Wisp group", it: [wispPath, stroke(3.5), groupTransform] }],
  };
}

const cup = {
  ddd: 0,
  ind: 4,
  ty: 4,
  nm: "Cup",
  sr: 1,
  ip: 0,
  op: 60,
  st: 0,
  bm: 0,
  ks: {
    o: { a: 0, k: 100 },
    r: { a: 0, k: 0 },
    p: { a: 0, k: [60, 60, 0] },
    a: { a: 0, k: [0, 0, 0] },
    s: { a: 0, k: [100, 100, 100] },
  },
  shapes: [
    {
      ty: "gr",
      nm: "Cup group",
      it: [
        {
          ty: "sh",
          nm: "Bowl",
          ks: {
            a: 0,
            k: {
              c: false,
              v: [[-26, 8], [0, 34], [26, 8]],
              i: [[0, 0], [-16, 0], [0, 16]],
              o: [[0, 16], [16, 0], [0, 0]],
            },
          },
        },
        { ty: "sh", nm: "Rim", ks: { a: 0, k: { c: false, v: [[-30, 8], [30, 8]], i: [[0, 0], [0, 0]], o: [[0, 0], [0, 0]] } } },
        stroke(4),
        groupTransform,
      ],
    },
  ],
};

export const STEAM_ANIMATION = {
  v: "5.7.0",
  fr: 30,
  ip: 0,
  op: 60,
  w: 120,
  h: 120,
  nm: "Steam",
  ddd: 0,
  assets: [],
  layers: [wisp(1, 46, 0), wisp(2, 60, 10), wisp(3, 74, 20), cup],
  slots: { accent: { p: { a: 0, k: [0.8, 0.4, 0.1, 1] } } },
} as const;
