import React from "react";
import { QR_FRAME_VIEWBOX } from "@/constants/qrCodes.constants";
import type { QrFrameRenderProps } from "@/types";
import { ArcText, FitText, scallopCircle, starPoints } from "./primitives";

/*
 * Stickers, drawn on a 600 × 600 canvas. Outside the shape stays transparent
 * so the PNG can go straight to a die-cut sticker printer.
 * The second line shows the table number, else the name, else the subline.
 */
const [W, H] = QR_FRAME_VIEWBOX.sticker;

function second({ table, name, subline }: QrFrameRenderProps): string {
  return table || name || subline;
}

export function BadgeSticker(p: QrFrameRenderProps) {
  const { uid, colors: c, headline, qr } = p;
  return (
    <>
      <circle cx={300} cy={300} r={296} fill={c.paper} />
      <circle cx={300} cy={300} r={270} fill="none" stroke={c.accent} strokeWidth={3} />
      <circle cx={300} cy={300} r={196} fill="none" stroke={c.accent} strokeWidth={1.5} opacity={0.6} />
      <ArcText id={`${uid}-top`} cx={300} cy={300} r={222} text={headline} size={40} fill={c.accent} />
      <ArcText id={`${uid}-bottom`} cx={300} cy={300} r={226} text={second(p)} size={28} fill={c.accent} top={false} weight={600} />
      <polygon points={starPoints(70, 300, 12)} fill={c.accent} />
      <polygon points={starPoints(530, 300, 12)} fill={c.accent} />
      {qr(172, 172, 256, { radius: 22 })}
    </>
  );
}

export function TabSticker(p: QrFrameRenderProps) {
  const { colors: c, headline, qr } = p;
  return (
    <>
      <rect x={4} y={4} width={W - 8} height={H - 8} rx={56} fill={c.paper} />
      {qr(116, 40, 368, { radius: 28 })}
      <polygon points="282,424 318,424 300,442" fill={c.accent} opacity={0.9} />
      <FitText x={300} y={518} text={headline} size={62} maxWidth={520} fill={c.accent} font="display" weight={800} caps spacing={2} />
      <FitText x={300} y={562} text={second(p)} size={24} maxWidth={480} fill={c.accent} opacity={0.85} weight={600} />
    </>
  );
}

export function SealSticker(p: QrFrameRenderProps) {
  const { uid, colors: c, headline, qr } = p;
  return (
    <>
      <path d={scallopCircle(300, 300, 296, 22, 22)} fill={c.paper} />
      <circle cx={300} cy={300} r={252} fill="none" stroke={c.accent} strokeWidth={4} strokeDasharray="0.1 12" strokeLinecap="round" />
      <ArcText id={`${uid}-top`} cx={300} cy={300} r={210} text={headline} size={30} fill={c.accent} />
      <ArcText id={`${uid}-bottom`} cx={300} cy={300} r={214} text={second(p)} size={24} fill={c.accent} top={false} weight={600} />
      {qr(170, 170, 260, { radius: 30 })}
    </>
  );
}

export function BubbleSticker(p: QrFrameRenderProps) {
  const { colors: c, headline, qr } = p;
  return (
    <>
      <rect x={10} y={10} width={580} height={500} rx={70} fill={c.paper} />
      <polygon points="150,500 236,500 112,592" fill={c.paper} />
      {qr(150, 46, 300, { radius: 22 })}
      <FitText x={300} y={428} text={headline} size={52} maxWidth={500} fill={c.accent} font="display" weight={800} caps />
      <FitText x={300} y={474} text={second(p)} size={24} maxWidth={460} fill={c.accent} opacity={0.88} weight={600} />
    </>
  );
}

export function StampSticker(p: QrFrameRenderProps) {
  const { uid, colors: c, headline, qr, name, table, subline } = p;
  const mask = `${uid}-stamp`;
  const holes: React.ReactNode[] = [];
  for (let i = 0; i <= W; i += 30) {
    holes.push(
      <circle key={`t${i}`} cx={i} cy={0} r={10} fill="#000" />,
      <circle key={`b${i}`} cx={i} cy={H} r={10} fill="#000" />,
      <circle key={`l${i}`} cx={0} cy={i} r={10} fill="#000" />,
      <circle key={`r${i}`} cx={W} cy={i} r={10} fill="#000" />,
    );
  }
  return (
    <>
      <defs>
        <mask id={mask}>
          <rect width={W} height={H} fill="#fff" />
          {holes}
        </mask>
      </defs>
      <rect width={W} height={H} fill={c.paper} mask={`url(#${mask})`} />
      <rect x={34} y={34} width={532} height={532} fill="none" stroke={c.accent} strokeWidth={3} />
      <rect x={44} y={44} width={512} height={512} fill="none" stroke={c.accent} strokeWidth={1} />
      {qr(160, 66, 280, { radius: 6 })}
      <FitText x={300} y={410} text={headline} size={42} maxWidth={440} fill={c.ink} font="serif" weight={700} />
      <FitText x={300} y={456} text={table || subline} size={24} maxWidth={420} fill={c.accent} weight={600} />
      <FitText x={300} y={510} text={name} size={24} maxWidth={420} fill={c.ink} font="serif" italic opacity={0.8} />
    </>
  );
}

export function BurstSticker(p: QrFrameRenderProps) {
  const { colors: c, headline, qr } = p;
  return (
    <>
      <polygon points={starPoints(300, 300, 298, 262, 28)} fill={c.paper} />
      <circle cx={300} cy={300} r={232} fill="none" stroke={c.accent} strokeWidth={4} />
      {qr(180, 146, 240, { radius: 20 })}
      <FitText x={300} y={436} text={headline} size={40} maxWidth={300} fill={c.accent} font="display" weight={800} caps />
      <FitText x={300} y={476} text={second(p)} size={22} maxWidth={240} fill={c.accent} weight={600} />
    </>
  );
}
