import styles from './SiteLayout.module.css';

type Props = {
  content: string;
};

function parseInline(text: string) {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*([^*]+)\*\*|\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]+)\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    if (match[2]) {
      parts.push(<strong key={match.index}>{match[2]}</strong>);
    } else if (match[3] && match[4]) {
      parts.push(
        <a key={match.index} href={match[4]} target={match[4].startsWith('http') ? '_blank' : undefined} rel={match[4].startsWith('http') ? 'noopener noreferrer' : undefined}>
          {match[3]}
        </a>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

export default function MarkdownArticle({ content }: Props) {
  const blocks = content.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);

  return (
    <div className={styles.articleContent}>
      {blocks.map((block, index) => {
        if (block.startsWith('![')) {
          const match = block.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
          if (match) {
            return (
              <div className={styles.articleImage} key={index}>
                <img src={match[2]} alt={match[1]} />
              </div>
            );
          }
        }

        if (block.startsWith('## ')) return <h2 key={index}>{parseInline(block.slice(3))}</h2>;
        if (block.startsWith('# ')) return <h1 key={index}>{parseInline(block.slice(2))}</h1>;
        if (block.startsWith('> ')) return <blockquote key={index}>{parseInline(block.replace(/^>\s?/gm, ''))}</blockquote>;

        if (block.split('\n').every((line) => line.startsWith('- '))) {
          return (
            <ul key={index} style={{ marginLeft: '20px', lineHeight: '1.8' }}>
              {block.split('\n').map((line, lineIndex) => <li key={lineIndex}>{parseInline(line.slice(2))}</li>)}
            </ul>
          );
        }

        return <p key={index}>{parseInline(block)}</p>;
      })}
    </div>
  );
}
