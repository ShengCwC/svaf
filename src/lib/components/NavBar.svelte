<script lang="ts">
  import { page } from '$app/stores';
  import { siteConfig } from '$lib/config/site';
  import ThemeToggle from './ThemeToggle.svelte';
  import { fly } from 'svelte/transition';

  let spinRaf = $state(0);
  let spinStart = $state(0);
  let spinOffset = $state(0);
  let spinDeg = $state(0);

  function startSpin() {
    cancelAnimationFrame(spinRaf);
    spinStart = performance.now();
    function tick(now: number) {
      const elapsed = now - spinStart;
      spinDeg = spinOffset + (Math.pow(2, elapsed / 3000) - 1) * 360;
      spinRaf = requestAnimationFrame(tick);
    }
    spinRaf = requestAnimationFrame(tick);
  }

  function stopSpin() {
    cancelAnimationFrame(spinRaf);
    spinOffset = spinDeg;
  }

  let crumbs = $derived.by(() => {
    const path = $page.url.pathname.replace(/\/$/, '') || '/';
    if (path === '/') return [];
    const parts = path.split('/').filter(Boolean);
    const result: { label: string; href: string }[] = [];
    let accumulated = '';
    for (let i = 0; i < parts.length; i++) {
      accumulated += '/' + parts[i];
      // 文章路径下的 posts 层替换为指向首页的「博客」
      if (parts[i] === 'posts' && i === 0) {
        result.push({ label: '公告', href: 'https://posts.screenshare.cn' });
      } else {
        result.push({ label: parts[i], href: accumulated });
      }
    }
    return result;
  });
</script>

<nav class="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
  <div class="relative flex h-14 items-center justify-between px-4 md:px-5">
    <div class="flex items-center gap-1.5 min-w-0">
      <a href="https://screenshare.cn" class="shrink-0 hover:opacity-80 transition-opacity" onmouseenter={startSpin} onmouseleave={stopSpin}>
        <img src={siteConfig.icon} alt="Home" class="h-8 w-8 rounded-full" style="transform: rotate({spinDeg}deg);" />
      </a>
      {#each crumbs as crumb, i (crumb.href)}
        <div in:fly={{ x: -8, duration: 300 }} out:fly={{ x: 8, duration: 200 }} class="inline-flex items-center gap-1.5">
          <span class="text-lg leading-none text-muted-foreground/40 shrink-0">/</span>
          {#if i < crumbs.length - 1}
            <a href={crumb.href} class="text-sm text-muted-foreground hover:text-foreground truncate transition-colors shrink min-w-0">{crumb.label}</a>
          {:else}
            <span class="text-sm text-foreground font-medium truncate shrink min-w-0">{crumb.label}</span>
          {/if}
        </div>
      {/each}
    </div>
    <div class="flex items-center gap-2 shrink-0">
      <ThemeToggle />
    </div>
  </div>
</nav>


