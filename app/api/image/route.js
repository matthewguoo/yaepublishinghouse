import { getDatabase, getArticleDatabase, getBlocks } from '../../../lib/notion';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const previewId = searchParams.get('id'); // preview image from post id
  const id = searchParams.get('articleId'); // article block image id
  const url = searchParams.get('url'); // direct url

  let imgUrl = null;

  if (url) {
    imgUrl = url;
  }
  else if (id) {
    const [projects, articles] = await Promise.all([
      getDatabase(),
      getArticleDatabase(),
    ]);
    const allPosts = [...projects, ...articles];

    // Fetch all blocks in parallel for all posts
    const allBlocksArrays = await Promise.all(
      allPosts.map(post => getBlocks(post.id))
    );

    // Flatten all blocks into one array
    const allBlocks = allBlocksArrays.flat();

    // Find the image block with matching id
    const imgBlock = allBlocks.find(b => b.id === id && b.type === 'image');

    if (!imgBlock) {
      return new Response('No image found', { status: 404 });
    }

    const value = imgBlock.image;
    imgUrl = value?.file?.url ?? value?.external?.url;
  }
  else if (previewId) {
    const [projects, articles] = await Promise.all([
      getDatabase(),
      getArticleDatabase(),
    ]);
    const allPosts = [...projects, ...articles];

    const post = allPosts.find(p => p.id === previewId);
    if (!post) return new Response('Post not found', { status: 404 });

    const preview = post.properties?.['preview-image']?.files?.[0] ?? null;
    imgUrl = preview?.file?.url ?? preview?.external?.url;

    if (!imgUrl) return new Response('No preview image found', { status: 404 });
  }
  else {
    return new Response('Missing id, previewId, or url', { status: 400 });
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
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
      },
    });
  } catch (err) {
    console.error('Image fetch error:', err);
    return new Response('Failed to fetch image', { status: 500 });
  }
}
