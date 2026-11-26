import { animation, anim, ellipse, fill, path, rect, shapeLayer, stroke, trimIn } from "./builder";

/**
 * Festival animations for the occasion banners (PLAN §2.8). 120×120, 30 fps,
 * drawn in the `accent` slot so each recolours to the festival's tint.
 * Small and calm: they sit beside a line of banner text.
 */

type Frames = Array<[number, number[]]>;
const Z = [0, 0, 100];
const ONE = [100, 100, 100];

const sway = (deg: number, end: number): Frames => [[0, [-deg]], [end / 2, [deg]], [end, [-deg]]];

/* ── Diya: an oil lamp whose flame flickers (Diwali). ── */
const FLAME = path([[0, -22], [7, -2], [0, 6], [-7, -2]], [[0, 0], [0, -10], [4, 0], [0, 5]], [[0, 0], [0, 5], [-4, 0], [0, -10]]);
const DIYA_ANIMATION = animation("Diya", 120, 60, [
  shapeLayer(1, "Flame", 60, [FLAME, fill()], {
    p: [60, 58, 0], a: [0, 6, 0],
    s: anim([0, ONE], [10, [88, 112, 100]], [24, [108, 92, 100]], [40, [94, 106, 100]], [59, ONE]),
    r: anim([0, [0]], [14, [-5]], [30, [4]], [46, [-3]], [59, [0]]),
  }),
  shapeLayer(2, "Glow", 60, [ellipse([50, 50], [0, -10]), fill(anim([0, [12]], [30, [22]], [59, [12]]))], { p: [60, 58, 0] }),
  shapeLayer(3, "Lamp", 60, [path([[-30, 0], [30, 0], [18, 22], [-18, 22]], [[0, 0], [0, 0], [8, 0], [0, 0]], [[0, 0], [-8, 0], [0, 0], [0, 0]]), fill(90)], { p: [60, 66, 0] }),
]);

/* ── Colour burst: powder puffs bursting outward in turn (Holi). ── */
function puff(ind: number, x: number, y: number, at: number, size: number) {
  return shapeLayer(ind, `Puff ${ind}`, 90, [ellipse([size, size]), fill(anim([0, [0]], [at, [0]], [at + 6, [90]], [at + 30, [0]], [89, [0]]))], {
    p: [x, y, 0], s: anim([0, [20, 20, 100]], [at, [20, 20, 100]], [at + 24, [140, 140, 100]], [89, [140, 140, 100]]),
  });
}
const COLOUR_BURST_ANIMATION = animation("Colour burst", 120, 90, [
  puff(1, 42, 46, 0, 30), puff(2, 78, 40, 18, 26), puff(3, 60, 78, 36, 34), puff(4, 34, 82, 54, 22), puff(5, 86, 76, 66, 24),
]);

/* ── Dandiya: two sticks that tap together (Navratri). ── */
const STICK = [rect([6, 64], [0, 0], 3), fill()];
const DANDIYA_ANIMATION = animation("Dandiya", 120, 40, [
  shapeLayer(1, "Stick L", 40, STICK, { p: [46, 64, 0], a: [0, 28, 0], r: anim([0, [-34]], [12, [-12]], [20, [-34]], [32, [-12]], [39, [-34]]) }),
  shapeLayer(2, "Stick R", 40, STICK, { p: [74, 64, 0], a: [0, 28, 0], r: anim([0, [34]], [12, [12]], [20, [34]], [32, [12]], [39, [34]]) }),
  shapeLayer(3, "Tap", 40, [ellipse([10, 10]), fill(anim([0, [0]], [11, [0]], [13, [80]], [18, [0]], [31, [0]], [33, [80]], [39, [0]]))], { p: [60, 34, 0] }),
]);

/* ── Marigold: a flower that turns slowly while its petals breathe (Durga Puja, Ganesh Chaturthi). ── */
function petals(n: number, r: number, size: number) {
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return ellipse([size, size], [Math.cos(a) * r, Math.sin(a) * r]);
  });
}
const MARIGOLD_ANIMATION = animation("Marigold", 120, 120, [
  shapeLayer(1, "Outer petals", 120, [...petals(12, 30, 20), fill(80)], { p: [60, 60, 0], r: anim([0, [0]], [119, [30]]), s: anim([0, ONE], [60, [106, 106, 100]], [119, ONE]) }),
  shapeLayer(2, "Inner petals", 120, [...petals(8, 16, 16), fill()], { p: [60, 60, 0], r: anim([0, [0]], [119, [-30]]) }),
  shapeLayer(3, "Heart", 120, [ellipse([14, 14]), fill()], { p: [60, 60, 0] }),
]);

/* ── Snake boat: a long boat riding the waves (Onam). ── */
const HULL = path([[-46, 0], [46, 0], [52, -14], [30, 8], [-40, 8]], [[0, 0], [0, 0], [0, 0], [6, 0], [0, 0]], [[0, 0], [0, 0], [-6, 6], [0, 0], [0, 0]]);
const BOAT_ANIMATION = animation("Snake boat", 120, 60, [
  shapeLayer(1, "Boat", 60, [HULL, fill()], { p: anim([0, [60, 64, 0]], [30, [60, 58, 0]], [59, [60, 64, 0]]), r: anim(...sway(3, 59)) }),
  shapeLayer(2, "Wave", 60, [path([[-60, 0], [-30, 0], [0, 0], [30, 0], [60, 0]], [[0, 0], [-8, 6], [-8, -6], [-8, 6], [-8, -6]], [[8, -6], [8, 6], [8, -6], [8, 6], [0, 0]], false), stroke(3, 70)], {
    p: anim([0, [60, 82, 0]], [59, [44, 82, 0]]),
  }),
]);

/* ── Kite: a kite tugging on its string (Pongal and Sankranti). ── */
const KITE_ANIMATION = animation("Kite", 120, 60, [
  shapeLayer(1, "Kite", 60, [path([[0, -22], [18, 0], [0, 26], [-18, 0]]), fill()], {
    p: anim([0, [72, 40, 0]], [20, [76, 34, 0]], [40, [68, 38, 0]], [59, [72, 40, 0]]), r: anim(...sway(8, 59)),
  }),
  shapeLayer(2, "String", 60, [path([[72, 66], [50, 88], [20, 110]], [[0, 0], [8, -6], [6, -4]], [[-8, 6], [-6, 4], [0, 0]], false), stroke(1.5, 70)]),
]);

/* ── Rakhi: a thread that loops round into a flower (Raksha Bandhan). ── */
const RAKHI_ANIMATION = animation("Rakhi", 120, 90, [
  shapeLayer(1, "Thread", 90, [path([[8, 60], [112, 60]], undefined, undefined, false), trimIn(0, 30), stroke(3)]),
  shapeLayer(2, "Flower", 90, [...petals(6, 12, 16), fill()], { p: [60, 60, 0], s: anim([0, Z], [26, Z], [40, [110, 110, 100]], [48, ONE], [89, ONE]), r: anim([26, [0]], [89, [60]]) }),
  shapeLayer(3, "Bead", 90, [ellipse([10, 10]), fill(60)], { p: [60, 60, 0], s: anim([0, Z], [36, Z], [44, ONE], [89, ONE]) }),
]);

/* ── Flag: a flag waving on its pole (national days). ── */
const FLAG_ANIMATION = animation("Flag", 120, 60, [
  shapeLayer(1, "Cloth", 60, [path([[0, 0], [52, 0], [52, 34], [0, 34]], [[0, 0], [-14, -6], [0, 0], [14, 6]], [[14, 6], [0, 0], [-14, -6], [0, 0]]), fill()], {
    p: [34, 24, 0], s: anim([0, ONE], [15, [94, 104, 100]], [30, ONE], [45, [96, 98, 100]], [59, ONE]),
  }),
  shapeLayer(2, "Pole", 60, [rect([4, 92], [32, 66], 2), fill(85)]),
]);

/* ── Lantern: a hanging lantern swinging with a soft glow (Ramadan). ── */
const LANTERN_ANIMATION = animation("Lantern", 120, 80, [
  shapeLayer(1, "Lantern", 80, [
    path([[0, -8], [0, 10]], undefined, undefined, false), stroke(2),
    path([[-14, 14], [14, 14], [18, 40], [0, 56], [-18, 40]]), fill(90),
    ellipse([12, 16], [0, 34]), fill(40),
  ], { p: [60, 18, 0], r: anim(...sway(10, 79)) }),
  shapeLayer(2, "Glow", 80, [ellipse([60, 60], [0, 0]), fill(anim([0, [8]], [40, [18]], [79, [8]]))], { p: [60, 70, 0] }),
]);

/* ── Crescent: a crescent moon with a star that twinkles (Eid). ── */
const CRESCENT_ANIMATION = animation("Crescent", 120, 90, [
  shapeLayer(1, "Moon", 90, [path([[0, -30], [0, 30], [0, -30]], [[0, 0], [30, 0], [-18, 0]], [[30, 0], [-18, 0], [0, 0]]), fill()], { p: [52, 60, 0], r: anim(...sway(4, 89)) }),
  shapeLayer(2, "Star", 90, [path([[0, -10], [2.4, -2.4], [10, 0], [2.4, 2.4], [0, 10], [-2.4, 2.4], [-10, 0], [-2.4, -2.4]]), fill()], {
    p: [84, 42, 0], s: anim([0, [70, 70, 100]], [20, [110, 110, 100]], [40, [70, 70, 100]], [89, [70, 70, 100]]), r: anim([0, [0]], [89, [90]]),
  }),
]);

/* ── Baubles: three ornaments swinging on their threads (Christmas). ── */
function bauble(ind: number, x: number, len: number, phase: number) {
  return shapeLayer(ind, `Bauble ${ind}`, 80, [path([[0, 0], [0, len]], undefined, undefined, false), stroke(1.5, 70), ellipse([18, 18], [0, len + 9]), fill()], {
    p: [x, 6, 0], r: anim([0, [phase]], [40, [-phase]], [79, [phase]]),
  });
}
const BAUBLE_ANIMATION = animation("Baubles", 120, 80, [bauble(1, 30, 40, 6), bauble(2, 60, 62, -5), bauble(3, 90, 30, 7)]);

/* ── Snowfall: flakes drifting down (winter). ── */
function flake(ind: number, x: number, delay: number, drift: number, size: number) {
  return shapeLayer(ind, `Flake ${ind}`, 90, [ellipse([size, size]), fill(85)], {
    p: anim([0, [x, -6, 0]], [delay, [x, -6, 0]], [delay + 60, [x + drift, 124, 0]], [89, [x + drift, 124, 0]]),
  });
}
const SNOWFALL_ANIMATION = animation("Snowfall", 120, 90, [
  flake(1, 20, 0, 8, 6), flake(2, 46, 12, -6, 4), flake(3, 70, 4, 10, 7), flake(4, 96, 20, -8, 5), flake(5, 34, 28, 6, 4), flake(6, 84, 32, -4, 6),
]);

/* ── Fireworks: two bursts of rays, one after the other (New Year's Eve). ── */
function burst(ind: number, x: number, y: number, at: number) {
  const rays = Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2;
    return path([[Math.cos(a) * 8, Math.sin(a) * 8], [Math.cos(a) * 26, Math.sin(a) * 26]], undefined, undefined, false);
  });
  return shapeLayer(ind, `Burst ${ind}`, 90, [...rays, stroke(3)], {
    p: [x, y, 0], s: anim([0, Z], [at, Z], [at + 14, [110, 110, 100]], [89, [110, 110, 100]]),
    o: anim([0, [0]], [at, [0]], [at + 4, [100]], [at + 30, [0]], [89, [0]]),
  });
}
const FIREWORKS_ANIMATION = animation("Fireworks", 120, 90, [burst(1, 42, 46, 0), burst(2, 80, 70, 30), burst(3, 58, 36, 56)]);

/* ── Hearts: small hearts rising and fading (Valentine's Day, Mother's Day). ── */
const HEART = path([[0, 10], [-12, -2], [0, -8], [12, -2]], [[0, 0], [2, 8], [-6, -6], [0, -10]], [[-2, 8], [0, -10], [6, -6], [0, 0]]);
function riser(ind: number, x: number, delay: number, size: number) {
  return shapeLayer(ind, `Heart ${ind}`, 90, [HEART, fill()], {
    p: anim([0, [x, 112, 0]], [delay, [x, 112, 0]], [delay + 56, [x + 4, 20, 0]], [89, [x + 4, 20, 0]]),
    s: [size, size, 100],
    o: anim([0, [0]], [delay, [0]], [delay + 8, [100]], [delay + 50, [0]], [89, [0]]),
  });
}
const HEARTS_ANIMATION = animation("Hearts", 120, 90, [riser(1, 36, 0, 100), riser(2, 64, 18, 140), riser(3, 88, 34, 90)]);

/* ── Egg: a decorated egg that wobbles (Easter). ── */
const EGG_ANIMATION = animation("Egg", 120, 60, [
  shapeLayer(1, "Egg", 60, [
    path([[0, -34], [24, 4], [0, 30], [-24, 4]], [[0, 0], [0, -22], [14, 0], [0, 16]], [[0, 0], [0, 16], [-14, 0], [0, -22]]), fill(),
  ], { p: [60, 92, 0], a: [0, 28, 0], r: anim([0, [0]], [10, [-8]], [20, [6]], [30, [-3]], [40, [0]], [59, [0]]) }),
]);

/* ── Pumpkin: a pumpkin whose face glows on and off (Halloween). ── */
const PUMPKIN_ANIMATION = animation("Pumpkin", 120, 60, [
  shapeLayer(1, "Pumpkin", 60, [ellipse([40, 46], [-14, 0]), ellipse([40, 46], [14, 0]), ellipse([36, 48], [0, 0]), fill(90), rect([6, 12], [0, -28], 2), fill()], { p: [60, 64, 0] }),
  shapeLayer(2, "Face glow", 60, [ellipse([44, 30], [0, 4]), fill(anim([0, [10]], [20, [40]], [40, [10]], [59, [10]]))], { p: [60, 64, 0] }),
]);

/* ── Leaves: autumn leaves tumbling down (Thanksgiving). ── */
const LEAF = path([[0, -12], [8, 0], [0, 12], [-8, 0]], [[0, 0], [0, -6], [4, 0], [0, 6]], [[0, 0], [0, 6], [-4, 0], [0, -6]]);
function fall(ind: number, x: number, delay: number, drift: number) {
  return shapeLayer(ind, `Leaf ${ind}`, 90, [LEAF, fill()], {
    p: anim([0, [x, -10, 0]], [delay, [x, -10, 0]], [delay + 64, [x + drift, 126, 0]], [89, [x + drift, 126, 0]]),
    r: anim([0, [0]], [delay, [0]], [delay + 64, [drift > 0 ? 220 : -220]], [89, [0]]),
  });
}
const LEAVES_ANIMATION = animation("Falling leaves", 120, 90, [fall(1, 24, 0, 18), fall(2, 60, 16, -14), fall(3, 92, 30, 12), fall(4, 42, 40, -10)]);

/* ── Shamrock: a three-leaf clover that turns and bobs (St Patrick's Day). ── */
const SHAMROCK_ANIMATION = animation("Shamrock", 120, 90, [
  shapeLayer(1, "Shamrock", 90, [
    ellipse([22, 22], [0, -12]), ellipse([22, 22], [-11, 6]), ellipse([22, 22], [11, 6]), fill(),
    path([[0, 6], [4, 34]], [[0, 0], [-2, -6]], [[2, 6], [0, 0]], false), stroke(3),
  ], { p: anim([0, [60, 54, 0]], [45, [60, 48, 0]], [89, [60, 54, 0]]), r: anim(...sway(10, 89)) }),
]);

/* ── Cheers: two glasses that clink (Father's Day). ── */
const GLASS = [path([[-10, -20], [10, -20], [8, 18], [-8, 18]]), fill(85)];
const CHEERS_ANIMATION = animation("Cheers", 120, 60, [
  shapeLayer(1, "Glass L", 60, GLASS, { p: [44, 66, 0], a: [0, 18, 0], r: anim([0, [-4]], [18, [14]], [26, [-4]], [59, [-4]]) }),
  shapeLayer(2, "Glass R", 60, GLASS, { p: [76, 66, 0], a: [0, 18, 0], r: anim([0, [4]], [18, [-14]], [26, [4]], [59, [4]]) }),
  shapeLayer(3, "Clink", 60, [path([[0, -6], [0, -16]], undefined, undefined, false), path([[-8, -4], [-14, -11]], undefined, undefined, false), path([[8, -4], [14, -11]], undefined, undefined, false), stroke(2.5)], {
    p: [60, 34, 0], o: anim([0, [0]], [17, [0]], [19, [100]], [28, [0]], [59, [0]]),
  }),
]);

/* ── Beer: a stein whose foam rises and settles (Oktoberfest). ── */
const BEER_ANIMATION = animation("Beer", 120, 60, [
  shapeLayer(1, "Stein", 60, [rect([40, 52], [0, 0], 4), fill(85), path([[20, -12], [32, -12], [32, 14], [20, 14]], undefined, undefined, false), stroke(4)], { p: [56, 70, 0] }),
  shapeLayer(2, "Foam", 60, [ellipse([16, 14], [-12, 0]), ellipse([18, 16], [2, -2]), ellipse([14, 12], [14, 0]), fill()], {
    p: [56, 44, 0], s: anim([0, [90, 80, 100]], [30, [104, 110, 100]], [59, [90, 80, 100]]),
  }),
]);

/* ── Confetti: pieces tossed up that flutter down (grand opening). ── */
function bit(ind: number, x: number, delay: number, drift: number, w: number) {
  return shapeLayer(ind, `Confetti ${ind}`, 90, [rect([w, w * 0.5], [0, 0], 1), fill()], {
    p: anim([0, [60, 110, 0]], [delay, [60, 110, 0]], [delay + 18, [x, 18, 0]], [delay + 60, [x + drift, 118, 0]], [89, [x + drift, 118, 0]]),
    r: anim([0, [0]], [delay + 60, [drift * 12]], [89, [0]]),
    o: anim([0, [0]], [delay, [0]], [delay + 2, [100]], [delay + 58, [100]], [delay + 60, [0]], [89, [0]]),
  });
}
const CONFETTI_ANIMATION = animation("Confetti", 120, 90, [
  bit(1, 24, 0, 6, 10), bit(2, 44, 4, -8, 8), bit(3, 66, 2, 10, 9), bit(4, 90, 6, -6, 10), bit(5, 34, 12, 8, 7), bit(6, 78, 10, -10, 8),
]);

/* ── Cake: a cake whose candle flames flicker (anniversary). ── */
const SMALL_FLAME = path([[0, -10], [4, 0], [0, 4], [-4, 0]], [[0, 0], [0, -5], [2, 0], [0, 3]], [[0, 0], [0, 3], [-2, 0], [0, -5]]);
const tinyFlame = (ind: number, x: number, phase: number) =>
  shapeLayer(ind, `Flame ${ind}`, 60, [SMALL_FLAME, fill()], { p: [x, 44, 0], a: [0, 4, 0], r: anim([0, [phase]], [30, [-phase]], [59, [phase]]) });
const CAKE_ANIMATION = animation("Cake", 120, 60, [
  shapeLayer(1, "Cake", 60, [rect([72, 26], [0, 12], 4), rect([56, 20], [0, -10], 4), fill(85), rect([3, 12], [-14, -26]), rect([3, 12], [0, -26]), rect([3, 12], [14, -26]), fill()], { p: [60, 82, 0] }),
  tinyFlame(2, 46, 6), tinyFlame(3, 60, -5), tinyFlame(4, 74, 7),
]);

/* ── Sun: a sun whose rays turn and pulse (summer). ── */
const SUN_ANIMATION = animation("Sun", 120, 120, [
  shapeLayer(2, "Rays", 120, [
    ...Array.from({ length: 12 }, (_, i) => {
      const a = (i / 12) * Math.PI * 2;
      return path([[Math.cos(a) * 30, Math.sin(a) * 30], [Math.cos(a) * 44, Math.sin(a) * 44]], undefined, undefined, false);
    }),
    stroke(4),
  ], { p: [60, 60, 0], r: anim([0, [0]], [119, [30]]), s: anim([0, ONE], [60, [108, 108, 100]], [119, ONE]) }),
  shapeLayer(1, "Disc", 120, [ellipse([44, 44]), fill()], { p: [60, 60, 0] }),
]);

/** The festival animation set, by id. */
export const FESTIVE_ANIMATIONS = {
  diya: DIYA_ANIMATION,
  "colour-burst": COLOUR_BURST_ANIMATION,
  dandiya: DANDIYA_ANIMATION,
  marigold: MARIGOLD_ANIMATION,
  boat: BOAT_ANIMATION,
  kite: KITE_ANIMATION,
  rakhi: RAKHI_ANIMATION,
  flag: FLAG_ANIMATION,
  lantern: LANTERN_ANIMATION,
  crescent: CRESCENT_ANIMATION,
  baubles: BAUBLE_ANIMATION,
  snowfall: SNOWFALL_ANIMATION,
  fireworks: FIREWORKS_ANIMATION,
  hearts: HEARTS_ANIMATION,
  egg: EGG_ANIMATION,
  pumpkin: PUMPKIN_ANIMATION,
  leaves: LEAVES_ANIMATION,
  shamrock: SHAMROCK_ANIMATION,
  cheers: CHEERS_ANIMATION,
  beer: BEER_ANIMATION,
  confetti: CONFETTI_ANIMATION,
  cake: CAKE_ANIMATION,
  sun: SUN_ANIMATION,
} as const;
