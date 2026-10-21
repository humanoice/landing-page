"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { Arrow, CTA, META } from "@/components/apply-ui";
import { TrackedLink } from "@/components/track";
import { FLASH_SALE_CODE, FLASH_SALE_SEEN_KEY } from "@/lib/flash-sale";
import type { HomeDictionary } from "@/lib/i18n";

type FlashSalePopupProps = {
  copy: HomeDictionary["flashSale"];
  /** Where "claim" leads. Omit on /apply: the code is already in the form, so the CTA just closes. */
  applyHref?: string;
};

/**
 * The Flash Sale poster in a modal, once per visitor — whichever page they land
 * on first. A native <dialog>, so Escape, focus and the backdrop come for free.
 */
export function FlashSalePopup({ copy, applyHref }: FlashSalePopupProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    try {
      if (localStorage.getItem(FLASH_SALE_SEEN_KEY)) return;
      localStorage.setItem(FLASH_SALE_SEEN_KEY, "1");
    } catch {
      // Storage blocked (private mode, cookies off): show it, but only on this page load.
    }
    ref.current?.showModal();
  }, []);

  const close = () => ref.current?.close();

  const poster = (
    <Image
      src="/humanoice-flash-sale-50.png"
      alt={copy.alt}
      width={1080}
      height={1080}
      sizes="(max-width: 640px) 92vw, 30rem"
      className="block h-auto w-full"
    />
  );

  return (
    <dialog
      ref={ref}
      aria-label={copy.label}
      // Preflight zeroes every margin, so the dialog's own centring has to come back.
      className="m-auto w-[min(92vw,30rem,calc(100dvh-11rem))] overflow-visible bg-transparent p-0 backdrop:bg-ink/60"
      // A click on the backdrop lands on the dialog itself, never on the card.
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div
        className="pop-in relative rounded-3xl border-[3px] border-ink bg-cream shadow-[10px_10px_0_0_var(--yellow-main)]"
        style={{ "--rot": "0deg" } as React.CSSProperties}
      >
        <button
          type="button"
          onClick={close}
          aria-label={copy.close}
          className="absolute -right-3 -top-3 z-10 grid size-9 place-items-center rounded-full border-2 border-ink bg-cream text-ink shadow-[3px_3px_0_0_var(--ink)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            className="rotate-45"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>

        <div className="overflow-hidden rounded-t-[1.3rem] border-b-[3px] border-ink">
          {applyHref ? (
            <TrackedLink
              href={applyHref}
              event="apply_click"
              params={{ location: "flash_sale_poster" }}
              onClick={close}
              tabIndex={-1}
            >
              {poster}
            </TrackedLink>
          ) : (
            poster
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-6">
          <p className={`${META} text-crimson`}>
            {applyHref ? copy.note : copy.applied}{" "}
            <span className="text-ink">{FLASH_SALE_CODE}</span>
          </p>
          {applyHref ? (
            <TrackedLink
              href={applyHref}
              event="apply_click"
              params={{ location: "flash_sale" }}
              onClick={close}
              className={CTA}
            >
              {copy.cta}
              <Arrow />
            </TrackedLink>
          ) : (
            <button type="button" onClick={close} className={CTA}>
              {copy.ok}
              <Arrow />
            </button>
          )}
        </div>
      </div>
    </dialog>
  );
}
