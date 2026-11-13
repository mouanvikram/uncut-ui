"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export type PixelRainProps = {
  className?: string;
  pixelSize?: number;
  speed?: number;
  trailLength?: number;
  color?: string;
};

type Drop = {
  y: number;
  velocity: number;
  length: number;
  alpha: number;
};

const rand = (min: number, max: number) => min + Math.random() * (max - min);

export function PixelRain({
  className,
  pixelSize = 10,
  speed = 1,
  trailLength = 14,
  color,
}: PixelRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let drops: Drop[] = [];
    let columns = 0;
    let width = 0;
    let height = 0;
    let frame = 0;
    let last = 0;
    let paint = "#171717";

    const spawn = (initial: boolean): Drop => ({
      y: initial ? rand(-height, height) : rand(-height * 0.5, -pixelSize * 2),
      velocity: rand(110, 300),
      length: Math.max(2, Math.round(rand(trailLength * 0.45, trailLength))),
      alpha: rand(0.35, 0.95),
    });

    const resolveColor = () => {
      paint = color ?? getComputedStyle(canvas).color ?? "#171717";
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height);
      const cell = Math.max(1, Math.round(pixelSize * 0.7));
      ctx.fillStyle = paint;
      for (let i = 0; i < columns; i += 1) {
        const count = Math.max(1, Math.round(trailLength / 5));
        for (let k = 0; k < count; k += 1) {
          const row = Math.floor(Math.random() * Math.max(1, height / pixelSize));
          ctx.globalAlpha = rand(0.08, 0.4);
          ctx.fillRect(i * pixelSize, row * pixelSize, cell, cell);
        }
      }
      ctx.globalAlpha = 1;
    };

    const draw = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = paint;
      const cell = Math.max(1, Math.round(pixelSize * 0.7));
      const rows = height / pixelSize;

      for (let i = 0; i < columns; i += 1) {
        const drop = drops[i];
        drop.y += drop.velocity * speed * dt;
        const head = Math.floor(drop.y / pixelSize);
        if (head - drop.length > rows) {
          drops[i] = spawn(false);
          continue;
        }
        for (let k = 0; k < drop.length; k += 1) {
          const row = head - k;
          if (row < 0) continue;
          const fade = 1 - k / drop.length;
          const alpha = fade * fade * drop.alpha;
          if (alpha < 0.02) continue;
          ctx.globalAlpha = alpha;
          ctx.fillRect(i * pixelSize, row * pixelSize, cell, cell);
        }
      }
      ctx.globalAlpha = 1;
      frame = requestAnimationFrame(draw);
    };

    const start = () => {
      cancelAnimationFrame(frame);
      if (motionQuery.matches || document.hidden) {
        drawStatic();
        return;
      }
      last = performance.now();
      frame = requestAnimationFrame(draw);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      columns = Math.max(1, Math.ceil(width / pixelSize));
      drops = Array.from({ length: columns }, () => spawn(true));
      resolveColor();
      start();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const themeObserver = new MutationObserver(() => {
      resolveColor();
      if (motionQuery.matches) drawStatic();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const onVisibilityChange = () => {
      start();
    };

    const onMotionChange = () => {
      start();
    };

    motionQuery.addEventListener("change", onMotionChange);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      motionQuery.removeEventListener("change", onMotionChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [pixelSize, speed, trailLength, color]);

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full text-[#171717] dark:text-[#ededed]",
        className,
      )}
      aria-hidden="true"
    />
  );
}
