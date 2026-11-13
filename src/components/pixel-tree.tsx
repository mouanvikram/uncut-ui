"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { isCanopyPoint, paintPetalBurst, paintPetals, paintTree, pickTwig, TREE_SIZE, type TreeVariant, type TwigPull } from "./pixel-tree-art";

const DISPLAY_SCALE = 3;
const WIND_POSES = [0, 0, 1, 1, 0, 0, -1, 0] as const;

export function PixelTree({ className, variant = "cherry" }: { className?: string; variant?: TreeVariant }) {
  const pixelsRef = useRef<HTMLCanvasElement>(null);
  const webglRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const pixels = pixelsRef.current;
    const webgl = webglRef.current;
    const context = pixels?.getContext("2d");
    if (!pixels || !webgl || !context) return;
    const host = pixels.parentElement;
    if (!host) return;
    const surface = host;
    const fallback = context;
    fallback.imageSmoothingEnabled = false;

    // Cache the original artwork. Its texture never randomly changes on a frame.
    const poses = [-1, 0, 1].map((flutter) => {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = TREE_SIZE;
      const ctx = canvas.getContext("2d");
      if (ctx) paintTree(ctx, flutter, undefined, variant);
      return canvas;
    });
    const framePixels = document.createElement("canvas");
    framePixels.width = framePixels.height = TREE_SIZE;
    const frameContext = framePixels.getContext("2d");
    if (!frameContext) return;
    const paint = frameContext;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 2);
    camera.position.z = 1;
    const texture = new THREE.CanvasTexture(framePixels);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.generateMipmaps = false;
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, toneMapped: false });
    scene.add(new THREE.Mesh(geometry, material));

    let renderer: THREE.WebGLRenderer | undefined;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: webgl,
        alpha: true,
        antialias: false,
        powerPreference: "low-power",
        preserveDrawingBuffer: true,
      });
      renderer.setSize(TREE_SIZE * DISPLAY_SCALE, TREE_SIZE * DISPLAY_SCALE, false);
      webgl.hidden = false;
      pixels.hidden = true;
    } catch {
      // The identical artwork remains available on the 2D canvas.
    }

    let frame = 0;
    let inView = true;
    let lastPaint = -Infinity;
    const start = performance.now();
    let grab: { pointer: number; x: number; y: number; moved: boolean } | undefined;
    let bursts: { x: number; y: number; at: number; seed: number }[] = [];
    let burstSeed = 0;
    let pull: TwigPull | undefined;
    let release: { pose: TwigPull; at: number } | undefined;

    function draw(elapsedSeconds: number) {
      // The first animation-frame timestamp can precede the effect's start time.
      const seconds = Math.max(0, elapsedSeconds);
      const pose = motion.matches ? 0 : WIND_POSES[Math.floor(seconds / 1.25) % WIND_POSES.length];
      paint.clearRect(0, 0, TREE_SIZE, TREE_SIZE);
      if (pull && (pull.dx || pull.dy)) paintTree(paint, pose, pull, variant);
      else paint.drawImage(poses[pose + 1], 0, 0);
      if (!motion.matches) {
        paintPetals(paint, seconds, variant);
        bursts = bursts.filter(({ at }) => seconds - at < 2.85);
        for (const { x, y, at, seed } of bursts) paintPetalBurst(paint, x, y, seconds - at, seed, variant);
      }
      fallback.clearRect(0, 0, TREE_SIZE * DISPLAY_SCALE, TREE_SIZE * DISPLAY_SCALE);
      fallback.drawImage(framePixels, 0, 0, TREE_SIZE * DISPLAY_SCALE, TREE_SIZE * DISPLAY_SCALE);
      if (renderer) {
        texture.needsUpdate = true;
        renderer.render(scene, camera);
      }
    }

    function animate(now: number) {
      if (release) {
        const remaining = Math.max(0, 1 - (now - release.at) / 320) ** 2;
        pull = remaining ? { branch: release.pose.branch, dx: release.pose.dx * remaining, dy: release.pose.dy * remaining } : undefined;
        if (!remaining) release = undefined;
      }
      if (now - lastPaint >= (pull || release || bursts.length ? 32 : 80) || motion.matches) {
        draw((now - start) / 1000);
        lastPaint = now;
      }
      if ((!motion.matches && inView && !document.hidden) || release) frame = requestAnimationFrame(animate);
    }

    function syncAnimation() {
      cancelAnimationFrame(frame);
      draw(motion.matches ? 0 : (performance.now() - start) / 1000);
      if ((!motion.matches && inView && !document.hidden) || release) frame = requestAnimationFrame(animate);
    }

    function position(event: PointerEvent) {
      const rect = surface.getBoundingClientRect();
      return {
        x: (event.clientX - rect.left) * TREE_SIZE / rect.width,
        y: (event.clientY - rect.top) * TREE_SIZE / rect.height,
      };
    }

    function down(event: PointerEvent) {
      if (grab || !event.isPrimary || event.button !== 0) return;
      const point = position(event);
      const branch = pickTwig(point.x, point.y, variant);
      if (branch < 0 && !isCanopyPoint(point.x, point.y, variant)) return;
      release = undefined;
      pull = branch >= 0 ? { branch, dx: 0, dy: 0 } : undefined;
      grab = { pointer: event.pointerId, ...point, moved: false };
      surface.setPointerCapture(event.pointerId);
      surface.style.cursor = pull ? "grabbing" : "pointer";
    }

    function move(event: PointerEvent) {
      const { x, y } = position(event);
      if (!grab) {
        surface.style.cursor = pickTwig(x, y, variant) >= 0 ? "grab" : isCanopyPoint(x, y, variant) ? "pointer" : "";
        return;
      }
      if (grab.pointer !== event.pointerId) return;
      const dx = x - grab.x;
      const dy = y - grab.y;
      grab.moved ||= Math.hypot(dx, dy) >= 4;
      if (!grab.moved || !pull) return;
      const limit = Math.min(1, 18 / (Math.hypot(dx, dy) || 1));
      pull = { branch: pull.branch, dx: dx * limit, dy: dy * limit };
      if (performance.now() - lastPaint >= 24) {
        lastPaint = performance.now();
        draw((lastPaint - start) / 1000);
      }
    }

    function end(event: PointerEvent) {
      if (grab?.pointer !== event.pointerId) return;
      const point = position(event);
      if (event.type === "pointerup" && !grab.moved && !motion.matches
        && Math.hypot(point.x - grab.x, point.y - grab.y) < 4
        && isCanopyPoint(grab.x, grab.y, variant)) {
        bursts = [...bursts.slice(-9), { x: grab.x, y: grab.y, at: (performance.now() - start) / 1000, seed: ++burstSeed }];
      }
      grab = undefined;
      surface.style.cursor = "";
      if (pull && (pull.dx || pull.dy) && !motion.matches) release = { pose: pull, at: performance.now() };
      else pull = undefined;
      syncAnimation();
    }

    surface.addEventListener("pointerdown", down);
    surface.addEventListener("pointermove", move);
    surface.addEventListener("pointerup", end);
    surface.addEventListener("pointercancel", end);
    surface.addEventListener("lostpointercapture", end);

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      syncAnimation();
    });
    observer.observe(pixels.parentElement ?? pixels);
    motion.addEventListener("change", syncAnimation);
    document.addEventListener("visibilitychange", syncAnimation);
    syncAnimation();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      motion.removeEventListener("change", syncAnimation);
      document.removeEventListener("visibilitychange", syncAnimation);
      surface.removeEventListener("pointerdown", down);
      surface.removeEventListener("pointermove", move);
      surface.removeEventListener("pointerup", end);
      surface.removeEventListener("pointercancel", end);
      surface.removeEventListener("lostpointercapture", end);
      surface.style.cursor = "";
      pixels.hidden = false;
      webgl.hidden = true;
      texture.dispose();
      geometry.dispose();
      material.dispose();
      renderer?.dispose();
    };
  }, [variant]);

  return (
    <figure className={className} style={{ touchAction: "none" }} role="img" aria-label={`Pixel-art ${variant} tree. Tap the canopy to release ${variant === "green" ? "leaves" : "petals"} or drag a twig to bend it.`}>
      <canvas ref={pixelsRef} className="pixel-tree-canvas" width={TREE_SIZE * DISPLAY_SCALE} height={TREE_SIZE * DISPLAY_SCALE} aria-hidden="true" />
      <canvas ref={webglRef} className="pixel-tree-canvas" width={TREE_SIZE * DISPLAY_SCALE} height={TREE_SIZE * DISPLAY_SCALE} aria-hidden="true" hidden />
    </figure>
  );
}
