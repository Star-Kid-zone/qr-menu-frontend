/*
 * Decorative QR pattern: a fixed 25×25 module grid with the three finder
 * squares. It does not encode a link. The finder squares take the brand's
 * saffron accent so the code reads as "ours" wherever it appears.
 */

const SIZE = 25;
const SEED =
  "10110100101101001011011100101010110010110101001101010011010110011010101101010011011010100110101001101101010011010101011010100110101101001101011010100110101100101101001011010110100101101010110101001011011010011010010110101101001011010100110101011010011010101101001101011001011010010110110010101101001011010100101101100101101010011010100110101101010011010010110100101011010100110101101011010010110100101101101001011010011010110100101101001011010110100101011010010110101001101011010010110100101101101010011010";

function inFinder(x: number, y: number) {
  const box = (ox: number, oy: number) => x >= ox && x < ox + 8 && y >= oy && y < oy + 8;
  return box(0, 0) || box(SIZE - 8, 0) || box(0, SIZE - 8);
}

export function QrPattern({
  className,
  accent = "var(--m-saffron)",
  ink = "currentColor",
}: {
  className?: string;
  accent?: string;
  ink?: string;
}) {
  const cells: { x: number; y: number }[] = [];
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (inFinder(x, y)) continue;
      if (SEED[(y * SIZE + x) % SEED.length] === "1") cells.push({ x, y });
    }
  }
  const finder = (ox: number, oy: number) => (
    <g key={`${ox}-${oy}`} fill={accent}>
      <path fillRule="evenodd" d={`M${ox} ${oy}h7v7h-7z M${ox + 1} ${oy + 1}v5h5v-5z`} />
      <rect x={ox + 2} y={oy + 2} width={3} height={3} />
    </g>
  );
  return (
    <svg viewBox={`-1 -1 ${SIZE + 2} ${SIZE + 2}`} className={className} aria-hidden shapeRendering="crispEdges">
      <g fill={ink}>
        {cells.map(({ x, y }) => (
          <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} />
        ))}
      </g>
      {finder(0, 0)}
      {finder(SIZE - 8, 0)}
      {finder(0, SIZE - 8)}
    </svg>
  );
}
