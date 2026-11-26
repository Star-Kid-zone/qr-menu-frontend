"use client";

import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { PiEnvelopeSimpleBold, PiEyeSlashBold, PiTrendUpBold } from "react-icons/pi";
import { FeastOwlLogo } from "@/components/brand";
import { MenuScreen, Phone } from "@/features/marketing";
import { APP_NAME } from "@/constants/app.constants";
import { AUTH_SAMPLE_RESTAURANT as SAMPLE, AUTH_SCENE_SIZE, AUTH_STAGE_COPY, REGISTER_STEPS } from "@/constants/auth.constants";
import type { AuthStageVariant } from "@/types";
import { cn } from "@/utils/cn";
import { useAuthPreview } from "../../context/AuthPreviewContext";
import { usePointerTilt } from "../../hooks/usePointerTilt";
import { slugPreview } from "../../lib/authFormat";
import { ReviewCard, SiteAddress, SocialCard, StatChip, TableCard, WebsiteCard } from "./StageCards";

/*
 * The plum panel beside the sign-in forms: "the table, in layers". A printed
 * QR card at the front, then what a guest's scan opens and what the owner
 * runs, each card at its own depth. The scene tilts toward the mouse, so near
 * cards move more than far ones (parallax). It rests flat for reduced motion
 * and on the password-reset screen.
 */

interface Layer {
  key: string;
  x: number;
  y: number;
  /** Depth in px: positive is nearer the viewer. */
  z: number;
  rotate?: number;
  node: ReactNode;
}

function phone() {
  // The marketing phone is 17.5rem wide; shrink it for the scene.
  return (
    <div style={{ transform: "scale(0.6)", transformOrigin: "top left" }}>
      <Phone>
        <MenuScreen />
      </Phone>
    </div>
  );
}

function layersFor(variant: AuthStageVariant, name: string, address: ReactNode, tagline?: string): Layer[] {
  if (variant === "register") {
    return [
      { key: "social", x: 400, y: 0, z: -180, rotate: 3, node: <SocialCard /> },
      { key: "phone", x: 0, y: 30, z: -110, node: phone() },
      { key: "table", x: 440, y: 160, z: 50, rotate: 6, node: <TableCard name={name} /> },
      { key: "review", x: 10, y: 340, z: 90, rotate: -2, node: <ReviewCard /> },
      // The website is up front: it shows the name being typed in the form.
      { key: "website", x: 140, y: 80, z: 160, node: <WebsiteCard name={name} address={address} tagline={tagline} className="scale-110" /> },
    ];
  }
  if (variant === "reset") {
    return [
      { key: "phone", x: 230, y: 40, z: -40, node: phone() },
      { key: "table", x: 80, y: 130, z: 60, rotate: -7, node: <TableCard name={name} /> },
      {
        key: "code",
        x: 330,
        y: 340,
        z: 140,
        node: (
          <StatChip tone="saffron" icon={<PiEnvelopeSimpleBold className="size-3" aria-hidden />}>
            Your code arrives by email
          </StatChip>
        ),
      },
    ];
  }
  return [
    { key: "website", x: -40, y: 0, z: -150, rotate: -2, node: <WebsiteCard name={name} address={address} tagline={tagline} /> },
    { key: "social", x: 400, y: 0, z: -70, rotate: 3, node: <SocialCard /> },
    { key: "phone", x: 225, y: 95, z: 20, node: phone() },
    { key: "table", x: -10, y: 230, z: 110, rotate: -7, node: <TableCard name={name} /> },
    { key: "review", x: 350, y: 330, z: 170, rotate: 2, node: <ReviewCard /> },
    {
      key: "opens",
      x: 190,
      y: 440,
      z: 210,
      node: (
        <StatChip tone="leaf" icon={<PiTrendUpBold className="size-3" aria-hidden />}>
          142 menu opens today
        </StatChip>
      ),
    },
    {
      key: "soldout",
      x: 405,
      y: 250,
      z: 130,
      node: (
        <StatChip tone="mute" icon={<PiEyeSlashBold className="size-3" aria-hidden />}>
          Mutton biryani marked sold out
        </StatChip>
      ),
    },
  ];
}

/** Scale that fits the design-size scene inside the box, never larger than 1.15. */
function useFitScale(ref: RefObject<HTMLDivElement | null>): number {
  const [scale, setScale] = useState(0.85);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      if (width && height) setScale(Math.min(width / AUTH_SCENE_SIZE.width, height / AUTH_SCENE_SIZE.height, 1.15) * 0.88);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return scale;
}

export function AuthStage({ variant, className }: { variant: AuthStageVariant; className?: string }) {
  const reduce = useReducedMotion() ?? false;
  const { businessName } = useAuthPreview();
  const { rotateX, rotateY } = usePointerTilt(9, !reduce && variant !== "reset");
  const boxRef = useRef<HTMLDivElement>(null);
  const scale = useFitScale(boxRef);

  const typed = variant === "register" ? businessName.trim() : "";
  const name = typed || SAMPLE.name;
  const address = variant === "register" ? <SiteAddress {...slugPreview(typed)} /> : <SiteAddress base={SAMPLE.slug} />;
  const copy = AUTH_STAGE_COPY[variant];
  const layers = layersFor(variant, name, address, typed ? undefined : SAMPLE.tagline);

  return (
    <section
      aria-label={`About ${APP_NAME}`}
      className={cn("mkt relative flex-col overflow-hidden px-12 py-10 xl:px-16", className)}
      style={{
        background:
          "radial-gradient(60rem 40rem at 85% 15%, rgb(91 46 133 / 0.55), transparent 60%), radial-gradient(40rem 30rem at 10% 90%, rgb(242 179 61 / 0.12), transparent 60%), linear-gradient(160deg, var(--m-plum) 0%, var(--m-plum-deep) 100%)",
        color: "var(--m-on-plum)",
      }}
    >
      <Link href="/" className="relative z-10 self-start rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--m-saffron)]">
        <FeastOwlLogo tone="dark" className="text-2xl" markClassName="size-10" />
      </Link>

      {/* The scene (decorative) */}
      <div ref={boxRef} aria-hidden className="relative my-6 min-h-[18rem] flex-1" style={{ perspective: "1600px" }}>
        <motion.div
          className="absolute left-1/2 top-1/2"
          style={{
            width: AUTH_SCENE_SIZE.width,
            height: AUTH_SCENE_SIZE.height,
            x: "-50%",
            y: "-50%",
            scale,
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
            opacity: variant === "reset" ? 0.6 : 1,
          }}
        >
          {layers.map((layer, i) => (
            <div
              key={`${variant}-${layer.key}`}
              className="absolute"
              style={{
                left: layer.x,
                top: layer.y,
                transform: `translateZ(${layer.z}px) rotate(${layer.rotate ?? 0}deg)`,
                transformStyle: "preserve-3d",
              }}
            >
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.08 * i, ease: [0.23, 1, 0.32, 1] }}
              >
                <motion.div
                  animate={reduce ? undefined : { y: [0, -7, 0] }}
                  transition={reduce ? undefined : { duration: 5 + (i % 3), repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
                >
                  {layer.node}
                </motion.div>
              </motion.div>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="relative z-10 max-w-lg">
        <p className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color: "var(--m-saffron)" }}>
          {copy.eyebrow}
        </p>
        <h2 className="mkt-h2 mt-2 text-white" style={{ fontSize: "clamp(1.75rem, 1rem + 1.6vw, 2.5rem)" }}>
          {copy.heading}
        </h2>
        {variant === "register" ? (
          <ol className="mt-5 grid gap-3 xl:grid-cols-3">
            {REGISTER_STEPS.map((step, i) => (
              <li key={step.title} className="flex gap-3 xl:flex-col xl:gap-2">
                <span
                  className="flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                  style={{ background: "var(--m-saffron)", color: "var(--m-plum-deep)" }}
                >
                  {i + 1}
                </span>
                <span className="text-sm leading-snug">
                  <span className="block font-semibold text-white">{step.title}</span>
                  <span style={{ color: "var(--m-on-plum-mute)" }}>{step.body}</span>
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-3 text-base leading-7" style={{ color: "var(--m-on-plum-mute)" }}>
            {copy.body}
          </p>
        )}
      </div>
    </section>
  );
}
