type PortableTextChild = { text?: string };
type PortableTextBlock = {
  _type?: string;
  children?: PortableTextChild[];
};

export function portableTextToPlainText(value: unknown, maxLength = 400): string {
  if (!Array.isArray(value)) return '';

  const text = value
    .filter((block): block is PortableTextBlock => Boolean(block) && typeof block === 'object')
    .filter((block) => block._type === 'block' && Array.isArray(block.children))
    .map((block) =>
      (block.children ?? [])
        .map((child) => (typeof child?.text === 'string' ? child.text.trim() : ''))
        .filter(Boolean)
        .join(' ')
    )
    .filter(Boolean)
    .join('\n\n')
    .trim();

  if (!text) return '';
  return text.length > maxLength ? `${text.slice(0, maxLength - 1).trim()}...` : text;
}
