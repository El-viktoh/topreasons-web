"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const clampClasses: Record<number, string> = {
  2: "line-clamp-2",
  3: "line-clamp-3",
  4: "line-clamp-4",
};

interface ExpandableTextProps {
  text: string;
  className?: string;
  wrapperClassName?: string;
  clampLines?: 2 | 3 | 4;
  buttonClassName?: string;
}

/**
 * Shows a clamped preview of long copy on mobile with a "Read more" toggle.
 * From `sm` up, the full text is always shown and the toggle is hidden —
 * this only simplifies the small-screen view, nothing is removed.
 */
export function ExpandableText({ text, className, wrapperClassName, clampLines = 3, buttonClassName }: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={wrapperClassName}>
      <p className={cn(className, !expanded && clampClasses[clampLines], "sm:line-clamp-none")}>
        {text}
      </p>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className={cn(
          "sm:hidden mt-2 text-primary text-xs font-bold uppercase tracking-widest underline underline-offset-4",
          buttonClassName
        )}
      >
        {expanded ? "Read less" : "Read more"}
      </button>
    </div>
  );
}
