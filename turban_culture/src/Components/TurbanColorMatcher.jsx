import React, { useEffect, useMemo, useRef, useState } from "react";
import { FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision";

// ======================================================
// CONFIG
// Install the SAME version as the WASM URL:
//   npm i @mediapipe/tasks-vision@0.10.14
// ======================================================

const MEDIAPIPE_VERSION = "0.10.14";
const WASM_URL = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MEDIAPIPE_VERSION}/wasm`;
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task";

const MAX_IMAGE_SIDE = 1024; // every photo is normalised to this size
const MIN_VISIBILITY = 0.5; // landmark must be this visible to be trusted
const MAX_PEOPLE = 4;

// ======================================================
// COLOR HELPERS
// ======================================================

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

const rgbToHex = ([r, g, b]) =>
  `#${[r, g, b]
    .map((v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, "0"))
    .join("")}`.toUpperCase();

const hexToRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

const rgbToHsl = ([r, g, b]) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
};

const hslToRgb = ([h, s, l]) => {
  h = ((h % 360) + 360) % 360;
  s = clamp(s, 0, 100) / 100;
  l = clamp(l, 0, 100) / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (h < 60) [r, g] = [c, x];
  else if (h < 120) [r, g] = [x, c];
  else if (h < 180) [g, b] = [c, x];
  else if (h < 240) [g, b] = [x, c];
  else if (h < 300) [r, b] = [x, c];
  else [r, b] = [c, x];

  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ];
};

// CIE Lab: distances here match what the human eye sees,
// unlike raw RGB distance.
const rgbToLab = ([r, g, b]) => {
  const lin = (v) => {
    v /= 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  const R = lin(r);
  const G = lin(g);
  const B = lin(b);

  const X = (R * 0.4124564 + G * 0.3575761 + B * 0.1804375) / 0.95047;
  const Y = R * 0.2126729 + G * 0.7151522 + B * 0.072175;
  const Z = (R * 0.0193339 + G * 0.119192 + B * 0.9503041) / 1.08883;

  const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  const fx = f(X);
  const fy = f(Y);
  const fz = f(Z);

  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
};

const labDistance = (a, b) =>
  Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

const hueDiff = (a, b) => {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
};

const isSkinYCbCr = (r, g, b) => {
  const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
  const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;
  return cb >= 77 && cb <= 127 && cr >= 133 && cr <= 173;
};

const getColorName = (rgb) => {
  const [h, s, l] = rgbToHsl(rgb);

  if (l < 10) return "Black";
  if (l >= 93 && s < 25) return "White";

  if (s < 12) {
    if (l < 28) return "Charcoal";
    if (l < 48) return "Dark Grey";
    if (l < 72) return "Grey";
    return l >= 85 ? "Ivory" : "Light Grey";
  }

  if (h >= 30 && h < 60 && s < 50 && l >= 75) return "Cream";
  if (h >= 15 && h < 50 && s < 70 && l < 40) return "Brown";
  if (h >= 15 && h < 50 && s < 45 && l >= 55 && l < 75) return "Beige";
  if (h >= 205 && h < 255 && l < 30) return "Navy";

  let family;
  if (h < 12 || h >= 345) family = "Red";
  else if (h < 25) family = "Rust";
  else if (h < 42) family = "Orange";
  else if (h < 58) family = "Gold";
  else if (h < 75) family = "Mustard";
  else if (h < 105) family = "Olive";
  else if (h < 145) family = "Green";
  else if (h < 175) family = "Emerald";
  else if (h < 195) family = "Teal";
  else if (h < 220) family = "Blue";
  else if (h < 250) family = "Royal Blue";
  else if (h < 275) family = "Indigo";
  else if (h < 300) family = "Purple";
  else if (h < 325) family = "Magenta";
  else family = "Wine";

  if (["Red", "Magenta", "Wine"].includes(family) && l >= 68) return "Pink";
  if (l < 28) return `Deep ${family}`;
  if (l < 42) return `Dark ${family}`;
  if (l > 78) return `Pastel ${family}`;
  if (s < 35) return `Muted ${family}`;
  return family;
};

// ======================================================
// IMAGE LOADING (EXIF-safe, resized)
// <img> decoding applies EXIF rotation in all modern
// browsers, so drawing it on a canvas gives upright pixels.
// ======================================================

const loadNormalizedCanvas = (file) =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      const w = img.naturalWidth;
      const h = img.naturalHeight;

      if (!w || !h) {
        reject(new Error("Empty image"));
        return;
      }

      const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(w, h));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(w * scale));
      canvas.height = Math.max(1, Math.round(h * scale));

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Decode failed"));
    };

    img.src = url;
  });

// ======================================================
// DOMINANT COLOR (k-means in Lab space)
// ======================================================

const dominantColor = (samples, k = 4) => {
  if (samples.length < 20) return null;

  const sorted = [...samples].sort((a, b) => a.lab[0] - b.lab[0]);
  const kk = Math.min(k, sorted.length);

  let centers = Array.from({ length: kk }, (_, i) =>
    sorted[Math.floor(((i + 0.5) / kk) * sorted.length)].lab.slice()
  );

  const assign = new Array(samples.length).fill(0);

  for (let iter = 0; iter < 10; iter++) {
    const sums = centers.map(() => ({ n: 0, l: 0, a: 0, b: 0 }));

    samples.forEach((s, i) => {
      let best = 0;
      let bestD = Infinity;
      centers.forEach((c, ci) => {
        const d = labDistance(s.lab, c);
        if (d < bestD) {
          bestD = d;
          best = ci;
        }
      });
      assign[i] = best;
      const t = sums[best];
      t.n++;
      t.l += s.lab[0];
      t.a += s.lab[1];
      t.b += s.lab[2];
    });

    centers = centers.map((c, ci) =>
      sums[ci].n
        ? [sums[ci].l / sums[ci].n, sums[ci].a / sums[ci].n, sums[ci].b / sums[ci].n]
        : c
    );
  }

  const clusters = centers.map((lab) => ({ n: 0, r: 0, g: 0, b: 0, lab }));
  samples.forEach((s, i) => {
    const c = clusters[assign[i]];
    c.n++;
    c.r += s.rgb[0];
    c.g += s.rgb[1];
    c.b += s.rgb[2];
  });

  const stats = clusters.filter((c) => c.n > 0).sort((a, b) => b.n - a.n);
  const main = stats[0];

  // Merge clusters that are just shadow/highlight versions of the main one.
  let n = 0;
  let r = 0;
  let g = 0;
  let b = 0;
  for (const c of stats) {
    if (labDistance(c.lab, main.lab) < 22) {
      n += c.n;
      r += c.r;
      g += c.g;
      b += c.b;
    }
  }

  return {
    rgb: [Math.round(r / n), Math.round(g / n), Math.round(b / n)],
    coverage: n / samples.length,
  };
};

// ======================================================
// GEOMETRY
// ======================================================

const shrinkPolygon = (pts, sx, sy) => {
  const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
  const cy = pts.reduce((s, p) => s + p.y, 0) / pts.length;
  return pts.map((p) => ({
    x: cx + (p.x - cx) * sx,
    y: cy + (p.y - cy) * sy,
  }));
};

const pointInConvex = (x, y, poly) => {
  let sign = 0;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const cross = (b.x - a.x) * (y - a.y) - (b.y - a.y) * (x - a.x);
    if (cross !== 0) {
      const s = cross > 0 ? 1 : -1;
      if (sign === 0) sign = s;
      else if (s !== sign) return false;
    }
  }
  return true;
};

const usable = (l) =>
  !!l &&
  (l.visibility ?? 1) >= MIN_VISIBILITY &&
  l.x >= -0.02 &&
  l.x <= 1.02 &&
  l.y >= -0.02 &&
  l.y <= 1.02;

const lerp = (a, b, t) => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
});

// ======================================================
// BODY REGIONS
// type: "shirt" (top ends at hips) or "kurta" (top reaches knees)
// ======================================================

const buildRegions = (L, type, w, h) => {
  if (!usable(L[11]) || !usable(L[12])) return {};

  const P = (i) => ({ x: L[i].x * w, y: L[i].y * h });
  const ls = P(11);
  const rs = P(12);
  const sw = Math.hypot(ls.x - rs.x, ls.y - rs.y);
  const anchor = { x: (ls.x + rs.x) / 2, y: (ls.y + rs.y) / 2 };

  const hipsOk = usable(L[23]) && usable(L[24]);
  const kneesOk = usable(L[25]) && usable(L[26]);
  const anklesOk = usable(L[27]) && usable(L[28]);

  // Half-body photo: hips are outside the frame, so estimate the torso.
  let lh;
  let rh;
  if (hipsOk) {
    lh = P(23);
    rh = P(24);
  } else {
    lh = { x: ls.x, y: Math.min(ls.y + sw * 1.1, h - 1) };
    rh = { x: rs.x, y: Math.min(rs.y + sw * 1.1, h - 1) };
  }

  let topPoly;
  let bottomPoly = null;

  if (type === "kurta" && hipsOk && kneesOk) {
    topPoly = shrinkPolygon([ls, rs, P(26), P(25)], 0.55, 0.85);
  } else {
    topPoly = shrinkPolygon([ls, rs, rh, lh], 0.6, 0.8);
  }

  if (type === "kurta") {
    if (kneesOk && anklesOk) {
      bottomPoly = shrinkPolygon(
        [lerp(P(25), P(27), 0.2), lerp(P(26), P(28), 0.2), P(28), P(27)],
        0.6,
        0.85
      );
    }
  } else if (hipsOk && (kneesOk || anklesOk)) {
    const ll = anklesOk ? P(27) : P(25);
    const lr = anklesOk ? P(28) : P(26);
    bottomPoly = shrinkPolygon(
      [lerp(P(23), ll, 0.25), lerp(P(24), lr, 0.25), lr, ll],
      0.6,
      0.85
    );
  }

  return { topPoly, bottomPoly, anchor, sortX: anchor.x / w };
};

// ======================================================
// PIXEL SAMPLING
// ======================================================

const pixelAt = (data, i) => [data[i], data[i + 1], data[i + 2]];

// Estimates this person's skin tone from a small patch on the nose.
const sampleSkin = (imageData, L) => {
  if (!usable(L[0])) return null;
  const { width, height, data } = imageData;

  const sw =
    usable(L[11]) && usable(L[12])
      ? Math.hypot((L[11].x - L[12].x) * width, (L[11].y - L[12].y) * height)
      : width * 0.15;

  const r = Math.max(3, Math.round(sw * 0.05));
  const cx = Math.round(L[0].x * width);
  const cy = Math.round(L[0].y * height);

  const rs = [];
  const gs = [];
  const bs = [];

  for (let y = cy - r; y <= cy + r; y++) {
    for (let x = cx - r; x <= cx + r; x++) {
      if (x < 0 || y < 0 || x >= width || y >= height) continue;
      const [pr, pg, pb] = pixelAt(data, (y * width + x) * 4);
      rs.push(pr);
      gs.push(pg);
      bs.push(pb);
    }
  }

  if (rs.length < 9) return null;

  const median = (arr) => arr.sort((a, b) => a - b)[Math.floor(arr.length / 2)];
  const rgb = [median(rs), median(gs), median(bs)];

  return isSkinYCbCr(...rgb) ? rgbToLab(rgb) : null;
};

const samplePolygon = (imageData, poly, skinLab) => {
  const { width, height, data } = imageData;

  const xs = poly.map((p) => p.x);
  const ys = poly.map((p) => p.y);
  const x0 = Math.max(0, Math.floor(Math.min(...xs)));
  const x1 = Math.min(width - 1, Math.ceil(Math.max(...xs)));
  const y0 = Math.max(0, Math.floor(Math.min(...ys)));
  const y1 = Math.min(height - 1, Math.ceil(Math.max(...ys)));

  if (x1 <= x0 || y1 <= y0) return [];

  const step = Math.max(1, Math.floor(Math.sqrt(((x1 - x0) * (y1 - y0)) / 4000)));

  const all = [];
  const clean = [];

  for (let y = y0; y <= y1; y += step) {
    for (let x = x0; x <= x1; x += step) {
      if (!pointInConvex(x, y, poly)) continue;
      const i = (y * width + x) * 4;
      if (data[i + 3] < 200) continue;

      const rgb = pixelAt(data, i);
      const lab = rgbToLab(rgb);
      const entry = { rgb, lab };
      all.push(entry);

      const skinLike =
        isSkinYCbCr(...rgb) && (!skinLab || labDistance(lab, skinLab) < 30);
      if (!skinLike) clean.push(entry);
    }
  }

  // If the garment itself is skin-coloured (beige, peach), keep everything.
  return clean.length >= 30 && clean.length >= all.length * 0.25 ? clean : all;
};

const buildPeople = (landmarkList, type, imageData) => {
  const people = landmarkList
    .map((L) => {
      const regions = buildRegions(L, type, imageData.width, imageData.height);
      const skin = sampleSkin(imageData, L);

      const top = regions.topPoly
        ? dominantColor(samplePolygon(imageData, regions.topPoly, skin))
        : null;
      const bottom = regions.bottomPoly
        ? dominantColor(samplePolygon(imageData, regions.bottomPoly, skin))
        : null;

      return {
        top: top?.rgb ?? null,
        bottom: bottom?.rgb ?? null,
        topPoly: regions.topPoly ?? null,
        bottomPoly: regions.bottomPoly ?? null,
        anchor: regions.anchor ?? null,
        sortX: regions.sortX ?? 0,
      };
    })
    .filter((p) => p.top)
    .sort((a, b) => a.sortX - b.sortX); // left to right, so numbering is predictable

  return people.map((p, i) => ({ ...p, id: i }));
};

// Product photo / flat-lay: removes plain background, then finds dominant color.
const analyseFlatLay = (imageData) => {
  const { width, height, data } = imageData;

  const bw = Math.max(2, Math.floor(Math.min(width, height) * 0.04));
  const border = [];
  for (let y = 0; y < height; y += 4) {
    for (let x = 0; x < width; x += 4) {
      if (x < bw || x >= width - bw || y < bw || y >= height - bw) {
        border.push(pixelAt(data, (y * width + x) * 4));
      }
    }
  }

  let bgLab = null;
  if (border.length > 20) {
    const med = (idx) =>
      border.map((p) => p[idx]).sort((a, b) => a - b)[Math.floor(border.length / 2)];
    const candidate = rgbToLab([med(0), med(1), med(2)]);
    const spread =
      border.reduce((s, p) => s + labDistance(rgbToLab(p), candidate), 0) /
      border.length;
    if (spread < 20) bgLab = candidate; // only trust a uniform background
  }

  const x0 = Math.floor(width * 0.15);
  const x1 = Math.floor(width * 0.85);
  const y0 = Math.floor(height * 0.15);
  const y1 = Math.floor(height * 0.85);
  const step = Math.max(1, Math.floor(Math.sqrt(((x1 - x0) * (y1 - y0)) / 4000)));

  const all = [];
  const clean = [];

  for (let y = y0; y < y1; y += step) {
    for (let x = x0; x < x1; x += step) {
      const i = (y * width + x) * 4;
      if (data[i + 3] < 200) continue;
      const rgb = pixelAt(data, i);
      const lab = rgbToLab(rgb);
      all.push({ rgb, lab });
      if (!bgLab || labDistance(lab, bgLab) >= 16) clean.push({ rgb, lab });
    }
  }

  const use = clean.length >= all.length * 0.05 && clean.length >= 30 ? clean : all;
  return dominantColor(use)?.rgb ?? null;
};

// ======================================================
// TURBAN MATCHING ENGINE
//
// 1. Build a pool: harmony shades from the outfit hue
//    + a curated set of real turban colors.
// 2. Score each on contrast (Lab distance), color harmony,
//    pants compatibility and wearability.
// 3. Pick 5 that are different from each other.
// ======================================================

const makeCandidate = (rgb, name, curated = false) => {
  const lab = rgbToLab(rgb);
  const [h, s, l] = rgbToHsl(rgb);
  return {
    rgb,
    hex: rgbToHex(rgb),
    name: name || getColorName(rgb),
    lab,
    h,
    s,
    l,
    chroma: Math.hypot(lab[1], lab[2]),
    curated,
  };
};

const CURATED_TURBANS = [
  ["White", "#F3F3EE"],
  ["Cream", "#EADFC4"],
  ["Black", "#1C1C1E"],
  ["Navy", "#1F2A44"],
  ["Maroon", "#6B1E2E"],
  ["Royal Blue", "#2B4C9B"],
  ["Mustard", "#C99A1E"],
  ["Bottle Green", "#1E5B3A"],
  ["Teal", "#1E7B7B"],
  ["Grey", "#8A8D91"],
  ["Peach", "#F2B8A0"],
  ["Sky Blue", "#8EC5E8"],
  ["Pink", "#E58CA8"],
  ["Saffron", "#E8832A"],
  ["Purple", "#5B3A8C"],
  ["Turquoise", "#2FB5B0"],
  ["Rust", "#B5502E"],
  ["Olive", "#6B7A2E"],
].map(([name, hex]) => makeCandidate(hexToRgb(hex), name, true));

const contrastLabel = (dE) => (dE < 25 ? "Subtle" : dE < 45 ? "Good" : "Strong");

const getTurbanMatches = (top, bottom) => {
  if (!top) return [];

  const topLab = rgbToLab(top);
  const [oh, os] = rgbToHsl(top);
  const oNeutral = Math.hypot(topLab[1], topLab[2]) < 14;

  let bottomInfo = null;
  if (bottom) {
    const bl = rgbToLab(bottom);
    bottomInfo = {
      h: rgbToHsl(bottom)[0],
      neutral: Math.hypot(bl[1], bl[2]) < 14,
    };
  }

  // ---- candidate pool
  const pool = [...CURATED_TURBANS];
  const baseHue =
    oNeutral && bottomInfo && !bottomInfo.neutral ? bottomInfo.h : oNeutral ? 20 : oh;
  const offsets = oNeutral
    ? [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]
    : [0, 25, -25, 50, -50, 120, -120, 150, -150, 180];
  const sats = oNeutral ? [50, 70] : [clamp(os, 35, 70), clamp(os + 20, 55, 85)];

  for (const off of offsets) {
    for (const sat of sats) {
      for (const light of [24, 36, 48, 62, 78]) {
        pool.push(makeCandidate(hslToRgb([baseHue + off, sat, light])));
      }
    }
  }

  // ---- scoring
  const score = (c) => {
    const dE = labDistance(topLab, c.lab);
    const dL = Math.abs(topLab[0] - c.lab[0]);

    const contrast = dE < 18 ? 0 : dE < 30 ? 0.5 : dE <= 75 ? 1 : 0.85;

    let harmony;
    if (oNeutral) {
      harmony = c.chroma < 14 ? (dL > 40 ? 0.7 : 0.35) : 0.8;
    } else if (c.chroma < 14) {
      harmony = 0.75;
    } else {
      const d = hueDiff(oh, c.h);
      if (d <= 20) harmony = dL >= 25 ? 0.75 : 0.45; // tonal needs lightness gap
      else if (d <= 50) harmony = 0.7; // analogous
      else if (d <= 100) harmony = 0.45; // awkward middle zone
      else if (d <= 135) harmony = 0.8; // triadic
      else if (d <= 165) harmony = 0.95; // split-complementary
      else harmony = 0.9; // complementary
    }

    let bottomFit = 0.5;
    if (bottomInfo) {
      if (bottomInfo.neutral || c.chroma < 14) {
        bottomFit = 0.6;
      } else {
        const d = hueDiff(bottomInfo.h, c.h);
        bottomFit = d <= 40 ? 1 : d <= 100 ? 0.4 : d >= 150 ? 0.8 : 0.6;
      }
    }

    let wear = 1;
    if (!c.curated && c.s > 88) wear -= 0.3; // neon
    if (c.chroma >= 14 && c.l < 14) wear -= 0.3; // looks black but isn't
    if (c.chroma >= 14 && c.l > 88) wear -= 0.2; // washed out

    return (
      0.4 * contrast +
      0.35 * harmony +
      0.1 * bottomFit +
      0.15 * wear +
      (c.curated ? 0.05 : 0)
    );
  };

  const ranked = pool
    .map((c) => ({ ...c, score: score(c), dE: labDistance(topLab, c.lab) }))
    .sort((a, b) => b.score - a.score);

  // ---- diverse selection
  const picked = [];
  let neutrals = 0;

  for (const c of ranked) {
    const distinct = picked.every((p) => {
      if (p.name === c.name) return false;
      const far = labDistance(p.lab, c.lab) >= 24;
      const hueClash =
        p.chroma >= 14 && c.chroma >= 14 && hueDiff(p.h, c.h) < 25 && labDistance(p.lab, c.lab) < 40;
      return far && !hueClash;
    });

    if (!distinct) continue;
    if (c.chroma < 14 && neutrals >= 2) continue;

    if (c.chroma < 14) neutrals++;
    picked.push(c);
    if (picked.length === 5) break;
  }

  // ---- labels
  return picked.map((c, i) => {
    let label = "Best Match";
    if (i > 0) {
      if (c.chroma < 14) label = "Classic";
      else if (c.dE >= 55) label = "Contrast";
      else if (!oNeutral && hueDiff(oh, c.h) <= 50) label = "Tonal";
      else if (c.l >= 62) label = "Soft";
      else label = "Bold";
    }
    return {
      label,
      name: c.name,
      hex: c.hex,
      rgb: c.rgb,
      contrast: contrastLabel(c.dE),
    };
  });
};

// ======================================================
// COMPONENT
// ======================================================

export default function TurbanColorMatcher() {
  const poseRef = useRef(null);
  const sourceRef = useRef(null); // normalised canvas (pixels used for analysis)
  const imageDataRef = useRef(null);
  const landmarksRef = useRef([]);
  const viewRef = useRef(null); // visible preview canvas

  const [loadAttempt, setLoadAttempt] = useState(0);
  const [modelLoading, setModelLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const [imageVersion, setImageVersion] = useState(0);
  const [outfitType, setOutfitType] = useState("shirt");
  const [analysis, setAnalysis] = useState({
    mode: null, // "pose" | "flat"
    people: [],
    flatColor: null,
  });
  const [selectedPerson, setSelectedPerson] = useState(0);
  const [manualTop, setManualTop] = useState(null);
  const [manualPoint, setManualPoint] = useState(null);

  // ---------------- load MediaPipe
  useEffect(() => {
    let active = true;
    let created = null;

    const load = async () => {
      try {
        setModelLoading(true);
        setError("");

        const vision = await FilesetResolver.forVisionTasks(WASM_URL);
        const pose = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: MODEL_URL },
          runningMode: "IMAGE",
          numPoses: MAX_PEOPLE,
          minPoseDetectionConfidence: 0.5,
          minPosePresenceConfidence: 0.5,
        });

        created = pose;
        if (active) poseRef.current = pose;
        else pose.close();
      } catch (err) {
        console.error("MediaPipe loading error:", err);
        if (active) setError("The body detector could not be loaded. Check your connection and tap Retry.");
      } finally {
        if (active) setModelLoading(false);
      }
    };

    load();

    return () => {
      active = false;
      if (created) created.close();
      poseRef.current = null;
    };
  }, [loadAttempt]);

  // ---------------- preview canvas (image + sampled regions)
  useEffect(() => {
    const view = viewRef.current;
    const src = sourceRef.current;
    if (!view || !src) return;

    view.width = src.width;
    view.height = src.height;
    const ctx = view.getContext("2d");
    ctx.drawImage(src, 0, 0);

    const lw = Math.max(2, src.width / 300);

    analysis.people.forEach((p, i) => {
      if (i === selectedPerson) {
        [p.topPoly, p.bottomPoly].forEach((poly, pi) => {
          if (!poly) return;
          ctx.beginPath();
          poly.forEach((pt, j) => (j ? ctx.lineTo(pt.x, pt.y) : ctx.moveTo(pt.x, pt.y)));
          ctx.closePath();
          ctx.lineWidth = lw;
          ctx.strokeStyle = pi === 0 ? "#f59e0b" : "#38bdf8";
          ctx.setLineDash([lw * 3, lw * 2]);
          ctx.stroke();
          ctx.setLineDash([]);
        });
      }

      if (analysis.people.length > 1 && p.anchor) {
        const r = lw * 6;
        ctx.beginPath();
        ctx.arc(p.anchor.x, p.anchor.y - r * 2, r, 0, Math.PI * 2);
        ctx.fillStyle = i === selectedPerson ? "#1c1917" : "rgba(255,255,255,0.9)";
        ctx.fill();
        ctx.lineWidth = lw;
        ctx.strokeStyle = "#1c1917";
        ctx.stroke();
        ctx.fillStyle = i === selectedPerson ? "#ffffff" : "#1c1917";
        ctx.font = `bold ${Math.round(r * 1.3)}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(String(i + 1), p.anchor.x, p.anchor.y - r * 2);
      }
    });

    if (manualPoint) {
      ctx.beginPath();
      ctx.arc(manualPoint.x, manualPoint.y, lw * 4, 0, Math.PI * 2);
      ctx.lineWidth = lw * 1.5;
      ctx.strokeStyle = "#ffffff";
      ctx.stroke();
      ctx.lineWidth = lw * 0.6;
      ctx.strokeStyle = "#1c1917";
      ctx.stroke();
    }
  }, [imageVersion, analysis, selectedPerson, manualPoint]);

  // ---------------- derived values
  const activePerson = analysis.people[selectedPerson] || null;

  const topColor =
    manualTop ||
    (analysis.mode === "flat" ? analysis.flatColor : activePerson?.top) ||
    null;
  const bottomColor =
    analysis.mode === "pose" && !manualTop ? activePerson?.bottom || null : null;

  const topKey = topColor ? topColor.join(",") : "";
  const bottomKey = bottomColor ? bottomColor.join(",") : "";

  const matches = useMemo(
    () => getTurbanMatches(topColor, bottomColor),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [topKey, bottomKey]
  );

  // ---------------- handlers
  const resetResults = () => {
    setError("");
    setInfo("");
    setAnalysis({ mode: null, people: [], flatColor: null });
    setSelectedPerson(0);
    setManualTop(null);
    setManualPoint(null);
    landmarksRef.current = [];
  };

  const handlePhoto = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setError("Please select an image smaller than 15 MB.");
      return;
    }

    resetResults();

    try {
      const canvas = await loadNormalizedCanvas(file);
      sourceRef.current = canvas;
      imageDataRef.current = canvas
        .getContext("2d", { willReadFrequently: true })
        .getImageData(0, 0, canvas.width, canvas.height);
      setImageVersion((v) => v + 1);
    } catch (err) {
      console.error(err);
      setError("The image could not be opened. Please try another image.");
    }
  };

  const analyzeOutfit = async () => {
    const src = sourceRef.current;
    const imageData = imageDataRef.current;
    const pose = poseRef.current;

    if (!src || !imageData) {
      setError("Please select an image first.");
      return;
    }
    if (!pose) {
      setError("The body detector is still loading. Please wait a moment.");
      return;
    }

    setAnalyzing(true);
    resetResults();

    // Let React paint "Analyzing..." before the heavy synchronous work.
    await new Promise((r) => setTimeout(r, 40));

    try {
      const result = pose.detect(src);
      const found = result.landmarks || [];
      landmarksRef.current = found;

      const people = found.length ? buildPeople(found, outfitType, imageData) : [];

      if (people.length > 0) {
        setAnalysis({ mode: "pose", people, flatColor: null });
        setSelectedPerson(0);
        setInfo(
          people.length === 1
            ? "Dashed boxes show where color was read. Wrong color? Tap the outfit in the photo."
            : `${people.length} people found. Pick one below. Wrong color? Tap the photo.`
        );
        return;
      }

      const flat = analyseFlatLay(imageData);
      if (!flat) {
        setError("The outfit color could not be detected. Try a clearer, well-lit photo.");
        return;
      }

      setAnalysis({ mode: "flat", people: [], flatColor: flat });
      setInfo(
        found.length
          ? "Torso not clear, so the main color of the photo was used. Tap the outfit to correct it."
          : "No person found, so the main color of the clothing was used. Tap the outfit to correct it."
      );
    } catch (err) {
      console.error("Analysis error:", err);
      setError("Something went wrong while analyzing the image. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const changeOutfitType = (type) => {
    setOutfitType(type);
    const imageData = imageDataRef.current;

    if (analysis.mode === "pose" && landmarksRef.current.length && imageData) {
      const people = buildPeople(landmarksRef.current, type, imageData);
      if (people.length) {
        setAnalysis({ mode: "pose", people, flatColor: null });
        setSelectedPerson(0);
        setManualTop(null);
        setManualPoint(null);
      }
    }
  };

  const selectPerson = (index) => {
    setSelectedPerson(index);
    setManualTop(null);
    setManualPoint(null);
  };

  const pickManualColor = (event) => {
    const view = viewRef.current;
    const src = sourceRef.current;
    if (!view || !src || !analysis.mode) return;

    const rect = view.getBoundingClientRect();
    const x = Math.round(((event.clientX - rect.left) / rect.width) * src.width);
    const y = Math.round(((event.clientY - rect.top) / rect.height) * src.height);

    const half = 5;
    const sx = clamp(x - half, 0, src.width - 1);
    const sy = clamp(y - half, 0, src.height - 1);
    const sw = Math.min(half * 2 + 1, src.width - sx);
    const sh = Math.min(half * 2 + 1, src.height - sy);

    const { data } = src.getContext("2d", { willReadFrequently: true }).getImageData(sx, sy, sw, sh);

    const rs = [];
    const gs = [];
    const bs = [];
    for (let i = 0; i < data.length; i += 4) {
      rs.push(data[i]);
      gs.push(data[i + 1]);
      bs.push(data[i + 2]);
    }
    const median = (arr) => arr.sort((a, b) => a - b)[Math.floor(arr.length / 2)];

    setManualTop([median(rs), median(gs), median(bs)]);
    setManualPoint({ x, y });
  };

  // Analyze automatically once a photo is loaded and the detector is ready.
  useEffect(() => {
    if (imageVersion > 0 && !modelLoading && poseRef.current) {
      analyzeOutfit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageVersion, modelLoading]);

  // ---------------- UI
  const hasImage = imageVersion > 0;

  const uploadClass = `cursor-pointer border border-dashed rounded-xl text-center font-semibold text-stone-700 text-sm transition focus-within:ring-2 focus-within:ring-amber-300 hover:border-amber-500 flex items-center justify-center gap-2 ${
    hasImage ? "py-2" : "py-6 flex-col"
  }`;

  const segClass = (active) =>
    `flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${
      active ? "bg-stone-900 text-white" : "text-stone-700 hover:bg-stone-200"
    }`;

  const contrastBars = { Subtle: 1, Good: 2, Strong: 3 };

  return (
    <section className="py-8 bg-amber-50/40 w-full overflow-x-hidden">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-stone-800 text-center">Find Your Turban Color</h2>
        <p className="text-xs text-stone-500 text-center mt-1 mb-5">
          Upload an outfit photo. Daylight gives the most accurate color.
        </p>

        <div
          className={`bg-white rounded-2xl shadow-md border border-stone-100 p-4 md:p-5 mx-auto w-full overflow-hidden ${
            hasImage ? "" : "max-w-md"
          }`}
        >
          <div className={hasImage ? "grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-start" : ""}>
            {/* LEFT: upload + photo */}
            <div className="min-w-0">
              <div className="grid grid-cols-2 gap-2">
                <label className={`${uploadClass} border-stone-300`}>
                  <span className={hasImage ? "text-base" : "text-3xl"} aria-hidden="true">🖼️</span>
                  <span>{hasImage ? "Upload" : "Upload Photo"}</span>
                  <input type="file" accept="image/*" onChange={handlePhoto} className="sr-only" />
                </label>

                <label className={`${uploadClass} border-amber-300 bg-amber-50/40`}>
                  <span className={hasImage ? "text-base" : "text-3xl"} aria-hidden="true">📷</span>
                  <span>{hasImage ? "Camera" : "Take Photo"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhoto}
                    className="sr-only"
                  />
                </label>
              </div>

              {modelLoading && (
                <p className="mt-3 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-2 text-center">
                  Preparing the outfit detector...
                </p>
              )}

              {error && (
                <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg" role="alert">
                  <p className="text-xs text-red-700 text-center">{error}</p>
                  {!modelLoading && !poseRef.current && (
                    <button
                      type="button"
                      onClick={() => setLoadAttempt((n) => n + 1)}
                      className="block mx-auto mt-1 text-xs font-semibold text-red-700 underline"
                    >
                      Retry
                    </button>
                  )}
                </div>
              )}

              {hasImage && (
                <div className="mt-3 bg-stone-100 rounded-xl flex justify-center">
                  <canvas
                    ref={viewRef}
                    onClick={pickManualColor}
                    aria-label="Selected outfit photo. Tap to pick a color."
                    className={`max-w-full max-h-[340px] md:max-h-[460px] w-auto h-auto rounded-xl ${
                      analysis.mode ? "cursor-crosshair" : ""
                    }`}
                  />
                </div>
              )}
            </div>

            {/* RIGHT: controls + results */}
            {hasImage && (
              <div className="space-y-4 min-w-0">
                <div
                  className="flex gap-1 bg-stone-100 p-1 rounded-xl"
                  role="group"
                  aria-label="Outfit type"
                >
                  <button
                    type="button"
                    onClick={() => changeOutfitType("shirt")}
                    aria-pressed={outfitType === "shirt"}
                    className={segClass(outfitType === "shirt")}
                  >
                    Shirt
                  </button>
                  <button
                    type="button"
                    onClick={() => changeOutfitType("kurta")}
                    aria-pressed={outfitType === "kurta"}
                    className={segClass(outfitType === "kurta")}
                    title="Choose Kurta if the top reaches the knees"
                  >
                    Kurta / Long
                  </button>
                </div>

                {(analyzing || info) && (
                  <p className="text-xs text-stone-600" role="status">
                    {analyzing ? "Analyzing outfit..." : info}
                  </p>
                )}

                {analysis.people.length > 1 && (
                  <div className="flex gap-2 flex-wrap">
                    {analysis.people.map((person, index) => (
                      <button
                        key={person.id}
                        type="button"
                        onClick={() => selectPerson(index)}
                        aria-pressed={selectedPerson === index}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold border transition ${
                          selectedPerson === index
                            ? "bg-stone-900 text-white border-stone-900"
                            : "bg-white text-stone-700 border-stone-300 hover:border-amber-500"
                        }`}
                      >
                        Person {index + 1}
                      </button>
                    ))}
                  </div>
                )}

                {topColor && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-bold text-stone-800">Detected Outfit</h3>
                      {manualTop && (
                        <button
                          type="button"
                          onClick={() => {
                            setManualTop(null);
                            setManualPoint(null);
                          }}
                          className="text-xs font-semibold text-amber-800 underline"
                        >
                          Use detected color
                        </button>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {[
                        [manualTop ? "Picked" : analysis.mode === "flat" ? "Clothing" : "Top", topColor],
                        ["Bottom", bottomColor],
                      ]
                        .filter(([, c]) => c)
                        .map(([label, c]) => (
                          <div
                            key={label}
                            className="flex-1 flex items-center gap-2 border border-stone-200 rounded-lg p-2 min-w-0"
                          >
                            <div
                              className="w-9 h-9 rounded-md border border-stone-100 shrink-0"
                              style={{ backgroundColor: rgbToHex(c) }}
                              role="img"
                              aria-label={`${label} color ${getColorName(c)}`}
                            />
                            <div className="min-w-0">
                              <p className="text-[10px] text-stone-500">{label}</p>
                              <p className="text-xs font-bold text-stone-700 truncate">
                                {getColorName(c)}
                              </p>
                              <p className="text-[10px] text-stone-500">{rgbToHex(c)}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {matches.length > 0 && (
                  <div>
                    <div className="flex items-baseline justify-between mb-2">
                      <h3 className="text-sm font-bold text-stone-800">Recommended Turban Colors</h3>
                      <span className="text-[10px] text-stone-500 md:hidden">swipe →</span>
                    </div>

                    <div className="flex gap-2 overflow-x-auto overscroll-x-contain snap-x snap-mandatory pb-2 [scrollbar-width:thin]">
                      {matches.map((color, index) => (
                        <div
                          key={`${color.hex}-${index}`}
                          className="snap-start shrink-0 w-[88px] border border-stone-200 rounded-lg p-1.5"
                        >
                          <div className="rounded-md overflow-hidden border border-stone-100">
                            <div
                              className="h-14"
                              style={{ backgroundColor: color.hex }}
                              role="img"
                              aria-label={`${color.label}: ${color.name}`}
                            />
                            <div className="h-3" style={{ backgroundColor: rgbToHex(topColor) }} />
                          </div>

                          <p className="mt-1.5 text-[10px] font-semibold text-amber-800">
                            {color.label}
                          </p>
                          <p className="text-[11px] font-bold text-stone-700 leading-tight truncate">
                            {color.name}
                          </p>
                          <p className="text-[10px] text-stone-500">{color.hex}</p>

                          <div className="flex gap-0.5 mt-1" title={`${color.contrast} contrast`}>
                            {[1, 2, 3].map((n) => (
                              <span
                                key={n}
                                className={`h-1 w-3 rounded-full ${
                                  n <= contrastBars[color.contrast] ? "bg-stone-700" : "bg-stone-200"
                                }`}
                              />
                            ))}
                            <span className="sr-only">{color.contrast} contrast</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-stone-500 mt-1">
                      Bar under the name = contrast with your outfit. Strip under the swatch = your outfit.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
