import { getDatabase, getArticleDatabase } from '../../../lib/notion';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const url = searchParams.get('url');

  let imgUrl = null;

  // If direct URL is provided, use it
  if (url) {
    imgUrl = url;
  }

  // Otherwise, try to resolve using post ID
  else if (id) {
    const [projects, articles] = await Promise.all([
      getDatabase(),
      getArticleDatabase(),
    ]);

    const post = [...projects, ...articles].find(p => p.id === id);
    if (!post) return new Response('Post not found', { status: 404 });

    const preview = post.properties?.['preview-image']?.files?.[0] ?? null;
    imgUrl = preview?.file?.url ?? preview?.external?.url;

    if (!imgUrl) return new Response('No image found', { status: 404 });
  }

  else {
    return new Response('Missing id or url', { status: 400 });
  }

  try {
    const res = await fetch(imgUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });

    if (!res.ok) throw new Error(`Image fetch failed: ${res.status}`);

    const contentType = res.headers.get('content-type') || 'image/jpeg';

    return new Response(res.body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (err) {
    return new Response('Failed to fetch image', { status: 500 });
  }
}
