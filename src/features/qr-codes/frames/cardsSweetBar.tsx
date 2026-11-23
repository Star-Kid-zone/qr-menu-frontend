import React from "react";
import { QR_FRAME_VIEWBOX } from "@/constants/qrCodes.constants";
import type { QrFrameRenderProps } from "@/types";
import { FitText, GlowFilter, Paper, Pill, Rosette, seeded, wavePath } from "./primitives";

/* Portrait cards (600 × 846) for cafés, sweet shops, bars and specialty shops. */
const [W, H] = QR_FRAME_VIEWBOX.card;

export function DripsCard({ uid, colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  const lengths = [70, 110, 50, 120, 80, 40, 100, 60, 115, 75];
  let d = `M 0 0 H ${W} V 96`;
  for (let i = lengths.length - 1; i >= 0; i--) {

    const xc = i * 60 + 30;
    const bottom = 96 + lengths[i];
    d += ` L ${xc + 17} 96 V ${bottom - 17} A 17 17 0 0 1 ${xc - 17} ${bottom - 17} V 96 L ${i * 60} 96`;
  }
  d += " Z";
  const rand = seeded(5);
  const sprinkles = Array.from({ length: 30 }, (_, i) => {
    const x = 20 + rand() * 560;
    const y = 14 + rand() * 70;
    return <rect key={i} x={x - 9} y={y - 3} width={18} height={6} rx={3} fill={i % 2 ? c.paper : c.ink} opacity={0.85} transform={`rotate(${rand() * 180} ${x} ${y})`} />;
  });
  const waffle = `${uid}-waffle`;
  return (
    <>
      <defs>
        <pattern id={waffle} width={28} height={28} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width={28} height={28} fill={c.accent} opacity={0.25} />
          <rect width={4} height={28} fill={c.accent} opacity={0.6} />
          <rect width={28} height={4} fill={c.accent} opacity={0.6} />
        </pattern>
      </defs>
      <Paper w={W} h={H} fill={c.paper} />
      <path d={d} fill={c.accent} />
      {sprinkles}
      <FitText x={300} y={272} text={name} size={40} maxWidth={440} fill={c.ink} font="display" weight={800} />
      {qr(165, 300, 270, { radius: 24 })}
      <FitText x={300} y={634} text={headline} size={40} maxWidth={460} fill={c.ink} font="display" weight={800} />
      <FitText x={300} y={672} text={subline} size={20} maxWidth={440} fill={c.ink} opacity={0.75} />
      <Pill cx={300} cy={730} text={table} fill={c.ink} color={c.paper} size={20} />
      <rect x={0} y={782} width={W} height={64} fill={`url(#${waffle})`} />
    </>
  );
}

function Wheat({ x, y, len, angle, color }: { x: number; y: number; len: number; angle: number; color: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <line x1={0} y1={0} x2={0} y2={-len} stroke={color} strokeWidth={3} strokeLinecap="round" />
      {Array.from({ length: 7 }, (_, i) => {
        const gy = -len + 14 + i * 15;
        return (
          <g key={i}>
            <ellipse cx={-7} cy={gy} rx={5.5} ry={11} fill={color} transform={`rotate(-28 -7 ${gy})`} />
            <ellipse cx={7} cy={gy} rx={5.5} ry={11} fill={color} transform={`rotate(28 7 ${gy})`} />
          </g>
        );
      })}
      <ellipse cx={0} cy={-len - 2} rx={5} ry={11} fill={color} />
    </g>
  );
}

export function WheatCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      <Wheat x={70} y={H + 10} len={300} angle={-14} color={c.accent} />
      <Wheat x={90} y={H + 10} len={260} angle={4} color={c.accent} />
      <Wheat x={530} y={H + 10} len={300} angle={14} color={c.accent} />
      <Wheat x={510} y={H + 10} len={260} angle={-4} color={c.accent} />
      <Wheat x={240} y={120} len={70} angle={-80} color={c.accent} />
      <Wheat x={360} y={120} len={70} angle={80} color={c.accent} />
      <FitText x={300} y={190} text={name} size={40} maxWidth={420} fill={c.ink} font="serif" weight={700} />
      {qr(155, 222, 290, { radius: 14 })}
      <FitText x={300} y={584} text={headline} size={40} maxWidth={320} fill={c.ink} font="serif" weight={700} />
      <FitText x={300} y={622} text={subline} size={20} maxWidth={300} fill={c.ink} opacity={0.72} />
      <Pill cx={300} cy={680} text={table} fill={c.ink} color={c.paper} size={20} />
    </>
  );
}

function Monstera({ x, y, rotate, scale = 1, color, paper }: { x: number; y: number; rotate: number; scale?: number; color: string; paper: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <path d="M0 0 C 60 -10 110 -60 100 -130 C 90 -190 30 -210 0 -200 C -30 -210 -90 -190 -100 -130 C -110 -60 -60 -10 0 0 Z" fill={color} />
      <line x1={0} y1={0} x2={0} y2={-192} stroke={paper} strokeWidth={3} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i} stroke={paper} strokeWidth={8} strokeLinecap="round">
          <line x1={14} y1={-46 - i * 34} x2={100} y2={-64 - i * 34} />
          <line x1={-14} y1={-46 - i * 34} x2={-100} y2={-64 - i * 34} />
        </g>
      ))}
      <ellipse cx={40} cy={-150} rx={8} ry={5} fill={paper} />
      <ellipse cx={-40} cy={-150} rx={8} ry={5} fill={paper} />
    </g>
  );
}

export function BotanicalCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      <Monstera x={30} y={30} rotate={140} color={c.accent} paper={c.paper} />
      <Monstera x={570} y={30} rotate={-140} scale={0.85} color={c.accent} paper={c.paper} />
      <Monstera x={30} y={816} rotate={40} scale={0.85} color={c.accent} paper={c.paper} />
      <Monstera x={570} y={816} rotate={-40} color={c.accent} paper={c.paper} />
      <FitText x={300} y={198} text={name} size={38} maxWidth={300} fill={c.ink} font="serif" weight={600} italic />
      {qr(160, 228, 280, { radius: 20 })}
      <FitText x={300} y={588} text={headline} size={40} maxWidth={380} fill={c.ink} font="serif" weight={700} />
      <FitText x={300} y={628} text={subline} size={20} maxWidth={360} fill={c.ink} opacity={0.72} />
      <Pill cx={300} cy={686} text={table} fill={c.accent} color={c.paper} size={20} />
    </>
  );
}

function Kulhad({ x, y, scale = 1, color, ink }: { x: number; y: number; scale?: number; color: string; ink: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {[-12, 0, 12].map((dx) => (
        <path key={dx} d={`M ${dx} -52 c -8 -8 8 -16 0 -24 c -8 -8 8 -16 0 -22`} fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" opacity={0.6} />
      ))}
      <path d="M -32 -40 H 32 L 23 30 Q 0 40 -23 30 Z" fill={color} />
      <ellipse cx={0} cy={-40} rx={33} ry={7} fill={ink} opacity={0.3} />
      <path d="M -27 -8 H 27" stroke={ink} strokeOpacity={0.2} strokeWidth={3} />
    </g>
  );
}

export function KulhadCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  const garland = Array.from({ length: 21 }, (_, i) => {
    const x = i * 30;
    const t = x / W;
    const y = (1 - t) ** 2 * 26 + 2 * (1 - t) * t * 80 + t ** 2 * 26;
    return <circle key={i} cx={x} cy={y} r={10} fill={i % 2 ? c.accent : c.ink} opacity={i % 2 ? 1 : 0.85} />;
  });
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      {garland}
      <Kulhad x={200} y={178} scale={0.85} color={c.accent} ink={c.ink} />
      <Kulhad x={300} y={168} color={c.accent} ink={c.ink} />
      <Kulhad x={400} y={178} scale={0.85} color={c.accent} ink={c.ink} />
      <FitText x={300} y={256} text={name} size={38} maxWidth={460} fill={c.ink} font="serif" weight={700} />
      {qr(165, 284, 270, { radius: 16 })}
      <FitText x={300} y={620} text={headline} size={38} maxWidth={460} fill={c.ink} font="serif" weight={700} />
      <FitText x={300} y={658} text={subline} size={20} maxWidth={440} fill={c.ink} opacity={0.75} />
      <Pill cx={300} cy={716} text={table} fill={c.accent} color={c.paper} size={20} />
      <Rosette cx={300} cy={790} r={22} petals={8} color={c.accent} ring={c.paper} />
      {[200, 250, 350, 400].map((x) => (
        <circle key={x} cx={x} cy={790} r={4} fill={c.accent} />
      ))}
    </>
  );
}

export function ChocoCard({ uid, colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  const bite = `${uid}-bite`;
  const cells: React.ReactNode[] = [];
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 6; col++) {
      const x = col * 100 + 6;
      const y = row * 66 + 6;
      cells.push(
        <g key={`${row}-${col}`}>
          <rect x={x} y={y} width={88} height={54} rx={6} fill={c.accent} />
          <rect x={x + 8} y={y + 8} width={72} height={38} rx={4} fill="none" stroke={c.paper} strokeOpacity={0.22} strokeWidth={3} />
        </g>,
      );
    }
  }
  return (
    <>
      <defs>
        <mask id={bite}>
          <rect width={W} height={H} fill="#fff" />
          <circle cx={600} cy={0} r={70} fill="#000" />
          <circle cx={530} cy={-6} r={40} fill="#000" />
        </mask>
      </defs>
      <Paper w={W} h={H} fill={c.paper} />
      <g mask={`url(#${bite})`}>
        <rect x={0} y={0} width={W} height={144} fill={c.ink} opacity={0.9} />
        {cells}
      </g>
      <FitText x={300} y={206} text={name} size={40} maxWidth={460} fill={c.ink} font="serif" weight={600} italic />
      {qr(160, 236, 280, { radius: 14 })}
      <FitText x={300} y={584} text={headline} size={40} maxWidth={460} fill={c.ink} font="serif" weight={700} />
      <FitText x={300} y={624} text={subline} size={20} maxWidth={440} fill={c.ink} opacity={0.72} />
      <Pill cx={300} cy={684} text={table} fill={c.accent} color={c.paper} size={20} />
      <path d={`M 0 770 ${Array.from({ length: 20 }, (_, i) => `L ${i * 30 + 15} ${i % 2 ? 770 : 752} L ${(i + 1) * 30} 770`).join(" ")} V ${H} H 0 Z`} fill={c.accent} />
    </>
  );
}

export function NeonCard({ uid, colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  const glow = `${uid}-glow`;
  return (
    <>
      <defs>
        <GlowFilter id={glow} blur={7} />
      </defs>
      <Paper w={W} h={H} fill={c.paper} />
      <rect x={40} y={40} width={520} height={766} rx={44} fill="none" stroke={c.accent} strokeWidth={14} filter={`url(#${glow})`} opacity={0.9} />
      <rect x={40} y={40} width={520} height={766} rx={44} fill="none" stroke={c.accent} strokeWidth={5} />
      <rect x={40} y={40} width={520} height={766} rx={44} fill="none" stroke="#FFFFFF" strokeWidth={1.5} opacity={0.7} />
      <FitText x={300} y={140} text={name} size={36} maxWidth={420} fill={c.ink} font="display" weight={700} caps spacing={5} />
      {qr(160, 186, 280, { radius: 14 })}
      <g filter={`url(#${glow})`} opacity={0.85}>
        <FitText x={300} y={568} text={headline} size={48} maxWidth={440} fill={c.accent} font="serif" weight={600} italic />
      </g>
      <FitText x={300} y={568} text={headline} size={48} maxWidth={440} fill={c.accent} font="serif" weight={600} italic />
      <FitText x={300} y={612} text={subline} size={20} maxWidth={420} fill={c.ink} opacity={0.8} />
      <Pill cx={300} cy={680} text={table} fill={c.ink} color={c.paper} size={20} />
    </>
  );
}

export function FoamCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  const rand = seeded(3);
  const bubbles = Array.from({ length: 34 }, (_, i) => {
    const left = i % 2 === 0;
    const x = left ? 24 + rand() * 110 : 466 + rand() * 110;
    const y = 180 + rand() * 640;
    return <circle key={i} cx={x} cy={y} r={3 + rand() * 7} fill="none" stroke={c.accent} strokeWidth={2} opacity={0.45} />;
  });
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      {bubbles}
      <rect x={0} y={0} width={W} height={110} fill={c.accent} />
      {Array.from({ length: 14 }, (_, i) => (
        <circle key={i} cx={i * 46} cy={112 + (i % 3) * 6} r={26 + (i % 2) * 6} fill={c.accent} />
      ))}
      <FitText x={300} y={232} text={name} size={40} maxWidth={420} fill={c.ink} font="display" weight={800} caps spacing={2} />
      {qr(160, 264, 280, { radius: 16 })}
      <FitText x={300} y={612} text={headline} size={40} maxWidth={420} fill={c.ink} font="display" weight={800} caps />
      <FitText x={300} y={650} text={subline} size={20} maxWidth={400} fill={c.ink} opacity={0.82} />
      <Pill cx={300} cy={710} text={table} fill={c.ink} color={c.paper} size={20} />
    </>
  );
}

export function WineLabelCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  const initial = (name.trim()[0] ?? "").toUpperCase();
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      <rect x={60} y={86} width={480} height={690} rx={10} fill={c.accent} />
      <rect x={74} y={100} width={452} height={662} rx={6} fill="none" stroke={c.ink} strokeOpacity={0.6} strokeWidth={1.5} />
      <rect x={80} y={106} width={440} height={650} rx={4} fill="none" stroke={c.ink} strokeOpacity={0.35} strokeWidth={0.8} />
      <path d="M268 128 H332 V160 Q332 196 300 206 Q268 196 268 160 Z" fill={c.ink} />
      <FitText x={300} y={176} text={initial} size={30} maxWidth={40} fill={c.accent} font="serif" weight={700} />
      <path d="M244 150 q -26 18 -18 50" fill="none" stroke={c.ink} strokeOpacity={0.5} strokeWidth={2} />
      <path d="M356 150 q 26 18 18 50" fill="none" stroke={c.ink} strokeOpacity={0.5} strokeWidth={2} />
      <FitText x={300} y={252} text={name} size={32} maxWidth={400} fill={c.ink} font="serif" weight={600} caps spacing={4} />
      <line x1={200} y1={272} x2={400} y2={272} stroke={c.ink} strokeOpacity={0.5} strokeWidth={1} />
      {qr(170, 296, 260, { radius: 4 })}
      <FitText x={300} y={612} text={headline} size={36} maxWidth={400} fill={c.ink} font="serif" weight={500} italic />
      <FitText x={300} y={650} text={subline} size={14} maxWidth={400} fill={c.ink} caps spacing={3} weight={600} opacity={0.8} />
      <Pill cx={300} cy={712} text={table} fill={c.paper} color={c.accent} size={18} font="serif" />
    </>
  );
}

export function CrateCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  const plank = (y: number, i: number) => (
    <g key={y}>
      <rect x={0} y={y} width={W} height={52} fill={c.accent} />
      <path d={wavePath(0, y + 18 + (i % 2) * 6, W, 3, 140)} fill="none" stroke={c.ink} strokeOpacity={0.16} strokeWidth={2} />
      <path d={wavePath(0, y + 34, W, 2, 90)} fill="none" stroke={c.ink} strokeOpacity={0.12} strokeWidth={2} />
      <circle cx={30} cy={y + 26} r={4} fill={c.ink} opacity={0.45} />
      <circle cx={570} cy={y + 26} r={4} fill={c.ink} opacity={0.45} />
    </g>
  );
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      {[0, 56].map(plank)}
      {[734, 790].map(plank)}
      <FitText x={300} y={196} text={name} size={42} maxWidth={460} fill={c.ink} font="display" weight={800} caps spacing={4} />
      <line x1={180} y1={216} x2={420} y2={216} stroke={c.ink} strokeWidth={3} strokeDasharray="12 8" opacity={0.5} />
      {qr(160, 238, 280, { radius: 6 })}
      <FitText x={300} y={582} text={headline} size={36} maxWidth={440} fill={c.ink} font="display" weight={800} caps />
      <FitText x={300} y={620} text={subline} size={20} maxWidth={420} fill={c.ink} opacity={0.75} />
      <Pill cx={300} cy={678} text={table} fill={c.ink} color={c.paper} size={20} />
    </>
  );
}
