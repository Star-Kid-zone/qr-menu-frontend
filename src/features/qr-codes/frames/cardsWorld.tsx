import React from "react";
import { QR_FRAME_VIEWBOX } from "@/constants/qrCodes.constants";
import type { QrFrameRenderProps } from "@/types";
import { FitText, Flower, Paper, Pill, eightPoint, starPoints, wavePath } from "./primitives";

/* Portrait cards (600 × 846) drawn for particular cuisines and kitchens. */
const [W, H] = QR_FRAME_VIEWBOX.card;

export function SakuraCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  const blossoms: [number, number, number][] = [
    [118, 104, 22], [228, 74, 18], [332, 62, 24], [452, 44, 18], [256, 128, 14], [548, 26, 16], [70, 132, 12],
    [520, 770, 18], [452, 806, 22], [570, 728, 14],
  ];
  const petals: [number, number, number][] = [[60, 300, 20], [540, 360, -30], [86, 520, 45], [524, 600, 10], [66, 700, -15]];
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      <path d="M-10 124 C 110 108 190 70 300 72 S 470 44 570 6" fill="none" stroke={c.ink} strokeWidth={6} strokeLinecap="round" opacity={0.85} />
      <path d="M186 88 Q 214 118 256 128" fill="none" stroke={c.ink} strokeWidth={4} strokeLinecap="round" opacity={0.85} />
      <path d="M610 744 C 540 756 490 786 430 846" fill="none" stroke={c.ink} strokeWidth={5} strokeLinecap="round" opacity={0.85} />
      {blossoms.map(([x, y, r]) => <Flower key={`${x}-${y}`} cx={x} cy={y} r={r} petal={c.accent} center={c.ink} />)}
      {petals.map(([x, y, a]) => (
        <ellipse key={`${x}-${y}`} cx={x} cy={y} rx={9} ry={5} fill={c.accent} opacity={0.75} transform={`rotate(${a} ${x} ${y})`} />
      ))}
      <FitText x={300} y={204} text={name} size={38} maxWidth={420} fill={c.ink} font="serif" weight={700} />
      {qr(155, 232, 290, { radius: 10 })}
      <FitText x={300} y={588} text={headline} size={40} maxWidth={440} fill={c.ink} font="serif" weight={600} />
      <FitText x={300} y={626} text={subline} size={20} maxWidth={420} fill={c.ink} opacity={0.72} />
      <Pill cx={300} cy={692} text={table} fill={c.ink} color={c.paper} size={20} />
    </>
  );
}

export function PapelCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  const flags = Array.from({ length: 5 }, (_, i) => {
    const w = 108;
    const x = 12 + i * 117;
    const cx = x + w / 2;
    const y = 26 + 14 * Math.sin((Math.PI * cx) / W);
    let d = `M${x} ${y} H${x + w} V${y + 100}`;
    for (let k = 1; k <= 6; k++) d += ` L${x + w - (w * (k - 0.5)) / 6} ${y + 112} L${x + w - (w * k) / 6} ${y + 100}`;
    d += " Z";
    const holes: [number, number][] = [[-28, 24], [28, 24], [-28, 76], [28, 76]];
    return (
      <g key={i}>
        <path d={d} fill={i % 2 === 0 ? c.accent : c.ink} />
        <rect x={x + 10} y={y + 8} width={w - 20} height={4} rx={2} fill={c.paper} opacity={0.75} />
        <rect x={cx - 10} y={y + 40} width={20} height={20} fill={c.paper} transform={`rotate(45 ${cx} ${y + 50})`} />
        {holes.map(([dx, dy]) => <circle key={`${dx}${dy}`} cx={cx + dx} cy={y + dy} r={6} fill={c.paper} />)}
        <polygon points={starPoints(cx, y + 88, 6)} fill={c.paper} />
      </g>
    );
  });
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      <path d="M0 24 Q300 56 600 24" fill="none" stroke={c.ink} strokeWidth={2} />
      {flags}
      <FitText x={300} y={202} text={name} size={34} maxWidth={440} fill={c.ink} font="display" weight={800} caps spacing={2} />
      {qr(155, 230, 290, { radius: 12 })}
      <FitText x={300} y={586} text={headline} size={42} maxWidth={440} fill={c.ink} font="display" weight={800} />
      <FitText x={300} y={624} text={subline} size={20} maxWidth={420} fill={c.ink} opacity={0.72} />
      <Pill cx={300} cy={690} text={table} fill={c.ink} color={c.paper} size={20} />
      <Flower cx={70} cy={790} r={30} petal={c.accent} center={c.ink} />
      <Flower cx={130} cy={814} r={14} petal={c.ink} center={c.accent} />
      <Flower cx={530} cy={790} r={30} petal={c.ink} center={c.accent} />
      <Flower cx={470} cy={814} r={14} petal={c.accent} center={c.ink} />
    </>
  );
}

function KolamRow({ y, count, step, color }: { y: number; count: number; step: number; color: string }) {
  const start = 300 - ((count - 1) * step) / 2;
  const side = step * 0.72;
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const x = start + i * step;
        return (
          <g key={i}>
            <rect x={x - side / 2} y={y - side / 2} width={side} height={side} rx={step * 0.18} fill="none" stroke={color} strokeWidth={3} transform={`rotate(45 ${x} ${y})`} />
            <circle cx={x} cy={y} r={3.5} fill={color} />
          </g>
        );
      })}
    </g>
  );
}

export function KolamCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      <rect x={22} y={22} width={556} height={802} rx={10} fill="none" stroke={c.accent} strokeWidth={2} />
      <KolamRow y={64} count={13} step={36} color={c.accent} />
      <KolamRow y={100} count={12} step={36} color={c.accent} />
      <KolamRow y={746} count={12} step={36} color={c.accent} />
      <KolamRow y={782} count={13} step={36} color={c.accent} />
      <FitText x={300} y={178} text={name} size={38} maxWidth={440} fill={c.ink} font="serif" weight={700} />
      {qr(155, 204, 290, { radius: 10 })}
      <FitText x={300} y={558} text={headline} size={40} maxWidth={440} fill={c.ink} font="serif" weight={700} />
      <FitText x={300} y={596} text={subline} size={20} maxWidth={420} fill={c.ink} opacity={0.75} />
      <Pill cx={300} cy={660} text={table} fill={c.accent} color={c.paper} size={20} />
    </>
  );
}

export function ArabesqueCard({ uid, colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  const tile = `${uid}-zellige`;
  return (
    <>
      <defs>
        <pattern id={tile} width={60} height={60} patternUnits="userSpaceOnUse">
          <rect width={60} height={60} fill={c.paper} />
          <polygon points={eightPoint(30, 30, 17)} fill={c.accent} opacity={0.32} />
          {[[0, 0], [60, 0], [0, 60], [60, 60]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r={6} fill={c.accent} opacity={0.32} />)}
        </pattern>
      </defs>
      <rect width={W} height={H} fill={`url(#${tile})`} />
      <path d="M84 812 V330 C84 226 180 164 300 84 C420 164 516 226 516 330 V812 Z" fill={c.paper} stroke={c.accent} strokeWidth={5} />
      <path d="M104 792 V334 C104 240 192 186 300 110 C408 186 496 240 496 334 V792 Z" fill="none" stroke={c.accent} strokeWidth={1.5} />
      <line x1={300} y1={34} x2={300} y2={66} stroke={c.accent} strokeWidth={3} />
      <circle cx={300} cy={44} r={5} fill={c.accent} />
      <circle cx={300} cy={72} r={9} fill={c.accent} />
      <polygon points={eightPoint(300, 206, 16)} fill={c.accent} />
      <FitText x={300} y={262} text={name} size={34} maxWidth={300} fill={c.ink} font="serif" weight={700} />
      {qr(165, 290, 270, { radius: 8 })}
      <FitText x={300} y={622} text={headline} size={36} maxWidth={370} fill={c.ink} font="serif" weight={700} />
      <FitText x={300} y={658} text={subline} size={19} maxWidth={360} fill={c.ink} opacity={0.72} />
      <Pill cx={300} cy={726} text={table} fill={c.accent} color={c.paper} size={20} />
    </>
  );
}

export function RopeCard({ uid, colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  const rope = `${uid}-rope`;
  return (
    <>
      <defs>
        <pattern id={rope} width={14} height={14} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width={14} height={14} fill={c.accent} />
          <rect width={6} height={14} fill={c.ink} opacity={0.3} />
        </pattern>
      </defs>
      <Paper w={W} h={H} fill={c.paper} />
      <rect x={38} y={38} width={524} height={770} rx={44} fill="none" stroke={`url(#${rope})`} strokeWidth={16} />
      <rect x={58} y={58} width={484} height={730} rx={30} fill="none" stroke={c.accent} strokeWidth={1.5} opacity={0.6} />
      <g fill="none" stroke={c.ink} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round">
        <circle cx={300} cy={104} r={12} />
        <line x1={300} y1={116} x2={300} y2={204} />
        <line x1={274} y1={138} x2={326} y2={138} />
        <path d="M256 176 Q 262 208 300 208 Q 338 208 344 176" />
      </g>
      <polygon points="244,186 256,164 268,184" fill={c.ink} />
      <polygon points="356,186 344,164 332,184" fill={c.ink} />
      <FitText x={300} y={262} text={name} size={38} maxWidth={420} fill={c.ink} font="serif" weight={700} />
      {qr(165, 286, 270, { radius: 8 })}
      <FitText x={300} y={616} text={headline} size={40} maxWidth={420} fill={c.ink} font="serif" weight={700} />
      <FitText x={300} y={654} text={subline} size={20} maxWidth={420} fill={c.ink} opacity={0.72} />
      <Pill cx={300} cy={718} text={table} fill={c.ink} color={c.paper} size={20} />
      <path d={wavePath(170, 770, 260, 5, 40)} fill="none" stroke={c.accent} strokeWidth={3} strokeLinecap="round" opacity={0.8} />
    </>
  );
}

export function ThaliCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  const bowls: [number, number, string][] = [[300, 190, "#E5A823"], [110, 380, "#C0461C"], [490, 380, "#4C8C3A"], [300, 570, "#F6F1E6"]];
  const minis = [45, 135, 225, 315].map((a) => {
    const r = (a * Math.PI) / 180;
    return [300 + Math.cos(r) * 226, 380 + Math.sin(r) * 226] as const;
  });
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      <FitText x={300} y={96} text={name} size={38} maxWidth={460} fill={c.ink} font="serif" weight={700} />
      <circle cx={306} cy={388} r={250} fill={c.ink} opacity={0.08} />
      <circle cx={300} cy={380} r={250} fill={c.accent} />
      <circle cx={300} cy={380} r={234} fill="none" stroke={c.ink} strokeWidth={2} opacity={0.15} />
      <circle cx={300} cy={380} r={170} fill="#FFFFFF" opacity={0.18} />
      {bowls.map(([x, y, food]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r={40} fill={c.paper} stroke={c.ink} strokeOpacity={0.2} strokeWidth={3} />
          <circle cx={x} cy={y} r={30} fill={food} />
        </g>
      ))}
      {minis.map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r={14} fill={c.paper} stroke={c.ink} strokeOpacity={0.2} strokeWidth={2} />
          <circle cx={x} cy={y} r={8} fill={c.ink} opacity={0.2} />
        </g>
      ))}
      {qr(170, 250, 260, { radius: 10 })}
      <FitText x={300} y={692} text={headline} size={40} maxWidth={460} fill={c.ink} font="serif" weight={700} />
      <FitText x={300} y={730} text={subline} size={20} maxWidth={440} fill={c.ink} opacity={0.72} />
      <Pill cx={300} cy={792} text={table} fill={c.ink} color={c.paper} size={20} />
    </>
  );
}

function Stalk({ x, w, top, bottom, color, node }: { x: number; w: number; top: number; bottom: number; color: string; node: string }) {
  const nodes: React.ReactNode[] = [];
  for (let y = top + 90; y < bottom; y += 110) nodes.push(<rect key={y} x={x - 2} y={y} width={w + 4} height={6} rx={3} fill={node} opacity={0.35} />);
  return (
    <g>
      <rect x={x} y={top} width={w} height={bottom - top} rx={w / 2} fill={color} />
      {nodes}
      <rect x={x + w * 0.2} y={top + 10} width={w * 0.18} height={bottom - top - 20} rx={2} fill="#FFFFFF" opacity={0.25} />
    </g>
  );
}

function LeafCluster({ x, y, angle, color }: { x: number; y: number; angle: number; color: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      {[-30, 0, 30].map((a) => <ellipse key={a} cx={0} cy={0} rx={44} ry={9} fill={color} transform={`rotate(${a}) translate(44 0)`} />)}
    </g>
  );
}

export function BambooCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      <Stalk x={22} w={30} top={-20} bottom={H + 20} color={c.accent} node={c.ink} />
      <Stalk x={62} w={18} top={260} bottom={H + 20} color={c.accent} node={c.ink} />
      <Stalk x={548} w={30} top={-20} bottom={H + 20} color={c.accent} node={c.ink} />
      <Stalk x={520} w={18} top={-20} bottom={520} color={c.accent} node={c.ink} />
      <LeafCluster x={60} y={300} angle={60} color={c.accent} />
      <LeafCluster x={80} y={620} angle={40} color={c.accent} />
      <LeafCluster x={540} y={240} angle={120} color={c.accent} />
      <LeafCluster x={540} y={700} angle={230} color={c.accent} />
      <FitText x={300} y={140} text={name} size={38} maxWidth={340} fill={c.ink} font="serif" weight={700} />
      {qr(155, 186, 290, { radius: 10 })}
      <FitText x={300} y={552} text={headline} size={40} maxWidth={360} fill={c.ink} font="serif" weight={700} />
      <FitText x={300} y={590} text={subline} size={20} maxWidth={340} fill={c.ink} opacity={0.72} />
      <Pill cx={300} cy={652} text={table} fill={c.ink} color={c.paper} size={20} />
      <path d="M206 724 Q300 672 394 724 Z" fill={c.accent} />
      <circle cx={300} cy={694} r={8} fill={c.accent} />
      <rect x={206} y={724} width={188} height={52} rx={12} fill={c.accent} />
      <line x1={212} y1={742} x2={388} y2={742} stroke={c.ink} strokeWidth={3} opacity={0.3} />
      <line x1={212} y1={760} x2={388} y2={760} stroke={c.ink} strokeWidth={3} opacity={0.3} />
    </>
  );
}

export function ButcherCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  // Handle crosses the centre, blade sits out at the end, so the pair reads as crossed cleavers.
  const cleaver = (
    <>
      <rect x={-50} y={-5} width={58} height={10} rx={5} />
      <path d="M6 -12 H52 Q58 -12 58 -6 V20 Q58 26 52 26 H6 Z" />
      <circle cx={48} cy={-2} r={4} fill={c.accent} />
    </>
  );
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      <rect x={22} y={22} width={556} height={802} fill="none" stroke={c.ink} strokeWidth={4} />
      <rect x={34} y={34} width={532} height={778} fill="none" stroke={c.ink} strokeWidth={1.5} />
      <circle cx={300} cy={132} r={70} fill={c.accent} />
      <circle cx={300} cy={132} r={60} fill="none" stroke={c.paper} strokeWidth={2} strokeDasharray="3 5" />
      <g transform="translate(300 140) rotate(-45)" fill={c.paper}>{cleaver}</g>
      <g transform="translate(300 140) scale(-1 1) rotate(-45)" fill={c.paper}>{cleaver}</g>
      <polygon points={starPoints(196, 132, 12)} fill={c.accent} />
      <polygon points={starPoints(404, 132, 12)} fill={c.accent} />
      <polygon points="96,190 504,190 486,216 504,242 96,242 114,216" fill={c.ink} />
      <FitText x={300} y={227} text={name} size={28} maxWidth={340} fill={c.paper} font="display" weight={800} caps spacing={3} />
      {qr(160, 270, 280, { radius: 6 })}
      <FitText x={300} y={612} text={headline} size={42} maxWidth={460} fill={c.ink} font="serif" weight={800} />
      <FitText x={300} y={650} text={subline} size={20} maxWidth={440} fill={c.ink} opacity={0.72} />
      <Pill cx={300} cy={714} text={table} fill={c.accent} color={c.paper} size={20} />
      <line x1={140} y1={772} x2={460} y2={772} stroke={c.ink} strokeWidth={1.5} />
      <polygon points={starPoints(300, 772, 9)} fill={c.accent} stroke={c.paper} strokeWidth={4} paintOrder="stroke" />
    </>
  );
}
