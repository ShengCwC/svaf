<script lang="ts">
  import { onMount } from 'svelte';
  import { siteConfig } from '$lib/config/site';

  let { path }: { path: string } = $props();

  let views = $state<number | null>(null);
  let loading = $state(true);

  // 缓存 token，避免每次都请求
  let cachedToken: string | null = null;
  let cachedWebsiteId: string | null = null;

  async function getShareToken(): Promise<{ token: string; websiteId: string }> {
    if (cachedToken && cachedWebsiteId) {
      return { token: cachedToken, websiteId: cachedWebsiteId };
    }

    const { shareId, region, baseUrl } = siteConfig.services.umami;
    const res = await fetch(`${baseUrl}/${region}/api/share/${shareId}`);
    const data = await res.json();

    cachedToken = data.token;
    cachedWebsiteId = data.websiteId;

    return { token: data.token, websiteId: data.websiteId };
  }

  async function fetchViews() {
    try {
      const { token, websiteId } = await getShareToken();
      const { region, baseUrl } = siteConfig.services.umami;

      const endAt = Date.now();
      const url = `${baseUrl}/${region}/api/websites/${websiteId}/stats`
        + `?startAt=0`
        + `&endAt=${endAt}`
        + `&unit=hour`
        + `&timezone=Pacific/Auckland`
        + `&path=eq.${encodeURIComponent(path)}`;

      const res = await fetch(url, {
        headers: {
          'x-umami-share-token': token
        }
      });

      const data = await res.json();
      views = data.pageviews ?? 0;
    } catch (err) {
      console.error('Failed to fetch page views:', err);
      views = 0;
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    fetchViews();
  });
</script>

<span class="text-sm text-muted-foreground">
  {#if loading}
    <span class="opacity-50">加载中...</span>
  {:else}
    {views} 次阅读
  {/if}
</span>
