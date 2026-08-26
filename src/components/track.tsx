"use client";

import Link from "next/link";
import { sendGAEvent } from "@next/third-parties/google";
import type { ComponentProps, MouseEvent } from "react";

/** Flat payload sent alongside a GA4 event. Nested objects are not supported. */
export type EventParams = Record<string, string | number | boolean | undefined>;

/**
 * Report a GA4 event.
 *
 * gtag.js only mounts in production (see `layout.tsx`), so gate here too —
 * otherwise every click in dev logs "GA has not been initialized".
 */
export function track(event: string, params?: EventParams) {
  if (process.env.NODE_ENV !== "production") return;
  sendGAEvent("event", event, params ?? {});
}

type TrackingProps = { event: string; params?: EventParams };

/**
 * Internal navigation that reports a GA event on click. Client-side routing
 * keeps the page alive, so the beacon always has time to leave.
 */
export function TrackedLink({
  event,
  params,
  onClick,
  ...props
}: TrackingProps & ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
        track(event, params);
        onClick?.(e);
      }}
    />
  );
}

/**
 * Outbound link (LINE, Airtable…) that reports a GA event on click. Every
 * caller opens in a new tab, so the current document survives the send.
 */
export function TrackedAnchor({
  event,
  params,
  onClick,
  ...props
}: TrackingProps & ComponentProps<"a">) {
  return (
    <a
      {...props}
      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
        track(event, params);
        onClick?.(e);
      }}
    />
  );
}
