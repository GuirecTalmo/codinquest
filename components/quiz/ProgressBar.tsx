import { Division } from '@prisma/client';
import { getDivisionColor, getNextDivision } from '@/lib/quiz/divisions';
import { PixelIcon } from '@/components/PixelIcon';

interface ProgressBarProps {
  current: number; // 0-2 (divisionPoints)
  total: number; // 3 (quiz réussis nécessaires)
  division: Division;
}

export function ProgressBar({ current, total, division }: ProgressBarProps) {
  const nextDivision = getNextDivision(division);
  // CHALLENGER : plus de division suivante, mais le backend continue
  // d'incrémenter divisionPoints au fil des réussites (voir
  // app/api/quiz/[id]/submit/route.ts) -- il peut donc dépasser `total`.
  const isMaxDivision = nextDivision === null;
  const percentage = Math.min(100, (current / total) * 100);
  const color = getDivisionColor(division);
  const remaining = Math.max(0, total - current);
  const promotionReady = !isMaxDivision && remaining <= 0;
  const oneWinAway = !isMaxDivision && remaining === 1;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-text-secondary uppercase tracking-wide">
          {isMaxDivision ? 'Division la plus haute' : 'Progression vers la prochaine division'}
        </span>
        {!isMaxDivision && (
          <span className="text-sm font-semibold text-text-primary">
            {current}/{total} quiz réussis
          </span>
        )}
      </div>
      <div className="w-full bg-surface-dimmed border-[3px] border-border h-3 overflow-hidden">
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>

      {/* Moment de maîtrise : la promotion (et l'approche à une victoire)
          emprunte le traitement "podium" du classement (fond accent plein,
          icône Couronne) au lieu d'un texte gris -- c'est le même mécanisme
          de ladder compétitive, il mérite la même énergie ici que sur
          /dashboard/leaderboard. */}
      {isMaxDivision ? (
        <div className="mt-3 flex items-center gap-2 bg-accent border-[3px] border-accent-border text-on-accent px-4 py-2 shadow-hard">
          <PixelIcon name="Crown" className="w-5 h-5" />
          <span className="font-display font-bold uppercase tracking-wide text-sm">
            Division maximale atteinte
          </span>
        </div>
      ) : promotionReady ? (
        <div className="mt-3 flex items-center gap-2 bg-accent border-[3px] border-accent-border text-on-accent px-4 py-2 shadow-hard">
          <PixelIcon name="Crown" className="w-5 h-5" />
          <span className="font-display font-bold uppercase tracking-wide text-sm">
            Promotion vers {nextDivision} disponible !
          </span>
        </div>
      ) : (
        <p
          className={`text-xs mt-1 flex items-center gap-1 ${
            oneWinAway ? 'text-accent font-semibold' : 'text-text-secondary'
          }`}
        >
          {oneWinAway && <PixelIcon name="Zap" className="w-3 h-3" />}
          {oneWinAway
            ? "Plus qu'une victoire d'affilée pour la promotion !"
            : `${remaining} réussites d'affilée restantes avant la promotion`}
        </p>
      )}
      {!isMaxDivision && (
        <p className="text-xs text-text-secondary/80 mt-1">
          Un échec sur un quiz jamais réussi remet ce compteur à zéro ; rejouer un quiz déjà validé ne casse pas la série.
        </p>
      )}
    </div>
  );
}
