export function formatArticleDate(date: string) {
  if (/^\d{4}\.\d{2}\.\d{2}$/.test(date)) return date;
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return date.replaceAll('-', '.');
}

export function articleToPlainText(markdown: string) {
  return markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~-]/g, '')
    .replace(/\n+/g, ' ')
    .trim();
}
