import type { Post, PostMetadata } from '$lib/types/post';

// 使用 mdsvex 导入所有 markdown 文件（支持文件夹内的 index.md）
const postModules = import.meta.glob('/src/content/posts/**/index.md', { eager: true });

/**
 * 获取所有文章（含隐藏）
 */
function fetchAllPosts(): Post[] {
  const posts: Post[] = [];

  for (const [path, module] of Object.entries(postModules)) {
    // 从路径提取 slug: /src/content/posts/pin/index.md -> pin
    const slug = path.split('/').slice(-2, -1)[0];
    const mod = module as any;

    // mdsvex 会将 frontmatter 导出为 metadata，合并默认值兜底
    const rawMetadata = (mod.metadata ?? {}) as Partial<PostMetadata>;
    const metadata: PostMetadata = {
      title: rawMetadata.title ?? slug,
      published: rawMetadata.published ?? new Date().toISOString().split('T')[0],
      description: rawMetadata.description ?? '',
      pinned: rawMetadata.pinned ?? false,
      draft: rawMetadata.draft ?? false,
      hide: rawMetadata.hide ?? false,
      ...rawMetadata
    };

    // 封面图路径修正：Pages CMS 写入的 static/media/ 转为 /media/
    if (metadata.image && metadata.image.startsWith('static/media/')) {
      metadata.image = metadata.image.replace('static/media', '/media');
    }

    posts.push({
      slug,
      metadata,
      content: '' // mdsvex 处理的内容通过组件渲染
    });
  }

  // 按发布日期排序，置顶文章优先
  return posts.sort((a, b) => {
    if (a.metadata.pinned && !b.metadata.pinned) return -1;
    if (!a.metadata.pinned && b.metadata.pinned) return 1;
    return new Date(b.metadata.published).getTime() - new Date(a.metadata.published).getTime();
  });
}

/**
 * 获取文章列表（不含 hide 文章）
 */
export function getAllPosts(): Post[] {
  return fetchAllPosts().filter((post) => !post.metadata.hide);
}

/**
 * 根据 slug 获取单篇文章
 */
export function getPostBySlug(slug: string): Post | undefined {
  return fetchAllPosts().find((post) => post.slug === slug);
}

/**
 * 获取文章组件
 */
export async function getPostComponent(slug: string) {
  try {
    const modules = import.meta.glob('/src/content/posts/**/index.md');
    const path = `/src/content/posts/${slug}/index.md`;
    
    if (path in modules) {
      const mod = await modules[path]();
      return (mod as any).default;
    }
  } catch (error) {
    console.error('Error loading post component:', error);
  }
  
  return null;
}
