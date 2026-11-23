import React from "react";
import { QR_FRAME_VIEWBOX } from "@/constants/qrCodes.constants";
import type { QrFrameRenderProps } from "@/types";
import { FitText, Paper, Pill, seeded, sparkle, starPoints } from "./primitives";

/* Portrait cards (600 × 846) that suit any business: modern, playful and print-inspired. */
const [W, H] = QR_FRAME_VIEWBOX.card;

export function ViewfinderCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  const corners: [number, number, number, number][] = [
    [126, 226, 1, 1], [474, 226, -1, 1], [126, 574, 1, -1], [474, 574, -1, -1],
  ];
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      <FitText x={300} y={138} text={name} size={32} maxWidth={460} fill={c.ink} font="display" weight={700} caps spacing={4} />
      <line x1={282} y1={164} x2={318} y2={164} stroke={c.accent} strokeWidth={3} strokeLinecap="round" />
      {corners.map(([x, y, dx, dy]) => (
        <path key={`${x}${y}`} d={`M ${x} ${y + dy * 54} V ${y} H ${x + dx * 54}`} fill="none" stroke={c.accent} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
      ))}
      {qr(150, 250, 300, { radius: 10 })}
      <FitText x={300} y={652} text={headline} size={40} maxWidth={480} fill={c.ink} font="display" weight={700} />
      <FitText x={300} y={694} text={subline} size={20} maxWidth={460} fill={c.ink} opacity={0.7} />
      <Pill cx={300} cy={768} text={table} fill={c.ink} color={c.paper} size={20} />
    </>
  );
}

export function GeoCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      <circle cx={60} cy={60} r={120} fill={c.accent} />
      <polygon points="600,0 600,170 430,0" fill={c.ink} opacity={0.88} />
      <circle cx={522} cy={232} r={16} fill={c.accent} />
      <path d="M600 846 V676 A170 170 0 0 0 430 846 Z" fill={c.accent} />
      <circle cx={0} cy={760} r={74} fill={c.ink} opacity={0.88} />
      {[0, 1, 2].map((i) => (
        <line key={i} x1={52} y1={330 + i * 18} x2={104} y2={330 + i * 18} stroke={c.accent} strokeWidth={6} strokeLinecap="round" />
      ))}
      <FitText x={300} y={206} text={name} size={38} maxWidth={340} fill={c.ink} font="display" weight={800} />
      {qr(155, 236, 290, { radius: 0 })}
      <FitText x={300} y={596} text={headline} size={40} maxWidth={420} fill={c.ink} font="display" weight={800} />
      <FitText x={300} y={636} text={subline} size={20} maxWidth={400} fill={c.ink} opacity={0.72} />
      <Pill cx={300} cy={696} text={table} fill={c.ink} color={c.paper} size={20} />
    </>
  );
}

export function PolaroidCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      <Pill cx={300} cy={58} text={table} fill={c.ink} color={c.paper} size={20} />
      <g transform="rotate(-2.5 300 400)">
        <rect x={78} y={118} width={460} height={556} fill={c.ink} opacity={0.14} />
        <rect x={70} y={110} width={460} height={556} fill="#FFFFFF" />
        {qr(110, 150, 380, { radius: 2 })}
        <FitText x={300} y={608} text={headline} size={36} maxWidth={400} fill="#2A2420" font="serif" weight={500} italic />
        <rect x={232} y={92} width={136} height={38} fill={c.accent} opacity={0.6} transform="rotate(4 300 111)" />
      </g>
      <FitText x={300} y={752} text={name} size={36} maxWidth={480} fill={c.ink} font="serif" weight={700} />
      <FitText x={300} y={792} text={subline} size={20} maxWidth={460} fill={c.ink} opacity={0.72} />
    </>
  );
}

export function PostcardCard({ uid, colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  const air = `${uid}-air`;
  return (
    <>
      <defs>
        <pattern id={air} width={56} height={56} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width={56} height={56} fill={c.paper} />
          <rect width={14} height={56} fill={c.accent} />
          <rect x={28} width={14} height={56} fill={c.ink} />
        </pattern>
      </defs>
      <Paper w={W} h={H} fill={c.paper} />
      <rect x={14} y={14} width={572} height={818} fill="none" stroke={`url(#${air})`} strokeWidth={28} />
      <rect x={440} y={58} width={100} height={120} fill={c.accent} />
      <rect x={440} y={58} width={100} height={120} fill="none" stroke={c.paper} strokeWidth={6} strokeDasharray="0.1 12" strokeLinecap="round" />
      <rect x={454} y={72} width={72} height={92} fill="none" stroke={c.paper} strokeWidth={2} />
      <polygon points={starPoints(490, 118, 22)} fill={c.paper} />
      <g fill="none" stroke={c.ink} opacity={0.45} strokeWidth={2}>
        <circle cx={392} cy={120} r={42} />
        <circle cx={392} cy={120} r={32} />
        <path d="M330 104 q 15 -8 30 0 t 30 0 t 30 0 M330 136 q 15 -8 30 0 t 30 0 t 30 0" />
      </g>
      <FitText x={64} y={112} text={name} size={34} maxWidth={250} fill={c.ink} font="serif" weight={700} italic anchor="start" />
      <FitText x={64} y={150} text={table} size={20} maxWidth={250} fill={c.accent} font="display" weight={700} anchor="start" caps spacing={2} />
      {qr(155, 226, 290, { radius: 6 })}
      <FitText x={300} y={598} text={headline} size={40} maxWidth={440} fill={c.ink} font="serif" weight={700} />
      <FitText x={300} y={638} text={subline} size={20} maxWidth={420} fill={c.ink} opacity={0.72} />
      {[680, 712, 744].map((y) => (
        <line key={y} x1={130} y1={y} x2={470} y2={y} stroke={c.ink} strokeWidth={1.5} opacity={0.2} />
      ))}
    </>
  );
}

export function RibbonCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      <rect x={30} y={30} width={540} height={786} rx={8} fill="none" stroke={c.accent} strokeWidth={2} />
      <FitText x={300} y={112} text={name} size={38} maxWidth={460} fill={c.ink} font="serif" weight={700} />
      <polygon points={starPoints(240, 144, 8)} fill={c.accent} />
      <polygon points={starPoints(300, 144, 10)} fill={c.accent} />
      <polygon points={starPoints(360, 144, 8)} fill={c.accent} />
      {qr(155, 178, 290, { radius: 14 })}
      <polygon points="20,530 92,530 92,604 20,604 44,567" fill={c.accent} />
      <polygon points="580,530 508,530 508,604 580,604 556,567" fill={c.accent} />
      <polygon points="72,584 92,584 92,604" fill={c.ink} opacity={0.35} />
      <polygon points="528,584 508,584 508,604" fill={c.ink} opacity={0.35} />
      <rect x={72} y={510} width={456} height={74} fill={c.accent} />
      <FitText x={300} y={559} text={headline} size={34} maxWidth={410} fill={c.paper} font="display" weight={800} caps spacing={1} />
      <FitText x={300} y={662} text={subline} size={22} maxWidth={460} fill={c.ink} opacity={0.75} font="text" italic />
      <Pill cx={300} cy={730} text={table} fill={c.ink} color={c.paper} size={20} />
    </>
  );
}

export function TerrazzoCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  const rand = seeded(7);
  const chips = Array.from({ length: 110 }, (_, i) => {
    const x = rand() * W;
    const y = rand() * H;
    const r = 6 + rand() * 14;
    const sides = 3 + Math.floor(rand() * 3);
    const pts = Array.from({ length: sides }, (_, k) => {
      const a = (k / sides) * Math.PI * 2 + rand() * 0.8;
      const rr = r * (0.6 + rand() * 0.5);
      return `${(x + Math.cos(a) * rr).toFixed(1)},${(y + Math.sin(a) * rr).toFixed(1)}`;
    }).join(" ");
    const fill = i % 3 === 0 ? c.ink : c.accent;
    return <polygon key={i} points={pts} fill={fill} opacity={i % 3 === 0 ? 0.55 : 0.85} />;
  });
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      {chips}
      <rect x={70} y={78} width={460} height={690} rx={26} fill={c.paper} />
      <FitText x={300} y={178} text={name} size={38} maxWidth={400} fill={c.ink} font="display" weight={700} />
      {qr(160, 212, 280, { radius: 18 })}
      <FitText x={300} y={572} text={headline} size={40} maxWidth={420} fill={c.ink} font="display" weight={700} />
      <FitText x={300} y={612} text={subline} size={20} maxWidth={400} fill={c.ink} opacity={0.72} />
      <Pill cx={300} cy={680} text={table} fill={c.accent} color={c.paper} size={20} />
    </>
  );
}

export function RetroCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  const arcs = [
    { r: 214, color: c.accent, opacity: 1 },
    { r: 178, color: c.ink, opacity: 0.85 },
    { r: 142, color: c.accent, opacity: 0.55 },
  ];
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      {arcs.map((a) => (
        <path key={a.r} d={`M ${300 - a.r} ${H} A ${a.r} ${a.r} 0 0 1 ${300 + a.r} ${H}`} fill="none" stroke={a.color} strokeWidth={30} opacity={a.opacity} />
      ))}
      <circle cx={300} cy={H} r={96} fill={c.accent} opacity={0.9} />
      <FitText x={300} y={108} text={name} size={40} maxWidth={480} fill={c.ink} font="display" weight={800} />
      {qr(160, 140, 280, { radius: 28 })}
      <FitText x={300} y={490} text={headline} size={42} maxWidth={480} fill={c.ink} font="display" weight={800} />
      <FitText x={300} y={530} text={subline} size={20} maxWidth={460} fill={c.ink} opacity={0.75} />
      <Pill cx={300} cy={586} text={table} fill={c.ink} color={c.paper} size={20} />
    </>
  );
}

export function NewspaperCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  const rand = seeded(11);
  const bars = (x: number, width: number, y0: number, y1: number) =>
    Array.from({ length: Math.floor((y1 - y0) / 16) }, (_, i) => {
      const w = width * (0.55 + rand() * 0.45);
      return <rect key={`${x}-${i}`} x={x} y={y0 + i * 16} width={w} height={6} fill={c.ink} opacity={0.16} />;
    });
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      <FitText x={300} y={112} text={name || "The Menu"} size={58} maxWidth={520} fill={c.ink} font="serif" weight={800} />
      <line x1={40} y1={136} x2={560} y2={136} stroke={c.ink} strokeWidth={3} />
      <line x1={40} y1={143} x2={560} y2={143} stroke={c.ink} strokeWidth={1} />
      <FitText x={40} y={166} text={table} size={16} maxWidth={250} fill={c.ink} font="serif" weight={700} anchor="start" caps spacing={2} />
      <line x1={40} y1={178} x2={560} y2={178} stroke={c.ink} strokeWidth={1} />
      <FitText x={300} y={238} text={headline} size={46} maxWidth={520} fill={c.ink} font="serif" weight={800} />
      {bars(40, 108, 280, 540)}
      {bars(452, 108, 280, 540)}
      <rect x={162} y={272} width={276} height={276} fill="none" stroke={c.ink} strokeWidth={1.5} />
      {qr(170, 280, 260, { radius: 0 })}
      <FitText x={300} y={590} text={subline} size={22} maxWidth={500} fill={c.ink} font="text" italic opacity={0.85} />
      <line x1={40} y1={620} x2={560} y2={620} stroke={c.ink} strokeWidth={1} />
      <line x1={213} y1={636} x2={213} y2={790} stroke={c.ink} strokeWidth={1} opacity={0.3} />
      <line x1={387} y1={636} x2={387} y2={790} stroke={c.ink} strokeWidth={1} opacity={0.3} />
      {bars(40, 158, 640, 800)}
      {bars(222, 156, 640, 800)}
      {bars(398, 162, 640, 800)}
      <rect x={40} y={640} width={60} height={6} fill={c.accent} />
    </>
  );
}

export function ConfettiCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  const rand = seeded(23);
  const pieces = Array.from({ length: 70 }, (_, i) => {
    const top = i % 2 === 0;
    const x = rand() * W;
    const y = top ? rand() * 190 : 742 + rand() * 104;
    const rot = rand() * 180;
    const fill = i % 3 === 0 ? c.ink : c.accent;
    const kind = i % 4;
    if (kind === 0) return <circle key={i} cx={x} cy={y} r={5 + rand() * 4} fill={fill} />;
    if (kind === 1) return <rect key={i} x={x - 4} y={y - 9} width={8} height={18} rx={2} fill={fill} transform={`rotate(${rot} ${x} ${y})`} />;
    if (kind === 2) return <polygon key={i} points={sparkle(x, y, 9)} fill={fill} />;
    return <path key={i} d={`M ${x - 12} ${y} q 6 -8 12 0 t 12 0`} fill="none" stroke={fill} strokeWidth={4} strokeLinecap="round" transform={`rotate(${rot} ${x} ${y})`} />;
  });
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      {pieces}
      <FitText x={300} y={238} text={name} size={44} maxWidth={480} fill={c.ink} font="display" weight={800} />
      {qr(155, 268, 290, { radius: 22 })}
      <FitText x={300} y={622} text={headline} size={42} maxWidth={480} fill={c.ink} font="display" weight={800} />
      <FitText x={300} y={662} text={subline} size={20} maxWidth={460} fill={c.ink} opacity={0.75} />
      <Pill cx={300} cy={712} text={table} fill={c.accent} color={c.paper} size={20} />
    </>
  );
}

export function ChalkboardCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      <ellipse cx={180} cy={300} rx={160} ry={60} fill={c.ink} opacity={0.04} />
      <ellipse cx={430} cy={640} rx={170} ry={70} fill={c.ink} opacity={0.05} />
      <rect x={12} y={12} width={576} height={822} rx={10} fill="none" stroke={c.accent} strokeWidth={24} />
      <rect x={24} y={24} width={552} height={798} rx={4} fill="none" stroke={c.ink} strokeWidth={1.5} opacity={0.15} />
      <FitText x={300} y={128} text={name} size={40} maxWidth={440} fill={c.ink} font="serif" weight={600} italic />
      <path d="M190 150 q 55 -10 110 0 t 110 0" fill="none" stroke={c.ink} strokeWidth={3} strokeLinecap="round" opacity={0.85} />
      {qr(155, 186, 290, { radius: 8 })}
      <path d="M96 620 C 70 560 90 500 140 470" fill="none" stroke={c.ink} strokeWidth={3} strokeLinecap="round" opacity={0.85} />
      <path d="M124 462 L 142 469 L 134 487" fill="none" stroke={c.ink} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" opacity={0.85} />
      <FitText x={300} y={560} text={headline} size={42} maxWidth={400} fill={c.ink} font="text" weight={600} italic />
      <FitText x={300} y={600} text={subline} size={20} maxWidth={400} fill={c.ink} opacity={0.75} />
      <Pill cx={300} cy={664} text={table} fill={c.ink} color={c.paper} size={20} />
      {[[80, 90], [520, 90], [520, 760], [90, 760]].map(([x, y]) => (
        <polygon key={`${x}${y}`} points={starPoints(x, y, 14)} fill="none" stroke={c.ink} strokeWidth={2} opacity={0.7} />
      ))}
    </>
  );
}
