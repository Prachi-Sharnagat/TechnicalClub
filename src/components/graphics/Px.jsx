// Small pixel bitmaps drawn as SVG rects (colour = currentColor).
const BITS = {
  image: ['XXXXXXXXX', 'X.......X', 'X..XX...X', 'X..XX...X', 'X.......X', 'X...X...X', 'X..XXX..X', 'X.XXXXX.X', 'XXXXXXXXX'],
  ui: ['XXXXXXXXX', 'X.......X', 'X.....X.X', 'X..X.XX.X', 'X.XXX...X', 'X.......X', 'XXXXXXXXX', '...XXX...', '..XXXXX..'],
  play: ['XXXXXXXXX', 'X.......X', 'X.X.....X', 'X.XXX...X', 'X.XXXXX.X', 'X.XXX...X', 'X.X.....X', 'X.......X', 'XXXXXXXXX'],
  arrow: ['...X...', '....X..', '.....X.', 'XXXXXXX', '.....X.', '....X..', '...X...'],
  menu: ['XXXXXXX', '.......', 'XXXXXXX', '.......', 'XXXXXXX'],
  chip: ['XXXXXXXXX', 'X.......X', 'X.X.X.X.X', 'X.XXXXX.X', 'X.XXXXX.X', 'X.XXXXX.X', 'X.X.X.X.X', 'X.......X', 'XXXXXXXXX'],
  signal: ['XXXXXXXXX', 'X.......X', 'X..XXX..X', 'X.X...X.X', 'X...X...X', 'X.......X', 'X...X...X', 'X.......X', 'XXXXXXXXX'],
  bot: ['XXXXXXXXX', 'X.......X', 'X.XX.XX.X', 'X.XX.XX.X', 'X.......X', 'X.XXXXX.X', 'X.......X', 'X.......X', 'XXXXXXXXX'],
  mail: [
    'XXXXXXXXXXX',
    'XX.......XX',
    'X.X.....X.X',
    'X..X...X..X',
    'X...X.X...X',
    'X....X....X',
    'X.........X',
    'XXXXXXXXXXX'
  ],
  instagram: [
    'XXXXXXXXXXX',
    'X.......X.X',
    'X..XXXXX..X',
    'X.XX...XX.X',
    'X.X..X..X.X',
    'X.XX...XX.X',
    'X..XXXXX..X',
    'X.........X',
    'XXXXXXXXXXX'
  ]
};

export default function Px({ name, className = '' }) {
  const rows = BITS[name];
  return (
    <svg className={`px-ic ${className}`} viewBox={`0 0 ${rows[0].length} ${rows.length}`} aria-hidden="true">
      {rows.flatMap((row, y) => [...row].map((c, x) => (c === 'X' ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" /> : null)))}
    </svg>
  );
}
