import React from "react";
import { QR_FRAME_VIEWBOX } from "@/constants/qrCodes.constants";
import type { QrFrameRenderProps } from "@/types";
import {
  Branch, eightPoint, FitText, Flower, Paper, Pill, Rosette, StarRow, starPoints, wavePath,
} from "./primitives";

/*
 * Portrait table cards, drawn on a 600 × 846 canvas (A-series proportions).
 * The QR always sits on a solid plate about half the card wide; text shrinks
 * to fit. Colours: paper = background, ink = text, accent = ornaments.
 */
const [W, H] = QR_FRAME_VIEWBOX.card;

/* ── Any business ──────────────────────────────────────────────────────── */

export function ClassicCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      <rect x={28} y={28} width={544} height={790} rx={18} fill="none" stroke={c.accent} strokeWidth={2.5} />
      <rect x={40} y={40} width={520} height={766} rx={12} fill="none" stroke={c.accent} strokeWidth={1} opacity={0.45} />
      <FitText x={300} y={124} text={name} size={36} maxWidth={440} fill={c.ink} font="serif" weight={600} />
      <line x1={262} y1={152} x2={338} y2={152} stroke={c.accent} strokeWidth={2} />
      <Pill cx={300} cy={194} text={table} fill={c.accent} color={c.paper} />
      {qr(150, 232, 300, { radius: 16 })}
      <FitText x={300} y={608} text={headline} size={46} maxWidth={480} fill={c.ink} font="serif" weight={700} />
      <FitText x={300} y={654} text={subline} size={22} maxWidth={460} fill={c.ink} opacity={0.72} />
      {[264, 300, 336].map((x) => (
        <rect key={x} x={x - 5} y={735} width={10} height={10} fill={c.accent} transform={`rotate(45 ${x} 740)`} />
      ))}
    </>
  );
}

export function ScanTabCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      <FitText x={300} y={112} text={name} size={32} maxWidth={460} fill={c.ink} font="display" weight={700} />
      <Pill cx={300} cy={160} text={table} fill={c.ink} color={c.paper} size={20} />
      <rect x={110} y={200} width={380} height={380} rx={36} fill={c.accent} />
      {qr(140, 230, 320, { radius: 22 })}
      <polygon points="282,602 318,602 300,584" fill={c.accent} />
      <rect x={110} y={600} width={380} height={96} rx={28} fill={c.accent} />
      <FitText x={300} y={662} text={headline} size={40} maxWidth={340} fill={c.paper} font="display" weight={800} caps spacing={1} />
      <FitText x={300} y={752} text={subline} size={22} maxWidth={460} fill={c.ink} opacity={0.75} />
    </>
  );
}

export function ArchCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      <polygon points={starPoints(300, 64, 16, 7, 4)} fill={c.accent} />
      <circle cx={262} cy={64} r={4} fill={c.accent} />
      <circle cx={338} cy={64} r={4} fill={c.accent} />
      <path d="M80 776 V330 A220 220 0 0 1 520 330 V776 Z" fill={c.accent} />
      <path d="M96 760 V330 A204 204 0 0 1 504 330 V760 Z" fill="none" stroke={c.paper} strokeWidth={2} opacity={0.55} />
      <FitText x={300} y={238} text={name} size={30} maxWidth={300} fill={c.ink} font="serif" weight={600} italic />
      {qr(160, 268, 280, { radius: 16 })}
      <FitText x={300} y={612} text={headline} size={44} maxWidth={380} fill={c.ink} font="serif" weight={600} />
      <FitText x={300} y={654} text={subline} size={20} maxWidth={360} fill={c.ink} opacity={0.72} />
      <Pill cx={300} cy={712} text={table} fill={c.paper} color={c.accent} size={20} />
    </>
  );
}

export function TicketCard({ uid, colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  const mask = `${uid}-ticket`;
  return (
    <>
      <defs>
        <mask id={mask}>
          <rect width={W} height={H} fill="#fff" />
          <circle cx={0} cy={640} r={30} fill="#000" />
          <circle cx={W} cy={640} r={30} fill="#000" />
        </mask>
      </defs>
      <rect width={W} height={H} rx={28} fill={c.paper} mask={`url(#${mask})`} />
      <rect x={26} y={26} width={548} height={794} rx={18} fill="none" stroke={c.accent} strokeWidth={2} strokeDasharray="2 9" strokeLinecap="round" />
      <FitText x={300} y={100} text={name} size={32} maxWidth={460} fill={c.ink} font="display" weight={800} caps spacing={2} />
      <StarRow cx={300} y={138} count={3} gap={34} r={9} colors={[c.ink]} />
      {qr(150, 172, 300, { radius: 14 })}
      <FitText x={300} y={548} text={headline} size={44} maxWidth={480} fill={c.ink} font="display" weight={800} caps />
      <FitText x={300} y={590} text={subline} size={20} maxWidth={460} fill={c.ink} opacity={0.75} />
      <line x1={44} y1={640} x2={556} y2={640} stroke={c.ink} strokeWidth={3} strokeDasharray="10 10" opacity={0.45} />
      {table ? (
        <FitText x={300} y={768} text={table} size={64} maxWidth={460} fill={c.ink} font="display" weight={800} caps />
      ) : (
        <StarRow cx={300} y={744} count={5} gap={56} r={14} colors={[c.ink, c.accent]} />
      )}
    </>
  );
}

export function BloomCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  const leaf = (x: number, y: number, a: number, s = 40) => (
    <ellipse key={`${x}-${y}`} cx={x} cy={y} rx={s / 2} ry={s / 5} fill={c.ink} opacity={0.55} transform={`rotate(${a} ${x} ${y})`} />
  );
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      <g>
        {leaf(150, 120, -30)}
        {leaf(450, 120, 30)}
        {leaf(220, 70, -60, 34)}
        {leaf(380, 70, 60, 34)}
        {leaf(90, 190, 20)}
        {leaf(510, 190, -20)}
        {leaf(260, 170, 70, 30)}
        {leaf(340, 170, -70, 30)}
        <Flower cx={300} cy={92} r={44} petal={c.accent} center={c.paper} />
        <Flower cx={190} cy={150} r={30} petal={c.accent} center={c.ink} />
        <Flower cx={410} cy={150} r={30} petal={c.accent} center={c.ink} />
        <Flower cx={80} cy={90} r={24} petal={c.ink} center={c.accent} />
        <Flower cx={520} cy={90} r={24} petal={c.ink} center={c.accent} />
        {[[130, 60], [470, 60], [250, 200], [350, 200], [40, 160], [560, 160]].map(([x, y]) => (
          <circle key={`${x}${y}`} cx={x} cy={y} r={5} fill={c.accent} />
        ))}
      </g>
      <FitText x={300} y={282} text={name} size={44} maxWidth={480} fill={c.ink} font="serif" weight={700} />
      {qr(155, 318, 290, { radius: 18 })}
      <FitText x={300} y={684} text={headline} size={40} maxWidth={480} fill={c.ink} font="serif" weight={600} />
      <FitText x={300} y={726} text={subline} size={20} maxWidth={460} fill={c.ink} opacity={0.72} />
      <Pill cx={300} cy={784} text={table} fill={c.accent} color={c.paper} size={20} />
      <Flower cx={58} cy={790} r={22} petal={c.accent} center={c.ink} />
      <Flower cx={542} cy={790} r={22} petal={c.accent} center={c.ink} />
    </>
  );
}

/* ── Restaurants ───────────────────────────────────────────────────────── */

export function TrattoriaCard({ uid, colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  const check = `${uid}-check`;
  return (
    <>
      <defs>
        <pattern id={check} width={40} height={40} patternUnits="userSpaceOnUse">
          <rect width={40} height={40} fill={c.paper} />
          <rect width={20} height={40} fill={c.accent} opacity={0.5} />
          <rect width={40} height={20} fill={c.accent} opacity={0.5} />
        </pattern>
      </defs>
      <Paper w={W} h={H} fill={c.paper} />
      <rect width={W} height={120} fill={`url(#${check})`} />
      <rect y={726} width={W} height={120} fill={`url(#${check})`} />
      <line x1={0} y1={121} x2={W} y2={121} stroke={c.accent} strokeWidth={3} />
      <line x1={0} y1={725} x2={W} y2={725} stroke={c.accent} strokeWidth={3} />
      <Pill cx={300} cy={60} text={table} fill={c.paper} color={c.accent} size={22} />
      <FitText x={300} y={200} text={name} size={44} maxWidth={480} fill={c.ink} font="serif" weight={600} italic />
      <line x1={220} y1={230} x2={280} y2={230} stroke={c.accent} strokeWidth={2} />
      <line x1={320} y1={230} x2={380} y2={230} stroke={c.accent} strokeWidth={2} />
      <rect x={294} y={224} width={12} height={12} fill={c.accent} transform="rotate(45 300 230)" />
      {qr(155, 262, 290, { radius: 10 })}
      <FitText x={300} y={622} text={headline} size={42} maxWidth={480} fill={c.ink} font="serif" weight={700} />
      <FitText x={300} y={664} text={subline} size={24} maxWidth={460} fill={c.ink} font="text" italic weight={500} opacity={0.78} />
    </>
  );
}

function DecoFan({ x, y, rotate, color }: { x: number; y: number; rotate: number; color: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`} stroke={color} fill="none" strokeWidth={1.5}>
      <path d="M0 64 A64 64 0 0 1 64 0" />
      <path d="M0 44 A44 44 0 0 1 44 0" />
      {[0, 15, 30, 45, 60, 75, 90].map((a) => {
        const r = (a * Math.PI) / 180;
        return <line key={a} x1={0} y1={0} x2={Math.sin(r) * 64} y2={Math.cos(r) * 64} />;
      })}
    </g>
  );
}

export function DecoCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      <rect x={24} y={24} width={552} height={798} fill="none" stroke={c.accent} strokeWidth={3} />
      <rect x={36} y={36} width={528} height={774} fill="none" stroke={c.accent} strokeWidth={1} />
      <DecoFan x={36} y={36} rotate={0} color={c.accent} />
      <DecoFan x={564} y={36} rotate={90} color={c.accent} />
      <DecoFan x={564} y={810} rotate={180} color={c.accent} />
      <DecoFan x={36} y={810} rotate={270} color={c.accent} />
      <rect x={292} y={62} width={16} height={16} fill={c.accent} transform="rotate(45 300 70)" />
      <FitText x={300} y={150} text={name} size={38} maxWidth={420} fill={c.ink} font="serif" weight={500} caps spacing={6} />
      <line x1={200} y1={182} x2={286} y2={182} stroke={c.accent} strokeWidth={1.5} />
      <line x1={314} y1={182} x2={400} y2={182} stroke={c.accent} strokeWidth={1.5} />
      <rect x={295} y={177} width={10} height={10} fill={c.accent} transform="rotate(45 300 182)" />
      <rect x={143} y={208} width={314} height={314} fill="none" stroke={c.accent} strokeWidth={1.5} />
      {qr(155, 220, 290, { radius: 4 })}
      <FitText x={300} y={600} text={headline} size={40} maxWidth={440} fill={c.ink} font="serif" weight={400} italic />
      <FitText x={300} y={640} text={subline} size={16} maxWidth={420} fill={c.accent} caps spacing={4} weight={600} />
      <Pill cx={300} cy={712} text={table} fill={c.accent} color={c.paper} size={20} font="serif" />
      {[260, 300, 340].map((x) => (
        <rect key={x} x={x - 4} y={772} width={8} height={8} fill={c.accent} transform={`rotate(45 ${x} 776)`} />
      ))}
    </>
  );
}

export function MandalaCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      <Rosette cx={0} cy={0} r={120} petals={12} color={c.accent} ring={c.paper} />
      <Rosette cx={W} cy={0} r={120} petals={12} color={c.accent} ring={c.paper} />
      <Rosette cx={0} cy={H} r={120} petals={12} color={c.accent} ring={c.paper} />
      <Rosette cx={W} cy={H} r={120} petals={12} color={c.accent} ring={c.paper} />
      <rect x={20} y={20} width={560} height={806} fill="none" stroke={c.accent} strokeWidth={2} />
      <rect x={32} y={32} width={536} height={782} fill="none" stroke={c.accent} strokeWidth={4} strokeDasharray="0.1 12" strokeLinecap="round" />
      <Rosette cx={300} cy={96} r={36} petals={8} color={c.accent} ring={c.paper} />
      <FitText x={300} y={192} text={name} size={40} maxWidth={420} fill={c.ink} font="serif" weight={700} />
      {qr(155, 226, 290, { radius: 18 })}
      <FitText x={300} y={590} text={headline} size={42} maxWidth={440} fill={c.ink} font="serif" weight={700} />
      <FitText x={300} y={630} text={subline} size={20} maxWidth={420} fill={c.ink} opacity={0.75} />
      <Pill cx={300} cy={690} text={table} fill={c.accent} color={c.paper} size={20} />
      <Rosette cx={300} cy={760} r={28} petals={8} color={c.accent} ring={c.paper} />
    </>
  );
}

export function WavesCard({ uid, colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  const clip = `${uid}-waves`;
  const initial = (name.trim()[0] ?? "").toUpperCase();
  const scales: React.ReactNode[] = [];
  for (let row = 0; row < 12; row++) {
    const y = 650 + row * 20;
    const offset = row % 2 === 0 ? 0 : 40;
    for (let x = -40 + offset; x <= W + 40; x += 80) {
      scales.push(
        <g key={`${row}-${x}`}>
          <circle cx={x} cy={y} r={40} fill={c.accent} />
          <circle cx={x} cy={y} r={31} fill={c.paper} />
          <circle cx={x} cy={y} r={22} fill={c.accent} />
          <circle cx={x} cy={y} r={13} fill={c.paper} />
        </g>,
      );
    }
  }
  return (
    <>
      <defs>
        <clipPath id={clip}>
          <rect x={0} y={640} width={W} height={H - 640} />
        </clipPath>
      </defs>
      <Paper w={W} h={H} fill={c.paper} />
      <g clipPath={`url(#${clip})`}>{scales}</g>
      <line x1={0} y1={640} x2={W} y2={640} stroke={c.accent} strokeWidth={3} />
      {initial ? (
        <g>
          <rect x={496} y={40} width={64} height={64} rx={8} fill={c.accent} />
          <FitText x={528} y={86} text={initial} size={40} maxWidth={50} fill={c.paper} font="serif" weight={700} />
        </g>
      ) : null}
      <Pill cx={300} cy={92} text={table} fill={c.ink} color={c.paper} size={20} />
      <FitText x={300} y={170} text={name} size={40} maxWidth={360} fill={c.ink} font="serif" weight={600} />
      <line x1={250} y1={194} x2={350} y2={194} stroke={c.accent} strokeWidth={2} />
      {qr(160, 218, 280, { radius: 6 })}
      <FitText x={300} y={558} text={headline} size={40} maxWidth={460} fill={c.ink} font="serif" weight={600} />
      <FitText x={300} y={598} text={subline} size={20} maxWidth={440} fill={c.ink} opacity={0.72} />
    </>
  );
}

export function TilesCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  const band = (y: number) => (
    <g>
      <rect x={0} y={y} width={W} height={90} fill={c.accent} />
      {Array.from({ length: 11 }, (_, i) => {
        const cx = i * 60;
        return (
          <g key={i}>
            <polygon points={eightPoint(cx, y + 45, 26)} fill={c.paper} />
            <polygon points={eightPoint(cx, y + 45, 11)} fill={c.accent} />
            <rect x={cx + 26} y={y + 41} width={8} height={8} fill={c.paper} transform={`rotate(45 ${cx + 30} ${y + 45})`} />
          </g>
        );
      })}
    </g>
  );
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      {band(0)}
      {band(756)}
      <FitText x={300} y={142} text={name} size={36} maxWidth={460} fill={c.ink} font="serif" weight={700} />
      <path d="M128 548 V272 Q128 208 300 180 Q472 208 472 272 V548 Z" fill={c.accent} fillOpacity={0.08} stroke={c.accent} strokeWidth={3} />
      {qr(155, 232, 290, { radius: 8 })}
      <FitText x={300} y={612} text={headline} size={42} maxWidth={460} fill={c.ink} font="serif" weight={700} />
      <FitText x={300} y={652} text={subline} size={20} maxWidth={440} fill={c.ink} opacity={0.75} />
      <Pill cx={300} cy={708} text={table} fill={c.accent} color={c.paper} size={20} />
    </>
  );
}

export function BuntingCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  const curve = (x: number) => {
    const t = x / W;
    return (1 - t) ** 2 * 26 + 2 * (1 - t) * t * 96 + t ** 2 * 26;
  };
  const fills = [c.accent, c.ink, c.accent];
  const flags = Array.from({ length: 8 }, (_, i) => {
    const x = 22 + i * 75;
    const y = curve(x + 30);
    const fill = fills[i % fills.length];
    // Right to left, so the zigzag closes the flag instead of crossing it.
    const zig = Array.from({ length: 6 }, (_, k) => `${x + 60 - k * 12} ${y + 82 - (k % 2 === 0 ? 0 : 12)}`).join(" L ");
    return (
      <g key={i} opacity={i % 3 === 1 ? 0.88 : 1}>
        <path d={`M ${x} ${y} H ${x + 60} V ${y + 82} L ${zig} Z`} fill={fill} />
        <circle cx={x + 30} cy={y + 30} r={9} fill={c.paper} />
        <rect x={x + 12} y={y + 50} width={8} height={8} fill={c.paper} transform={`rotate(45 ${x + 16} ${y + 54})`} />
        <rect x={x + 40} y={y + 50} width={8} height={8} fill={c.paper} transform={`rotate(45 ${x + 44} ${y + 54})`} />
      </g>
    );
  });
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      <path d={`M 0 26 Q 300 166 600 26`} fill="none" stroke={c.ink} strokeWidth={2} />
      {flags}
      <FitText x={300} y={248} text={name} size={44} maxWidth={480} fill={c.ink} font="display" weight={800} />
      {qr(155, 282, 290, { radius: 16 })}
      <FitText x={300} y={638} text={headline} size={44} maxWidth={480} fill={c.ink} font="display" weight={800} />
      <FitText x={300} y={678} text={subline} size={20} maxWidth={460} fill={c.ink} opacity={0.75} />
      <Pill cx={300} cy={736} text={table} fill={c.accent} color={c.paper} size={20} />
      <path d={wavePath(0, 806, W, 8, 40)} fill="none" stroke={c.accent} strokeWidth={3} />
    </>
  );
}

function Anchor({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g transform={`translate(${x} ${y})`} fill="none" stroke={color} strokeWidth={5} strokeLinecap="round">
      <circle cx={0} cy={-30} r={8} />
      <line x1={0} y1={-22} x2={0} y2={30} />
      <line x1={-16} y1={-10} x2={16} y2={-10} />
      <path d="M -26 14 Q -22 34 0 34 Q 22 34 26 14" />
    </g>
  );
}

export function HarbourCard({ uid, colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  const rope = `${uid}-rope`;
  return (
    <>
      <defs>
        <pattern id={rope} width={12} height={12} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width={12} height={12} fill={c.accent} />
          <rect width={4} height={12} fill={c.paper} opacity={0.75} />
        </pattern>
      </defs>
      <Paper w={W} h={H} fill={c.paper} />
      <rect x={24} y={24} width={552} height={798} rx={30} fill="none" stroke={`url(#${rope})`} strokeWidth={12} />
      <Anchor x={300} y={86} color={c.accent} />
      <FitText x={300} y={180} text={name} size={40} maxWidth={440} fill={c.ink} font="serif" weight={700} />
      {qr(155, 214, 290, { radius: 14 })}
      <FitText x={300} y={574} text={headline} size={42} maxWidth={460} fill={c.ink} font="serif" weight={700} />
      <FitText x={300} y={614} text={subline} size={20} maxWidth={440} fill={c.ink} opacity={0.75} />
      <Pill cx={300} cy={672} text={table} fill={c.accent} color={c.paper} size={20} />
      {[732, 758, 784].map((y, i) => (
        <path key={y} d={wavePath(60, y, 480, 7, 60)} fill="none" stroke={c.accent} strokeWidth={4} opacity={1 - i * 0.25} strokeLinecap="round" />
      ))}
    </>
  );
}

/* ── Quick & casual ────────────────────────────────────────────────────── */

export function AwningCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      {Array.from({ length: 12 }, (_, i) => {
        const x = i * 50;
        return (
          <path key={i} d={`M ${x} 0 H ${x + 50} V 128 A 25 25 0 0 1 ${x} 128 Z`} fill={c.accent} opacity={i % 2 === 0 ? 1 : 0.35} />
        );
      })}
      <rect width={W} height={18} fill={c.ink} opacity={0.88} />
      <FitText x={300} y={232} text={name} size={44} maxWidth={480} fill={c.ink} font="display" weight={800} caps spacing={1} />
      {qr(155, 264, 290, { radius: 20 })}
      <FitText x={300} y={622} text={headline} size={44} maxWidth={480} fill={c.accent} font="display" weight={800} />
      <FitText x={300} y={662} text={subline} size={20} maxWidth={460} fill={c.ink} opacity={0.75} />
      <Pill cx={300} cy={728} text={table} fill={c.ink} color={c.paper} size={20} />
      <rect y={796} width={W} height={50} fill={c.accent} />
      <rect y={790} width={W} height={6} fill={c.ink} opacity={0.88} />
    </>
  );
}

export function SprigCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      <Branch cx={0} cy={0} radius={150} from={8} to={82} leaves={9} leaf={46} color={c.accent} />
      <Branch cx={W} cy={0} radius={150} from={172} to={98} leaves={9} leaf={46} color={c.accent} />
      <Branch cx={0} cy={H} radius={130} from={-8} to={-80} leaves={7} leaf={42} color={c.accent} />
      <Branch cx={W} cy={H} radius={130} from={188} to={260} leaves={7} leaf={42} color={c.accent} />
      <FitText x={300} y={180} text={name} size={40} maxWidth={360} fill={c.ink} font="serif" weight={600} />
      <ellipse cx={288} cy={202} rx={12} ry={4} fill={c.accent} transform="rotate(-25 288 202)" />
      <ellipse cx={312} cy={202} rx={12} ry={4} fill={c.accent} transform="rotate(25 312 202)" />
      {qr(155, 222, 290, { radius: 24 })}
      <FitText x={300} y={584} text={headline} size={42} maxWidth={440} fill={c.ink} font="serif" weight={700} />
      <FitText x={300} y={624} text={subline} size={20} maxWidth={420} fill={c.ink} opacity={0.72} />
      <Pill cx={300} cy={684} text={table} fill={c.accent} color={c.paper} size={20} />
    </>
  );
}

/* ── Cafés & sweets ────────────────────────────────────────────────────── */

export function SteamCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      <g>
        {[276, 300, 324].map((x) => (
          <path key={x} d={`M ${x} 118 c -12 -12 12 -24 0 -36 c -12 -12 12 -24 0 -30`} fill="none" stroke={c.accent} strokeWidth={5} strokeLinecap="round" opacity={0.7} />
        ))}
        <path d="M245 128 H355 V162 Q355 194 325 194 H275 Q245 194 245 162 Z" fill={c.accent} />
        <path d="M355 138 q 30 0 30 18 q 0 18 -30 18" fill="none" stroke={c.accent} strokeWidth={8} />
        <ellipse cx={300} cy={202} rx={84} ry={10} fill={c.accent} />
      </g>
      <FitText x={300} y={268} text={name} size={40} maxWidth={460} fill={c.ink} font="serif" weight={600} />
      {qr(160, 298, 280, { radius: 18 })}
      <FitText x={300} y={642} text={headline} size={40} maxWidth={460} fill={c.ink} font="serif" weight={600} italic />
      <FitText x={300} y={682} text={subline} size={20} maxWidth={440} fill={c.ink} opacity={0.72} />
      <Pill cx={300} cy={742} text={table} fill={c.accent} color={c.paper} size={20} />
    </>
  );
}

export function LaceCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  const scallops: React.ReactNode[] = [];
  for (let x = 40; x <= 560; x += 36) {
    scallops.push(<circle key={`t${x}`} cx={x} cy={40} r={18} fill={c.accent} />, <circle key={`b${x}`} cx={x} cy={806} r={18} fill={c.accent} />);
  }
  for (let y = 76; y <= 770; y += 36) {
    scallops.push(<circle key={`l${y}`} cx={40} cy={y} r={18} fill={c.accent} />, <circle key={`r${y}`} cx={560} cy={y} r={18} fill={c.accent} />);
  }
  const eyelets: React.ReactNode[] = [];
  for (let x = 58; x <= 542; x += 24) {
    eyelets.push(<circle key={`et${x}`} cx={x} cy={49} r={3.5} fill={c.paper} />, <circle key={`eb${x}`} cx={x} cy={797} r={3.5} fill={c.paper} />);
  }
  for (let y = 70; y <= 776; y += 24) {
    eyelets.push(<circle key={`el${y}`} cx={49} cy={y} r={3.5} fill={c.paper} />, <circle key={`er${y}`} cx={551} cy={y} r={3.5} fill={c.paper} />);
  }
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      {scallops}
      <rect x={40} y={40} width={520} height={766} fill={c.accent} />
      <rect x={58} y={58} width={484} height={730} fill={c.paper} />
      {eyelets}
      <rect x={76} y={76} width={448} height={694} fill="none" stroke={c.accent} strokeWidth={4} strokeDasharray="0.1 11" strokeLinecap="round" />
      <FitText x={300} y={172} text={name} size={40} maxWidth={400} fill={c.ink} font="serif" weight={600} italic />
      {qr(155, 210, 290, { radius: 24 })}
      <FitText x={300} y={576} text={headline} size={40} maxWidth={420} fill={c.ink} font="serif" weight={700} />
      <FitText x={300} y={616} text={subline} size={20} maxWidth={400} fill={c.ink} opacity={0.72} />
      <Pill cx={300} cy={684} text={table} fill={c.accent} color={c.paper} size={20} />
    </>
  );
}

/* ── Bars & lounges ────────────────────────────────────────────────────── */

export function LaurelCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  const notch = (inset: number, r: number) => {
    const a = inset;
    const b = W - inset;
    const t = inset;
    const btm = H - inset;
    return `M${a + r} ${t} H${b - r} A${r} ${r} 0 0 0 ${b} ${t + r} V${btm - r} A${r} ${r} 0 0 0 ${b - r} ${btm} H${a + r} A${r} ${r} 0 0 0 ${a} ${btm - r} V${t + r} A${r} ${r} 0 0 0 ${a + r} ${t} Z`;
  };
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      <path d={notch(32, 30)} fill="none" stroke={c.accent} strokeWidth={3} />
      <path d={notch(44, 24)} fill="none" stroke={c.accent} strokeWidth={1.2} />
      <Branch cx={300} cy={236} radius={196} from={162} to={236} leaves={10} leaf={42} color={c.accent} />
      <Branch cx={300} cy={236} radius={196} from={18} to={-56} leaves={10} leaf={42} color={c.accent} />
      <FitText x={300} y={222} text={name} size={34} maxWidth={250} fill={c.ink} font="serif" weight={700} />
      <StarRow cx={300} y={300} count={5} gap={56} r={13} colors={[c.ink, c.accent]} />
      {qr(172, 330, 256, { radius: 6 })}
      <FitText x={300} y={648} text={headline} size={40} maxWidth={420} fill={c.accent} font="serif" weight={800} caps />
      <FitText x={300} y={688} text={subline} size={20} maxWidth={320} fill={c.ink} opacity={0.8} />
      <Branch cx={300} cy={612} radius={186} from={150} to={104} leaves={6} leaf={36} color={c.accent} />
      <Branch cx={300} cy={612} radius={186} from={30} to={76} leaves={6} leaf={36} color={c.accent} />
      {table ? (
        <Pill cx={300} cy={766} text={table} fill={c.ink} color={c.paper} size={18} minWidth={100} />
      ) : (
        <polygon points={starPoints(300, 770, 15)} fill={c.ink} />
      )}
    </>
  );
}

function HopCone({ x, y, s, color, paper }: { x: number; y: number; s: number; color: string; paper: string }) {
  const rows = [1, 2, 3, 3, 2, 1];
  return (
    <g>
      <path d={`M ${x} ${y - s * 0.6} q ${s * 0.1} ${-s * 0.25} ${s * 0.3} ${-s * 0.3}`} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" />
      {rows.map((count, r) =>
        Array.from({ length: count }, (_, i) => {
          const cx = x + (i - (count - 1) / 2) * s * 0.3;
          const cy = y - s * 0.45 + r * s * 0.2;
          return <ellipse key={`${r}-${i}`} cx={cx} cy={cy} rx={s * 0.19} ry={s * 0.15} fill={color} stroke={paper} strokeWidth={2} />;
        }),
      )}
    </g>
  );
}

export function HopsCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      <path d="M70 120 H530 V560 Q530 760 300 822 Q70 760 70 560 Z" fill="none" stroke={c.accent} strokeWidth={4} />
      <path d="M84 134 H516 V560 Q516 748 300 806 Q84 748 84 560 Z" fill="none" stroke={c.accent} strokeWidth={1.5} />
      <HopCone x={70} y={88} s={90} color={c.accent} paper={c.paper} />
      <HopCone x={530} y={88} s={90} color={c.accent} paper={c.paper} />
      <ellipse cx={120} cy={60} rx={24} ry={10} fill={c.accent} opacity={0.7} transform="rotate(-25 120 60)" />
      <ellipse cx={480} cy={60} rx={24} ry={10} fill={c.accent} opacity={0.7} transform="rotate(25 480 60)" />
      <FitText x={300} y={204} text={name} size={38} maxWidth={380} fill={c.ink} font="display" weight={800} caps spacing={2} />
      {qr(165, 236, 270, { radius: 12 })}
      <FitText x={300} y={572} text={headline} size={38} maxWidth={400} fill={c.accent} font="display" weight={800} caps />
      <FitText x={300} y={610} text={subline} size={20} maxWidth={380} fill={c.ink} opacity={0.78} />
      <Pill cx={300} cy={676} text={table} fill={c.accent} color={c.paper} size={20} />
    </>
  );
}

function Grapes({ x, y, color }: { x: number; y: number; color: string }) {
  const rows = [4, 3, 2, 1];
  return (
    <g>
      {rows.map((count, r) =>
        Array.from({ length: count }, (_, i) => (
          <circle key={`${r}-${i}`} cx={x + (i - (count - 1) / 2) * 22} cy={y + r * 19} r={11} fill={color} />
        )),
      )}
    </g>
  );
}

export function VineCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  const leaf = (x: number, y: number, a: number) => (
    <g key={`${x}`} transform={`rotate(${a} ${x} ${y})`} fill={c.accent} opacity={0.85}>
      <circle cx={x} cy={y - 10} r={11} />
      <circle cx={x - 10} cy={y} r={10} />
      <circle cx={x + 10} cy={y} r={10} />
      <circle cx={x} cy={y + 6} r={9} />
    </g>
  );
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      <rect x={26} y={26} width={548} height={794} fill="none" stroke={c.accent} strokeWidth={1.5} />
      <path d={wavePath(60, 84, 480, 12, 120)} fill="none" stroke={c.accent} strokeWidth={3} />
      {leaf(120, 70, -20)}
      {leaf(240, 96, 15)}
      {leaf(360, 70, -15)}
      {leaf(480, 96, 20)}
      <Grapes x={180} y={100} color={c.accent} />
      <Grapes x={420} y={100} color={c.accent} />
      <FitText x={300} y={218} text={name} size={40} maxWidth={440} fill={c.ink} font="serif" weight={600} italic />
      {qr(160, 250, 280, { radius: 10 })}
      <FitText x={300} y={600} text={headline} size={40} maxWidth={440} fill={c.ink} font="serif" weight={600} />
      <FitText x={300} y={640} text={subline} size={22} maxWidth={420} fill={c.ink} font="text" italic opacity={0.78} />
      <Pill cx={300} cy={700} text={table} fill={c.accent} color={c.paper} size={20} />
      <path d={wavePath(60, 778, 480, 10, 120)} fill="none" stroke={c.accent} strokeWidth={2.5} opacity={0.8} />
    </>
  );
}

/* ── Shops ─────────────────────────────────────────────────────────────── */

export function TagCard({ uid, colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  const mask = `${uid}-tag`;
  return (
    <>
      <defs>
        <mask id={mask}>
          <rect width={W} height={H} fill="#fff" />
          <circle cx={300} cy={96} r={20} fill="#000" />
        </mask>
      </defs>
      <path d="M120 30 H480 L570 120 V816 H30 V120 Z" fill={c.paper} mask={`url(#${mask})`} />
      <circle cx={300} cy={96} r={30} fill="none" stroke={c.accent} strokeWidth={4} opacity={0.8} />
      <rect x={70} y={168} width={460} height={606} rx={14} fill={c.accent} />
      <rect x={82} y={180} width={436} height={582} rx={10} fill="none" stroke={c.ink} strokeWidth={1.5} strokeDasharray="6 6" opacity={0.4} />
      <FitText x={300} y={244} text={name} size={36} maxWidth={390} fill={c.ink} font="serif" weight={700} />
      <line x1={250} y1={266} x2={350} y2={266} stroke={c.ink} strokeWidth={1.5} opacity={0.5} />
      {qr(165, 282, 270, { radius: 8 })}
      <FitText x={300} y={612} text={headline} size={36} maxWidth={400} fill={c.ink} font="serif" weight={700} />
      <FitText x={300} y={650} text={subline} size={20} maxWidth={390} fill={c.ink} opacity={0.75} />
      <Pill cx={300} cy={714} text={table} fill={c.ink} color={c.accent} size={20} />
    </>
  );
}
