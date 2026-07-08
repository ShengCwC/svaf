<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { siteConfig } from '$lib/config/site';
  import Icon from '@iconify/svelte';
  import { fadeInUp } from '$lib/utils/motion';
  import Announcement from '$lib/components/Announcement.svelte';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>{siteConfig.title} - 首页</title>
</svelte:head>

<div class="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
  <div class="mo-fade-in-up" use:fadeInUp>
    <Announcement />
  </div>

  <div class="mo-fade-in-up" use:fadeInUp={{ delay: 0.1 }}>
    <img src={siteConfig.bio.avatar} alt="Avatar" class="h-32 w-32 rounded-full" />
  </div>
  
  <div class="text-center mo-fade-in-up" use:fadeInUp={{ delay: 0.15 }}>
    <h1 class="text-4xl font-bold mb-2">{siteConfig.bio.name}</h1>
    <p class="text-lg text-muted-foreground mb-4">{siteConfig.bio.bio}</p>
    <p class="text-sm text-muted-foreground">
      共 {data.totalPosts} 篇文章 · {data.totalWords.toLocaleString()} 字
    </p>
  </div>

  <!-- 社交媒体链接 -->
  {#if siteConfig.bio.links.length > 0}
    <div class="w-full max-w-2xl mx-auto mo-fade-in-up" use:fadeInUp={{ delay: 0.2 }}>
      <div class="flex flex-wrap gap-3 justify-center">
        {#each siteConfig.bio.links as link}
          {@const isLocalImage = link.icon.startsWith('/')}
          <a href={link.url} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" class="flex items-center gap-2">
              {#if isLocalImage}
                <img src={link.icon} alt={link.name} class="w-5 h-5" />
              {:else}
                <Icon
                  icon={link.icon}
                  class="w-5 h-5"
                  style={link.color ? `color: ${link.color}` : ''}
                />
              {/if}
              <span class="text-sm font-medium">{link.name}</span>
            </Button>
          </a>
        {/each}
      </div>
    </div>
  {/if}

  <!-- 进入博客 -->
  <div class="mo-fade-in-up" use:fadeInUp={{ delay: 0.25 }}>
    <a href="/posts">
      <Button size="lg" class="flex items-center gap-2">
        <Icon icon="mdi:post-outline" class="w-5 h-5" />
        浏览博客
      </Button>
    </a>
  </div>
</div>
