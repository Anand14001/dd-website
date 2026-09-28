import React from 'react';

interface MarkdownContentProps {
  content: string;
}

export const MarkdownContent: React.FC<MarkdownContentProps> = ({ content }) => {
  const lines = content.split('\n');

  const parseInline = (text: string) => {
    // Split on **bold** text
    const segments = text.split(/(\*\*.*?\*\*)/g);
    return segments.map((seg, i) => {
      if (seg.startsWith('**') && seg.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-white">
            {seg.slice(2, -2)}
          </strong>
        );
      }
      return seg;
    });
  };

  return (
    <div className="space-y-1.5 leading-relaxed">
      {lines.map((rawLine, idx) => {
        const trimmed = rawLine.trim();

        // Empty line
        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }

        // Bullet line
        const bulletMatch = rawLine.match(/^(\s*)([•\*\-]\s+)(.*)$/);
        if (bulletMatch) {
          const indent = bulletMatch[1].length;
          const body = bulletMatch[3];
          return (
            <div
              key={idx}
              className="flex items-start gap-2 text-white/90"
              style={{ paddingLeft: `${Math.min(indent * 6, 24)}px` }}
            >
              <span className="text-lime font-bold shrink-0 mt-0.5">•</span>
              <span className="flex-1">{parseInline(body)}</span>
            </div>
          );
        }

        // Standard paragraph line
        return (
          <p key={idx} className="text-inherit">
            {parseInline(rawLine)}
          </p>
        );
      })}
    </div>
  );
};
