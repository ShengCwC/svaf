<script lang="ts">
	import { spaCache } from '$lib/utils/spaCache';
	import { siteConfig } from '$lib/config/site';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	let {
		pathname,
		cacheKey,
		class: className = '',
		onloaded
	}: {
		pathname: string;
		cacheKey?: string;
		class?: string;
		onloaded?: () => void;
	} = $props();

	let pageViews = $state<number | null>(null);

	async function loadPageViews() {
		const key = cacheKey ?? `pageviews-${pathname}`;
		pageViews = await spaCache.get(key, async () => {
			const response = await fetch(siteConfig.services.pageViews, {
				method: 'POST',
				headers: {
					'Content-Type': 'text/plain'
				},
				body: JSON.stringify([pathname])
			});

			if (response.ok) {
				const views = (await response.json()) as number[];
				return views[0] || 0;
			}
			return 0;
		});
		onloaded?.();
	}

	$effect(() => {
		void pathname;
		void cacheKey;
		pageViews = null;
		loadPageViews();
	});
</script>

{#if pageViews !== null}
	<span class={className} transition:fly={{ y: 8, duration: 350, easing: quintOut }}>
		{pageViews.toLocaleString()} 次浏览
	</span>
{/if}
