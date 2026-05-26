import { Fragment } from "react";

type MarqueeProps = {
  items: string[];
  reverse?: boolean;
  /** css duration, e.g. "32s" */
  speed?: string;
  /** separator glyph between items */
  sep?: string;
  className?: string;
  itemClassName?: string;
  sepClassName?: string;
};

/**
 * Seamless infinite ticker. Renders the item list twice and translates the
 * track by -50% so the loop is gap-free. Pauses on hover.
 */
export function Marquee({
  items,
  reverse = false,
  speed = "34s",
  sep = "✦",
  className = "",
  itemClassName = "",
  sepClassName = "",
}: MarqueeProps) {
  const group = (
    <div className="flex shrink-0 items-center">
      {items.map((item, i) => (
        <Fragment key={i}>
          <span className={itemClassName}>{item}</span>
          <span className={`px-6 ${sepClassName}`} aria-hidden>
            {sep}
          </span>
        </Fragment>
      ))}
    </div>
  );

  return (
    <div className={`marquee-host overflow-hidden ${className}`}>
      <div
        className={`marquee ${reverse ? "marquee--rev" : ""}`}
        style={{ "--speed": speed } as React.CSSProperties}
      >
        {group}
        <div aria-hidden className="contents">
          {group}
        </div>
      </div>
    </div>
  );
}
