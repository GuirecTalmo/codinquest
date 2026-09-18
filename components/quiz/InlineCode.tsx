/**
 * Découpe un texte sur les paires de backticks et enveloppe les segments
 * de code dans <code> -- même convention que la source Codin'sideQuest
 * pour les explications ("`preconnect`" -> code inline surligné).
 */
export function renderInlineCode(text: string): React.ReactNode[] {
  const parts = text.split('`');
  return parts.map((part, index) => {
    if (part === '') return null;
    if (index % 2 === 1) {
      return (
        <code
          key={index}
          className="bg-surface-dimmed text-text-primary px-1 border border-border"
        >
          {part}
        </code>
      );
    }
    return part;
  });
}
