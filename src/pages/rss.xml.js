import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  
  // Sort posts by date (newest first)
  const sortedPosts = posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: 'DevOps Engineer Portfolio Blog',
    description: 'Building scalable cloud architecture and sharing technical insights.',
    site: context.site || 'https://qkdgur4.github.io',
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      // Create a link to the post using its ID
      link: `/blog/${post.id}/`,
    })),
    // (Optional) add custom xml stylesheet or languages here
    customData: `<language>ko-KR</language>`,
  });
}
