import React from "react";
import { QR_FRAME_VIEWBOX } from "@/constants/qrCodes.constants";
import type { QrFrameRenderProps } from "@/types";
import { FitText, polygonPoints } from "./primitives";

/* More sticker shapes on the 600 × 600 canvas; outside the shape stays transparent. */
const [W, H] = QR_FRAME_VIEWBOX.sticker;

function second({ table, name, subline }: QrFrameRenderProps): string {
  return table || name || subline;
}

export function HeartSticker(p: QrFrameRenderProps) {
  const { colors: c, headline, qr } = p;
  return (
    <>
      <path d="M300 572 C 120 452 16 336 16 200 C 16 96 98 26 190 26 C 240 26 280 56 300 98 C 320 56 360 26 410 26 C 502 26 584 96 584 200 C 584 336 480 452 300 572 Z" fill={c.paper} />
      {qr(190, 128, 220, { radius: 18 })}
      <FitText x={300} y={412} text={headline} size={34} maxWidth={300} fill={c.accent} font="display" weight={800} caps />
      <FitText x={300} y={446} text={second(p)} size={18} maxWidth={190} fill={c.accent} opacity={0.9} weight={600} />
    </>
  );
}

export function HexSticker(p: QrFrameRenderProps) {
  const { colors: c, headline, qr } = p;
  return (
    <>
      <polygon points={polygonPoints(300, 300, 296, 6)} fill={c.paper} />
      <polygon points={polygonPoints(300, 300, 268, 6)} fill="none" stroke={c.accent} strokeWidth={3} />
      {qr(175, 110, 250, { radius: 16 })}
      <FitText x={300} y={430} text={headline} size={36} maxWidth={330} fill={c.accent} font="display" weight={800} caps />
      <FitText x={300} y={472} text={second(p)} size={20} maxWidth={260} fill={c.accent} opacity={0.9} weight={600} />
    </>
  );
}

export function ArchSticker(p: QrFrameRenderProps) {
  const { colors: c, headline, qr } = p;
  return (
    <>
      <path d="M40 592 V300 A260 260 0 0 1 560 300 V592 Z" fill={c.paper} />
      <path d="M60 572 V300 A240 240 0 0 1 540 300 V572 Z" fill="none" stroke={c.accent} strokeWidth={3} />
      {qr(170, 130, 260, { radius: 20 })}
      <FitText x={300} y={460} text={headline} size={38} maxWidth={420} fill={c.accent} font="serif" weight={700} />
      <FitText x={300} y={506} text={second(p)} size={22} maxWidth={380} fill={c.accent} opacity={0.9} weight={600} />
    </>
  );
}

export function FlowerSticker(p: QrFrameRenderProps) {
  const { colors: c, headline, qr } = p;
  return (
    <>
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2;
        return <circle key={i} cx={300 + Math.cos(a) * 204} cy={300 + Math.sin(a) * 204} r={92} fill={c.paper} />;
      })}
      <circle cx={300} cy={300} r={226} fill={c.paper} />
      <circle cx={300} cy={300} r={214} fill="none" stroke={c.accent} strokeWidth={4} strokeDasharray="0.1 10" strokeLinecap="round" />
      {qr(185, 132, 230, { radius: 18 })}
      <FitText x={300} y={418} text={headline} size={32} maxWidth={300} fill={c.accent} font="display" weight={800} caps />
      <FitText x={300} y={456} text={second(p)} size={20} maxWidth={230} fill={c.accent} opacity={0.9} weight={600} />
    </>
  );
}

export function ShieldSticker(p: QrFrameRenderProps) {
  const { colors: c, headline, qr } = p;
  return (
    <>
      <path d="M60 36 H540 V280 Q540 482 300 574 Q60 482 60 280 Z" fill={c.paper} />
      <path d="M84 60 H516 V280 Q516 464 300 548 Q84 464 84 280 Z" fill="none" stroke={c.accent} strokeWidth={3} />
      {qr(180, 86, 240, { radius: 14 })}
      <FitText x={300} y={384} text={headline} size={36} maxWidth={380} fill={c.accent} font="display" weight={800} caps spacing={1} />
      <FitText x={300} y={428} text={second(p)} size={20} maxWidth={300} fill={c.accent} opacity={0.9} weight={600} />
    </>
  );
}

export function LabelSticker(p: QrFrameRenderProps) {
  const { colors: c, headline, qr } = p;
  return (
    <>
      <rect x={60} y={40} width={480} height={510} rx={40} fill={c.paper} />
      {qr(155, 74, 290, { radius: 18 })}
      <polygon points="14,404 84,404 84,474 14,474 36,439" fill={c.accent} />
      <polygon points="586,404 516,404 516,474 586,474 564,439" fill={c.accent} />
      <rect x={64} y={388} width={472} height={74} fill={c.accent} />
      <FitText x={300} y={437} text={headline} size={34} maxWidth={420} fill={c.paper} font="display" weight={800} caps />
      <FitText x={300} y={512} text={second(p)} size={22} maxWidth={400} fill={c.ink} opacity={0.85} weight={600} />
    </>
  );
}

export function PriceTagSticker(p: QrFrameRenderProps) {
  const { uid, colors: c, headline, qr } = p;
  const mask = `${uid}-pricetag`;
  return (
    <>
      <defs>
        <mask id={mask}>
          <rect width={W} height={H} fill="#fff" />
          <circle cx={96} cy={300} r={18} fill="#000" />
        </mask>
      </defs>
      <path d="M140 40 H556 Q580 40 580 64 V536 Q580 560 556 560 H140 L20 300 Z" fill={c.paper} mask={`url(#${mask})`} />
      <circle cx={96} cy={300} r={28} fill="none" stroke={c.accent} strokeWidth={3} />
      {qr(220, 70, 280, { radius: 14 })}
      <FitText x={360} y={420} text={headline} size={36} maxWidth={380} fill={c.accent} font="display" weight={800} caps />
      <FitText x={360} y={466} text={second(p)} size={22} maxWidth={360} fill={c.accent} opacity={0.9} weight={600} />
    </>
  );
}

export function DiamondSticker(p: QrFrameRenderProps) {
  const { colors: c, headline, qr } = p;
  return (
    <>
      <polygon points="300,6 594,300 300,594 6,300" fill={c.paper} />
      <polygon points="300,40 560,300 300,560 40,300" fill="none" stroke={c.accent} strokeWidth={3} />
      {qr(196, 150, 208, { radius: 10 })}
      <FitText x={300} y={410} text={headline} size={28} maxWidth={250} fill={c.accent} font="display" weight={800} caps />
      <FitText x={300} y={444} text={second(p)} size={17} maxWidth={180} fill={c.accent} opacity={0.9} weight={600} />
    </>
  );
}

export function RingSticker(p: QrFrameRenderProps) {
  const { colors: c, headline, qr } = p;
  return (
    <>
      <circle cx={300} cy={300} r={296} fill={c.paper} />
      <circle cx={300} cy={300} r={280} fill="none" stroke={c.accent} strokeWidth={2} />
      {Array.from({ length: 48 }, (_, i) => {
        const a = (i / 48) * Math.PI * 2;
        return <circle key={i} cx={300 + Math.cos(a) * 262} cy={300 + Math.sin(a) * 262} r={i % 4 === 0 ? 4 : 2} fill={c.accent} />;
      })}
      {qr(160, 120, 280, { radius: 20 })}
      <FitText x={300} y={452} text={headline} size={30} maxWidth={300} fill={c.ink} font="display" weight={700} />
      <FitText x={300} y={488} text={second(p)} size={18} maxWidth={230} fill={c.accent} weight={600} />
    </>
  );
}

export function TicketSticker(p: QrFrameRenderProps) {
  const { uid, colors: c, headline, qr } = p;
  const mask = `${uid}-tix`;
  return (
    <>
      <defs>
        <mask id={mask}>
          <rect width={W} height={H} fill="#fff" />
          <circle cx={318} cy={130} r={20} fill="#000" />
          <circle cx={318} cy={470} r={20} fill="#000" />
        </mask>
      </defs>
      <rect x={14} y={130} width={572} height={340} rx={26} fill={c.paper} mask={`url(#${mask})`} />
      <line x1={318} y1={160} x2={318} y2={440} stroke={c.accent} strokeWidth={3} strokeDasharray="8 8" />
      {qr(46, 162, 244, { radius: 14 })}
      <FitText x={452} y={290} text={headline} size={34} maxWidth={230} fill={c.accent} font="display" weight={800} caps />
      <FitText x={452} y={334} text={second(p)} size={22} maxWidth={220} fill={c.accent} opacity={0.9} weight={600} />
    </>
  );
}
