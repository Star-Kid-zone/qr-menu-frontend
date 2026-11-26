import { cn } from "@/utils/cn";
import { BRAND_COLORS } from "@/constants/brand.constants";
import { OwlMark } from "./OwlMark";

interface FeastOwlLogoProps {
  /**
   * light: on light backgrounds · dark: on dark backgrounds or photos ·
   * auto: follows the app's light/dark mode.
   */
  tone?: "light" | "dark" | "auto";
  className?: string;
  /** Size of the owl; the wordmark scales with the text size set on `className`. */
  markClassName?: string;
}

/** Owl mark + "FeastOwl" wordmark in Fraunces, with "Owl" in the brand colour. */
export function FeastOwlLogo({ tone = "light", className, markClassName = "size-8" }: FeastOwlLogoProps) {
  const mark =
    tone === "auto" ? (
      <>
        <OwlMark variant="color" className={cn(markClassName, "dark:hidden")} />
        <OwlMark variant="reversed" className={cn(markClassName, "hidden dark:block")} />
      </>
    ) : (
      <OwlMark variant={tone === "dark" ? "reversed" : "color"} className={markClassName} />
    );

  const owlStyle =
    tone === "auto" ? undefined : { color: tone === "dark" ? BRAND_COLORS.saffron : BRAND_COLORS.aubergine };

  return (
    <span className={cn("inline-flex items-center gap-2 text-xl", className)}>
      {mark}
      <span className="font-serif font-bold leading-none tracking-tight" style={{ fontVariationSettings: '"SOFT" 100' }}>
        Feast<span className={tone === "auto" ? "text-primary" : undefined} style={owlStyle}>Owl</span>
      </span>
    </span>
  );
}
