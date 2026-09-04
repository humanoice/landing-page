"use client";

import { useEffect, useRef, useState } from "react";

type HeroReelProps = {
  /** Describes the footage for screen readers. */
  alt: string;
  className?: string;
};

/**
 * The bench window: real workshop footage in a straight-standing portal.
 * Everything else in the hero is a tilted sticker; this one is evidence,
 * so it doesn't tilt.
 *
 * Plays only when it is both on screen and motion is welcome — otherwise the
 * poster frame stands in. A chip holds the frame until there are real pixels
 * to show, so a slow connection sees a signal rather than an empty black box.
 */
export function HeroReel({ alt, className = "" }: HeroReelProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [waiting, setWaiting] = useState(true);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    // React sets `muted` as a property, not an attribute; autoplay policies
    // check the property, so make sure it is set before we ever call play().
    video.muted = true;

    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    let onScreen = false;

    /** Nothing more to wait for — either it's playing, or the poster is the answer. */
    const settle = () => setWaiting(false);

    const sync = () => {
      // Reduced motion: the poster is the finished state, so never keep waiting.
      if (calm.matches) {
        video.pause();
        settle();
        return;
      }
      if (!onScreen) {
        video.pause();
        return;
      }
      // Autoplay refused is also a settled state — the poster stands in.
      void video.play().catch(settle);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { threshold: 0.15 },
    );

    observer.observe(video);
    video.addEventListener("playing", settle);
    calm.addEventListener("change", sync);

    return () => {
      observer.disconnect();
      video.removeEventListener("playing", settle);
      calm.removeEventListener("change", sync);
    };
  }, []);

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border-[3px] border-ink bg-ink shadow-[12px_12px_0_0_var(--yellow-main)] ${className}`}
    >
      <video
        ref={ref}
        className="block aspect-[9/16] w-full object-cover"
        poster="/hero-loop-poster.webp"
        preload="metadata"
        muted
        loop
        playsInline
        disablePictureInPicture
        aria-label={alt}
        src="/hero-loop.mp4"
      />

      {waiting && (
        <span
          aria-hidden
          className="reel-waiting pointer-events-none absolute inset-0 grid place-items-center"
        >
          <span className="flex items-center gap-1.5 rounded-full border-2 border-ink bg-yellow-main px-3 py-2 shadow-[3px_3px_0_0_var(--ink)]">
            <span className="tick block size-2 bg-ink" />
            <span
              className="tick block size-2 bg-ink"
              style={{ animationDelay: "0.15s" }}
            />
            <span
              className="tick block size-2 bg-ink"
              style={{ animationDelay: "0.3s" }}
            />
          </span>
        </span>
      )}
    </div>
  );
}
