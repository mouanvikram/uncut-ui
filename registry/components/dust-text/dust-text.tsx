"use client";

import { useEffect, useRef, useState } from "react";

const grainSize = 1;
const canvasGutter = 8;
const gravity = 360;

type Grain = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  delay: number;
  opacity: number;
  settled: boolean;
};

function DustFragment({ text }: { text: string }) {
  const glyphRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const [crumbled, setCrumbled] = useState(false);

  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

  function crumble() {
    cancelAnimationFrame(frameRef.current);
    const glyph = glyphRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { willReadFrequently: true });
    if (!glyph || !canvas || !context) return;

    if (crumbled) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      setCrumbled(false);
      return;
    }

    const bounds = glyph.getBoundingClientRect();
    const style = getComputedStyle(glyph);
    canvas.width = Math.ceil(bounds.width) + canvasGutter * 2;
    canvas.height = Math.ceil(bounds.height);
    const { width, height } = canvas;
    context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    context.textAlign = "left";
    context.direction = style.direction === "rtl" ? "rtl" : "ltr";
    const metrics = context.measureText(text);
    const baseline = (height + metrics.fontBoundingBoxAscent - metrics.fontBoundingBoxDescent) / 2;
    context.fillText(text, canvasGutter, baseline);
    const { data } = context.getImageData(0, 0, width, height);
    const grains: Grain[] = [];

    for (let y = 0; y < height; y += grainSize) {
      for (let x = 0; x < width; x += grainSize) {
        const alpha = data[(y * width + x) * 4 + 3];
        if (alpha < 48) continue;
        grains.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 44,
          vy: -10 - Math.random() * 30,
          delay: y * 0.004 + Math.random() * 0.07,
          opacity: (alpha / 255) * (0.55 + Math.random() * 0.45),
          settled: false,
        });
      }
    }
    context.clearRect(0, 0, width, height);
    if (!grains.length) return;

    const floor = Math.min(height, grains[grains.length - 1].y + 7);
    const columns = new Uint16Array(Math.floor(width / grainSize));
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let previousTime = performance.now();
    let elapsed = 0;

    function settle(grain: Grain, column: number) {
      // Let grains spill sideways when a neighboring column is lower.
      while (true) {
        const left = column > 0 ? columns[column - 1] : Infinity;
        const right = column < columns.length - 1 ? columns[column + 1] : Infinity;
        if (Math.min(left, right) >= columns[column] - 1) break;
        column += left <= right ? -1 : 1;
      }
      columns[column]++;
      grain.x = column * grainSize;
      grain.y = floor - columns[column] * grainSize;
      grain.settled = true;
    }

    function draw(time: number) {
      if (!context) return;
      const dt = Math.min((time - previousTime) / 1000, 0.032);
      previousTime = time;
      elapsed += dt;
      context.clearRect(0, 0, width, height);
      context.fillStyle = "#171717";
      let moving = false;

      for (const grain of grains) {
        if (!grain.settled && (reducedMotion || elapsed >= grain.delay)) {
          grain.vy += gravity * dt;
          grain.y += grain.vy * dt;
          grain.x = Math.max(0, Math.min(width - grainSize, grain.x + grain.vx * dt));
          const column = Math.floor(grain.x / grainSize);
          const surface = floor - columns[column] * grainSize;
          if (reducedMotion || (grain.vy > 0 && grain.y + grainSize >= surface)) {
            settle(grain, column);
          }
        }
        moving ||= !grain.settled;
        context.globalAlpha = grain.opacity;
        context.fillRect(Math.round(grain.x), Math.round(grain.y), grainSize, grainSize);
      }
      context.globalAlpha = 1;
      if (moving) frameRef.current = requestAnimationFrame(draw);
    }

    setCrumbled(true);
    draw(previousTime);
  }

  return (
    <button
      type="button"
      className="relative inline-block cursor-pointer select-none leading-normal"
      aria-label={crumbled ? `Restore ${text}` : `Crumble ${text}`}
      onClick={crumble}
    >
      <span ref={glyphRef} className={crumbled ? "invisible inline-block" : "inline-block"} aria-hidden="true">
        {text}
      </span>
      <canvas
        ref={canvasRef}
        hidden={!crumbled}
        aria-hidden="true"
        className="pointer-events-none absolute top-0 -left-2 max-w-none dark:invert"
      />
    </button>
  );
}

const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });

export function DustText({
  text,
  crumbleBy = "letter",
}: {
  text: string;
  crumbleBy?: "letter" | "word";
}) {
  return text.split(/(\s+)/).map((word, wordIndex) =>
    /^\s*$/.test(word) ? word : (
      <span key={wordIndex} className="inline-block max-w-full">
        {crumbleBy === "word" ? (
          <DustFragment key={word} text={word} />
        ) : (
          Array.from(segmenter.segment(word), ({ segment }, index) => (
            <DustFragment key={`${index}-${segment}`} text={segment} />
          ))
        )}
      </span>
    ),
  );
}
