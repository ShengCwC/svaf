export const siteConfig = {
  name: 'Blog',
  siteName: 'My Blog',
  title: '个人博客',
  subtitle: '',
  url: 'https://annoucement.screenshare.cn',
  icon: '/favicon.svg',
  description: '一个基于 SvelteKit 构建的个人博客',
  keywords: ['博客', 'Blog', 'SvelteKit', '个人博客'],
  lang: 'zh_CN',
  ogImage: '/favicon.svg',
  author: {
    name: 'Author',
    url: 'https://annoucement.screenshare.cn'
  },
  bio: {
    avatar: '/favicon.svg',
    name: 'Author',
    bio: '',
    links: []
  },
  services: {
    umami: {
      websiteId: '578915b7-1329-458a-8b86-09d1ca5321e2',
      shareId: 'Mr6O0vTbWl9JTXzY',
      region: 'us',
      baseUrl: 'https://cloud.umami.is/analytics',
      scriptUrl: 'https://cloud.umami.is/script.js'
    }
  },
  navLinks: [
    { label: '博客', icon: 'mdi:post-outline', href: '/' }
  ] as const
};

export type SiteConfig = typeof siteConfig;
