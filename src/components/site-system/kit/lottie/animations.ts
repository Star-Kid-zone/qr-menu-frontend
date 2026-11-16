import { animation, anim, ellipse, fill, path, rect, shapeLayer, stroke, trimIn } from "./builder";

/**
 * Hand-authored decorative animations for the layouts (Lottie kit).
 * All draw in the `accent` slot. 30 fps.
 */

/* ── Gilt sparkle: three four-point glints that bloom and fade in turn (3 s loop). ── */

const STAR = path(
  [[0, -12], [2.6, -2.6], [12, 0], [2.6, 2.6], [0, 12], [-2.6, 2.6], [-12, 0], [-2.6, -2.6]],
);

function glint(ind: number, x: number, y: number, start: number, size: number) {
  const peak = start + 14;
  const end = start + 32;
  const zero = [0, 0, 100];
  const lead: Array<[number, number[]]> = start > 0 ? [[0, zero], [start, zero]] : [[0, zero]];
  return shapeLayer(ind, `Glint ${ind}`, 90, [STAR, fill()], {
    p: [x, y, 0],
    s: anim(...lead, [peak, [size, size, 100]], [end, zero], [89, zero]),
    r: anim([start, [0]], [end, [90]]),
  });
}

export const SPARKLE_ANIMATION = animation("Gilt sparkle", 120, 90, [
  glint(1, 60, 58, 0, 150),
  glint(2, 30, 34, 26, 80),
  glint(3, 90, 84, 50, 100),
]);

/* ── Vines: two stems curl in from the corner, then their leaves open (plays once, 3 s). ── */

const STEM_A = path(
  [[4, 116], [30, 80], [44, 44], [78, 20], [112, 10]],
  [[0, 0], [-6, 14], [-8, 14], [-14, 6], [-12, 2]],
  [[6, -14], [8, -14], [14, -6], [12, -2], [0, 0]],
  false,
);
const STEM_B = path(
  [[4, 116], [40, 104], [70, 82], [92, 60]],
  [[0, 0], [-14, 4], [-10, 8], [-6, 8]],
  [[14, -4], [10, -8], [6, -8], [0, 0]],
  false,
);

/** A leaf: a pointed oval, opened (scaled up) once its stem has reached it. */
function leaf(ind: number, x: number, y: number, rot: number, at: number) {
  const LEAF = path([[0, 0], [7, -9], [0, -20], [-7, -9]], [[0, 0], [0, 5], [5, 0], [0, -5]], [[0, 0], [0, -5], [-5, 0], [0, 5]]);
  return shapeLayer(ind, `Leaf ${ind}`, 90, [LEAF, fill(85)], {
    p: [x, y, 0],
    r: rot,
    s: anim([0, [0, 0, 100]], [at, [0, 0, 100]], [at + 12, [110, 110, 100]], [at + 18, [100, 100, 100]]),
  });
}

export const VINE_ANIMATION = animation("Vines", 120, 90, [
  shapeLayer(1, "Stem A", 90, [STEM_A, trimIn(0, 50), stroke(2.2)]),
  shapeLayer(2, "Stem B", 90, [STEM_B, trimIn(10, 52), stroke(1.8)]),
  leaf(3, 30, 80, -30, 22),
  leaf(4, 46, 44, 40, 34),
  leaf(5, 80, 21, -70, 46),
  leaf(6, 70, 82, 60, 40),
  leaf(7, 104, 12, 75, 54),
]);

/* ── Embers: sparks drifting up from a grill and fading (2 s loop). ── */

function ember(ind: number, x: number, delay: number, drift: number, size: number) {
  const t0 = delay;
  return shapeLayer(ind, `Ember ${ind}`, 60, [ellipse([size, size]), fill()], {
    p: anim([0, [x, 108, 0]], [t0, [x, 108, 0]], [t0 + 40, [x + drift, 30, 0]], [59, [x + drift, 30, 0]]),
    o: anim([0, [0]], [t0, [0]], [t0 + 6, [100]], [t0 + 30, [70]], [t0 + 40, [0]], [59, [0]]),
  });
}

export const EMBER_ANIMATION = animation("Embers", 120, 60, [
  ember(1, 30, 1, 8, 5),
  ember(2, 52, 8, -6, 4),
  ember(3, 70, 4, 10, 6),
  ember(4, 88, 14, -8, 4),
  ember(5, 44, 18, 4, 3),
  ember(6, 78, 12, -4, 3),
  // A low glow line: the grill bars.
  shapeLayer(7, "Grill", 60, [rect([96, 3], [60, 112], 1.5), fill(anim([0, [55]], [30, [90]], [59, [55]]))]),
]);

/* ── Candle: a flame that sways from its wick, with a breathing glow (2 s loop). ── */

const FLAME = path(
  [[0, -26], [8, -2], [0, 8], [-8, -2]],
  [[0, 0], [0, -11], [5, 0], [0, 6]],
  [[0, 0], [0, 6], [-5, 0], [0, -11]],
);

export const CANDLE_ANIMATION = animation("Candle", 120, 60, [
  // Flame (anchored at its base so it bends from the wick).
  shapeLayer(1, "Flame", 60, [FLAME, fill()], {
    p: [60, 50, 0],
    a: [0, 8, 0],
    s: anim([0, [100, 100, 100]], [12, [90, 110, 100]], [26, [106, 94, 100]], [42, [94, 106, 100]], [59, [100, 100, 100]]),
    r: anim([0, [0]], [15, [-4]], [32, [3]], [48, [-2]], [59, [0]]),
  }),
  // Glow around the flame.
  shapeLayer(2, "Glow", 60, [ellipse([56, 56], [0, -8]), fill(anim([0, [14]], [30, [24]], [59, [14]]))], {
    p: [60, 50, 0],
  }),
  // Wick and candle.
  shapeLayer(3, "Candle", 60, [
    path([[0, 8], [0, 14]], undefined, undefined, false),
    stroke(2),
    rect([16, 44], [0, 37], 3),
    fill(85),
  ], { p: [60, 50, 0] }),
]);
