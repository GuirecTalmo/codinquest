export type PixelIconName =
  | 'Mail'
  | 'CheckCircle2'
  | 'XCircle'
  | 'Lock'
  | 'Clock'
  | 'Trophy'
  | 'Target'
  | 'AlertCircle'
  | 'ArrowRight'
  | 'ArrowLeft'
  | 'LogIn'
  | 'LogOut'
  | 'Calendar'
  | 'Zap'
  | 'RotateCcw'
  | 'LayoutDashboard'
  | 'History'
  | 'User'
  | 'Medal'
  | 'Crown'
  | 'TrendingUp'
  | 'ChevronRight'
  | 'Home';

interface PixelIconProps {
  name: PixelIconName;
  className?: string;
}

/**
 * Monochrome 8x8 pixel-art glyphs replacing the app's lucide-react icons
 * 1:1 by name -- flat currentColor fills, no anti-aliasing, matching the
 * Codin'sideQuest pixel-art design system. Sizing and color come from
 * className exactly as with the lucide icons they replace.
 */
export function PixelIcon({ name, className }: PixelIconProps) {
  return (
    <svg
      viewBox="0 0 8 8"
      className={className}
      fill="currentColor"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {renderRects(name)}
    </svg>
  );
}

function renderRects(name: PixelIconName) {
  switch (name) {
    case 'Mail':
      return (
        <>
          <rect x={0} y={0} width={8} height={1} />
          <rect x={0} y={1} width={1} height={1} />
          <rect x={2} y={1} width={1} height={1} />
          <rect x={5} y={1} width={1} height={1} />
          <rect x={7} y={1} width={1} height={1} />
          <rect x={0} y={2} width={1} height={1} />
          <rect x={3} y={2} width={2} height={1} />
          <rect x={7} y={2} width={1} height={1} />
          <rect x={0} y={3} width={1} height={1} />
          <rect x={7} y={3} width={1} height={1} />
          <rect x={0} y={4} width={1} height={1} />
          <rect x={7} y={4} width={1} height={1} />
          <rect x={0} y={5} width={1} height={1} />
          <rect x={7} y={5} width={1} height={1} />
          <rect x={0} y={6} width={1} height={1} />
          <rect x={7} y={6} width={1} height={1} />
          <rect x={0} y={7} width={8} height={1} />
        </>
      );
    case 'CheckCircle2':
      return (
        <>
          <rect x={7} y={2} width={1} height={1} />
          <rect x={6} y={3} width={1} height={1} />
          <rect x={5} y={4} width={1} height={1} />
          <rect x={0} y={5} width={1} height={1} />
          <rect x={5} y={5} width={1} height={1} />
          <rect x={1} y={6} width={1} height={1} />
          <rect x={4} y={6} width={1} height={1} />
          <rect x={2} y={7} width={2} height={1} />
        </>
      );
    case 'XCircle':
      return (
        <>
          <rect x={0} y={0} width={1} height={1} />
          <rect x={7} y={0} width={1} height={1} />
          <rect x={1} y={1} width={1} height={1} />
          <rect x={6} y={1} width={1} height={1} />
          <rect x={2} y={2} width={1} height={1} />
          <rect x={5} y={2} width={1} height={1} />
          <rect x={3} y={3} width={2} height={1} />
          <rect x={3} y={4} width={2} height={1} />
          <rect x={2} y={5} width={1} height={1} />
          <rect x={5} y={5} width={1} height={1} />
          <rect x={1} y={6} width={1} height={1} />
          <rect x={6} y={6} width={1} height={1} />
          <rect x={0} y={7} width={1} height={1} />
          <rect x={7} y={7} width={1} height={1} />
        </>
      );
    case 'Lock':
      return (
        <>
          <rect x={1} y={0} width={4} height={1} />
          <rect x={0} y={1} width={1} height={1} />
          <rect x={5} y={1} width={1} height={1} />
          <rect x={0} y={2} width={1} height={1} />
          <rect x={5} y={2} width={1} height={1} />
          <rect x={0} y={3} width={7} height={1} />
          <rect x={0} y={4} width={1} height={1} />
          <rect x={6} y={4} width={1} height={1} />
          <rect x={0} y={5} width={1} height={1} />
          <rect x={3} y={5} width={1} height={1} />
          <rect x={6} y={5} width={1} height={1} />
          <rect x={0} y={6} width={1} height={1} />
          <rect x={6} y={6} width={1} height={1} />
          <rect x={0} y={7} width={7} height={1} />
        </>
      );
    case 'Clock':
      return (
        <>
          <rect x={1} y={0} width={6} height={1} />
          <rect x={0} y={1} width={1} height={1} />
          <rect x={7} y={1} width={1} height={1} />
          <rect x={0} y={2} width={1} height={1} />
          <rect x={3} y={2} width={1} height={1} />
          <rect x={7} y={2} width={1} height={1} />
          <rect x={0} y={3} width={1} height={1} />
          <rect x={3} y={3} width={1} height={1} />
          <rect x={7} y={3} width={1} height={1} />
          <rect x={0} y={4} width={1} height={1} />
          <rect x={3} y={4} width={3} height={1} />
          <rect x={7} y={4} width={1} height={1} />
          <rect x={0} y={5} width={1} height={1} />
          <rect x={7} y={5} width={1} height={1} />
          <rect x={0} y={6} width={1} height={1} />
          <rect x={7} y={6} width={1} height={1} />
          <rect x={1} y={7} width={6} height={1} />
        </>
      );
    case 'Trophy':
      return (
        <>
          <rect x={2} y={0} width={4} height={1} />
          <rect x={0} y={1} width={1} height={1} />
          <rect x={2} y={1} width={4} height={1} />
          <rect x={7} y={1} width={1} height={1} />
          <rect x={0} y={2} width={1} height={1} />
          <rect x={2} y={2} width={4} height={1} />
          <rect x={7} y={2} width={1} height={1} />
          <rect x={2} y={3} width={4} height={1} />
          <rect x={3} y={4} width={2} height={1} />
          <rect x={3} y={5} width={2} height={1} />
          <rect x={2} y={6} width={4} height={1} />
          <rect x={2} y={7} width={4} height={1} />
        </>
      );
    case 'Target':
      return (
        <>
          <rect x={1} y={0} width={6} height={1} />
          <rect x={0} y={1} width={1} height={1} />
          <rect x={7} y={1} width={1} height={1} />
          <rect x={0} y={2} width={1} height={1} />
          <rect x={2} y={2} width={4} height={1} />
          <rect x={7} y={2} width={1} height={1} />
          <rect x={0} y={3} width={1} height={1} />
          <rect x={2} y={3} width={4} height={1} />
          <rect x={7} y={3} width={1} height={1} />
          <rect x={0} y={4} width={1} height={1} />
          <rect x={2} y={4} width={4} height={1} />
          <rect x={7} y={4} width={1} height={1} />
          <rect x={0} y={5} width={1} height={1} />
          <rect x={2} y={5} width={4} height={1} />
          <rect x={7} y={5} width={1} height={1} />
          <rect x={0} y={6} width={1} height={1} />
          <rect x={7} y={6} width={1} height={1} />
          <rect x={1} y={7} width={6} height={1} />
        </>
      );
    case 'AlertCircle':
      return (
        <>
          <rect x={1} y={0} width={6} height={1} />
          <rect x={0} y={1} width={1} height={1} />
          <rect x={7} y={1} width={1} height={1} />
          <rect x={0} y={2} width={1} height={1} />
          <rect x={3} y={2} width={2} height={1} />
          <rect x={7} y={2} width={1} height={1} />
          <rect x={0} y={3} width={1} height={1} />
          <rect x={3} y={3} width={2} height={1} />
          <rect x={7} y={3} width={1} height={1} />
          <rect x={0} y={4} width={1} height={1} />
          <rect x={3} y={4} width={2} height={1} />
          <rect x={7} y={4} width={1} height={1} />
          <rect x={0} y={5} width={1} height={1} />
          <rect x={7} y={5} width={1} height={1} />
          <rect x={0} y={6} width={1} height={1} />
          <rect x={3} y={6} width={2} height={1} />
          <rect x={7} y={6} width={1} height={1} />
          <rect x={1} y={7} width={6} height={1} />
        </>
      );
    case 'ArrowRight':
      return (
        <>
          <rect x={4} y={1} width={1} height={1} />
          <rect x={5} y={2} width={1} height={1} />
          <rect x={0} y={3} width={7} height={1} />
          <rect x={0} y={4} width={7} height={1} />
          <rect x={5} y={5} width={1} height={1} />
          <rect x={4} y={6} width={1} height={1} />
        </>
      );
    case 'ArrowLeft':
      return (
        <>
          <rect x={3} y={1} width={1} height={1} />
          <rect x={2} y={2} width={1} height={1} />
          <rect x={1} y={3} width={7} height={1} />
          <rect x={1} y={4} width={7} height={1} />
          <rect x={2} y={5} width={1} height={1} />
          <rect x={3} y={6} width={1} height={1} />
        </>
      );
    case 'LogIn':
      return (
        <>
          <rect x={4} y={0} width={1} height={1} />
          <rect x={4} y={1} width={2} height={1} />
          <rect x={0} y={2} width={6} height={1} />
          <rect x={7} y={2} width={1} height={1} />
          <rect x={0} y={3} width={6} height={1} />
          <rect x={7} y={3} width={1} height={1} />
          <rect x={4} y={4} width={2} height={1} />
          <rect x={4} y={5} width={1} height={1} />
        </>
      );
    case 'LogOut':
      return (
        <>
          <rect x={3} y={0} width={1} height={1} />
          <rect x={3} y={1} width={3} height={1} />
          <rect x={0} y={2} width={1} height={1} />
          <rect x={3} y={2} width={5} height={1} />
          <rect x={0} y={3} width={1} height={1} />
          <rect x={3} y={3} width={5} height={1} />
          <rect x={3} y={4} width={3} height={1} />
          <rect x={3} y={5} width={1} height={1} />
        </>
      );
    case 'Calendar':
      return (
        <>
          <rect x={0} y={0} width={8} height={1} />
          <rect x={0} y={1} width={1} height={1} />
          <rect x={7} y={1} width={1} height={1} />
          <rect x={0} y={2} width={8} height={1} />
          <rect x={0} y={3} width={1} height={1} />
          <rect x={2} y={3} width={1} height={1} />
          <rect x={4} y={3} width={1} height={1} />
          <rect x={6} y={3} width={1} height={1} />
          <rect x={0} y={4} width={1} height={1} />
          <rect x={7} y={4} width={1} height={1} />
          <rect x={0} y={5} width={1} height={1} />
          <rect x={2} y={5} width={1} height={1} />
          <rect x={4} y={5} width={1} height={1} />
          <rect x={6} y={5} width={1} height={1} />
          <rect x={0} y={6} width={1} height={1} />
          <rect x={7} y={6} width={1} height={1} />
          <rect x={0} y={7} width={8} height={1} />
        </>
      );
    case 'Zap':
      return (
        <>
          <rect x={2} y={0} width={3} height={1} />
          <rect x={1} y={1} width={2} height={1} />
          <rect x={0} y={2} width={2} height={1} />
          <rect x={1} y={3} width={5} height={1} />
          <rect x={4} y={4} width={2} height={1} />
          <rect x={3} y={5} width={2} height={1} />
          <rect x={2} y={6} width={2} height={1} />
          <rect x={1} y={7} width={1} height={1} />
        </>
      );
    case 'RotateCcw':
      return (
        <>
          <rect x={2} y={0} width={4} height={1} />
          <rect x={1} y={1} width={1} height={1} />
          <rect x={6} y={1} width={1} height={1} />
          <rect x={0} y={2} width={1} height={1} />
          <rect x={7} y={2} width={1} height={1} />
          <rect x={0} y={3} width={1} height={1} />
          <rect x={7} y={3} width={1} height={1} />
          <rect x={0} y={4} width={1} height={1} />
          <rect x={7} y={4} width={1} height={1} />
          <rect x={0} y={5} width={1} height={1} />
          <rect x={5} y={5} width={2} height={1} />
          <rect x={1} y={6} width={1} height={1} />
          <rect x={4} y={6} width={1} height={1} />
          <rect x={2} y={7} width={2} height={1} />
        </>
      );
    case 'LayoutDashboard':
      return (
        <>
          <rect x={0} y={0} width={3} height={1} />
          <rect x={4} y={0} width={3} height={1} />
          <rect x={0} y={1} width={3} height={1} />
          <rect x={4} y={1} width={3} height={1} />
          <rect x={0} y={2} width={3} height={1} />
          <rect x={4} y={2} width={3} height={1} />
          <rect x={0} y={4} width={3} height={1} />
          <rect x={4} y={4} width={3} height={1} />
          <rect x={0} y={5} width={3} height={1} />
          <rect x={4} y={5} width={3} height={1} />
          <rect x={0} y={6} width={3} height={1} />
          <rect x={4} y={6} width={3} height={1} />
        </>
      );
    case 'History':
      return (
        <>
          <rect x={0} y={0} width={8} height={1} />
          <rect x={0} y={1} width={8} height={1} />
          <rect x={0} y={3} width={8} height={1} />
          <rect x={0} y={4} width={8} height={1} />
          <rect x={0} y={6} width={8} height={1} />
          <rect x={0} y={7} width={8} height={1} />
        </>
      );
    case 'User':
      return (
        <>
          <rect x={2} y={0} width={4} height={1} />
          <rect x={1} y={1} width={1} height={1} />
          <rect x={6} y={1} width={1} height={1} />
          <rect x={1} y={2} width={1} height={1} />
          <rect x={6} y={2} width={1} height={1} />
          <rect x={2} y={3} width={4} height={1} />
          <rect x={1} y={5} width={6} height={1} />
          <rect x={0} y={6} width={8} height={1} />
          <rect x={0} y={7} width={8} height={1} />
        </>
      );
    case 'Medal':
      return (
        <>
          <rect x={2} y={0} width={1} height={1} />
          <rect x={5} y={0} width={1} height={1} />
          <rect x={2} y={1} width={4} height={1} />
          <rect x={1} y={2} width={6} height={1} />
          <rect x={0} y={3} width={8} height={1} />
          <rect x={0} y={4} width={8} height={1} />
          <rect x={0} y={5} width={8} height={1} />
          <rect x={1} y={6} width={6} height={1} />
          <rect x={2} y={7} width={4} height={1} />
        </>
      );
    case 'Crown':
      return (
        <>
          <rect x={0} y={1} width={1} height={1} />
          <rect x={2} y={1} width={1} height={1} />
          <rect x={4} y={1} width={1} height={1} />
          <rect x={6} y={1} width={1} height={1} />
          <rect x={0} y={2} width={1} height={1} />
          <rect x={2} y={2} width={1} height={1} />
          <rect x={4} y={2} width={1} height={1} />
          <rect x={6} y={2} width={1} height={1} />
          <rect x={0} y={3} width={7} height={1} />
          <rect x={0} y={4} width={7} height={1} />
          <rect x={0} y={5} width={7} height={1} />
          <rect x={0} y={6} width={7} height={1} />
        </>
      );
    case 'TrendingUp':
      return (
        <>
          <rect x={6} y={0} width={2} height={1} />
          <rect x={6} y={1} width={2} height={1} />
          <rect x={4} y={2} width={4} height={1} />
          <rect x={4} y={3} width={4} height={1} />
          <rect x={2} y={4} width={6} height={1} />
          <rect x={2} y={5} width={6} height={1} />
          <rect x={0} y={6} width={8} height={1} />
          <rect x={0} y={7} width={8} height={1} />
        </>
      );
    case 'ChevronRight':
      return (
        <>
          <rect x={0} y={0} width={1} height={1} />
          <rect x={1} y={1} width={1} height={1} />
          <rect x={2} y={2} width={1} height={1} />
          <rect x={3} y={3} width={1} height={1} />
          <rect x={3} y={4} width={1} height={1} />
          <rect x={2} y={5} width={1} height={1} />
          <rect x={1} y={6} width={1} height={1} />
          <rect x={0} y={7} width={1} height={1} />
        </>
      );
    case 'Home':
      return (
        <>
          <rect x={3} y={0} width={2} height={1} />
          <rect x={2} y={1} width={4} height={1} />
          <rect x={1} y={2} width={6} height={1} />
          <rect x={0} y={3} width={8} height={1} />
          <rect x={0} y={4} width={1} height={1} />
          <rect x={2} y={4} width={4} height={1} />
          <rect x={7} y={4} width={1} height={1} />
          <rect x={0} y={5} width={1} height={1} />
          <rect x={2} y={5} width={4} height={1} />
          <rect x={7} y={5} width={1} height={1} />
          <rect x={0} y={6} width={1} height={1} />
          <rect x={2} y={6} width={1} height={1} />
          <rect x={5} y={6} width={1} height={1} />
          <rect x={7} y={6} width={1} height={1} />
          <rect x={0} y={7} width={1} height={1} />
          <rect x={2} y={7} width={1} height={1} />
          <rect x={5} y={7} width={1} height={1} />
          <rect x={7} y={7} width={1} height={1} />
        </>
      );
    default:
      return null;
  }
}
