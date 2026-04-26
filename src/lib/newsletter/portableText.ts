type PortableTextMarkDef = {
  _key?: string;
  _type?: string;
  href?: string;
};

type PortableTextSpan = {
  _type?: string;
  text?: string;
  marks?: string[];
};

type PortableTextBlock = {
  _type?: string;
  style?: string;
  listItem?: 'bullet' | 'number';
  level?: number;
  children?: PortableTextSpan[];
  markDefs?: PortableTextMarkDef[];
};

const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => HTML_ESCAPE_MAP[char]);
}

function normalizeTypography(value: string): string {
  // Keep typography email-safe and user-requested: no em dashes.
  return value.replace(/—/g, '-');
}

function applyMarks(
  rawText: string,
  marks: string[] | undefined,
  markDefs: PortableTextMarkDef[] | undefined,
): string {
  const text = escapeHtml(normalizeTypography(rawText));
  if (!marks || marks.length === 0) return text;

  return marks.reduce((acc, mark) => {
    if (mark === 'strong') return `<strong>${acc}</strong>`;
    if (mark === 'em') return `<em>${acc}</em>`;
    if (mark === 'code') return `<code>${acc}</code>`;

    const def = markDefs?.find((d) => d._key === mark && d._type === 'link' && typeof d.href === 'string');
    if (def?.href) {
      const href = escapeHtml(def.href);
      return `<a href="${href}" target="_blank" rel="noopener noreferrer">${acc}</a>`;
    }
    return acc;
  }, text);
}

function blockTag(style: string | undefined): 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'blockquote' {
  if (!style) return 'p';
  if (style.startsWith('h1')) return 'h1';
  if (style.startsWith('h2')) return 'h2';
  if (style.startsWith('h3')) return 'h3';
  if (style.startsWith('h4')) return 'h4';
  if (style === 'blockquote') return 'blockquote';
  return 'p';
}

function blockStyle(tag: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'blockquote'): string {
  if (tag === 'h1') return 'margin:0 0 12px 0;font-size:28px;line-height:1.3;color:#111827;';
  if (tag === 'h2') return 'margin:0 0 10px 0;font-size:24px;line-height:1.35;color:#111827;';
  if (tag === 'h3') return 'margin:0 0 10px 0;font-size:20px;line-height:1.4;color:#111827;';
  if (tag === 'h4') return 'margin:0 0 8px 0;font-size:18px;line-height:1.4;color:#111827;';
  if (tag === 'blockquote') return 'margin:0 0 14px 0;padding:8px 12px;border-left:4px solid #d1d5db;color:#374151;';
  return 'margin:0 0 14px 0;font-size:16px;line-height:1.65;color:#374151;';
}

function renderChildren(block: PortableTextBlock): string {
  return (block.children ?? [])
    .filter((child) => child?._type === 'span' && typeof child.text === 'string')
    .map((child) => applyMarks(child.text ?? '', child.marks, block.markDefs))
    .join('');
}

export function portableTextToHtml(value: unknown): string {
  if (!Array.isArray(value)) return '';

  const blocks = value.filter(
    (b): b is PortableTextBlock => Boolean(b) && typeof b === 'object',
  );

  const chunks: string[] = [];
  let listBuffer: { type: 'bullet' | 'number'; level: number; items: string[] } | null = null;

  const flushList = () => {
    if (!listBuffer || listBuffer.items.length === 0) return;
    const listTag = listBuffer.type === 'number' ? 'ol' : 'ul';
    chunks.push(`<${listTag} style="margin:0 0 14px 0;padding-left:20px;color:#374151;">${listBuffer.items.join('')}</${listTag}>`);
    listBuffer = null;
  };

  for (const block of blocks) {
    const content = renderChildren(block).trim();
    if (!content) continue;

    if (block.listItem) {
      const level = block.level ?? 1;
      if (
        !listBuffer ||
        listBuffer.type !== block.listItem ||
        listBuffer.level !== level
      ) {
        flushList();
        listBuffer = { type: block.listItem, level, items: [] };
      }
      listBuffer.items.push(`<li style="margin:0 0 8px 0;line-height:1.65;">${content}</li>`);
      continue;
    }

    flushList();
    const tag = blockTag(block.style);
    chunks.push(`<${tag} style="${blockStyle(tag)}">${content}</${tag}>`);
  }

  flushList();
  return chunks.join('\n');
}

export function portableTextToPlainText(value: unknown): string {
  if (!Array.isArray(value)) return '';

  return value
    .filter((block): block is PortableTextBlock => Boolean(block) && typeof block === 'object')
    .map((block) =>
      (block.children ?? [])
        .filter((child) => child?._type === 'span' && typeof child.text === 'string')
        .map((child) => normalizeTypography(child.text ?? '').trim())
        .filter(Boolean)
        .join(' ')
    )
    .filter(Boolean)
    .join('\n\n')
    .trim();
}
