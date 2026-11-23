import React from "react";
import { QR_FRAME_VIEWBOX } from "@/constants/qrCodes.constants";
import type { QrFrameRenderProps } from "@/types";
import { ArcText, FitText, Paper, Pill, Rosette, StarRow, scallopCircle, seeded, sparkle, wavePath } from "./primitives";

/* Portrait cards (600 × 846) for cafés, sweet shops, bars and food shops. */
const [W, H] = QR_FRAME_VIEWBOX.card;

export function LatteCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  const beans: [number, number, number][] = [[70, 742, -30], [118, 790, 20], [56, 806, 60], [150, 744, -60], [520, 800, 30], [556, 760, -20]];
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      <circle cx={504} cy={112} r={122} fill={c.ink} opacity={0.07} />
      <rect x={404} y={170} width={58} height={26} rx={13} fill={c.paper} stroke={c.ink} strokeOpacity={0.25} strokeWidth={3} transform="rotate(-45 433 183)" />
      <circle cx={504} cy={112} r={88} fill={c.paper} stroke={c.ink} strokeOpacity={0.25} strokeWidth={3} />
      <circle cx={504} cy={112} r={72} fill={c.accent} />
      <path d="M504 146 C 474 124 458 104 470 88 C 480 76 496 80 504 94 C 512 80 528 76 538 88 C 550 104 534 124 504 146 Z" fill={c.paper} opacity={0.92} />
      <FitText x={60} y={112} text={name} size={40} maxWidth={300} fill={c.ink} font="serif" weight={700} anchor="start" />
      <rect x={60} y={134} width={56} height={5} rx={2.5} fill={c.accent} />
      {qr(155, 250, 290, { radius: 12 })}
      <FitText x={300} y={606} text={headline} size={42} maxWidth={440} fill={c.ink} font="serif" weight={600} italic />
      <FitText x={300} y={644} text={subline} size={20} maxWidth={420} fill={c.ink} opacity={0.72} />
      <Pill cx={300} cy={710} text={table} fill={c.ink} color={c.paper} size={20} />
      {beans.map(([x, y, a]) => (
        <g key={`${x}-${y}`} transform={`rotate(${a} ${x} ${y})`}>
          <ellipse cx={x} cy={y} rx={20} ry={13} fill={c.accent} />
          <path d={`M${x - 14} ${y} Q ${x} ${y - 6} ${x + 14} ${y}`} stroke={c.paper} strokeWidth={2.5} fill="none" strokeLinecap="round" />
        </g>
      ))}
    </>
  );
}

function Donut({ cx, cy, r, icing, hole }: { cx: number; cy: number; r: number; icing: string; hole: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#E2B07A" />
      <path d={scallopCircle(cx, cy, r * 0.9, 12, r * 0.1)} fill={icing} />
      <circle cx={cx} cy={cy} r={r * 0.36} fill="#E2B07A" />
      <circle cx={cx} cy={cy} r={r * 0.3} fill={hole} />
    </g>
  );
}

export function SprinklesCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  const rand = seeded(17);
  const colours = [c.accent, c.ink, "#F2B33D", "#4FB3E8", "#7BC96F"];
  const bits: React.ReactNode[] = [];
  for (let i = 0; bits.length < 70 && i < 400; i++) {
    const x = rand() * W;
    const y = rand() * H;
    const a = rand() * 180;
    const k = Math.floor(rand() * colours.length);
    if (x > 100 && x < 500 && y > 80 && y < 720) continue;
    bits.push(
      <rect key={i} x={x - 9} y={y - 3} width={18} height={6} rx={3} fill={colours[k]} transform={`rotate(${a.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})`} />,
    );
  }
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      <Donut cx={580} cy={20} r={100} icing={c.accent} hole={c.paper} />
      <Donut cx={20} cy={826} r={100} icing={c.accent} hole={c.paper} />
      {bits}
      <FitText x={300} y={140} text={name} size={38} maxWidth={340} fill={c.ink} font="display" weight={800} />
      {qr(155, 176, 290, { radius: 16 })}
      <FitText x={300} y={540} text={headline} size={42} maxWidth={380} fill={c.ink} font="display" weight={800} />
      <FitText x={300} y={580} text={subline} size={20} maxWidth={380} fill={c.ink} opacity={0.72} />
      <Pill cx={300} cy={646} text={table} fill={c.ink} color={c.paper} size={20} />
    </>
  );
}

function Macaron({ cx, cy, shell }: { cx: number; cy: number; shell: string }) {
  return (
    <g>
      <rect x={cx - 42} y={cy - 34} width={84} height={30} rx={15} fill={shell} />
      <line x1={cx - 38} y1={cy - 5} x2={cx + 38} y2={cy - 5} stroke={shell} strokeWidth={4} strokeDasharray="2 3" />
      <rect x={cx - 36} y={cy - 6} width={72} height={12} rx={6} fill="#FFF8F0" />
      <line x1={cx - 38} y1={cy + 5} x2={cx + 38} y2={cy + 5} stroke={shell} strokeWidth={4} strokeDasharray="2 3" />
      <rect x={cx - 42} y={cy + 4} width={84} height={30} rx={15} fill={shell} />
      <rect x={cx - 28} y={cy - 28} width={30} height={6} rx={3} fill="#FFFFFF" opacity={0.4} />
    </g>
  );
}

export function MacaronCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  const shells = ["#F7B6C8", "#BFE3C9", c.accent, "#F5DFA0", "#C9B8EE"];
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      {Array.from({ length: 11 }, (_, i) => <circle key={i} cx={i * 60} cy={0} r={34} fill={c.accent} opacity={0.18} />)}
      <FitText x={300} y={140} text={name} size={42} maxWidth={420} fill={c.ink} font="serif" weight={600} italic />
      {qr(155, 176, 290, { radius: 14 })}
      <FitText x={300} y={536} text={headline} size={40} maxWidth={440} fill={c.ink} font="serif" weight={600} />
      <FitText x={300} y={574} text={subline} size={20} maxWidth={420} fill={c.ink} opacity={0.72} />
      <Pill cx={300} cy={640} text={table} fill={c.accent} color={c.paper} size={20} />
      {shells.map((shell, i) => <Macaron key={i} cx={100 + i * 100} cy={760} shell={shell} />)}
    </>
  );
}

function Cone({ cx, top, fill, scoops, cherry }: { cx: number; top: number; fill: string; scoops: [string, string]; cherry?: boolean }) {
  return (
    <g>
      <polygon points={`${cx - 40},${top} ${cx + 40},${top} ${cx},${top + 170}`} fill={fill} />
      <circle cx={cx} cy={top - 32} r={42} fill={scoops[0]} />
      <ellipse cx={cx} cy={top} rx={46} ry={12} fill={scoops[0]} />
      <circle cx={cx} cy={top - 96} r={38} fill={scoops[1]} />
      <ellipse cx={cx} cy={top - 66} rx={40} ry={10} fill={scoops[1]} />
      {cherry ? (
        <>
          <path d={`M${cx} ${top - 140} q 6 -18 18 -24`} fill="none" stroke="#5B3A1E" strokeWidth={3} strokeLinecap="round" />
          <circle cx={cx} cy={top - 136} r={10} fill="#C8352B" />
        </>
      ) : null}
    </g>
  );
}

export function ScoopCard({ uid, colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  const waffle = `${uid}-waffle`;
  const rand = seeded(13);
  const dots = Array.from({ length: 18 }, (_, i) => {
    const left = i % 2 === 0;
    return <circle key={i} cx={left ? 20 + rand() * 90 : 490 + rand() * 90} cy={30 + rand() * 420} r={5} fill={c.accent} opacity={0.25} />;
  });
  return (
    <>
      <defs>
        <pattern id={waffle} width={18} height={18} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width={18} height={18} fill="#E0AA62" />
          <path d="M0 0 H18 M0 0 V18" stroke="#B07A3A" strokeWidth={3} />
        </pattern>
      </defs>
      <Paper w={W} h={H} fill={c.paper} />
      {dots}
      <Cone cx={64} top={650} fill={`url(#${waffle})`} scoops={["#F6E7C1", c.accent]} cherry />
      <Cone cx={536} top={650} fill={`url(#${waffle})`} scoops={["#7A4A2E", "#B8E0C8"]} />
      <FitText x={300} y={128} text={name} size={38} maxWidth={360} fill={c.ink} font="display" weight={800} />
      {qr(155, 166, 290, { radius: 16 })}
      <FitText x={300} y={532} text={headline} size={40} maxWidth={360} fill={c.ink} font="display" weight={800} />
      <FitText x={300} y={570} text={subline} size={20} maxWidth={340} fill={c.ink} opacity={0.72} />
      <Pill cx={300} cy={636} text={table} fill={c.ink} color={c.paper} size={20} />
      <path d={wavePath(160, 760, 280, 6, 40)} fill="none" stroke={c.accent} strokeWidth={4} strokeLinecap="round" opacity={0.5} />
    </>
  );
}

export function MithaiCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  const rand = seeded(9);
  const corners: [number, number][] = [[40, 40], [560, 40], [40, 806], [560, 806]];
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      <rect x={11} y={11} width={578} height={824} fill="none" stroke={c.accent} strokeWidth={22} />
      <rect x={40} y={40} width={520} height={766} fill="none" stroke={c.accent} strokeWidth={2} />
      {corners.map(([x, y]) => <Rosette key={`${x}-${y}`} cx={x} cy={y} r={22} petals={8} color={c.accent} ring={c.paper} />)}
      {Array.from({ length: 7 }, (_, i) => {
        const x = 300 + (i - 3) * 62;
        return (
          <g key={i}>
            <polygon points={`${x},70 ${x + 26},96 ${x},122 ${x - 26},96`} fill={c.accent} opacity={0.3} />
            <polygon points={`${x},82 ${x + 14},96 ${x},110 ${x - 14},96`} fill="#FFFFFF" opacity={0.55} />
          </g>
        );
      })}
      <FitText x={300} y={184} text={name} size={40} maxWidth={440} fill={c.ink} font="serif" weight={700} />
      {qr(160, 210, 280, { radius: 10 })}
      <FitText x={300} y={554} text={headline} size={38} maxWidth={440} fill={c.ink} font="serif" weight={700} />
      <FitText x={300} y={592} text={subline} size={20} maxWidth={420} fill={c.ink} opacity={0.72} />
      <Pill cx={300} cy={654} text={table} fill={c.accent} color={c.paper} size={20} />
      {Array.from({ length: 6 }, (_, i) => {
        const x = 300 + (i - 2.5) * 66;
        return (
          <g key={i}>
            <circle cx={x} cy={744} r={26} fill={c.accent} />
            {Array.from({ length: 8 }, (_, k) => {
              const a = rand() * Math.PI * 2;
              const d = rand() * 18;
              return <circle key={k} cx={x + Math.cos(a) * d} cy={744 + Math.sin(a) * d} r={2.5} fill={c.paper} opacity={0.4} />;
            })}
          </g>
        );
      })}
    </>
  );
}

function MartiniGlass({ cx, y, color }: { cx: number; y: number; color: string }) {
  return (
    <g>
      <path d={`M${cx - 26} ${y + 12} L${cx + 26} ${y + 12} L${cx} ${y + 42} Z`} fill={color} opacity={0.3} />
      <g fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        <path d={`M${cx - 38} ${y} L${cx + 38} ${y} L${cx} ${y + 44} Z`} />
        <line x1={cx} y1={y + 44} x2={cx} y2={y + 96} />
        <line x1={cx - 22} y1={y + 96} x2={cx + 22} y2={y + 96} />
        <line x1={cx + 12} y1={y - 14} x2={cx - 6} y2={y + 22} />
      </g>
      <circle cx={cx - 3} cy={y + 16} r={7} fill={color} />
    </g>
  );
}

function Coupe({ cx, y, color }: { cx: number; y: number; color: string }) {
  return (
    <g fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <path d={`M${cx - 34} ${y} Q ${cx} ${y + 44} ${cx + 34} ${y} Z`} fill={color} fillOpacity={0.3} />
      <line x1={cx} y1={y + 22} x2={cx} y2={y + 70} />
      <line x1={cx - 20} y1={y + 70} x2={cx + 20} y2={y + 70} />
    </g>
  );
}

export function MartiniCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  const sparkles: [number, number, number][] = [[166, 70, 8], [434, 74, 8], [86, 300, 7], [520, 330, 9], [80, 520, 8], [524, 560, 7]];
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      <rect x={28} y={28} width={544} height={790} fill="none" stroke={c.accent} strokeWidth={2} />
      <rect x={38} y={38} width={524} height={770} fill="none" stroke={c.accent} strokeWidth={1} opacity={0.6} />
      <MartiniGlass cx={96} y={84} color={c.accent} />
      <MartiniGlass cx={504} y={84} color={c.accent} />
      {sparkles.map(([x, y, r]) => <polygon key={`${x}-${y}`} points={sparkle(x, y, r)} fill={c.accent} />)}
      <FitText x={300} y={150} text={name} size={30} maxWidth={300} fill={c.ink} font="display" weight={700} caps spacing={5} />
      <line x1={250} y1={174} x2={350} y2={174} stroke={c.accent} strokeWidth={2} />
      {qr(160, 204, 280, { radius: 10 })}
      <FitText x={300} y={556} text={headline} size={46} maxWidth={440} fill={c.accent} font="serif" weight={600} italic />
      <FitText x={300} y={594} text={subline} size={20} maxWidth={420} fill={c.ink} opacity={0.8} />
      <Pill cx={300} cy={660} text={table} fill={c.accent} color={c.paper} size={20} />
      <g transform="rotate(12 262 800)">
        <Coupe cx={262} y={730} color={c.accent} />
      </g>
      <g transform="rotate(-12 338 800)">
        <Coupe cx={338} y={730} color={c.accent} />
      </g>
      <polygon points={sparkle(300, 712, 10)} fill={c.accent} />
    </>
  );
}

export function CoasterCard({ uid, colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      <circle cx={520} cy={790} r={58} fill="none" stroke={c.accent} strokeWidth={6} opacity={0.18} />
      <circle cx={70} cy={66} r={46} fill="none" stroke={c.accent} strokeWidth={5} opacity={0.15} />
      <path d={scallopCircle(300, 370, 270, 28, 14)} fill={c.accent} />
      <circle cx={300} cy={370} r={240} fill={c.paper} />
      <circle cx={300} cy={370} r={228} fill="none" stroke={c.accent} strokeWidth={2} strokeDasharray="4 6" />
      <ArcText id={`${uid}-coaster`} cx={300} cy={370} r={200} text={name} size={30} fill={c.ink} font="display" weight={800} />
      {qr(182, 252, 236, { radius: 10 })}
      <StarRow cx={300} y={548} count={3} gap={36} r={10} colors={[c.accent]} />
      <FitText x={300} y={702} text={headline} size={40} maxWidth={460} fill={c.ink} font="display" weight={800} />
      <FitText x={300} y={740} text={subline} size={20} maxWidth={440} fill={c.ink} opacity={0.72} />
      <Pill cx={300} cy={796} text={table} fill={c.ink} color={c.paper} size={20} />
    </>
  );
}

export function CheeseCard({ colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  const holes: [number, number, number, number][] = [[520, 770, 14, 11], [470, 786, 9, 7], [548, 740, 8, 7], [420, 794, 6, 5]];
  const grapes: [number, number][] = [[80, 740], [104, 740], [128, 740], [92, 762], [116, 762], [104, 784]];
  return (
    <>
      <Paper w={W} h={H} fill={c.paper} />
      <rect x={26} y={26} width={548} height={794} rx={6} fill="none" stroke={c.ink} strokeWidth={2} strokeDasharray="10 6" opacity={0.5} />
      <FitText x={300} y={120} text={name} size={40} maxWidth={440} fill={c.ink} font="serif" weight={700} />
      <line x1={236} y1={146} x2={284} y2={146} stroke={c.ink} strokeWidth={1.5} opacity={0.6} />
      <rect x={295} y={141} width={10} height={10} fill={c.accent} transform="rotate(45 300 146)" />
      <line x1={316} y1={146} x2={364} y2={146} stroke={c.ink} strokeWidth={1.5} opacity={0.6} />
      {qr(155, 176, 290, { radius: 8 })}
      <FitText x={300} y={540} text={headline} size={40} maxWidth={440} fill={c.ink} font="serif" weight={700} />
      <FitText x={300} y={578} text={subline} size={20} maxWidth={420} fill={c.ink} opacity={0.72} />
      <Pill cx={300} cy={640} text={table} fill={c.ink} color={c.paper} size={20} />
      <polygon points="572,690 590,700 590,812 572,804" fill={c.accent} />
      <polygon points="572,690 590,700 590,812 572,804" fill={c.ink} opacity={0.2} />
      <polygon points="330,804 572,804 572,690" fill={c.accent} />
      <line x1={330} y1={804} x2={572} y2={690} stroke={c.ink} strokeWidth={3} opacity={0.15} strokeLinecap="round" />
      {holes.map(([x, y, rx, ry]) => <ellipse key={`${x}-${y}`} cx={x} cy={y} rx={rx} ry={ry} fill={c.ink} opacity={0.15} />)}
      <path d="M104 726 q 4 -16 16 -22" fill="none" stroke={c.ink} strokeWidth={3} strokeLinecap="round" opacity={0.7} />
      <ellipse cx={132} cy={712} rx={18} ry={9} fill={c.accent} transform="rotate(-25 132 712)" />
      {grapes.map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={13} fill={c.ink} opacity={0.75} />)}
    </>
  );
}

export function HamperCard({ uid, colors: c, headline, subline, name, table, qr }: QrFrameRenderProps) {
  const weave = `${uid}-weave`;
  return (
    <>
      <defs>
        <pattern id={weave} width={24} height={16} patternUnits="userSpaceOnUse">
          <rect width={24} height={16} fill="#C99A5B" />
          <rect x={0} y={0} width={12} height={8} fill="#A9773C" />
          <rect x={12} y={8} width={12} height={8} fill="#A9773C" />
        </pattern>
      </defs>
      <Paper w={W} h={H} fill={c.paper} />
      <polygon points="0,110 110,0 160,0 0,160" fill={c.accent} />
      <ellipse cx={48} cy={48} rx={30} ry={16} fill={c.accent} stroke={c.ink} strokeOpacity={0.25} strokeWidth={2} transform="rotate(45 48 48)" />
      <ellipse cx={88} cy={88} rx={30} ry={16} fill={c.accent} stroke={c.ink} strokeOpacity={0.25} strokeWidth={2} transform="rotate(45 88 88)" />
      <circle cx={68} cy={68} r={12} fill={c.accent} stroke={c.ink} strokeOpacity={0.3} strokeWidth={2} />
      <FitText x={300} y={160} text={name} size={40} maxWidth={380} fill={c.ink} font="serif" weight={700} />
      {qr(155, 196, 290, { radius: 12 })}
      <FitText x={300} y={556} text={headline} size={40} maxWidth={440} fill={c.ink} font="serif" weight={700} />
      <FitText x={300} y={594} text={subline} size={20} maxWidth={420} fill={c.ink} opacity={0.72} />
      <Pill cx={300} cy={660} text={table} fill={c.accent} color={c.paper} size={20} />
      <rect x={478} y={612} width={18} height={40} rx={4} fill={c.ink} opacity={0.85} />
      <rect x={470} y={640} width={34} height={90} rx={8} fill={c.ink} opacity={0.85} />
      <rect x={472} y={672} width={30} height={24} fill={c.paper} opacity={0.8} />
      <g transform="rotate(-40 460 661)">
        <rect x={400} y={650} width={120} height={22} rx={11} fill="#D9A35B" />
        {[426, 452, 478].map((x) => <line key={x} x1={x} y1={655} x2={x + 10} y2={667} stroke="#B07A3A" strokeWidth={3} strokeLinecap="round" />)}
      </g>
      <path d="M408 726 C 408 640 552 640 552 726" fill="none" stroke="#A9773C" strokeWidth={10} />
      <path d="M392 726 H568 L548 822 H412 Z" fill={`url(#${weave})`} />
      <rect x={384} y={716} width={192} height={18} rx={9} fill="#A9773C" />
      <circle cx={428} cy={706} r={18} fill={c.accent} />
      <ellipse cx={436} cy={684} rx={8} ry={4} fill="#4C8C3A" transform="rotate(-30 436 684)" />
    </>
  );
}
