import React from "react";
import { QR_FRAME_VIEWBOX } from "@/constants/qrCodes.constants";
import type { QrFrameRenderProps } from "@/types";
import { Branch, FitText, Paper, Pill, Rosette, sparkle, wavePath } from "./primitives";

/* Portrait cards (600 × 846) drawn for particular cuisines and quick-service places. */
const [W, H] = QR_FRAME_VIEWBOX.card;

export function NorenCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  const initial = (name.trim()[0] ?? "").toUpperCase();
  const panels = [40, 216, 392];
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      {panels.map((x) => (
        <rect key={x} x={x} y={30} width={168} height={196} fill={c.accent} />
      ))}
      <rect x={24} y={20} width={552} height={12} rx={6} fill={c.ink} />
      <circle cx={300} cy={128} r={48} fill={c.paper} />
      <FitText x={300} y={146} text={initial} size={50} maxWidth={60} fill={c.accent} font="serif" weight={700} />
      <FitText x={300} y={290} text={name} size={38} maxWidth={460} fill={c.ink} font="serif" weight={600} />
      {qr(165, 318, 270, { radius: 6 })}
      <FitText x={300} y={652} text={headline} size={38} maxWidth={460} fill={c.ink} font="serif" weight={600} />
      <FitText x={300} y={690} text={subline} size={20} maxWidth={440} fill={c.ink} opacity={0.72} />
      <Pill cx={300} cy={750} text={table} fill={c.accent} color={c.paper} size={20} />
      <line x1={200} y1={800} x2={400} y2={800} stroke={c.accent} strokeWidth={2} />
    </>
  );
}

function Lantern({ x, color, ink }: { x: number; color: string; ink: string }) {
  return (
    <g>
      <line x1={x} y1={0} x2={x} y2={46} stroke={ink} strokeWidth={2} />
      <rect x={x - 22} y={44} width={44} height={12} rx={3} fill={ink} />
      <ellipse cx={x} cy={118} rx={52} ry={64} fill={color} />
      <ellipse cx={x} cy={118} rx={32} ry={64} fill="none" stroke={ink} strokeOpacity={0.25} strokeWidth={2} />
      <ellipse cx={x} cy={118} rx={12} ry={64} fill="none" stroke={ink} strokeOpacity={0.25} strokeWidth={2} />
      <rect x={x - 22} y={178} width={44} height={12} rx={3} fill={ink} />
      {[-8, 0, 8].map((dx) => (
        <line key={dx} x1={x + dx} y1={190} x2={x + dx} y2={226} stroke={color} strokeWidth={3} strokeLinecap="round" />
      ))}
    </g>
  );
}

export function LanternCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      <Lantern x={96} color={c.accent} ink={c.ink} />
      <Lantern x={504} color={c.accent} ink={c.ink} />
      <FitText x={300} y={132} text={name} size={40} maxWidth={300} fill={c.ink} font="serif" weight={600} />
      <line x1={250} y1={156} x2={350} y2={156} stroke={c.accent} strokeWidth={2} />
      {qr(155, 210, 290, { radius: 8 })}
      <FitText x={300} y={572} text={headline} size={40} maxWidth={460} fill={c.ink} font="serif" weight={600} />
      <FitText x={300} y={612} text={subline} size={20} maxWidth={440} fill={c.ink} opacity={0.72} />
      <Pill cx={300} cy={672} text={table} fill={c.accent} color={c.paper} size={20} />
      <path d={wavePath(40, 760, 520, 10, 52)} fill="none" stroke={c.accent} strokeWidth={4} />
      <path d={wavePath(40, 786, 520, 10, 52)} fill="none" stroke={c.accent} strokeWidth={4} opacity={0.5} />
    </>
  );
}

function Chilli({ x, y, rotate, scale = 1, color, stem }: { x: number; y: number; rotate: number; scale?: number; color: string; stem: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <path d="M0 0 C 22 -16 62 -12 86 8 C 62 0 26 8 0 12 Z" fill={color} />
      <path d="M2 6 c -8 -2 -14 -10 -14 -20" fill="none" stroke={stem} strokeWidth={5} strokeLinecap="round" />
    </g>
  );
}

export function SpiceCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  const top: [number, number, number][] = [[60, 70, 20], [180, 50, -10], [300, 76, 15], [420, 46, -20], [520, 80, 30]];
  const bottom: [number, number, number][] = [[50, 770, -20], [170, 800, 10], [400, 790, -15], [500, 760, 20]];
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      {[...top, ...bottom].map(([x, y, r]) => (
        <Chilli key={`${x}${y}`} x={x} y={y} rotate={r} color={c.accent} stem={c.ink} />
      ))}
      {[[130, 110], [250, 120], [370, 104], [470, 124], [110, 740], [290, 760], [340, 812], [560, 810]].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={6} fill={c.ink} opacity={0.8} />
      ))}
      <FitText x={300} y={182} text={name} size={40} maxWidth={440} fill={c.ink} font="display" weight={800} />
      {qr(155, 214, 290, { radius: 16 })}
      <FitText x={300} y={576} text={headline} size={42} maxWidth={460} fill={c.accent} font="display" weight={800} />
      <FitText x={300} y={616} text={subline} size={20} maxWidth={440} fill={c.ink} opacity={0.75} />
      <Pill cx={300} cy={676} text={table} fill={c.ink} color={c.paper} size={20} />
    </>
  );
}

export function BananaLeafCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  const veins = Array.from({ length: 19 }, (_, i) => 160 + i * 30);
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      <FitText x={300} y={82} text={name} size={34} maxWidth={460} fill={c.ink} font="serif" weight={700} />
      <path d="M300 112 C 470 150 524 380 504 724 C 420 768 180 768 96 724 C 76 380 130 150 300 112 Z" fill={c.accent} />
      {veins.map((y) => (
        <g key={y} stroke={c.paper} strokeOpacity={0.22} strokeWidth={2}>
          <line x1={300} y1={y} x2={110} y2={y + 46} />
          <line x1={300} y1={y} x2={490} y2={y + 46} />
        </g>
      ))}
      <line x1={300} y1={122} x2={300} y2={748} stroke={c.paper} strokeOpacity={0.5} strokeWidth={4} />
      {qr(165, 236, 270, { radius: 14 })}
      <FitText x={300} y={584} text={headline} size={38} maxWidth={360} fill={c.paper} font="serif" weight={700} />
      <FitText x={300} y={624} text={subline} size={20} maxWidth={340} fill={c.paper} opacity={0.88} />
      <Pill cx={300} cy={796} text={table} fill={c.accent} color={c.paper} size={20} />
    </>
  );
}

/** Points on the outline of a cusped (multifoil) arch, joined by small inward arcs. */
function cuspedArch(cx: number, baseY: number, rx: number, ry: number, lobes: number): string {
  const pts = Array.from({ length: lobes + 1 }, (_, i) => {
    const a = Math.PI - (Math.PI * i) / lobes;
    return [cx + rx * Math.cos(a), baseY - ry * Math.sin(a)];
  });
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const [x, y] = pts[i];
    const chord = Math.hypot(x - pts[i - 1][0], y - pts[i - 1][1]);
    d += ` A ${(chord * 0.62).toFixed(1)} ${(chord * 0.62).toFixed(1)} 0 0 1 ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}

export function JharokhaCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  const outer = `M 90 790 V 320 ${cuspedArch(300, 320, 210, 170, 7).replace(/^M [\d.]+ [\d.]+/, "")} V 790 Z`;
  const inner = `M 108 790 V 324 ${cuspedArch(300, 324, 192, 152, 7).replace(/^M [\d.]+ [\d.]+/, "")} V 790`;
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      <FitText x={300} y={74} text={name} size={34} maxWidth={460} fill={c.ink} font="serif" weight={700} />
      <line x1={300} y1={96} x2={300} y2={130} stroke={c.accent} strokeWidth={3} />
      <circle cx={300} cy={102} r={7} fill={c.accent} />
      <path d={outer} fill={c.accent} fillOpacity={0.12} stroke={c.accent} strokeWidth={4} />
      <path d={inner} fill="none" stroke={c.accent} strokeWidth={1.5} />
      <Rosette cx={140} cy={180} r={26} petals={8} color={c.accent} ring={c.paper} />
      <Rosette cx={460} cy={180} r={26} petals={8} color={c.accent} ring={c.paper} />
      {qr(165, 302, 270, { radius: 10 })}
      <FitText x={300} y={640} text={headline} size={38} maxWidth={360} fill={c.ink} font="serif" weight={700} />
      <FitText x={300} y={680} text={subline} size={20} maxWidth={350} fill={c.ink} opacity={0.75} />
      <Pill cx={300} cy={738} text={table} fill={c.accent} color={c.paper} size={20} />
      <line x1={50} y1={792} x2={550} y2={792} stroke={c.accent} strokeWidth={3} />
      <line x1={70} y1={804} x2={530} y2={804} stroke={c.accent} strokeWidth={1.5} />
    </>
  );
}

export function OliveCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  const olive = (deg: number) => {
    const a = (deg * Math.PI) / 180;
    const x = 300 + 272 * Math.cos(a);
    const y = 380 + 272 * Math.sin(a);
    return <ellipse key={deg} cx={x} cy={y} rx={9} ry={13} fill={c.ink} transform={`rotate(${deg} ${x} ${y})`} />;
  };
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      <FitText x={300} y={108} text={name} size={38} maxWidth={440} fill={c.ink} font="serif" weight={600} italic />
      <Branch cx={300} cy={380} radius={250} from={112} to={248} leaves={15} leaf={44} color={c.accent} />
      <Branch cx={300} cy={380} radius={250} from={68} to={-68} leaves={15} leaf={44} color={c.accent} />
      {[140, 170, 205, 232, 40, 10, -25, -52].map(olive)}
      {qr(165, 245, 270, { radius: 16 })}
      <FitText x={300} y={690} text={headline} size={40} maxWidth={460} fill={c.ink} font="serif" weight={700} />
      <FitText x={300} y={728} text={subline} size={20} maxWidth={440} fill={c.ink} opacity={0.72} />
      <Pill cx={300} cy={786} text={table} fill={c.accent} color={c.paper} size={20} />
    </>
  );
}

export function GrillCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  const flames = Array.from({ length: 11 }, (_, i) => {
    const x = 10 + i * 58;
    const h = 90 + ((i * 37) % 60);
    return (
      <g key={i}>
        <path d={`M ${x} ${H} C ${x - 34} ${H - h * 0.45} ${x - 8} ${H - h * 0.8} ${x} ${H - h} C ${x + 8} ${H - h * 0.8} ${x + 34} ${H - h * 0.45} ${x} ${H} Z`} fill={c.accent} />
        <path d={`M ${x} ${H} C ${x - 16} ${H - h * 0.3} ${x - 4} ${H - h * 0.5} ${x} ${H - h * 0.6} C ${x + 4} ${H - h * 0.5} ${x + 16} ${H - h * 0.3} ${x} ${H} Z`} fill={c.paper} opacity={0.4} />
      </g>
    );
  });
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      {[28, 46, 64, 82].map((y) => (
        <rect key={y} x={0} y={y} width={W} height={8} fill={c.accent} opacity={0.35} />
      ))}
      <FitText x={300} y={156} text={name} size={40} maxWidth={460} fill={c.ink} font="display" weight={800} caps spacing={2} />
      {qr(155, 190, 290, { radius: 10 })}
      <FitText x={300} y={552} text={headline} size={40} maxWidth={460} fill={c.accent} font="display" weight={800} caps />
      <FitText x={300} y={592} text={subline} size={20} maxWidth={440} fill={c.ink} opacity={0.8} />
      <Pill cx={300} cy={650} text={table} fill={c.accent} color={c.paper} size={20} />
      {flames}
    </>
  );
}

export function GildedCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  const beads: React.ReactNode[] = [];
  for (let x = 64; x <= 536; x += 24) {
    beads.push(<circle key={`t${x}`} cx={x} cy={64} r={3} fill={c.accent} />, <circle key={`b${x}`} cx={x} cy={782} r={3} fill={c.accent} />);
  }
  for (let y = 88; y <= 758; y += 24) {
    beads.push(<circle key={`l${y}`} cx={64} cy={y} r={3} fill={c.accent} />, <circle key={`r${y}`} cx={536} cy={y} r={3} fill={c.accent} />);
  }
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      <rect x={20} y={20} width={560} height={806} fill="none" stroke={c.accent} strokeWidth={26} />
      <rect x={10} y={10} width={580} height={826} fill="none" stroke={c.ink} strokeOpacity={0.25} strokeWidth={2} />
      <rect x={36} y={36} width={528} height={774} fill="none" stroke={c.ink} strokeOpacity={0.3} strokeWidth={2} />
      {beads}
      {[[46, 46], [554, 46], [46, 800], [554, 800]].map(([x, y]) => (
        <Rosette key={`${x}${y}`} cx={x} cy={y} r={22} petals={8} color={c.accent} ring={c.paper} />
      ))}
      <FitText x={300} y={152} text={name} size={38} maxWidth={420} fill={c.ink} font="serif" weight={500} italic />
      <line x1={230} y1={176} x2={370} y2={176} stroke={c.accent} strokeWidth={1.5} />
      {qr(160, 196, 280, { radius: 4 })}
      <FitText x={300} y={556} text={headline} size={40} maxWidth={420} fill={c.ink} font="serif" weight={600} />
      <FitText x={300} y={596} text={subline} size={15} maxWidth={420} fill={c.accent} caps spacing={3} weight={600} />
      <Pill cx={300} cy={664} text={table} fill={c.accent} color={c.paper} size={20} font="serif" />
      <path d="M220 730 q 40 -18 80 0 q 40 18 80 0" fill="none" stroke={c.accent} strokeWidth={2} />
    </>
  );
}

export function DinerCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  const squares: React.ReactNode[] = [];
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 17; col++) {
      if ((row + col) % 2 === 0) squares.push(<rect key={`${row}-${col}`} x={col * 36} y={700 + row * 36} width={36} height={36} fill={c.ink} />);
    }
  }
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      {squares}
      <rect x={0} y={694} width={W} height={6} fill={c.accent} />
      {[[50, 60, 18], [548, 110, 14], [70, 300, 12], [540, 420, 16], [62, 560, 10]].map(([x, y, r]) => (
        <polygon key={`${x}${y}`} points={sparkle(x, y, r)} fill={c.accent} />
      ))}
      <path d="M470 40 q 40 10 60 -6 q -10 24 -48 30 z" fill={c.ink} opacity={0.85} />
      <rect x={90} y={58} width={420} height={100} rx={50} fill={c.accent} />
      <rect x={100} y={68} width={400} height={80} rx={40} fill="none" stroke={c.paper} strokeWidth={2} opacity={0.7} />
      <FitText x={300} y={122} text={name} size={40} maxWidth={360} fill={c.paper} font="display" weight={800} caps spacing={1} />
      <rect x={143} y={188} width={314} height={314} rx={32} fill="none" stroke={c.ink} strokeWidth={6} />
      {qr(155, 200, 290, { radius: 24 })}
      <FitText x={300} y={566} text={headline} size={42} maxWidth={460} fill={c.ink} font="display" weight={800} italic />
      <FitText x={300} y={604} text={subline} size={20} maxWidth={440} fill={c.ink} opacity={0.75} />
      <Pill cx={300} cy={656} text={table} fill={c.ink} color={c.paper} size={20} />
    </>
  );
}

function Slice({ cx, cy, r, color, paper }: { cx: number; cy: number; r: number; color: string; paper: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={color} />
      <circle cx={cx} cy={cy} r={r * 0.88} fill={paper} />
      {Array.from({ length: 8 }, (_, i) => {
        const a0 = (i / 8) * Math.PI * 2 + 0.06;
        const a1 = ((i + 1) / 8) * Math.PI * 2 - 0.06;
        const rr = r * 0.8;
        return (
          <path
            key={i}
            d={`M ${cx} ${cy} L ${cx + rr * Math.cos(a0)} ${cy + rr * Math.sin(a0)} A ${rr} ${rr} 0 0 1 ${cx + rr * Math.cos(a1)} ${cy + rr * Math.sin(a1)} Z`}
            fill={color}
            opacity={0.65}
          />
        );
      })}
      <circle cx={cx} cy={cy} r={r * 0.08} fill={paper} />
    </g>
  );
}

export function CitrusCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      <Slice cx={30} cy={30} r={118} color={c.accent} paper={c.paper} />
      <Slice cx={576} cy={820} r={128} color={c.accent} paper={c.paper} />
      <Slice cx={524} cy={104} r={44} color={c.accent} paper={c.paper} />
      <Slice cx={70} cy={770} r={48} color={c.accent} paper={c.paper} />
      <ellipse cx={470} cy={66} rx={20} ry={8} fill={c.ink} opacity={0.6} transform="rotate(-30 470 66)" />
      <FitText x={300} y={192} text={name} size={40} maxWidth={360} fill={c.ink} font="display" weight={800} />
      {qr(155, 226, 290, { radius: 24 })}
      <FitText x={300} y={586} text={headline} size={42} maxWidth={440} fill={c.ink} font="display" weight={800} />
      <FitText x={300} y={626} text={subline} size={20} maxWidth={420} fill={c.ink} opacity={0.75} />
      <Pill cx={300} cy={686} text={table} fill={c.accent} color={c.paper} size={20} />
    </>
  );
}
