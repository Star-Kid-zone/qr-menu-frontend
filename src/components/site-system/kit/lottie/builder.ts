/**
 * Tiny helpers for hand-authoring Lottie (Bodymovin 5.7) JSON. Every colour
 * uses the `accent` slot so ThemedLottie recolours the animation to the
 * site's accent at runtime — one file works with every skin.
 */

type Vec = number[];
export type Keyframe = { t: number; s: Vec; i?: { x: number[]; y: number[] }; o?: { x: number[]; y: number[] } };

const easeFor = (dims: number) => ({
  i: { x: Array(dims).fill(0.42), y: Array(dims).fill(1) },
  o: { x: Array(dims).fill(0.58), y: Array(dims).fill(0) },
});

/** Animated property from [frame, value] pairs (eased in and out). */
export function anim(...frames: Array<[number, Vec]>) {
  return {
    a: 1,
    k: frames.map(([t, s], i): Keyframe => (i === frames.length - 1 ? { t, s } : { t, s, ...easeFor(s.length) })),
  };
}

export const still = (k: number | Vec) => ({ a: 0, k });

export const ACCENT_SLOT = { a: 0, k: [0.78, 0.6, 0.25, 1], sid: "accent" };

export const fill = (opacity: number | ReturnType<typeof anim> = 100) => ({
  ty: "fl",
  nm: "Fill",
  c: ACCENT_SLOT,
  o: typeof opacity === "number" ? still(opacity) : opacity,
  r: 1,
});

export const stroke = (width: number, opacity = 100) => ({
  ty: "st",
  nm: "Stroke",
  c: ACCENT_SLOT,
  o: still(opacity),
  w: still(width),
  lc: 2,
  lj: 2,
});

export const groupTransform = {
  ty: "tr",
  nm: "Transform",
  p: still([0, 0]),
  a: still([0, 0]),
  s: still([100, 100]),
  r: still(0),
  o: still(100),
};

/** A path from vertices + in/out tangents (relative), closed by default. */
export function path(v: Vec[], i?: Vec[], o?: Vec[], closed = true) {
  const zero = v.map(() => [0, 0]);
  return { ty: "sh", nm: "Path", ks: still({ c: closed, v, i: i ?? zero, o: o ?? zero } as unknown as number) };
}

/** Trim path: draws the paths above it from 0 → 100% between two frames (a line drawing itself). */
export function trimIn(from: number, to: number) {
  return { ty: "tm", nm: "Trim", s: still(0), e: anim([0, [0]], [from, [0]], [to, [100]]), o: still(0), m: 1 };
}

export const ellipse =(size: Vec, position: Vec = [0, 0]) => ({ ty: "el", nm: "Ellipse", s: still(size), p: still(position), d: 1 });
export const rect = (size: Vec, position: Vec = [0, 0], radius = 0) => ({ ty: "rc", nm: "Rect", s: still(size), p: still(position), r: still(radius), d: 1 });

export interface LayerTransform {
  p?: Vec | ReturnType<typeof anim>;
  a?: Vec;
  s?: Vec | ReturnType<typeof anim>;
  r?: number | ReturnType<typeof anim>;
  o?: number | ReturnType<typeof anim>;
}

const prop = (v: unknown, fallback: number | Vec) => (v === undefined ? still(fallback) : Array.isArray(v) || typeof v === "number" ? still(v as number | Vec) : v);

/** A shape layer of the given items, lasting the whole animation. */
export function shapeLayer(ind: number, name: string, op: number, items: unknown[], t: LayerTransform = {}) {
  return {
    ddd: 0,
    ind,
    ty: 4,
    nm: name,
    sr: 1,
    ip: 0,
    op,
    st: 0,
    bm: 0,
    ks: {
      p: prop(t.p, [0, 0, 0]),
      a: still(t.a ?? [0, 0, 0]),
      s: prop(t.s, [100, 100, 100]),
      r: prop(t.r, 0),
      o: prop(t.o, 100),
    },
    shapes: [{ ty: "gr", nm: `${name} group`, it: [...items, groupTransform] }],
  };
}

export function animation(name: string, size: number, frames: number, layers: unknown[]) {
  return {
    v: "5.7.0",
    fr: 30,
    ip: 0,
    op: frames,
    w: size,
    h: size,
    nm: name,
    ddd: 0,
    assets: [],
    layers,
    slots: { accent: { p: still(ACCENT_SLOT.k) } },
  };
}
