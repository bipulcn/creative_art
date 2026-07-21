const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [800, 800],
};

// =============================================
//  PARAMETRIC COAXIAL CABLE CROSS-SECTION
//  Change these values to reshape the cable.
//  All layer sizes scale proportionally with
//  outerRadius, so changing it resizes everything.
// =============================================
const PARAMS = {
  outerRadius: 350, // Master radius — scales the entire cable
  strandCount: 70, // Conductor circles in the outer shield ring
  strandRadius: 13.5, // Radius of each outer strand circle
  segmentCount: 5, // Pie-slice segments in the inner core
  coreDotRadius: 5, // Small circle radius inside core segments
  dividerWidth: 2, // Divider thickness between core segments
};

const COLORS = {
  bg: "#f0f0f0",
  jacket: "#888888",
  shield: "#1a1a1a",
  strand: "#E87830",
  strandStroke: "#B05510",
  insulator: "#C0C0C0",
  innerShield: "#2a2a2a",
  innerInsulator: "#D5D5D5",
  coreBase: "#E87830",
  coreDot: "#D46A22",
  coreDotHL: "#F09838",
  divider: "#C0C0C0",
  centerHub: "#B0B0B0",
  outline: "#555555",
};

const sketch = () => {
  const P = PARAMS;
  const C = COLORS;
  const R = P.outerRadius;

  // --- All layer radii derived proportionally from outerRadius ---
  const L = {
    jacketOuter: R,
    jacketInner: R * 0.88,
    shieldOuter: R * 0.88,
    shieldInner: R * 0.8,
    strandRing: R * 0.84,
    insulatorOuter: R * 0.8,
    insulatorInner: R * 0.72,
    innerShieldOuter: R * 0.72,
    innerShieldInner: R * 0.68,
    innerInsOuter: R * 0.68,
    innerInsInner: R * 0.62,
    coreRadius: R * 0.62,
  };

  // ===== Drawing Helper Functions =====

  /** Fill a circle at (x, y) with radius r */
  function fillCircle(ctx, x, y, r, color) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }

  /** Stroke a circle outline */
  function strokeCircle(ctx, x, y, r, color, lw) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = lw;
    ctx.stroke();
  }

  /** Fill a ring (annulus) between outerR and innerR */
  function fillRing(ctx, cx, cy, outerR, innerR, color) {
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2, true);
    ctx.fillStyle = color;
    ctx.fill();
  }

  /** Draw evenly-spaced circles arranged on a ring */
  function drawStrandRing(ctx, cx, cy, ringR, count, dotR, fill, stroke) {
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const x = cx + Math.cos(a) * ringR;
      const y = cy + Math.sin(a) * ringR;
      fillCircle(ctx, x, y, dotR, fill);
      if (stroke) strokeCircle(ctx, x, y, dotR, stroke, 1);
    }
  }

  /** Check if a point (px, py) relative to center is inside a pie-slice segment */
  function inSegment(px, py, segStart, segSpan, rMin, rMax, margin) {
    const d = Math.sqrt(px * px + py * py);
    if (d < rMin || d > rMax) return false;
    // Rotate so segment starts at angle 0
    const cs = Math.cos(-segStart),
      sn = Math.sin(-segStart);
    let a = Math.atan2(px * sn + py * cs, px * cs - py * sn);
    if (a < 0) a += Math.PI * 2;
    const m = margin / d;
    return a > m && a < segSpan - m;
  }

  /** Draw the segmented core conductor filled with hex-packed dots */
  function drawCore(ctx, cx, cy) {
    const segSpan = (Math.PI * 2) / P.segmentCount;
    const cR = L.coreRadius;
    const dR = P.coreDotRadius;

    // 1. Fill all segment backgrounds
    for (let i = 0; i < P.segmentCount; i++) {
      const start = i * segSpan - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, cR, start, start + segSpan);
      ctx.closePath();
      ctx.fillStyle = C.coreBase;
      //   ctx.fill();
    }

    // 2. Pack small dots using tight hex-grid (circles touching)
    const step = dR * 2.05;
    const rowH = step * 0.866;
    for (let gy = -cR; gy <= cR; gy += rowH) {
      const row = Math.round(gy / rowH);
      const xOff = (row & 1) * step * 0.5;
      for (let gx = -cR; gx <= cR; gx += step) {
        const px = gx + xOff;
        const py = gy;
        const d = Math.sqrt(px * px + py * py);
        if (d > cR - dR * 0.5 || d < dR) continue;

        // Determine which segment this point belongs to (O(1) lookup)
        let angle = Math.atan2(py, px) + Math.PI / 2;
        if (angle < 0) angle += Math.PI * 2;
        if (angle >= Math.PI * 2) angle -= Math.PI * 2;
        const segIdx = Math.floor(angle / segSpan);
        const segStart = segIdx * segSpan - Math.PI / 2;

        if (inSegment(px, py, segStart, segSpan, dR, cR - dR * 0.5, dR * 0.7)) {
          fillCircle(ctx, cx + px, cy + py, dR, C.coreDot);
          // Tiny specular highlight for 3D effect
          //   fillCircle(
          //     ctx,
          //     cx + px - dR * 0.25,
          //     cy + py - dR * 0.25,
          //     dR * 0.35,
          //     C.coreDotHL,
          //   );
        }
      }
    }

    // 3. Divider lines between segments
    ctx.strokeStyle = C.divider;
    ctx.lineWidth = P.dividerWidth;
    ctx.lineCap = "round";
    for (let i = 0; i < P.segmentCount; i++) {
      const a = i * segSpan - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * cR, cy + Math.sin(a) * cR);
      ctx.stroke();
    }

    // 4. Center hub circle
    fillCircle(ctx, cx, cy, dR * 3, C.centerHub);
    strokeCircle(ctx, cx, cy, dR * 3, C.outline, 1);

    // 5. Core outer ring stroke
    strokeCircle(ctx, cx, cy, cR, C.outline, 1.5);
  }

  // ===== Main Render =====
  return ({ context: ctx, width, height }) => {
    const cx = width / 2;
    const cy = height / 2;

    // Background
    ctx.fillStyle = C.bg;
    ctx.fillRect(0, 0, width, height);

    // Layer 1 — Outer jacket (light grey ring)
    fillRing(ctx, cx, cy, L.jacketOuter, L.jacketInner, C.jacket);
    strokeCircle(ctx, cx, cy, L.jacketOuter, C.outline, 2);

    // Layer 2 — Outer shield (dark band)
    fillRing(ctx, cx, cy, L.shieldOuter, L.shieldInner, C.shield);

    // Layer 3 — Conductor strand circles on ring
    drawStrandRing(
      ctx,
      cx,
      cy,
      L.strandRing,
      P.strandCount,
      P.strandRadius,
      C.strand,
      C.strandStroke,
    );

    // Layer 4 — Outer insulator (grey ring)
    fillRing(ctx, cx, cy, L.insulatorOuter, L.insulatorInner, C.insulator);
    strokeCircle(ctx, cx, cy, L.insulatorOuter, C.outline, 1);

    // Layer 5 — Inner shield (thin dark ring)
    fillRing(
      ctx,
      cx,
      cy,
      L.innerShieldOuter,
      L.innerShieldInner,
      C.innerShield,
    );

    // Layer 6 — Inner insulator
    fillRing(ctx, cx, cy, L.innerInsOuter, L.innerInsInner, C.innerInsulator);
    strokeCircle(ctx, cx, cy, L.innerInsOuter, C.outline, 0.5);
    strokeCircle(ctx, cx, cy, L.innerInsInner, C.outline, 0.5);

    // Layer 7 — Segmented core conductor with packed dots
    drawCore(ctx, cx, cy);
  };
};

canvasSketch(sketch, settings);
