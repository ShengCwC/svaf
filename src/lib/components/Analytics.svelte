<script lang="ts">
  import { onMount } from 'svelte';
  import { siteConfig } from '$lib/config/site';

  onMount(() => {
    const { websiteId, scriptUrl } = siteConfig.services.umami;
    if (!websiteId) return;

    const script = document.createElement('script');
    script.defer = true;
    script.src = scriptUrl;
    script.setAttribute('data-website-id', websiteId);
    document.head.appendChild(script);
  });
</script>
