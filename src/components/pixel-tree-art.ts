// Original pixel artwork, built from an authored silhouette and seeded texture.
// Geometry stays fixed between frames; the seed only describes the painted pixels.
export const TREE_SIZE = 224;

type Point = readonly [x: number, y: number, radius: number];
type Crown = readonly [x: number, y: number, rx: number, ry: number, tone: number];
type Pixels = Pick<CanvasRenderingContext2D, "fillStyle" | "fillRect">;

const PETALS = ["#bb708d", "#d191a8", "#e6adc0", "#f4c8d3", "#ffe0e3"];
const BARK = ["#301d21", "#43272a", "#553034", "#6b3c3e", "#814b49"];
const GREEN = ["#192c40", "#214e4d", "#33773e", "#6bad42", "#b0de61"];
const PALE_BARK = ["#25343a", "#525751", "#868375", "#aaa492", "#ccc4ae"];
export type TreeVariant = "cherry" | "green";

const GREEN_BACK: readonly Crown[] = [
  [92, 30, 13, 22, 0.8], [136, 42, 17, 24, -0.4],
  [67, 56, 18, 15, 0.2], [108, 61, 22, 27, -0.1],
  [150, 64, 17, 23, -1], [77, 84, 26, 22, 0.2],
  [119, 88, 32, 28, -0.5], [173, 87, 13, 19, -1.2],
  [54, 112, 16, 13, -0.1], [91, 114, 28, 25, -0.4],
  [148, 112, 30, 26, -1], [178, 113, 16, 17, -1.5],
  [86, 136, 20, 16, -0.5], [119, 143, 26, 18, -1],
  [159, 140, 24, 19, -1.4],
];
const GREEN_FRONT: readonly Crown[] = [
  [90, 30, 8, 13, 1.3], [66, 51, 11, 9, 1],
  [135, 45, 12, 13, 0.1], [91, 65, 14, 14, 1.4],
  [112, 62, 13, 11, 0.6], [63, 81, 14, 12, 0.6],
  [81, 89, 19, 15, 1.3], [111, 93, 15, 16, 0.3],
  [144, 82, 16, 15, -0.2], [68, 111, 17, 11, 0.8],
  [96, 112, 13, 12, 0.4], [141, 111, 17, 15, -0.6],
  [176, 110, 14, 12, -0.7], [83, 133, 14, 9, 0.1],
  [111, 132, 12, 12, -0.1], [158, 136, 17, 12, -0.9],
];

// Each mass is placed by hand: high left crown, broad middle, trailing right edge.
const BACK_CROWN: readonly Crown[] = [
  [88, 42, 22, 17, 0.7], [104, 47, 21, 16, 0.4],
  [76, 56, 19, 15, 0], [96, 64, 29, 19, -0.2],
  [124, 65, 19, 17, 0.4], [141, 75, 23, 17, 0.2],
  [162, 78, 19, 12, 0.6], [169, 96, 24, 19, 0.1],
  [179, 114, 22, 18, -0.1], [165, 133, 29, 20, -0.3],
  [163, 154, 19, 15, -0.8], [150, 145, 18, 17, -0.3],
  [136, 127, 28, 22, -0.5], [109, 119, 27, 25, -0.9],
  [85, 110, 26, 21, -0.6], [62, 101, 21, 18, -0.2],
  [49, 117, 21, 12, -0.7], [73, 126, 25, 14, -0.8],
  [98, 139, 20, 16, -0.6], [58, 88, 21, 10, 0.2],
];

// The foreground leaves gaps around the main forks instead of exposing a ladder.
const FRONT_CROWN: readonly Crown[] = [
  [80, 40, 14, 10, 0.9], [98, 36, 12, 9, 1],
  [112, 48, 13, 10, 0.7], [74, 55, 13, 10, 0.5],
  [91, 63, 15, 10, 0.2], [109, 76, 16, 11, 0.6],
  [129, 59, 12, 10, 0.7], [137, 78, 14, 10, 0.5],
  [160, 75, 19, 10, 0.7], [177, 89, 14, 10, 0.5],
  [61, 88, 22, 8, 0.5], [84, 85, 16, 10, 0.5],
  [55, 107, 21, 9, 0], [75, 114, 15, 10, -0.7],
  [97, 96, 15, 11, 0.7], [123, 101, 15, 14, 0.6],
  [151, 100, 16, 11, 0.2], [179, 108, 18, 10, 0.6],
  [100, 131, 10, 12, -0.5], [134, 121, 10, 13, 0.4],
  [174, 131, 17, 12, 0.2], [153, 144, 12, 11, -0.3],
  [165, 158, 11, 10, -0.4],
];

// Radii decrease all the way to a one-pixel twig. All forks meet a parent limb.
const LIMBS: readonly (readonly Point[])[] = [
  [[117, 205, 7], [115, 196, 4.5], [116, 182, 3.7], [120, 166, 3.5], [120, 153, 3.1], [116, 140, 2.6], [111, 126, 2], [114, 112, 1.5], [118, 99, 0.5]],
  [[120, 166, 2.8], [131, 156, 2.2], [137, 145, 1.7], [141, 136, 1.5], [149, 128, 1.1], [153, 116, 0.4]],
  [[115, 139, 2.2], [103, 132, 1.7], [95, 125, 1.4], [82, 121, 1.1], [70, 114, 0.4]],
  [[108, 134, 1.7], [104, 119, 1.1], [98, 106, 0.7], [99, 96, 0.4]],
  [[111, 127, 1.4], [107, 110, 1], [105, 95, 0.8], [100, 81, 0.7], [91, 71, 0.5], [86, 57, 0.3], [83, 43, 0.2]],
  [[105, 96, 0.9], [115, 83, 0.7], [123, 72, 0.5], [127, 60, 0.2]],
  [[99, 81, 0.7], [89, 79, 0.5], [81, 70, 0.3]],
  [[91, 71, 0.6], [97, 61, 0.4], [94, 50, 0.2]],
  [[132, 155, 1.5], [147, 152, 1], [156, 145, 0.4]],
  [[139, 141, 1.3], [153, 140, 0.8], [160, 135, 0.4]],
  [[146, 131, 1], [161, 129, 0.8], [170, 121, 0.3]],
  [[153, 116, 0.8], [158, 105, 0.6], [156, 95, 0.3]],
  [[161, 129, 0.6], [173, 131, 0.4], [182, 125, 0.2]],
  [[96, 125, 1], [93, 114, 0.7], [86, 106, 0.4]],
  [[81, 121, 0.8], [70, 123, 0.5], [59, 118, 0.2]],
  [[83, 43, 0.4], [82, 38, 0.3], [89, 33, 0.3]],
  [[86, 57, 0.5], [77, 51, 0.4], [68, 48, 0.3]],
  [[86, 57, 0.5], [92, 52, 0.4], [98, 48, 0.3]],
  [[123, 72, 0.5], [122, 61, 0.4], [121, 52, 0.3]],
  [[123, 72, 0.5], [130, 64, 0.4], [137, 58, 0.3]],
  [[156, 95, 0.5], [148, 87, 0.4], [148, 79, 0.3]],
  [[156, 95, 0.5], [163, 83, 0.4], [177, 82, 0.3]],
  [[170, 121, 0.5], [177, 111, 0.4], [181, 102, 0.3]],
  [[70, 123, 0.5], [64, 113, 0.4], [64, 105, 0.3]],
];

const PARENTS = [-1, 0, 0, 2, 0, 4, 4, 4, 1, 1, 1, 1, 10, 2, 2, 4, 4, 4, 5, 5, 11, 11, 10, 14];
export type TwigPull = { branch: number; dx: number; dy: number };

function nearest(x: number, y: number, paths = LIMBS, first = 0) {
  let best = { branch: -1, at: 0, distance: Infinity };
  for (let branch = first; branch < paths.length; branch++) {
    const points = paths[branch];
    for (let i = 1; i < points.length; i++) {
      const [ax, ay] = points[i - 1];
      const [bx, by] = points[i];
      const vx = bx - ax;
      const vy = by - ay;
      const t = Math.max(0, Math.min(1, ((x - ax) * vx + (y - ay) * vy) / (vx * vx + vy * vy || 1)));
      const distance = Math.hypot(x - ax - vx * t, y - ay - vy * t);
      if (distance <= best.distance) best = { branch, at: i - 1 + t, distance };
    }
  }
  return best;
}

const GREEN_LIMBS = LIMBS.map((limb) => limb.map(([x, y, r]): Point => [
  117 + (x - 117) * 0.88, y - Math.max(0, 194 - y) * 0.12, r * 0.83,
]));
const treeLimbs = { cherry: LIMBS, green: GREEN_LIMBS };
const foliage = { cherry: PETALS, green: GREEN };

export function pickTwig(x: number, y: number, variant: TreeVariant = "cherry") {
  const hit = nearest(x, y, treeLimbs[variant], 1);
  return hit.distance <= 9 ? hit.branch : -1;
}

const joints = {
  cherry: findJoints(LIMBS),
  green: findJoints(GREEN_LIMBS),
};

function findJoints(limbs: readonly (readonly Point[])[]) {
  return limbs.map(([root], i) =>
    PARENTS[i] < 0 ? 0 : nearest(root[0], root[1], [limbs[PARENTS[i]]]).at,
  );
}

function offsets(variant: TreeVariant, pull?: TwigPull) {
  const limbs = treeLimbs[variant];
  return limbs.map((points, branch) => {
    function displacement(index: number, at: number): readonly [number, number] {
      if (!pull || index < 0) return [0, 0];
      if (index === pull.branch) {
        const weight = (at / (limbs[index].length - 1)) ** 2;
        return [pull.dx * weight, pull.dy * weight];
      }
      return displacement(PARENTS[index], joints[variant][index]);
    }
    return (at: number) => displacement(branch, Math.min(points.length - 1, at));
  });
}

function makeLayers(layers: readonly (readonly Crown[])[], limbs: readonly (readonly Point[])[]) {
  return layers.map((layer) => layer.map((mass) => {
    const [x, y, rx, ry, tone] = mass;
    const owner = nearest(x, y, limbs, 1);
    const forks = PARENTS.filter((parent) => parent === owner.branch).length;
    const spread = forks >= 2 ? 1 : forks === 1 ? 0.93 : 0.86;
    return { mass: [x, y, rx * spread, ry * spread, tone] as Crown, owner };
  }));
}
const CROWN_LAYERS = {
  cherry: makeLayers([BACK_CROWN, FRONT_CROWN], LIMBS),
  green: makeLayers([GREEN_BACK, GREEN_FRONT], GREEN_LIMBS),
};

export function treeHash(x: number, y: number, seed = 0) {
  let n = Math.imul(x + seed * 47, 374761393) + Math.imul(y + seed * 131, 668265263);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}

function noise(x: number, y: number, scale: number, seed: number) {
  const ix = Math.floor(x / scale);
  const iy = Math.floor(y / scale);
  const fx = x / scale - ix;
  const fy = y / scale - iy;
  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);
  const a = treeHash(ix, iy, seed) * (1 - sx) + treeHash(ix + 1, iy, seed) * sx;
  const b = treeHash(ix, iy + 1, seed) * (1 - sx) + treeHash(ix + 1, iy + 1, seed) * sx;
  return a * (1 - sy) + b * sy;
}

function crown(ctx: Pixels, [cx, cy, rx, ry, tone]: Crown, seed: number, flutter: number, shiftX: number, shiftY: number, palette: readonly string[]) {
  const pixelSize = 2;
  const dx = Math.round(shiftX + flutter * (cy < 80 ? 0.85 : 0.55));
  const dy = Math.round(shiftY);
  const startX = Math.floor((cx - rx - 5) / pixelSize) * pixelSize;
  const startY = Math.floor((cy - ry - 5) / pixelSize) * pixelSize;
  for (let y = startY; y <= cy + ry + 5; y += pixelSize) {
    for (let x = startX; x <= cx + rx + 5; x += pixelSize) {
      const u = (x - cx) / rx;
      const v = (y - cy) / ry;
      const edge = Math.hypot(u, v);
      const contour = 0.92 + (noise(x, y, 3, seed) - 0.5) * 0.5
        + (treeHash(x, y, seed) - 0.5) * 0.17;
      // Solid interiors with small, irregular groups of pixels at the edge.
      if (edge > contour) {
        if (edge > contour + 0.17 || noise(x, y, 2, seed + 17) < 0.68) continue;
      }
      const mass = noise(x + 4, y, 7, seed + 2);
      const patches = mass > 0.62 ? 1.35 : mass < 0.4 ? -1.1 : 0;
      const leaf = noise(x, y, 2.6, seed + 5);
      const shade = Math.floor(3.5 + tone - v * 1.85 - u * 0.3 + patches + (leaf > 0.68 ? 0.8 : leaf < 0.3 ? -0.5 : 0));
      ctx.fillStyle = palette[Math.max(0, Math.min(4, Math.floor(shade * 0.8)))];
      ctx.fillRect(x + dx, y + dy, pixelSize, pixelSize);
    }
  }
}

function limb(ctx: Pixels, points: readonly Point[], palette: readonly string[]) {
  // Interpolate the wood's centerline and radius before rasterizing its silhouette.
  // Painting the union once avoids black rings where individual segments meet.
  const curve: Point[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[Math.max(0, i - 1)];
    const b = points[i];
    const c = points[i + 1];
    const d = points[Math.min(points.length - 1, i + 2)];
    for (let step = 0; step < 6; step++) {
      const t = step / 6;
      const at = (axis: number) => 0.5 * ((2 * b[axis]) + (-a[axis] + c[axis]) * t
        + (2 * a[axis] - 5 * b[axis] + 4 * c[axis] - d[axis]) * t * t
        + (-a[axis] + 3 * b[axis] - 3 * c[axis] + d[axis]) * t * t * t);
      curve.push([at(0), at(1), Math.max(0.2, at(2))]);
    }
  }
  curve.push(points[points.length - 1]);
  const minX = Math.floor(Math.min(...curve.map(([x, , r]) => x - r)));
  const maxX = Math.ceil(Math.max(...curve.map(([x, , r]) => x + r)));
  const minY = Math.floor(Math.min(...curve.map(([, y, r]) => y - r)));
  const maxY = Math.ceil(Math.max(...curve.map(([, y, r]) => y + r)));
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      let margin = Infinity;
      let lit = 0;
      for (let i = 0; i < curve.length - 1; i++) {
        const [ax, ay, ar] = curve[i];
        const [bx, by, br] = curve[i + 1];
        const vx = bx - ax;
        const vy = by - ay;
        const t = Math.max(0, Math.min(1, ((x - ax) * vx + (y - ay) * vy) / (vx * vx + vy * vy || 1)));
        const radius = ar + (br - ar) * t;
        const px = ax + vx * t;
        const edge = Math.hypot(x - px, y - ay - vy * t) - radius;
        if (edge < margin) {
          margin = edge;
          lit = (x - px) / Math.max(1, radius);
        }
      }
      if (margin > 0) continue;
      const ridge = noise(x * 2, y / 2, 3, 93);
      const shade = margin > -0.6 ? 0 : Math.max(1, Math.min(4, Math.floor(2 - lit * 0.8 + ridge)));
      ctx.fillStyle = palette[shade];
      ctx.fillRect(x, y, 1, 1);
    }
  }
}

export function paintTree(ctx: Pixels, flutter = 0, pull?: TwigPull, variant: TreeVariant = "cherry") {
  const shifts = offsets(variant, pull);
  const layers = CROWN_LAYERS[variant];
  const palette = foliage[variant];
  function paintLayer(layer: typeof layers[number], seed: number) {
    layer.forEach(({ mass, owner }, i) => {
      const [dx, dy] = shifts[owner.branch](owner.at);
      crown(ctx, mass, seed + i * 13, flutter, dx, dy, palette);
    });
  }
  // Rear foliage, a connected woody skeleton, then overlapping foreground masses.
  paintLayer(layers[0], 100);
  if (variant === "green") paintLayer(layers[1], 300);
  treeLimbs[variant].forEach((points, branch) => limb(ctx, points.map(([x, y, radius], at) => {
    const [dx, dy] = shifts[branch](at);
    return [x + dx, y + dy, radius];
  }), variant === "green" ? PALE_BARK : BARK));
  if (variant === "cherry") paintLayer(layers[1], 300);

  if (variant === "green") {
    for (let i = 0; i < 155; i++) {
      const x = Math.round(116 + (treeHash(i, 4) + treeHash(i, 8) - 1) * 51);
      const y = 208 + Math.floor(treeHash(i, 9) * 6);
      const height = 1 + Math.floor(treeHash(i, 17) * (1 + 8 * Math.max(0, 1 - Math.abs(x - 116) / 45)));
      const lean = treeHash(i, 23) > 0.5 ? 1 : -1;
      ctx.fillStyle = GREEN[1 + i % 4];
      for (let step = 0; step < height; step++) {
        ctx.fillRect(x + lean * Math.floor(step / 2), y - step, step === 0 ? 3 : 1, 1);
      }
    }
    return;
  }

  // The base widens only a little: short roots, moss, and a shallow petal carpet.
  for (let i = 0; i < 155; i++) {
    const x = Math.round(116 + (treeHash(i, 4) + treeHash(i, 8) - 1) * 53);
    const y = 207 + Math.floor(treeHash(i, 9) * 4);
    ctx.fillStyle = PETALS[i % 5];
    ctx.fillRect(x, y, 1 + i % 3, 1);
  }
  for (let i = 0; i < 37; i++) {
    const x = 105 + Math.floor(treeHash(i, 19) * 25);
    const y = 203 + Math.floor(treeHash(i, 29) * 6);
    ctx.fillStyle = ["#686b40", "#93975d", "#aebb83", "#dca1b3"][i % 4];
    ctx.fillRect(x, y, 1 + i % 2, 1);
  }
}

export function isCanopyPoint(x: number, y: number, variant: TreeVariant = "cherry") {
  return CROWN_LAYERS[variant].some((layer) => layer.some(({ mass: [cx, cy, rx, ry] }) =>
    Math.hypot((x - cx) / rx, (y - cy) / ry) <= 0.95,
  ));
}

export function paintPetalBurst(ctx: CanvasRenderingContext2D, x: number, y: number, age: number, seed: number, variant: TreeVariant = "cherry") {
  for (let i = 0; i < 8; i++) {
    const t = age - i * 0.035;
    if (t < 0) continue;
    const spread = treeHash(i, 17, seed) - 0.5;
    const drop = treeHash(i, 31, seed);
    const px = x + spread * (12 + t * 21) + Math.sin(t * 5 + i) * t * 3;
    const py = y + drop * 7 + t * (10 + drop * 13) + 9 * t * t;
    ctx.globalAlpha = Math.max(0, Math.min(1, (2.6 - t) / 0.55));
    ctx.fillStyle = foliage[variant][i % PETALS.length];
    ctx.fillRect(Math.round(px), Math.round(py), 1 + i % 2, 1);
  }
  ctx.globalAlpha = 1;
}

export function paintPetals(ctx: CanvasRenderingContext2D, seconds: number, variant: TreeVariant = "cherry") {
  for (let i = 0; i < 8; i++) {
    const phase = (seconds * (0.035 + treeHash(i, 11) * 0.014) + i / 8) % 1;
    const x = 62 + treeHash(i, 7) * 120 + phase * 9 + Math.sin(phase * 9 + i) * 3;
    const y = 100 + treeHash(i, 8) * 38 + phase * 80;
    ctx.globalAlpha = Math.min(1, phase / 0.1, (1 - phase) / 0.14) * 0.8;
    ctx.fillStyle = foliage[variant][2 + i % 3];
    ctx.fillRect(Math.round(x), Math.round(y), 1 + i % 2, 1);
  }
  ctx.globalAlpha = 1;
}
