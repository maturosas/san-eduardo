import React from "react";

const PARAGRAPH_STARTERS = ["la ", "el ", "lo ", "en ", "un ", "una ", "para ", "si ", "no ", "con ", "de ", "te ", "los ", "las ", "al ", "su ", "se ", "es ", "son ", "hay ", "esto ", "este ", "esta ", "cuando ", "aunque ", "pero ", "y ", "o ", "porque ", "que "];

function isHeading(block: string): boolean {
  if (block.length > 100) return false;
  if (block.startsWith("-")) return false;
  if (block.includes("\n")) return false;
  const lower = block.toLowerCase();
  return !PARAGRAPH_STARTERS.some(w => lower.startsWith(w));
}

export function parseContent(content: string): React.ReactNode[] {
  const blocks = content.split(/\n\n+/).map(b => b.trim()).filter(Boolean);

  return blocks.map((block, i) => {
    const lines = block.split("\n").filter(Boolean);

    // List block
    if (lines.length > 1 && lines.every(l => l.startsWith("- "))) {
      return (
        <ul key={i} className="article-list">
          {lines.map((l, j) => (
            <li key={j}>{l.slice(2)}</li>
          ))}
        </ul>
      );
    }

    // Mixed block with list items
    if (lines.some(l => l.startsWith("- ")) && lines.some(l => !l.startsWith("- "))) {
      return (
        <div key={i}>
          {lines.map((l, j) =>
            l.startsWith("- ") ? (
              <li key={j} className="article-list-item">{l.slice(2)}</li>
            ) : (
              <p key={j} className="article-p">{l}</p>
            )
          )}
        </div>
      );
    }

    // Heading
    if (isHeading(block)) {
      return <h2 key={i} className="article-h2">{block}</h2>;
    }

    // Regular paragraph — first one gets drop cap treatment
    return (
      <p key={i} className={i === 0 ? "article-p article-lead" : "article-p"}>
        {block}
      </p>
    );
  });
}
