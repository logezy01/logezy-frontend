function renderInline(text, keyPrefix) {
  const tokens = text.split(/(\[[^\]]+\]\(https?:\/\/[^\s)]+\)|\*\*[^*]+\*\*|`[^`]+`)/g);

  return tokens.map((token, index) => {
    const key = `${keyPrefix}-${index}`;
    const linkMatch = token.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);

    if (linkMatch) {
      const [, label, href] = linkMatch;
      return (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-[#286b35] underline decoration-[#286b35]/30 underline-offset-2 transition hover:decoration-[#286b35] dark:text-[#a4d4a8]"
        >
          {label}
        </a>
      );
    }

    if (token.startsWith('**') && token.endsWith('**')) {
      return <strong key={key} className="font-semibold text-[#263a2a] dark:text-[#f0f4ee]">{token.slice(2, -2)}</strong>;
    }

    if (token.startsWith('`') && token.endsWith('`')) {
      return (
        <code key={key} className="rounded-md bg-black/[0.05] px-1.5 py-0.5 font-mono text-[0.9em] dark:bg-white/10">
          {token.slice(1, -1)}
        </code>
      );
    }

    return token;
  });
}

function renderBlocks(content) {
  const lines = content.replace(/\r\n?/g, '\n').split('\n');
  const blocks = [];
  let paragraph = [];
  let listItems = [];
  let listType = null;

  const flushParagraph = () => {
    if (!paragraph.length) return;
    blocks.push({ type: 'paragraph', lines: paragraph });
    paragraph = [];
  };

  const flushList = () => {
    if (!listItems.length) return;
    blocks.push({ type: listType, items: listItems });
    listItems = [];
    listType = null;
  };

  lines.forEach((line) => {
    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    const unorderedItem = line.match(/^\s*[-*•]\s+(.+)$/);
    const orderedItem = line.match(/^\s*\d+[.)]\s+(.+)$/);
    const quote = line.match(/^\s*>\s?(.*)$/);

    if (!line.trim()) {
      flushParagraph();
      flushList();
      return;
    }

    if (heading) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'heading', level: heading[1].length, text: heading[2] });
      return;
    }

    if (unorderedItem || orderedItem) {
      flushParagraph();
      const nextListType = unorderedItem ? 'unordered' : 'ordered';
      if (listType && listType !== nextListType) flushList();
      listType = nextListType;
      listItems.push((unorderedItem || orderedItem)[1]);
      return;
    }

    if (quote) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'quote', text: quote[1] });
      return;
    }

    flushList();
    paragraph.push(line);
  });

  flushParagraph();
  flushList();

  return blocks.map((block, index) => {
    if (block.type === 'heading') {
      const className = 'mb-1.5 mt-4 first:mt-0 font-semibold tracking-tight text-[#25372a] dark:text-[#f0f4ee]';
      const text = renderInline(block.text, `heading-${index}`);
      if (block.level === 1) return <h2 key={index} className={`${className} text-lg`}>{text}</h2>;
      if (block.level === 2) return <h3 key={index} className={`${className} text-base`}>{text}</h3>;
      return <h4 key={index} className={`${className} text-sm`}>{text}</h4>;
    }

    if (block.type === 'unordered' || block.type === 'ordered') {
      const List = block.type === 'unordered' ? 'ul' : 'ol';
      return (
        <List key={index} className={`${block.type === 'unordered' ? 'list-disc' : 'list-decimal'} my-2.5 space-y-1.5 pl-5 marker:text-[#66866b]`}>
          {block.items.map((item, itemIndex) => (
            <li key={itemIndex} className="pl-0.5">{renderInline(item, `list-${index}-${itemIndex}`)}</li>
          ))}
        </List>
      );
    }

    if (block.type === 'quote') {
      return (
        <blockquote key={index} className="my-2 border-l-2 border-[#7ca783] pl-3 text-[#607463] dark:text-[#b4c4b5]">
          {renderInline(block.text, `quote-${index}`)}
        </blockquote>
      );
    }

    return (
      <p key={index} className="my-2 first:mt-0 last:mb-0">
        {block.lines.map((line, lineIndex) => (
          <span key={lineIndex}>
            {lineIndex > 0 && <br />}
            {renderInline(line, `paragraph-${index}-${lineIndex}`)}
          </span>
        ))}
      </p>
    );
  });
}

export default function ChatMessage({ message }) {
  const isAssistant = message.role === 'assistant';

  return (
    <article className={`flex w-full gap-3 ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      {isAssistant && (
        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#dce8dc] bg-white/80 text-[#3A7D44] shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-[#a4d4a8]">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4">
            <path d="M4.5 10.5 12 4l7.5 6.5v8a1.5 1.5 0 0 1-1.5 1.5h-4.5v-5.5h-3V20H6a1.5 1.5 0 0 1-1.5-1.5v-8Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
            <path d="M9 9h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </div>
      )}

      <div className={`min-w-0 max-w-[min(100%,46rem)] ${isAssistant ? 'flex-1' : ''}`}>
        {isAssistant && (
          <div className="mb-1.5 flex items-center gap-2 px-1">
            <span className="text-xs font-semibold tracking-wide text-[#465d4a] dark:text-[#c3d5c4]">Logezy Assistant</span>
            {message.webSearchStatus === 'available' && (
              <span className="rounded-full bg-[#edf5ec] px-2 py-0.5 text-[10px] font-medium text-[#47734c] dark:bg-emerald-900/30 dark:text-emerald-200">
                Recherche web
              </span>
            )}
          </div>
        )}
        <div className={`rounded-[22px] px-4 py-3.5 text-[14px] leading-[1.75] sm:px-5 sm:py-4 ${
          isAssistant
            ? 'rounded-tl-md border border-white/80 bg-white/75 text-[#3e4b40] shadow-[0_8px_24px_rgba(40,55,40,0.055)] backdrop-blur-xl dark:border-white/10 dark:bg-[#1b241d]/85 dark:text-[#d8e0d6]'
            : 'rounded-tr-md bg-[#376f40] text-white shadow-[0_8px_24px_rgba(41,94,49,0.18)]'
        }`}>
          <div className="break-words [overflow-wrap:anywhere]">
            {renderBlocks(message.content)}
          </div>

          {isAssistant && message.sources?.length > 0 && (
            <section className="mt-4 border-t border-[#e9eee7] pt-3 dark:border-white/10" aria-label="Sources en ligne">
              <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#758477] dark:text-[#aab9aa]">
                Sources consultées
              </h3>
              <ul className="space-y-1.5">
                {message.sources.map((source, index) => (
                  <li key={`${source.url}-${index}`} className="flex gap-2 text-xs leading-relaxed">
                    <span className="mt-1 text-[#719278]" aria-hidden="true">↗</span>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-w-0 font-medium text-[#376f40] underline decoration-[#376f40]/20 underline-offset-2 transition hover:decoration-[#376f40] dark:text-[#a4d4a8]"
                    >
                      {source.title || source.url}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {isAssistant && message.webSearchStatus === 'not_configured' && (
            <p className="mt-3 rounded-xl bg-amber-50/80 px-3 py-2 text-xs leading-relaxed text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
              La recherche en ligne n’est pas encore configurée sur le serveur.
            </p>
          )}
          {isAssistant && message.webSearchStatus === 'unavailable' && (
            <p className="mt-3 rounded-xl bg-amber-50/80 px-3 py-2 text-xs leading-relaxed text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
              La recherche en ligne est temporairement indisponible ; les informations de Logezy restent accessibles.
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
