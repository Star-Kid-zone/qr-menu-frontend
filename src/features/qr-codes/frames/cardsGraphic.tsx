import React from "react";
import { QR_FRAME_VIEWBOX } from "@/constants/qrCodes.constants";
import type { QrFrameRenderProps } from "@/types";
import { FitText, GlowFilter, Paper, Pill, StarRow, seeded, sparkle, wavePath } from "./primitives";

/* Graphic portrait cards (600 × 846): bold shapes and printed-matter looks that suit any business. */
const [W, H] = QR_FRAME_VIEWBOX.card;

function Barcode({ x, y, width, height, seed, color }: { x: number; y: number; width: number; height: number; seed: number; color: string }) {
  const rand = seeded(seed);
  const bars: React.ReactNode[] = [];
  let bx = x;
  while (bx < x + width) {
    const w = 2 + Math.floor(rand() * 5);
    bars.push(<rect key={bx} x={bx} y={y} width={Math.min(w, x + width - bx)} height={height} fill={color} />);
    bx += w + 2 + Math.floor(rand() * 4);
  }
  return <g>{bars}</g>;
}

export function BauhausCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      <path d="M0 0 H130 A130 130 0 0 1 0 130 Z" fill={c.accent} />
      <rect x={516} y={36} width={48} height={48} fill={c.ink} />
      <circle cx={540} cy={128} r={16} fill={c.accent} />
      <FitText x={300} y={124} text={name} size={34} maxWidth={320} fill={c.ink} font="display" weight={800} caps spacing={3} />
      <rect x={270} y={146} width={60} height={6} fill={c.accent} />
      {qr(155, 184, 290, { radius: 0 })}
      <FitText x={300} y={540} text={headline} size={40} maxWidth={440} fill={c.ink} font="display" weight={800} />
      <FitText x={300} y={580} text={subline} size={20} maxWidth={420} fill={c.ink} opacity={0.72} />
      <Pill cx={300} cy={640} text={table} fill={c.ink} color={c.paper} size={20} />
      <rect x={0} y={700} width={150} height={146} fill={c.ink} />
      <path d="M150 846 V700 A146 146 0 0 1 296 846 Z" fill={c.accent} />
      <circle cx={373} cy={773} r={62} fill={c.ink} opacity={0.9} />
      <polygon points="450,700 600,700 525,772" fill={c.accent} />
      <path d="M450 846 A75 75 0 0 1 600 846 Z" fill={c.ink} />
    </>
  );
}

export function MemphisCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  const dots: React.ReactNode[] = [];
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 3; j++) dots.push(<circle key={`${i}-${j}`} cx={44 + i * 22} cy={744 + j * 22} r={4} fill={c.ink} />);
  }
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      <path d={wavePath(36, 64, 180, 9, 36)} fill="none" stroke={c.accent} strokeWidth={7} strokeLinecap="round" />
      <polygon points="474,36 548,36 511,98" fill="none" stroke={c.ink} strokeWidth={6} strokeLinejoin="round" />
      <circle cx={556} cy={172} r={22} fill={c.accent} />
      <path d="M52 286 A44 44 0 0 1 52 374" fill="none" stroke={c.ink} strokeWidth={7} strokeLinecap="round" />
      <rect x={500} y={330} width={36} height={36} fill={c.accent} transform="rotate(20 518 348)" />
      <line x1={66} y1={474} x2={100} y2={440} stroke={c.accent} strokeWidth={7} strokeLinecap="round" />
      <line x1={500} y1={470} x2={540} y2={490} stroke={c.ink} strokeWidth={7} strokeLinecap="round" />
      <circle cx={60} cy={622} r={14} fill="none" stroke={c.accent} strokeWidth={6} />
      {dots}
      <polyline points="440,792 470,762 500,792 530,762 560,792" fill="none" stroke={c.accent} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
      <FitText x={300} y={146} text={name} size={36} maxWidth={300} fill={c.ink} font="display" weight={800} />
      {qr(155, 182, 290, { radius: 12 })}
      <FitText x={300} y={556} text={headline} size={42} maxWidth={400} fill={c.ink} font="display" weight={800} />
      <FitText x={300} y={596} text={subline} size={20} maxWidth={380} fill={c.ink} opacity={0.72} />
      <Pill cx={300} cy={662} text={table} fill={c.ink} color={c.paper} size={20} />
    </>
  );
}

export function ReceiptCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  let edge = "M70 50";
  for (let x = 70; x < 530; x += 20) edge += ` L ${x + 10} 38 L ${x + 20} 50`;
  edge += " L 530 796";
  for (let x = 530; x > 70; x -= 20) edge += ` L ${x - 10} 808 L ${x - 20} 796`;
  edge += " Z";
  const rule = (y: number) => <line x1={100} y1={y} x2={500} y2={y} stroke={c.ink} strokeWidth={2} strokeDasharray="6 6" opacity={0.45} />;
  return (
    <>
      <Paper w={W} h={H} fill={c.accent} />
      <path d={edge} fill={c.ink} opacity={0.12} transform="translate(6 8)" />
      <path d={edge} fill={c.paper} />
      <FitText x={300} y={112} text={name} size={30} maxWidth={400} fill={c.ink} font="mono" weight={700} caps />
      {rule(140)}
      <FitText x={300} y={178} text={table} size={22} maxWidth={380} fill={c.ink} font="mono" weight={700} caps />
      {qr(165, 200, 270, { radius: 0 })}
      {rule(500)}
      <FitText x={300} y={546} text={headline} size={30} maxWidth={400} fill={c.ink} font="mono" weight={700} caps />
      <FitText x={300} y={584} text={subline} size={18} maxWidth={400} fill={c.ink} font="mono" opacity={0.75} />
      {rule(616)}
      <Barcode x={150} y={642} width={300} height={56} seed={11} color={c.ink} />
      <StarRow cx={300} y={746} count={3} gap={30} r={7} colors={[c.ink]} />
    </>
  );
}

export function BoardingPassCard({ uid, colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  const mask = `${uid}-pass`;
  return (
    <>
      <defs>
        <mask id={mask}>
          <rect width={W} height={H} fill="#fff" />
          <circle cx={0} cy={652} r={26} fill="#000" />
          <circle cx={W} cy={652} r={26} fill="#000" />
        </mask>
      </defs>
      <g mask={`url(#${mask})`}>
        <Paper w={W} h={H} fill={c.paper} />
        <rect x={0} y={0} width={W} height={184} fill={c.accent} />
        <FitText x={300} y={100} text={name} size={38} maxWidth={480} fill={c.paper} font="display" weight={800} caps spacing={3} />
        <line x1={156} y1={142} x2={262} y2={142} stroke={c.paper} strokeWidth={3} strokeDasharray="2 8" strokeLinecap="round" opacity={0.8} />
        <line x1={338} y1={142} x2={444} y2={142} stroke={c.paper} strokeWidth={3} strokeDasharray="2 8" strokeLinecap="round" opacity={0.8} />
        <circle cx={150} cy={142} r={6} fill={c.paper} />
        <circle cx={450} cy={142} r={6} fill="none" stroke={c.paper} strokeWidth={3} />
        <g transform="translate(300 142)" fill={c.paper}>
          <ellipse cx={0} cy={0} rx={24} ry={5} />
          <polygon points="-6,0 8,0 -4,-20 -12,-20" />
          <polygon points="-6,0 8,0 -4,20 -12,20" />
          <polygon points="-18,0 -12,0 -20,-10 -25,-10" />
          <polygon points="-18,0 -12,0 -20,10 -25,10" />
        </g>
        {qr(155, 224, 290, { radius: 8 })}
        <FitText x={300} y={574} text={headline} size={38} maxWidth={460} fill={c.ink} font="display" weight={800} />
        <FitText x={300} y={612} text={subline} size={20} maxWidth={440} fill={c.ink} opacity={0.7} />
        <line x1={34} y1={652} x2={566} y2={652} stroke={c.ink} strokeWidth={2} strokeDasharray="8 8" opacity={0.3} />
        <Barcode x={60} y={700} width={300} height={70} seed={5} color={c.ink} />
        <FitText x={480} y={746} text={table} size={30} maxWidth={170} fill={c.accent} font="mono" weight={700} />
      </g>
    </>
  );
}

export function MarqueeCard({ uid, colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  const glow = `${uid}-bulb`;
  const [x0, y0, x1, y1] = [30, 30, W - 30, H - 30];
  const bulbs: [number, number][] = [];
  for (let i = 0; i <= 12; i++) {
    const x = x0 + ((x1 - x0) * i) / 12;
    bulbs.push([x, y0], [x, y1]);
  }
  for (let j = 1; j < 18; j++) {
    const y = y0 + ((y1 - y0) * j) / 18;
    bulbs.push([x0, y], [x1, y]);
  }
  return (
    <>
      <defs>
        <GlowFilter id={glow} blur={4} />
      </defs>
      <Paper w={W} h={H} fill={c.paper} />
      <rect x={30} y={30} width={540} height={786} fill="none" stroke={c.ink} strokeWidth={60} />
      <g filter={`url(#${glow})`}>
        {bulbs.map(([x, y]) => <circle key={`g${x}-${y}`} cx={x} cy={y} r={11} fill={c.accent} />)}
      </g>
      {bulbs.map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r={8} fill={c.accent} />
          <circle cx={x - 2} cy={y - 2} r={3} fill="#FFFFFF" opacity={0.8} />
        </g>
      ))}
      <rect x={110} y={92} width={380} height={96} rx={14} fill={c.ink} />
      <rect x={122} y={104} width={356} height={72} rx={8} fill="none" stroke={c.accent} strokeWidth={2} />
      <FitText x={300} y={152} text={name} size={34} maxWidth={320} fill={c.accent} font="display" weight={800} caps spacing={2} />
      {qr(160, 220, 280, { radius: 10 })}
      <FitText x={300} y={566} text={headline} size={42} maxWidth={420} fill={c.ink} font="serif" weight={700} />
      <FitText x={300} y={604} text={subline} size={20} maxWidth={400} fill={c.ink} opacity={0.75} />
      <Pill cx={300} cy={670} text={table} fill={c.ink} color={c.paper} size={20} />
      <StarRow cx={300} y={740} count={5} gap={34} r={9} colors={[c.ink]} />
    </>
  );
}

export function NightSkyCard({ uid, colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  const moon = `${uid}-moon`;
  const rand = seeded(21);
  const stars = Array.from({ length: 70 }, (_, i) => (
    <circle key={i} cx={rand() * W} cy={rand() * H} r={0.8 + rand() * 1.8} fill={c.ink} opacity={0.3 + rand() * 0.5} />
  ));
  const sparkles: [number, number, number][] = [[96, 96, 14], [520, 250, 10], [70, 420, 9], [540, 520, 12], [120, 640, 8], [480, 720, 10]];
  return (
    <>
      <defs>
        <mask id={moon}>
          <rect width={W} height={H} fill="#fff" />
          <circle cx={520} cy={80} r={35} fill="#000" />
        </mask>
      </defs>
      <Paper w={W} h={H} fill={c.paper} />
      {stars}
      {sparkles.map(([x, y, r]) => <polygon key={`${x}-${y}`} points={sparkle(x, y, r)} fill={c.accent} />)}
      <circle cx={500} cy={96} r={40} fill={c.accent} mask={`url(#${moon})`} />
      <FitText x={300} y={170} text={name} size={38} maxWidth={360} fill={c.ink} font="serif" weight={600} italic />
      {qr(155, 204, 290, { radius: 12 })}
      <FitText x={300} y={566} text={headline} size={42} maxWidth={440} fill={c.accent} font="serif" weight={600} />
      <FitText x={300} y={606} text={subline} size={20} maxWidth={420} fill={c.ink} opacity={0.8} />
      <Pill cx={300} cy={672} text={table} fill={c.accent} color={c.paper} size={20} />
      <path d="M0 790 Q 150 740 300 780 T 600 770 V846 H0 Z" fill={c.ink} opacity={0.08} />
    </>
  );
}

export function StitchedCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  const rivets: [number, number][] = [[62, 62], [538, 62], [62, 784], [538, 784]];
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      <rect x={30} y={30} width={540} height={786} rx={34} fill="none" stroke={c.ink} strokeWidth={4} strokeDasharray="16 10" strokeLinecap="round" opacity={0.7} />
      <rect x={46} y={46} width={508} height={754} rx={24} fill="none" stroke={c.accent} strokeWidth={2} />
      {rivets.map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r={10} fill={c.accent} />
          <circle cx={x} cy={y} r={4} fill={c.paper} />
        </g>
      ))}
      <rect x={160} y={86} width={280} height={72} rx={8} fill={c.accent} />
      <rect x={168} y={94} width={264} height={56} rx={4} fill="none" stroke={c.paper} strokeWidth={1.5} strokeDasharray="5 4" opacity={0.8} />
      <FitText x={300} y={132} text={name} size={28} maxWidth={240} fill={c.paper} font="display" weight={800} caps spacing={2} />
      {qr(150, 196, 300, { radius: 14 })}
      <FitText x={300} y={566} text={headline} size={40} maxWidth={440} fill={c.ink} font="display" weight={800} />
      <FitText x={300} y={606} text={subline} size={20} maxWidth={420} fill={c.ink} opacity={0.72} />
      <Pill cx={300} cy={676} text={table} fill={c.accent} color={c.paper} size={20} />
      {[230, 265, 300, 335, 370].map((x) => (
        <path key={x} d={`M${x - 7} 741 L${x + 7} 755 M${x + 7} 741 L${x - 7} 755`} stroke={c.accent} strokeWidth={3} strokeLinecap="round" />
      ))}
    </>
  );
}

export function GinghamCard({ uid, colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  const check = `${uid}-gingham`;
  return (
    <>
      <defs>
        <pattern id={check} width={40} height={40} patternUnits="userSpaceOnUse">
          <rect width={40} height={40} fill={c.paper} />
          <rect width={20} height={40} fill={c.accent} opacity={0.45} />
          <rect width={40} height={20} fill={c.accent} opacity={0.45} />
        </pattern>
      </defs>
      <rect width={W} height={H} fill={`url(#${check})`} />
      <rect x={50} y={50} width={500} height={746} rx={22} fill={c.paper} />
      <rect x={64} y={64} width={472} height={718} rx={14} fill="none" stroke={c.accent} strokeWidth={3} strokeDasharray="0.1 9" strokeLinecap="round" />
      <FitText x={300} y={142} text={name} size={40} maxWidth={400} fill={c.ink} font="serif" weight={700} italic />
      <line x1={236} y1={170} x2={284} y2={170} stroke={c.accent} strokeWidth={2} />
      <rect x={295} y={165} width={10} height={10} fill={c.accent} transform="rotate(45 300 170)" />
      <line x1={316} y1={170} x2={364} y2={170} stroke={c.accent} strokeWidth={2} />
      {qr(150, 196, 300, { radius: 12 })}
      <FitText x={300} y={566} text={headline} size={40} maxWidth={420} fill={c.ink} font="serif" weight={700} />
      <FitText x={300} y={604} text={subline} size={20} maxWidth={400} fill={c.ink} opacity={0.72} />
      <Pill cx={300} cy={676} text={table} fill={c.accent} color={c.paper} size={20} />
    </>
  );
}

export function SplitCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      <rect x={0} y={0} width={W} height={440} fill={c.accent} />
      <circle cx={540} cy={60} r={90} fill={c.paper} opacity={0.08} />
      <circle cx={40} cy={400} r={60} fill={c.paper} opacity={0.08} />
      <FitText x={300} y={100} text={name} size={26} maxWidth={460} fill={c.paper} font="display" weight={700} caps spacing={6} opacity={0.9} />
      <FitText x={300} y={200} text={headline} size={48} maxWidth={480} fill={c.paper} font="serif" weight={700} />
      <FitText x={300} y={248} text={subline} size={20} maxWidth={460} fill={c.paper} opacity={0.85} />
      <rect x={163} y={338} width={290} height={290} rx={18} fill={c.ink} opacity={0.14} />
      {qr(155, 330, 290, { radius: 18 })}
      <Pill cx={300} cy={690} text={table} fill={c.ink} color={c.paper} size={20} />
      {[260, 300, 340].map((x) => <circle key={x} cx={x} cy={772} r={6} fill={c.accent} />)}
    </>
  );
}

export function FoodTruckCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      <rect x={150} y={66} width={300} height={70} rx={12} fill={c.ink} />
      <rect x={290} y={136} width={20} height={14} fill={c.ink} />
      <FitText x={300} y={112} text={name} size={28} maxWidth={260} fill={c.paper} font="display" weight={800} caps />
      <rect x={40} y={150} width={520} height={540} rx={34} fill={c.accent} />
      {Array.from({ length: 10 }, (_, i) => <circle key={`s${i}`} cx={93 + i * 46} cy={230} r={23} fill={i % 2 === 0 ? c.paper : c.ink} />)}
      {Array.from({ length: 10 }, (_, i) => <rect key={`r${i}`} x={70 + i * 46} y={186} width={46} height={44} fill={i % 2 === 0 ? c.paper : c.ink} />)}
      <rect x={110} y={262} width={380} height={318} rx={14} fill={c.ink} opacity={0.18} />
      {qr(155, 272, 290, { radius: 10 })}
      <rect x={92} y={572} width={416} height={18} rx={5} fill={c.ink} />
      <FitText x={300} y={642} text={headline} size={32} maxWidth={440} fill={c.paper} font="display" weight={800} caps />
      <rect x={556} y={600} width={18} height={40} rx={6} fill={c.ink} />
      <circle cx={170} cy={694} r={46} fill={c.ink} />
      <circle cx={170} cy={694} r={18} fill={c.paper} />
      <circle cx={430} cy={694} r={46} fill={c.ink} />
      <circle cx={430} cy={694} r={18} fill={c.paper} />
      <Pill cx={300} cy={686} text={table} fill={c.ink} color={c.paper} size={18} minWidth={100} />
      <line x1={24} y1={742} x2={576} y2={742} stroke={c.ink} strokeWidth={3} opacity={0.2} strokeLinecap="round" />
      <FitText x={300} y={790} text={subline} size={20} maxWidth={460} fill={c.ink} opacity={0.75} />
    </>
  );
}
