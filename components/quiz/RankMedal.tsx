interface RankMedalProps {
  rank: 1 | 2 | 3;
  className?: string;
}

/**
 * Pixel-art medal for a leaderboard's top 3, in place of the medal emoji
 * -- same 16x16 disc silhouette as the Bronze/Silver division icons, in
 * gold/silver/bronze so all three read as one medal in three metals.
 */
export function RankMedal({ rank, className }: RankMedalProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {renderRects(rank)}
    </svg>
  );
}

function renderRects(rank: 1 | 2 | 3) {
  switch (rank) {
    case 1:
      return (
        <>
          <rect x={4} y={1} width={8} height={1} fill="#20222c" />
          <rect x={3} y={2} width={10} height={1} fill="#20222c" />
          <rect x={2} y={3} width={12} height={1} fill="#20222c" />
          <rect x={1} y={4} width={1} height={1} fill="#20222c" />
          <rect x={2} y={4} width={4} height={1} fill="#FFE873" />
          <rect x={6} y={4} width={4} height={1} fill="#FFD700" />
          <rect x={10} y={4} width={4} height={1} fill="#B8960A" />
          <rect x={14} y={4} width={1} height={1} fill="#20222c" />
          <rect x={1} y={5} width={1} height={1} fill="#20222c" />
          <rect x={2} y={5} width={4} height={1} fill="#FFE873" />
          <rect x={6} y={5} width={4} height={1} fill="#FFD700" />
          <rect x={10} y={5} width={4} height={1} fill="#B8960A" />
          <rect x={14} y={5} width={1} height={1} fill="#20222c" />
          <rect x={1} y={6} width={1} height={1} fill="#20222c" />
          <rect x={2} y={6} width={4} height={1} fill="#FFE873" />
          <rect x={6} y={6} width={4} height={1} fill="#FFD700" />
          <rect x={10} y={6} width={4} height={1} fill="#B8960A" />
          <rect x={14} y={6} width={1} height={1} fill="#20222c" />
          <rect x={1} y={7} width={1} height={1} fill="#20222c" />
          <rect x={2} y={7} width={4} height={1} fill="#FFE873" />
          <rect x={6} y={7} width={4} height={1} fill="#FFD700" />
          <rect x={10} y={7} width={4} height={1} fill="#B8960A" />
          <rect x={14} y={7} width={1} height={1} fill="#20222c" />
          <rect x={1} y={8} width={1} height={1} fill="#20222c" />
          <rect x={2} y={8} width={4} height={1} fill="#FFE873" />
          <rect x={6} y={8} width={4} height={1} fill="#FFD700" />
          <rect x={10} y={8} width={4} height={1} fill="#B8960A" />
          <rect x={14} y={8} width={1} height={1} fill="#20222c" />
          <rect x={1} y={9} width={1} height={1} fill="#20222c" />
          <rect x={2} y={9} width={4} height={1} fill="#FFE873" />
          <rect x={6} y={9} width={4} height={1} fill="#FFD700" />
          <rect x={10} y={9} width={4} height={1} fill="#B8960A" />
          <rect x={14} y={9} width={1} height={1} fill="#20222c" />
          <rect x={1} y={10} width={1} height={1} fill="#20222c" />
          <rect x={2} y={10} width={4} height={1} fill="#FFE873" />
          <rect x={6} y={10} width={4} height={1} fill="#FFD700" />
          <rect x={10} y={10} width={4} height={1} fill="#B8960A" />
          <rect x={14} y={10} width={1} height={1} fill="#20222c" />
          <rect x={1} y={11} width={1} height={1} fill="#20222c" />
          <rect x={2} y={11} width={4} height={1} fill="#FFE873" />
          <rect x={6} y={11} width={4} height={1} fill="#FFD700" />
          <rect x={10} y={11} width={4} height={1} fill="#B8960A" />
          <rect x={14} y={11} width={1} height={1} fill="#20222c" />
          <rect x={2} y={12} width={12} height={1} fill="#20222c" />
          <rect x={3} y={13} width={10} height={1} fill="#20222c" />
          <rect x={4} y={14} width={8} height={1} fill="#20222c" />
        </>
      );
    case 2:
      return (
        <>
          <rect x={4} y={1} width={8} height={1} fill="#20222c" />
          <rect x={3} y={2} width={10} height={1} fill="#20222c" />
          <rect x={2} y={3} width={12} height={1} fill="#20222c" />
          <rect x={1} y={4} width={1} height={1} fill="#20222c" />
          <rect x={2} y={4} width={4} height={1} fill="#E0E0E0" />
          <rect x={6} y={4} width={4} height={1} fill="#C0C0C0" />
          <rect x={10} y={4} width={4} height={1} fill="#8A8A8A" />
          <rect x={14} y={4} width={1} height={1} fill="#20222c" />
          <rect x={1} y={5} width={1} height={1} fill="#20222c" />
          <rect x={2} y={5} width={4} height={1} fill="#E0E0E0" />
          <rect x={6} y={5} width={4} height={1} fill="#C0C0C0" />
          <rect x={10} y={5} width={4} height={1} fill="#8A8A8A" />
          <rect x={14} y={5} width={1} height={1} fill="#20222c" />
          <rect x={1} y={6} width={1} height={1} fill="#20222c" />
          <rect x={2} y={6} width={4} height={1} fill="#E0E0E0" />
          <rect x={6} y={6} width={4} height={1} fill="#C0C0C0" />
          <rect x={10} y={6} width={4} height={1} fill="#8A8A8A" />
          <rect x={14} y={6} width={1} height={1} fill="#20222c" />
          <rect x={1} y={7} width={1} height={1} fill="#20222c" />
          <rect x={2} y={7} width={4} height={1} fill="#E0E0E0" />
          <rect x={6} y={7} width={4} height={1} fill="#C0C0C0" />
          <rect x={10} y={7} width={4} height={1} fill="#8A8A8A" />
          <rect x={14} y={7} width={1} height={1} fill="#20222c" />
          <rect x={1} y={8} width={1} height={1} fill="#20222c" />
          <rect x={2} y={8} width={4} height={1} fill="#E0E0E0" />
          <rect x={6} y={8} width={4} height={1} fill="#C0C0C0" />
          <rect x={10} y={8} width={4} height={1} fill="#8A8A8A" />
          <rect x={14} y={8} width={1} height={1} fill="#20222c" />
          <rect x={1} y={9} width={1} height={1} fill="#20222c" />
          <rect x={2} y={9} width={4} height={1} fill="#E0E0E0" />
          <rect x={6} y={9} width={4} height={1} fill="#C0C0C0" />
          <rect x={10} y={9} width={4} height={1} fill="#8A8A8A" />
          <rect x={14} y={9} width={1} height={1} fill="#20222c" />
          <rect x={1} y={10} width={1} height={1} fill="#20222c" />
          <rect x={2} y={10} width={4} height={1} fill="#E0E0E0" />
          <rect x={6} y={10} width={4} height={1} fill="#C0C0C0" />
          <rect x={10} y={10} width={4} height={1} fill="#8A8A8A" />
          <rect x={14} y={10} width={1} height={1} fill="#20222c" />
          <rect x={1} y={11} width={1} height={1} fill="#20222c" />
          <rect x={2} y={11} width={4} height={1} fill="#E0E0E0" />
          <rect x={6} y={11} width={4} height={1} fill="#C0C0C0" />
          <rect x={10} y={11} width={4} height={1} fill="#8A8A8A" />
          <rect x={14} y={11} width={1} height={1} fill="#20222c" />
          <rect x={2} y={12} width={12} height={1} fill="#20222c" />
          <rect x={3} y={13} width={10} height={1} fill="#20222c" />
          <rect x={4} y={14} width={8} height={1} fill="#20222c" />
        </>
      );
    case 3:
      return (
        <>
          <rect x={4} y={1} width={8} height={1} fill="#20222c" />
          <rect x={3} y={2} width={10} height={1} fill="#20222c" />
          <rect x={2} y={3} width={12} height={1} fill="#20222c" />
          <rect x={1} y={4} width={1} height={1} fill="#20222c" />
          <rect x={2} y={4} width={4} height={1} fill="#E2A365" />
          <rect x={6} y={4} width={4} height={1} fill="#CD7F32" />
          <rect x={10} y={4} width={4} height={1} fill="#8B5A23" />
          <rect x={14} y={4} width={1} height={1} fill="#20222c" />
          <rect x={1} y={5} width={1} height={1} fill="#20222c" />
          <rect x={2} y={5} width={4} height={1} fill="#E2A365" />
          <rect x={6} y={5} width={4} height={1} fill="#CD7F32" />
          <rect x={10} y={5} width={4} height={1} fill="#8B5A23" />
          <rect x={14} y={5} width={1} height={1} fill="#20222c" />
          <rect x={1} y={6} width={1} height={1} fill="#20222c" />
          <rect x={2} y={6} width={4} height={1} fill="#E2A365" />
          <rect x={6} y={6} width={4} height={1} fill="#CD7F32" />
          <rect x={10} y={6} width={4} height={1} fill="#8B5A23" />
          <rect x={14} y={6} width={1} height={1} fill="#20222c" />
          <rect x={1} y={7} width={1} height={1} fill="#20222c" />
          <rect x={2} y={7} width={4} height={1} fill="#E2A365" />
          <rect x={6} y={7} width={4} height={1} fill="#CD7F32" />
          <rect x={10} y={7} width={4} height={1} fill="#8B5A23" />
          <rect x={14} y={7} width={1} height={1} fill="#20222c" />
          <rect x={1} y={8} width={1} height={1} fill="#20222c" />
          <rect x={2} y={8} width={4} height={1} fill="#E2A365" />
          <rect x={6} y={8} width={4} height={1} fill="#CD7F32" />
          <rect x={10} y={8} width={4} height={1} fill="#8B5A23" />
          <rect x={14} y={8} width={1} height={1} fill="#20222c" />
          <rect x={1} y={9} width={1} height={1} fill="#20222c" />
          <rect x={2} y={9} width={4} height={1} fill="#E2A365" />
          <rect x={6} y={9} width={4} height={1} fill="#CD7F32" />
          <rect x={10} y={9} width={4} height={1} fill="#8B5A23" />
          <rect x={14} y={9} width={1} height={1} fill="#20222c" />
          <rect x={1} y={10} width={1} height={1} fill="#20222c" />
          <rect x={2} y={10} width={4} height={1} fill="#E2A365" />
          <rect x={6} y={10} width={4} height={1} fill="#CD7F32" />
          <rect x={10} y={10} width={4} height={1} fill="#8B5A23" />
          <rect x={14} y={10} width={1} height={1} fill="#20222c" />
          <rect x={1} y={11} width={1} height={1} fill="#20222c" />
          <rect x={2} y={11} width={4} height={1} fill="#E2A365" />
          <rect x={6} y={11} width={4} height={1} fill="#CD7F32" />
          <rect x={10} y={11} width={4} height={1} fill="#8B5A23" />
          <rect x={14} y={11} width={1} height={1} fill="#20222c" />
          <rect x={2} y={12} width={12} height={1} fill="#20222c" />
          <rect x={3} y={13} width={10} height={1} fill="#20222c" />
          <rect x={4} y={14} width={8} height={1} fill="#20222c" />
        </>
      );
    default:
      return null;
  }
}
