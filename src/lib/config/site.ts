export const siteConfig = {
  name: '社区动态',
  siteName: 'Undefined SS Community',
  title: 'Undefined SS Community',
  subtitle: '最新公告与发布说明 / 了解我们的最新进展',
  url: 'https://annoucement.screenshare.cn',
  icon: '/favicon.svg',
  description: '最新公告与发布说明 / 了解我们的最新进展',
  keywords: ['社区动态', '公告', '发布说明', 'Undefined SS Community'],
  lang: 'zh_CN',
  ogImage: '/favicon.svg',
  author: {
    name: 'Undefined SS Community',
    url: 'https://kook.screenshare.cn'
  },
  bio: {
    avatar: '/favicon.svg',
    name: 'Undefined SS Community',
    bio: '',
    links: ['https://kook.screenshare.cn']
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
