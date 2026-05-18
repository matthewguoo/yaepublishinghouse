'use client';

import {
  KBarProvider,
  KBarPortal,
  KBarPositioner,
  KBarAnimator,
  KBarSearch,
  KBarResults,
  useMatches,
  ActionId,
  ActionImpl,
} from 'kbar';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

function RenderResults() {
  const { results } = useMatches();

  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) =>
        typeof item === 'string' ? (
          <div style={{
            padding: '8px 16px',
            fontSize: '11px',
            fontWeight: 600,
            color: '#8b5a8c',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            background: '#f9f5f9',
          }}>
            {item}
          </div>
        ) : (
          <div
            style={{
              padding: '12px 16px',
              background: active ? '#f0e8f0' : 'transparent',
              borderLeft: active ? '3px solid #8b5a8c' : '3px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            {item.icon && (
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
            )}
            <div>
              <div style={{ 
                fontSize: '14px', 
                color: '#333',
                fontWeight: active ? 600 : 400,
              }}>
                {item.name}
              </div>
              {item.subtitle && (
                <div style={{ 
                  fontSize: '12px', 
                  color: '#888',
                  marginTop: '2px',
                }}>
                  {item.subtitle}
                </div>
              )}
            </div>
          </div>
        )
      }
    />
  );
}

export default function SearchProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const actions = useMemo(() => [
    // Navigation
    {
      id: 'home',
      name: 'Home',
      subtitle: 'Return to homepage',
      shortcut: ['h'],
      keywords: 'home main top',
      icon: '→',
      section: 'Navigation',
      perform: () => router.push('/'),
    },
    // News
    {
      id: 'news-hoyofair',
      name: 'HoYoFair 2026 Report',
      subtitle: 'Event coverage from Los Angeles',
      keywords: 'hoyofair event los angeles convention',
      icon: '→',
      section: 'News',
      perform: () => router.push('/news/hoyofair-2026'),
    },
    {
      id: 'news-anniversary',
      name: '500th Anniversary Dialogue',
      subtitle: 'Special interview with Yae Miko and Raiden Shogun',
      keywords: 'anniversary yae miko raiden shogun interview dialogue',
      icon: '→',
      section: 'News',
      perform: () => router.push('/news/anniversary-dialogue'),
    },
    // Products
    {
      id: 'products',
      name: 'All Products',
      subtitle: 'Browse available merchandise',
      keywords: 'products shop store merchandise all',
      icon: '→',
      section: 'Navigation',
      perform: () => router.push('/products'),
    },
    {
      id: 'product-nameless-pass',
      name: 'Nameless Honor Pass',
      subtitle: 'Limited Edition Gold ENIG - 2,158 units',
      keywords: 'nameless honor pass star rail ipc limited edition collectible',
      icon: '◈',
      section: 'Products',
      perform: () => router.push('/products/nameless-pass'),
    },
    // Tools
    {
      id: 'tool-png',
      name: 'PNG Transparency Maker',
      subtitle: 'Free background removal tool',
      keywords: 'png transparent background remove free tool image',
      icon: '→',
      section: 'Tools',
      perform: () => router.push('/tools/png-transparency'),
    },
    // Books
    {
      id: 'book-shogun',
      name: 'Shogun Almighty: Reincarnated with Cheat Powers',
      subtitle: 'By Kujou Sara - $12.99',
      keywords: 'shogun almighty raiden reincarnated light novel',
      icon: '→',
      section: 'Light Novels',
    },
    {
      id: 'book-kitsune',
      name: 'Pretty Please, Kitsune Guuji?',
      subtitle: 'By Sangonomiya Kokomi - $14.99',
      keywords: 'kitsune guuji yae miko light novel',
      icon: '→',
      section: 'Light Novels',
    },
    {
      id: 'book-fischl',
      name: 'Flowers for Princess Fischl (Vol. 0)',
      subtitle: 'Compiled by Oz - $11.99',
      keywords: 'fischl flowers princess light novel oz',
      icon: '→',
      section: 'Light Novels',
    },
  ], [router]);

  return (
    <KBarProvider actions={actions}>
      <KBarPortal>
        <KBarPositioner style={{
          background: 'rgba(90, 61, 90, 0.4)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
        }}>
          <KBarAnimator style={{
            maxWidth: '600px',
            width: '100%',
            background: '#fff',
            overflow: 'hidden',
            boxShadow: '0 16px 70px rgba(90, 61, 90, 0.3)',
            border: '1px solid #e0d0e0',
          }}>
            <KBarSearch 
              style={{
                padding: '16px 20px',
                fontSize: '16px',
                width: '100%',
                outline: 'none',
                border: 'none',
                borderBottom: '1px solid #e0d0e0',
                background: '#fff',
                fontFamily: "'Noto Sans JP', sans-serif",
              }}
              defaultPlaceholder="Search books, news, products..."
            />
            <div style={{ maxHeight: '400px', overflow: 'auto' }}>
              <RenderResults />
            </div>
            <div style={{
              padding: '10px 16px',
              fontSize: '11px',
              color: '#888',
              borderTop: '1px solid #e0d0e0',
              background: '#faf8fa',
              display: 'flex',
              gap: '16px',
            }}>
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
              <span>Esc Close</span>
            </div>
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      {children}
    </KBarProvider>
  );
}
