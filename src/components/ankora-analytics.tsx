"use client";

import Script from "next/script";
import { useSyncExternalStore } from "react";

const trackedHostname = "uncut-ui.mouan.in";
const subscribe = () => () => {};
const isTrackedSite = () => window.location.hostname === trackedHostname;
const serverSnapshot = () => false;

export function AnkoraAnalytics() {
  const enabled = useSyncExternalStore(subscribe, isTrackedSite, serverSnapshot);
  if (!enabled) return null;

  return (
    <Script
      src="https://ankora.mouan.in/sdk.js"
      data-domain={trackedHostname}
      strategy="afterInteractive"
    />
  );
}
