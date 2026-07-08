<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchPageViews } from '$lib/utils/pageViews';

  let { path }: { path: string } = $props();

  let views = $state<number | null>(null);
  let loading = $state(true);

  async function fetchViews() {
    try {
      views = await fetchPageViews(path);
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
