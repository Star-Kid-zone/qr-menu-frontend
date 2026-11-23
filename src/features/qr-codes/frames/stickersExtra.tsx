import React from "react";
import { QR_FRAME_VIEWBOX } from "@/constants/qrCodes.constants";
import type { QrFrameRenderProps } from "@/types";
import { FitText, polygonPoints, scallopCircle, sparkle, starPoints } from "./primitives";

/* A third set of sticker shapes on the 600 × 600 canvas; outside the shape stays transparent. */
const [W, H] = QR_FRAME_VIEWBOX.sticker;

function secondLine({ table, name, subline }: QrFrameRenderProps): string {
  return table || name || subline;
}

export function CloudSticker(p: QrFrameRenderProps) {
  const { colors: c, headline, qr } = p;
  return (
    <>
      <g fill={c.paper}>
        <circle cx={170} cy={320} r={130} />
        <circle cx={300} cy={240} r={160} />
        <circle cx={440} cy={310} r={130} />
        <circle cx={232} cy={410} r={108} />
        <circle cx={376} cy={410} r={108} />
        <rect x={120} y={330} width={360} height={188} rx={60} />
      </g>
      {qr(190, 160, 220, { radius: 18 })}
      <FitText x={300} y={448} text={headline} size={34} maxWidth={320} fill={c.accent} font="display" weight={800} caps />
      <FitText x={300} y={486} text={secondLine(p)} size={18} maxWidth={240} fill={c.accent} opacity={0.9} weight={600} />
    </>
  );
}

export function OctagonSticker(p: QrFrameRenderProps) {
  const { colors: c, headline, qr } = p;
  return (
    <>
      <polygon points={polygonPoints(300, 300, 296, 8, 22.5)} fill={c.paper} />
      <polygon points={polygonPoints(300, 300, 268, 8, 22.5)} fill="none" stroke={c.accent} strokeWidth={4} />
      {qr(178, 98, 244, { radius: 12 })}
      <FitText x={300} y={414} text={headline} size={40} maxWidth={360} fill={c.accent} font="display" weight={800} caps />
      <FitText x={300} y={458} text={secondLine(p)} size={20} maxWidth={300} fill={c.accent} opacity={0.9} weight={600} />
    </>
  );
}

export function CupSticker(p: QrFrameRenderProps) {
  const { colors: c, headline, qr } = p;
  return (
    <>
      <circle cx={486} cy={300} r={64} fill="none" stroke={c.paper} strokeWidth={30} />
      <g fill={c.paper}>
        <path d="M112 150 H488 L456 516 Q452 560 412 560 H188 Q148 560 144 516 Z" />
        <rect x={92} y={128} width={416} height={44} rx={22} />
      </g>
      <g fill="none" stroke={c.paper} strokeWidth={14} strokeLinecap="round">
        {[232, 300, 368].map((x) => <path key={x} d={`M${x} 112 q -22 -22 0 -46 t 0 -46`} />)}
      </g>
      <rect x={92} y={128} width={416} height={44} rx={22} fill={c.ink} opacity={0.12} />
      {qr(190, 190, 220, { radius: 14 })}
      <FitText x={300} y={466} text={headline} size={32} maxWidth={260} fill={c.accent} font="display" weight={800} caps />
      <FitText x={300} y={500} text={secondLine(p)} size={18} maxWidth={220} fill={c.accent} opacity={0.9} weight={600} />
    </>
  );
}

export function BlobSticker(p: QrFrameRenderProps) {
  const { colors: c, headline, qr } = p;
  const d = "M300 30 C 432 22 562 112 570 252 C 578 392 498 562 328 572 C 168 582 36 498 30 338 C 24 188 152 38 300 30 Z";
  return (
    <>
      <path d={d} fill={c.paper} />
      <path d={d} fill="none" stroke={c.accent} strokeWidth={3} strokeDasharray="0.1 10" strokeLinecap="round" transform="translate(300 300) scale(0.9) translate(-300 -300)" />
      {qr(180, 112, 240, { radius: 20 })}
      <FitText x={300} y={424} text={headline} size={36} maxWidth={360} fill={c.accent} font="display" weight={800} caps />
      <FitText x={300} y={466} text={secondLine(p)} size={20} maxWidth={300} fill={c.accent} opacity={0.9} weight={600} />
    </>
  );
}

export function RosetteSticker(p: QrFrameRenderProps) {
  const { colors: c, headline, qr } = p;
  const tails = ["236,372 304,410 254,594 226,558 186,576", "364,372 296,410 346,594 374,558 414,576"];
  return (
    <>
      {tails.map((pts) => (
        <g key={pts}>
          <polygon points={pts} fill={c.paper} />
          <polygon points={pts} fill={c.ink} opacity={0.18} />
        </g>
      ))}
      <path d={scallopCircle(300, 250, 232, 26, 18)} fill={c.paper} />
      <circle cx={300} cy={250} r={214} fill="none" stroke={c.accent} strokeWidth={3} strokeDasharray="0.1 9" strokeLinecap="round" />
      {qr(202, 118, 196, { radius: 12 })}
      <FitText x={300} y={360} text={headline} size={28} maxWidth={250} fill={c.accent} font="display" weight={800} caps />
      <FitText x={300} y={392} text={secondLine(p)} size={17} maxWidth={200} fill={c.accent} opacity={0.9} weight={600} />
    </>
  );
}

export function SunSticker(p: QrFrameRenderProps) {
  const { colors: c, headline, qr } = p;
  return (
    <>
      <polygon points={starPoints(300, 300, 296, 236, 18, -90)} fill={c.paper} />
      <circle cx={300} cy={300} r={226} fill={c.paper} />
      <circle cx={300} cy={300} r={206} fill="none" stroke={c.accent} strokeWidth={3} />
      {qr(192, 140, 216, { radius: 16 })}
      <FitText x={300} y={410} text={headline} size={32} maxWidth={300} fill={c.accent} font="display" weight={800} caps />
      <FitText x={300} y={448} text={secondLine(p)} size={18} maxWidth={240} fill={c.accent} opacity={0.9} weight={600} />
    </>
  );
}

export function PintSticker(p: QrFrameRenderProps) {
  const { colors: c, headline, qr } = p;
  const bubbles: [number, number, number][] = [[200, 520, 6], [226, 488, 4], [384, 530, 5], [404, 494, 3], [352, 548, 4]];
  return (
    <>
      <path d="M122 60 H478 L440 556 Q438 580 414 580 H186 Q162 580 160 556 Z" fill={c.paper} />
      <path d="M152 150 L178 540" stroke="#FFFFFF" strokeWidth={8} opacity={0.25} strokeLinecap="round" />
      <g fill="#FFF6E2">
        {[150, 210, 270, 330, 390, 450].map((x) => <circle key={x} cx={x} cy={62} r={36} />)}
        <rect x={118} y={62} width={364} height={58} />
        {[146, 194, 242, 290, 338, 386, 434].map((x, i) => <circle key={x} cx={x} cy={120} r={i % 2 === 0 ? 14 : 10} />)}
      </g>
      {bubbles.map(([x, y, r]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill={c.accent} opacity={0.35} />)}
      {qr(190, 150, 220, { radius: 12 })}
      <FitText x={300} y={434} text={headline} size={32} maxWidth={250} fill={c.accent} font="display" weight={800} caps />
      <FitText x={300} y={470} text={secondLine(p)} size={18} maxWidth={210} fill={c.accent} opacity={0.9} weight={600} />
    </>
  );
}

export function PhoneSticker(p: QrFrameRenderProps) {
  const { colors: c, headline, qr } = p;
  const corners: [number, number, number, number][] = [[170, 86, 1, 1], [430, 86, -1, 1], [170, 346, 1, -1], [430, 346, -1, -1]];
  return (
    <>
      <rect x={130} y={14} width={340} height={572} rx={50} fill={c.paper} />
      <rect x={150} y={70} width={300} height={430} rx={16} fill={c.accent} />
      <rect x={262} y={36} width={76} height={10} rx={5} fill={c.accent} opacity={0.6} />
      <circle cx={300} cy={540} r={20} fill="none" stroke={c.accent} strokeWidth={4} opacity={0.7} />
      {corners.map(([x, y, dx, dy]) => (
        <path key={`${x}-${y}`} d={`M${x} ${y + dy * 24} V${y} H${x + dx * 24}`} fill="none" stroke={c.paper} strokeWidth={4} strokeLinecap="round" />
      ))}
      {qr(180, 96, 240, { radius: 12 })}
      <FitText x={300} y={398} text={headline} size={28} maxWidth={260} fill={c.paper} font="display" weight={800} caps />
      <FitText x={300} y={434} text={secondLine(p)} size={17} maxWidth={240} fill={c.paper} opacity={0.85} weight={600} />
    </>
  );
}

export function LuggageTagSticker(p: QrFrameRenderProps) {
  const { uid, colors: c, headline, qr } = p;
  const mask = `${uid}-luggage`;
  return (
    <>
      <defs>
        <mask id={mask}>
          <rect width={W} height={H} fill="#fff" />
          <circle cx={88} cy={300} r={20} fill="#000" />
        </mask>
      </defs>
      <path d="M130 60 H550 Q572 60 572 82 V518 Q572 540 550 540 H130 L28 438 V162 Z" fill={c.paper} mask={`url(#${mask})`} />
      <circle cx={88} cy={300} r={30} fill="none" stroke={c.accent} strokeWidth={6} />
      <line x1={160} y1={90} x2={160} y2={510} stroke={c.accent} strokeWidth={2} strokeDasharray="6 6" opacity={0.6} />
      {qr(241, 90, 250, { radius: 12 })}
      <FitText x={366} y={410} text={headline} size={34} maxWidth={340} fill={c.accent} font="display" weight={800} caps />
      <FitText x={366} y={452} text={secondLine(p)} size={20} maxWidth={300} fill={c.accent} opacity={0.9} weight={600} />
    </>
  );
}

export function SquircleSticker(p: QrFrameRenderProps) {
  const { colors: c, headline, qr } = p;
  return (
    <>
      <rect x={20} y={20} width={560} height={560} rx={160} fill={c.paper} />
      <rect x={44} y={44} width={512} height={512} rx={138} fill="none" stroke={c.accent} strokeWidth={2} opacity={0.5} />
      <polygon points={sparkle(500, 120, 12)} fill={c.accent} />
      <polygon points={sparkle(102, 150, 8)} fill={c.accent} />
      {qr(160, 82, 280, { radius: 18 })}
      <FitText x={300} y={438} text={headline} size={40} maxWidth={420} fill={c.accent} font="display" weight={800} caps />
      <FitText x={300} y={484} text={secondLine(p)} size={22} maxWidth={380} fill={c.accent} opacity={0.9} weight={600} />
    </>
  );
}

export function ScrollSticker(p: QrFrameRenderProps) {
  const { colors: c, headline, qr } = p;
  return (
    <>
      <rect x={72} y={86} width={456} height={428} fill={c.paper} />
      {[54, 496].map((y) => (
        <g key={y}>
          <rect x={44} y={y} width={512} height={50} rx={25} fill={c.paper} />
          <rect x={44} y={y} width={512} height={50} rx={25} fill={c.ink} opacity={0.14} />
          <line x1={66} y1={y + 16} x2={534} y2={y + 16} stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" opacity={0.35} />
        </g>
      ))}
      <rect x={96} y={122} width={408} height={356} fill="none" stroke={c.accent} strokeWidth={2} opacity={0.6} />
      {qr(190, 134, 220, { radius: 8 })}
      <FitText x={300} y={410} text={headline} size={34} maxWidth={360} fill={c.accent} font="serif" weight={700} />
      <FitText x={300} y={448} text={secondLine(p)} size={20} maxWidth={320} fill={c.accent} opacity={0.9} weight={600} />
    </>
  );
}

export function SplitCircleSticker(p: QrFrameRenderProps) {
  const { colors: c, headline, qr } = p;
  return (
    <>
      <circle cx={300} cy={300} r={296} fill={c.paper} />
      <path d="M21.4 400 A296 296 0 0 0 578.6 400 Z" fill={c.accent} />
      <circle cx={300} cy={300} r={280} fill="none" stroke={c.accent} strokeWidth={2} opacity={0.4} />
      {qr(175, 112, 250, { radius: 14 })}
      <FitText x={300} y={466} text={headline} size={36} maxWidth={380} fill={c.paper} font="display" weight={800} caps />
      <FitText x={300} y={510} text={secondLine(p)} size={20} maxWidth={300} fill={c.paper} opacity={0.9} weight={600} />
    </>
  );
}
