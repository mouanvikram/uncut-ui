"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

function subscribeToTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

function getThemeSnapshot() {
  return document.documentElement.dataset.theme === "dark";
}

function getServerThemeSnapshot() {
  return false;
}

export function BrandLogo({ size = 40, className = "", priority = false }: { size?: number; className?: string; priority?: boolean }) {
  const isDark = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getServerThemeSnapshot);
  return (
    <Image
      className={cn("block shrink-0 object-contain object-center", className)}
      src={isDark ? "/uncut-ui-logo-dark.png" : "/uncut-ui-logo.png"}
      alt=""
      width={size}
      height={size}
      style={{ width: size, height: size }}
      priority={priority}
    />
  );
}
