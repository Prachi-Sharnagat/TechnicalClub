// Pixel-art 3D Viewport scene: Wireframe isometric mesh with coordinate axes & HUD
export default function ModellingArt() {
  return (
    <div
      style={{
        width: '100%',
        aspectRatio: '16/11',
        border: '3px solid var(--line)',
        backgroundColor: '#080b16',
        boxShadow: '8px 8px 0 var(--shade)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
      role="img"
      aria-label="Pixel art 3D viewport displaying a wireframe model"
    >
      {/* Top HUD Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 12px',
          borderBottom: '2px solid var(--line)',
          backgroundColor: '#0f1526',
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 'clamp(0.5rem, 1vw, 0.65rem)',
          color: 'var(--acc)',
          letterSpacing: '-0.02em'
        }}
      >
        <span>[3D VIEWPORT // WIREFRAME]</span>
        <span style={{ color: 'var(--dim)' }}>MODE: EDIT</span>
      </div>

      {/* Viewport Canvas */}
      <svg
        viewBox="0 0 400 240"
        style={{ width: '100%', height: '100%', display: 'block' }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <radialGradient id="gridGlow" cx="50%" cy="60%" r="50%">
            <stop offset="0%" stopColor="#5b8cff" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#080b16" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient center glow */}
        <rect x="0" y="0" width="400" height="240" fill="url(#gridGlow)" />

        {/* Isometric Ground Grid Lines */}
        <g stroke="#1b274c" strokeWidth="1" opacity="0.8">
          {/* Diagonal lines descending left to right */}
          <line x1="80" y1="130" x2="280" y2="230" />
          <line x1="120" y1="120" x2="320" y2="220" />
          <line x1="160" y1="110" x2="360" y2="210" />
          <line x1="200" y1="100" x2="400" y2="200" />
          <line x1="40" y1="140" x2="240" y2="240" />

          {/* Diagonal lines descending right to left */}
          <line x1="320" y1="130" x2="120" y2="230" />
          <line x1="280" y1="120" x2="80" y2="220" />
          <line x1="240" y1="110" x2="40" y2="210" />
          <line x1="200" y1="100" x2="0" y2="200" />
          <line x1="360" y1="140" x2="160" y2="240" />
        </g>

        {/* Origin Axes (X: Red, Y: Green, Z: Blue) */}
        <g strokeWidth="2">
          {/* Z Axis (Up) */}
          <line x1="200" y1="140" x2="200" y2="35" stroke="#5b8cff" />
          {/* X Axis (Right-Down) */}
          <line x1="200" y1="140" x2="310" y2="195" stroke="#ff5555" />
          {/* Y Axis (Left-Down) */}
          <line x1="200" y1="140" x2="90" y2="195" stroke="#55ff55" />
        </g>

        {/* 3D Model Wireframe Mesh (Isometric Hexagonal Cube/Polyhedron) */}
        {/* Top Face */}
        <polygon
          points="200,55 260,85 200,115 140,85"
          fill="rgba(91, 140, 255, 0.22)"
          stroke="#5b8cff"
          strokeWidth="2"
        />
        {/* Top Face Subdivisions (quad wireframe) */}
        <line x1="170" y1="70" x2="230" y2="100" stroke="#5b8cff" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
        <line x1="230" y1="70" x2="170" y2="100" stroke="#5b8cff" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

        {/* Left Face */}
        <polygon
          points="140,85 200,115 200,185 140,155"
          fill="rgba(91, 140, 255, 0.08)"
          stroke="#5b8cff"
          strokeWidth="2"
        />
        {/* Left Face Subdivision */}
        <line x1="140" y1="120" x2="200" y2="150" stroke="#5b8cff" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
        <line x1="170" y1="100" x2="170" y2="170" stroke="#5b8cff" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

        {/* Right Face */}
        <polygon
          points="200,115 260,85 260,155 200,185"
          fill="rgba(91, 140, 255, 0.15)"
          stroke="#5b8cff"
          strokeWidth="2"
        />
        {/* Right Face Subdivision */}
        <line x1="200" y1="150" x2="260" y2="120" stroke="#5b8cff" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
        <line x1="230" y1="100" x2="230" y2="170" stroke="#5b8cff" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

        {/* Center Vertical Edge */}
        <line x1="200" y1="115" x2="200" y2="185" stroke="#5b8cff" strokeWidth="2.5" />

        {/* Vertex Markers (Retro square points) */}
        {[
          [200, 55],
          [260, 85],
          [200, 115],
          [140, 85],
          [140, 155],
          [200, 185],
          [260, 155],
          [200, 150],
          [170, 100],
          [230, 100]
        ].map(([x, y], idx) => (
          <rect
            key={idx}
            x={x - 2.5}
            y={y - 2.5}
            width="5"
            height="5"
            fill="#eef2ff"
            stroke="#5b8cff"
            strokeWidth="1"
          />
        ))}

        {/* XYZ Orientation Gizmo in Upper Right */}
        <g transform="translate(350, 45)">
          <circle cx="0" cy="0" r="18" fill="#0f1526" stroke="#26345c" strokeWidth="1.5" />
          <line x1="0" y1="0" x2="10" y2="-8" stroke="#5b8cff" strokeWidth="2" />
          <text x="12" y="-9" fill="#5b8cff" fontSize="7" fontFamily="'Press Start 2P', monospace">Z</text>
          <line x1="0" y1="0" x2="12" y2="6" stroke="#ff5555" strokeWidth="2" />
          <text x="14" y="9" fill="#ff5555" fontSize="7" fontFamily="'Press Start 2P', monospace">X</text>
          <line x1="0" y1="0" x2="-10" y2="7" stroke="#55ff55" strokeWidth="2" />
          <text x="-18" y="11" fill="#55ff55" fontSize="7" fontFamily="'Press Start 2P', monospace">Y</text>
        </g>
      </svg>

      {/* Bottom Status HUD */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '6px 12px',
          borderTop: '2px solid var(--line)',
          backgroundColor: '#0f1526',
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 'clamp(0.45rem, 0.9vw, 0.58rem)',
          color: 'var(--dim)'
        }}
      >
        <span>VERT: 514 | POLY: 1,024</span>
        <span style={{ color: 'var(--acc)' }}>RENDER: CYCLES // 60 FPS</span>
      </div>
    </div>
  );
}
