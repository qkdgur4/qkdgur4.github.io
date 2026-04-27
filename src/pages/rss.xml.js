import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  
  // Sort posts by date (newest first)
  const sortedPosts = posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: 'qkdgur4 기술 블로그',
    description: '백엔드, 인프라, Kubernetes, 관측성 프로젝트를 직접 기록하는 qkdgur4의 기술 블로그입니다.',
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
