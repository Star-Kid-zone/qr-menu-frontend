import type { ReactNode } from "react";
import { PiForkKnife, PiQrCode, PiShareNetwork, PiStar, PiStorefront } from "react-icons/pi";
import { APP_NAME } from "@/constants/app.constants";
import { AUTH_FEATURE_STRIP } from "@/constants/auth.constants";
import type { AuthFeatureKey } from "@/types";
import { cn } from "@/utils/cn";

function iconFor(key: AuthFeatureKey): ReactNode {
  const props = { className: "size-5", "aria-hidden": true } as const;
  switch (key) {
    case "menu":
      return <PiForkKnife {...props} />;
    case "website":
      return <PiStorefront {...props} />;
    case "reviews":
      return <PiStar {...props} />;
    case "social":
      return <PiShareNetwork {...props} />;
    case "qr":
      return <PiQrCode {...props} />;
  }
}

/**
 * Phones and tablets: the desktop scene, flattened into cards you swipe
 * sideways. Sits under the form so it never pushes the form down.
 */
export function FeatureStrip({ className }: { className?: string }) {
  return (
    <section aria-labelledby="feature-strip-title" className={cn("-mx-4 sm:-mx-6", className)}>
      <h2 id="feature-strip-title" className="px-4 text-caption font-semibold uppercase tracking-wider text-muted-foreground sm:px-6">
        What you get with {APP_NAME}
      </h2>
      <ul
        className="mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:px-6 [&::-webkit-scrollbar]:hidden"
        tabIndex={0}
        aria-label="Features, scroll sideways for more"
      >
        {AUTH_FEATURE_STRIP.map((item) => (
          <li key={item.key} className="w-[15rem] shrink-0 snap-start rounded-xl border border-border bg-card p-4">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">{iconFor(item.key)}</span>
            <p className="mt-3 text-body-medium text-foreground">{item.title}</p>
            <p className="mt-1 text-caption leading-relaxed text-muted-foreground">{item.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
