import { Division } from '@prisma/client';

interface DivisionIconProps {
  division: Division;
  className?: string;
}

/**
 * Pixel-art badge per division (bronze -> challenger), ported from the
 * Codin'sideQuest design system: flat colors, hard 1px-grid edges, no
 * anti-aliasing. Each icon is a fixed 16x16 grid rendered as merged SVG
 * rects -- see the design canvas this was drafted on for the visual
 * reference (Bronze medal through the Challenger sunburst).
 */
export function DivisionIcon({ division, className }: DivisionIconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {renderRects(division)}
    </svg>
  );
}

function renderRects(division: Division) {
  switch (division) {
    case 'BRONZE':
      return (
        <>
          <rect x={4} y={1} width={8} height={1} fill="#20222c" />
          <rect x={3} y={2} width={10} height={1} fill="#20222c" />
          <rect x={2} y={3} width={12} height={1} fill="#20222c" />
          <rect x={1} y={4} width={1} height={1} fill="#20222c" />
          <rect x={2} y={4} width={6} height={1} fill="#E2A365" />
          <rect x={8} y={4} width={6} height={1} fill="#8B5A23" />
          <rect x={14} y={4} width={1} height={1} fill="#20222c" />
          <rect x={1} y={5} width={1} height={1} fill="#20222c" />
          <rect x={2} y={5} width={6} height={1} fill="#E2A365" />
          <rect x={8} y={5} width={6} height={1} fill="#8B5A23" />
          <rect x={14} y={5} width={1} height={1} fill="#20222c" />
          <rect x={1} y={6} width={1} height={1} fill="#20222c" />
          <rect x={2} y={6} width={6} height={1} fill="#E2A365" />
          <rect x={8} y={6} width={6} height={1} fill="#8B5A23" />
          <rect x={14} y={6} width={1} height={1} fill="#20222c" />
          <rect x={1} y={7} width={1} height={1} fill="#20222c" />
          <rect x={2} y={7} width={6} height={1} fill="#E2A365" />
          <rect x={8} y={7} width={6} height={1} fill="#8B5A23" />
          <rect x={14} y={7} width={1} height={1} fill="#20222c" />
          <rect x={1} y={8} width={1} height={1} fill="#20222c" />
          <rect x={2} y={8} width={6} height={1} fill="#E2A365" />
          <rect x={8} y={8} width={6} height={1} fill="#8B5A23" />
          <rect x={14} y={8} width={1} height={1} fill="#20222c" />
          <rect x={1} y={9} width={1} height={1} fill="#20222c" />
          <rect x={2} y={9} width={6} height={1} fill="#E2A365" />
          <rect x={8} y={9} width={6} height={1} fill="#8B5A23" />
          <rect x={14} y={9} width={1} height={1} fill="#20222c" />
          <rect x={1} y={10} width={1} height={1} fill="#20222c" />
          <rect x={2} y={10} width={6} height={1} fill="#E2A365" />
          <rect x={8} y={10} width={6} height={1} fill="#8B5A23" />
          <rect x={14} y={10} width={1} height={1} fill="#20222c" />
          <rect x={1} y={11} width={1} height={1} fill="#20222c" />
          <rect x={2} y={11} width={6} height={1} fill="#E2A365" />
          <rect x={8} y={11} width={6} height={1} fill="#8B5A23" />
          <rect x={14} y={11} width={1} height={1} fill="#20222c" />
          <rect x={2} y={12} width={12} height={1} fill="#20222c" />
          <rect x={3} y={13} width={10} height={1} fill="#20222c" />
          <rect x={4} y={14} width={8} height={1} fill="#20222c" />
        </>
      );
    case 'SILVER':
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
    case 'GOLD':
      return (
        <>
          <rect x={6} y={1} width={4} height={1} fill="#20222c" />
          <rect x={5} y={2} width={1} height={1} fill="#20222c" />
          <rect x={6} y={2} width={2} height={1} fill="#FFE873" />
          <rect x={8} y={2} width={2} height={1} fill="#B8960A" />
          <rect x={10} y={2} width={1} height={1} fill="#20222c" />
          <rect x={4} y={3} width={1} height={1} fill="#20222c" />
          <rect x={5} y={3} width={3} height={1} fill="#FFE873" />
          <rect x={8} y={3} width={3} height={1} fill="#B8960A" />
          <rect x={11} y={3} width={1} height={1} fill="#20222c" />
          <rect x={3} y={4} width={2} height={1} fill="#20222c" />
          <rect x={5} y={4} width={3} height={1} fill="#FFE873" />
          <rect x={8} y={4} width={3} height={1} fill="#B8960A" />
          <rect x={11} y={4} width={2} height={1} fill="#20222c" />
          <rect x={3} y={5} width={2} height={1} fill="#20222c" />
          <rect x={5} y={5} width={3} height={1} fill="#FFE873" />
          <rect x={8} y={5} width={3} height={1} fill="#B8960A" />
          <rect x={11} y={5} width={2} height={1} fill="#20222c" />
          <rect x={5} y={6} width={1} height={1} fill="#20222c" />
          <rect x={6} y={6} width={2} height={1} fill="#FFE873" />
          <rect x={8} y={6} width={2} height={1} fill="#B8960A" />
          <rect x={10} y={6} width={1} height={1} fill="#20222c" />
          <rect x={6} y={7} width={1} height={1} fill="#20222c" />
          <rect x={7} y={7} width={1} height={1} fill="#FFE873" />
          <rect x={8} y={7} width={1} height={1} fill="#B8960A" />
          <rect x={9} y={7} width={1} height={1} fill="#20222c" />
          <rect x={7} y={8} width={2} height={1} fill="#20222c" />
          <rect x={7} y={9} width={2} height={1} fill="#20222c" />
          <rect x={5} y={10} width={1} height={1} fill="#20222c" />
          <rect x={6} y={10} width={2} height={1} fill="#FFE873" />
          <rect x={8} y={10} width={2} height={1} fill="#B8960A" />
          <rect x={10} y={10} width={1} height={1} fill="#20222c" />
          <rect x={4} y={11} width={1} height={1} fill="#20222c" />
          <rect x={5} y={11} width={3} height={1} fill="#FFE873" />
          <rect x={8} y={11} width={3} height={1} fill="#B8960A" />
          <rect x={11} y={11} width={1} height={1} fill="#20222c" />
          <rect x={4} y={12} width={8} height={1} fill="#20222c" />
        </>
      );
    case 'PLATINE':
      return (
        <>
          <rect x={7} y={1} width={2} height={1} fill="#20222c" />
          <rect x={6} y={2} width={1} height={1} fill="#20222c" />
          <rect x={7} y={2} width={1} height={1} fill="#FFFFFF" />
          <rect x={8} y={2} width={1} height={1} fill="#B5B4B0" />
          <rect x={9} y={2} width={1} height={1} fill="#20222c" />
          <rect x={5} y={3} width={1} height={1} fill="#20222c" />
          <rect x={6} y={3} width={2} height={1} fill="#FFFFFF" />
          <rect x={8} y={3} width={2} height={1} fill="#B5B4B0" />
          <rect x={10} y={3} width={1} height={1} fill="#20222c" />
          <rect x={4} y={4} width={1} height={1} fill="#20222c" />
          <rect x={5} y={4} width={3} height={1} fill="#FFFFFF" />
          <rect x={8} y={4} width={3} height={1} fill="#B5B4B0" />
          <rect x={11} y={4} width={1} height={1} fill="#20222c" />
          <rect x={3} y={5} width={1} height={1} fill="#20222c" />
          <rect x={4} y={5} width={4} height={1} fill="#FFFFFF" />
          <rect x={8} y={5} width={4} height={1} fill="#B5B4B0" />
          <rect x={12} y={5} width={1} height={1} fill="#20222c" />
          <rect x={2} y={6} width={1} height={1} fill="#20222c" />
          <rect x={3} y={6} width={5} height={1} fill="#FFFFFF" />
          <rect x={8} y={6} width={5} height={1} fill="#B5B4B0" />
          <rect x={13} y={6} width={1} height={1} fill="#20222c" />
          <rect x={1} y={7} width={1} height={1} fill="#20222c" />
          <rect x={2} y={7} width={6} height={1} fill="#FFFFFF" />
          <rect x={8} y={7} width={6} height={1} fill="#B5B4B0" />
          <rect x={14} y={7} width={1} height={1} fill="#20222c" />
          <rect x={1} y={8} width={1} height={1} fill="#20222c" />
          <rect x={2} y={8} width={6} height={1} fill="#FFFFFF" />
          <rect x={8} y={8} width={6} height={1} fill="#B5B4B0" />
          <rect x={14} y={8} width={1} height={1} fill="#20222c" />
          <rect x={2} y={9} width={1} height={1} fill="#20222c" />
          <rect x={3} y={9} width={5} height={1} fill="#FFFFFF" />
          <rect x={8} y={9} width={5} height={1} fill="#B5B4B0" />
          <rect x={13} y={9} width={1} height={1} fill="#20222c" />
          <rect x={3} y={10} width={1} height={1} fill="#20222c" />
          <rect x={4} y={10} width={4} height={1} fill="#FFFFFF" />
          <rect x={8} y={10} width={4} height={1} fill="#B5B4B0" />
          <rect x={12} y={10} width={1} height={1} fill="#20222c" />
          <rect x={4} y={11} width={1} height={1} fill="#20222c" />
          <rect x={5} y={11} width={3} height={1} fill="#FFFFFF" />
          <rect x={8} y={11} width={3} height={1} fill="#B5B4B0" />
          <rect x={11} y={11} width={1} height={1} fill="#20222c" />
          <rect x={5} y={12} width={1} height={1} fill="#20222c" />
          <rect x={6} y={12} width={2} height={1} fill="#FFFFFF" />
          <rect x={8} y={12} width={2} height={1} fill="#B5B4B0" />
          <rect x={10} y={12} width={1} height={1} fill="#20222c" />
          <rect x={6} y={13} width={1} height={1} fill="#20222c" />
          <rect x={7} y={13} width={1} height={1} fill="#FFFFFF" />
          <rect x={8} y={13} width={1} height={1} fill="#B5B4B0" />
          <rect x={9} y={13} width={1} height={1} fill="#20222c" />
          <rect x={7} y={14} width={2} height={1} fill="#20222c" />
        </>
      );
    case 'DIAMOND':
      return (
        <>
          <rect x={7} y={1} width={2} height={1} fill="#20222c" />
          <rect x={6} y={2} width={1} height={1} fill="#20222c" />
          <rect x={7} y={2} width={1} height={1} fill="#E3FBFF" />
          <rect x={8} y={2} width={1} height={1} fill="#FFFFFF" />
          <rect x={9} y={2} width={1} height={1} fill="#20222c" />
          <rect x={5} y={3} width={1} height={1} fill="#20222c" />
          <rect x={6} y={3} width={1} height={1} fill="#E3FBFF" />
          <rect x={7} y={3} width={2} height={1} fill="#B9F2FF" />
          <rect x={9} y={3} width={1} height={1} fill="#6FD3E8" />
          <rect x={10} y={3} width={1} height={1} fill="#20222c" />
          <rect x={4} y={4} width={1} height={1} fill="#20222c" />
          <rect x={5} y={4} width={2} height={1} fill="#E3FBFF" />
          <rect x={7} y={4} width={2} height={1} fill="#B9F2FF" />
          <rect x={9} y={4} width={2} height={1} fill="#6FD3E8" />
          <rect x={11} y={4} width={1} height={1} fill="#20222c" />
          <rect x={3} y={5} width={1} height={1} fill="#20222c" />
          <rect x={4} y={5} width={3} height={1} fill="#E3FBFF" />
          <rect x={7} y={5} width={2} height={1} fill="#B9F2FF" />
          <rect x={9} y={5} width={3} height={1} fill="#6FD3E8" />
          <rect x={12} y={5} width={1} height={1} fill="#20222c" />
          <rect x={2} y={6} width={1} height={1} fill="#20222c" />
          <rect x={3} y={6} width={3} height={1} fill="#E3FBFF" />
          <rect x={6} y={6} width={4} height={1} fill="#B9F2FF" />
          <rect x={10} y={6} width={3} height={1} fill="#6FD3E8" />
          <rect x={13} y={6} width={1} height={1} fill="#20222c" />
          <rect x={1} y={7} width={1} height={1} fill="#20222c" />
          <rect x={2} y={7} width={4} height={1} fill="#E3FBFF" />
          <rect x={6} y={7} width={4} height={1} fill="#B9F2FF" />
          <rect x={10} y={7} width={4} height={1} fill="#6FD3E8" />
          <rect x={14} y={7} width={1} height={1} fill="#20222c" />
          <rect x={1} y={8} width={14} height={1} fill="#20222c" />
          <rect x={2} y={9} width={1} height={1} fill="#20222c" />
          <rect x={3} y={9} width={3} height={1} fill="#E3FBFF" />
          <rect x={6} y={9} width={4} height={1} fill="#B9F2FF" />
          <rect x={10} y={9} width={3} height={1} fill="#6FD3E8" />
          <rect x={13} y={9} width={1} height={1} fill="#20222c" />
          <rect x={3} y={10} width={1} height={1} fill="#20222c" />
          <rect x={4} y={10} width={3} height={1} fill="#E3FBFF" />
          <rect x={7} y={10} width={2} height={1} fill="#B9F2FF" />
          <rect x={9} y={10} width={3} height={1} fill="#6FD3E8" />
          <rect x={12} y={10} width={1} height={1} fill="#20222c" />
          <rect x={4} y={11} width={1} height={1} fill="#20222c" />
          <rect x={5} y={11} width={2} height={1} fill="#E3FBFF" />
          <rect x={7} y={11} width={2} height={1} fill="#B9F2FF" />
          <rect x={9} y={11} width={2} height={1} fill="#6FD3E8" />
          <rect x={11} y={11} width={1} height={1} fill="#20222c" />
          <rect x={5} y={12} width={1} height={1} fill="#20222c" />
          <rect x={6} y={12} width={1} height={1} fill="#E3FBFF" />
          <rect x={7} y={12} width={2} height={1} fill="#B9F2FF" />
          <rect x={9} y={12} width={1} height={1} fill="#6FD3E8" />
          <rect x={10} y={12} width={1} height={1} fill="#20222c" />
          <rect x={6} y={13} width={1} height={1} fill="#20222c" />
          <rect x={7} y={13} width={1} height={1} fill="#E3FBFF" />
          <rect x={8} y={13} width={1} height={1} fill="#6FD3E8" />
          <rect x={9} y={13} width={1} height={1} fill="#20222c" />
          <rect x={7} y={14} width={2} height={1} fill="#20222c" />
        </>
      );
    case 'MASTER':
      return (
        <>
          <rect x={7} y={2} width={2} height={1} fill="#20222c" />
          <rect x={6} y={3} width={1} height={1} fill="#20222c" />
          <rect x={7} y={3} width={1} height={1} fill="#C084D6" />
          <rect x={8} y={3} width={1} height={1} fill="#6C3483" />
          <rect x={9} y={3} width={1} height={1} fill="#20222c" />
          <rect x={6} y={4} width={1} height={1} fill="#20222c" />
          <rect x={7} y={4} width={1} height={1} fill="#C084D6" />
          <rect x={8} y={4} width={1} height={1} fill="#6C3483" />
          <rect x={9} y={4} width={1} height={1} fill="#20222c" />
          <rect x={6} y={5} width={1} height={1} fill="#20222c" />
          <rect x={7} y={5} width={1} height={1} fill="#C084D6" />
          <rect x={8} y={5} width={1} height={1} fill="#6C3483" />
          <rect x={9} y={5} width={1} height={1} fill="#20222c" />
          <rect x={1} y={6} width={1} height={1} fill="#20222c" />
          <rect x={2} y={6} width={1} height={1} fill="#C084D6" />
          <rect x={3} y={6} width={1} height={1} fill="#6C3483" />
          <rect x={4} y={6} width={1} height={1} fill="#20222c" />
          <rect x={6} y={6} width={1} height={1} fill="#20222c" />
          <rect x={7} y={6} width={1} height={1} fill="#C084D6" />
          <rect x={8} y={6} width={1} height={1} fill="#6C3483" />
          <rect x={9} y={6} width={1} height={1} fill="#20222c" />
          <rect x={11} y={6} width={1} height={1} fill="#20222c" />
          <rect x={12} y={6} width={1} height={1} fill="#6C3483" />
          <rect x={13} y={6} width={1} height={1} fill="#C084D6" />
          <rect x={14} y={6} width={1} height={1} fill="#20222c" />
          <rect x={1} y={7} width={1} height={1} fill="#20222c" />
          <rect x={2} y={7} width={1} height={1} fill="#C084D6" />
          <rect x={3} y={7} width={1} height={1} fill="#6C3483" />
          <rect x={4} y={7} width={1} height={1} fill="#20222c" />
          <rect x={6} y={7} width={1} height={1} fill="#20222c" />
          <rect x={7} y={7} width={1} height={1} fill="#C084D6" />
          <rect x={8} y={7} width={1} height={1} fill="#6C3483" />
          <rect x={9} y={7} width={1} height={1} fill="#20222c" />
          <rect x={11} y={7} width={1} height={1} fill="#20222c" />
          <rect x={12} y={7} width={1} height={1} fill="#6C3483" />
          <rect x={13} y={7} width={1} height={1} fill="#C084D6" />
          <rect x={14} y={7} width={1} height={1} fill="#20222c" />
          <rect x={1} y={8} width={1} height={1} fill="#20222c" />
          <rect x={2} y={8} width={1} height={1} fill="#C084D6" />
          <rect x={3} y={8} width={1} height={1} fill="#6C3483" />
          <rect x={4} y={8} width={1} height={1} fill="#20222c" />
          <rect x={6} y={8} width={1} height={1} fill="#20222c" />
          <rect x={7} y={8} width={1} height={1} fill="#C084D6" />
          <rect x={8} y={8} width={1} height={1} fill="#6C3483" />
          <rect x={9} y={8} width={1} height={1} fill="#20222c" />
          <rect x={11} y={8} width={1} height={1} fill="#20222c" />
          <rect x={12} y={8} width={1} height={1} fill="#6C3483" />
          <rect x={13} y={8} width={1} height={1} fill="#C084D6" />
          <rect x={14} y={8} width={1} height={1} fill="#20222c" />
          <rect x={1} y={9} width={1} height={1} fill="#20222c" />
          <rect x={2} y={9} width={1} height={1} fill="#C084D6" />
          <rect x={3} y={9} width={1} height={1} fill="#6C3483" />
          <rect x={4} y={9} width={1} height={1} fill="#20222c" />
          <rect x={6} y={9} width={1} height={1} fill="#20222c" />
          <rect x={7} y={9} width={1} height={1} fill="#C084D6" />
          <rect x={8} y={9} width={1} height={1} fill="#6C3483" />
          <rect x={9} y={9} width={1} height={1} fill="#20222c" />
          <rect x={11} y={9} width={1} height={1} fill="#20222c" />
          <rect x={12} y={9} width={1} height={1} fill="#6C3483" />
          <rect x={13} y={9} width={1} height={1} fill="#C084D6" />
          <rect x={14} y={9} width={1} height={1} fill="#20222c" />
          <rect x={1} y={10} width={14} height={1} fill="#20222c" />
          <rect x={1} y={11} width={1} height={1} fill="#20222c" />
          <rect x={2} y={11} width={5} height={1} fill="#9B59B6" />
          <rect x={7} y={11} width={2} height={1} fill="#FFFFFF" />
          <rect x={9} y={11} width={5} height={1} fill="#9B59B6" />
          <rect x={14} y={11} width={1} height={1} fill="#20222c" />
          <rect x={1} y={12} width={1} height={1} fill="#20222c" />
          <rect x={2} y={12} width={1} height={1} fill="#9B59B6" />
          <rect x={3} y={12} width={2} height={1} fill="#FFFFFF" />
          <rect x={5} y={12} width={6} height={1} fill="#9B59B6" />
          <rect x={11} y={12} width={2} height={1} fill="#FFFFFF" />
          <rect x={13} y={12} width={1} height={1} fill="#9B59B6" />
          <rect x={14} y={12} width={1} height={1} fill="#20222c" />
          <rect x={1} y={13} width={14} height={1} fill="#20222c" />
        </>
      );
    case 'CHALLENGER':
      return (
        <>
          <rect x={7} y={0} width={2} height={1} fill="#20222c" />
          <rect x={7} y={1} width={2} height={1} fill="#E5352B" />
          <rect x={7} y={2} width={2} height={1} fill="#E5352B" />
          <rect x={7} y={3} width={2} height={1} fill="#FF8C1A" />
          <rect x={7} y={4} width={2} height={1} fill="#FF8C1A" />
          <rect x={5} y={5} width={1} height={1} fill="#E5352B" />
          <rect x={7} y={5} width={2} height={1} fill="#FFE066" />
          <rect x={10} y={5} width={1} height={1} fill="#E5352B" />
          <rect x={6} y={6} width={1} height={1} fill="#FF8C1A" />
          <rect x={7} y={6} width={2} height={1} fill="#FFE066" />
          <rect x={9} y={6} width={1} height={1} fill="#FF8C1A" />
          <rect x={0} y={7} width={1} height={1} fill="#20222c" />
          <rect x={1} y={7} width={2} height={1} fill="#E5352B" />
          <rect x={3} y={7} width={2} height={1} fill="#FF8C1A" />
          <rect x={5} y={7} width={6} height={1} fill="#FFE066" />
          <rect x={11} y={7} width={2} height={1} fill="#FF8C1A" />
          <rect x={13} y={7} width={2} height={1} fill="#E5352B" />
          <rect x={15} y={7} width={1} height={1} fill="#20222c" />
          <rect x={0} y={8} width={1} height={1} fill="#20222c" />
          <rect x={1} y={8} width={2} height={1} fill="#E5352B" />
          <rect x={3} y={8} width={2} height={1} fill="#FF8C1A" />
          <rect x={5} y={8} width={6} height={1} fill="#FFE066" />
          <rect x={11} y={8} width={2} height={1} fill="#FF8C1A" />
          <rect x={13} y={8} width={2} height={1} fill="#E5352B" />
          <rect x={15} y={8} width={1} height={1} fill="#20222c" />
          <rect x={6} y={9} width={1} height={1} fill="#FF8C1A" />
          <rect x={7} y={9} width={2} height={1} fill="#FFE066" />
          <rect x={9} y={9} width={1} height={1} fill="#FF8C1A" />
          <rect x={5} y={10} width={1} height={1} fill="#E5352B" />
          <rect x={7} y={10} width={2} height={1} fill="#FFE066" />
          <rect x={10} y={10} width={1} height={1} fill="#E5352B" />
          <rect x={7} y={11} width={2} height={1} fill="#FF8C1A" />
          <rect x={7} y={12} width={2} height={1} fill="#FF8C1A" />
          <rect x={7} y={13} width={2} height={1} fill="#E5352B" />
          <rect x={7} y={14} width={2} height={1} fill="#E5352B" />
          <rect x={7} y={15} width={2} height={1} fill="#20222c" />
        </>
      );
    default:
      return null;
  }
}
