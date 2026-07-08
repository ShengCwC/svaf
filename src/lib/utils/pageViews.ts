import { siteConfig } from '$lib/config/site';

type ShareToken = {
  token: string;
  websiteId: string;
};

let cachedShareToken: ShareToken | null = null;
let shareTokenPromise: Promise<ShareToken> | null = null;

async function getShareToken(): Promise<ShareToken> {
  if (cachedShareToken) return cachedShareToken;
  if (shareTokenPromise) return shareTokenPromise;

  const { shareId, region, baseUrl } = siteConfig.services.umami;
  const url = `${baseUrl}/${region}/api/share/${shareId}`;

  shareTokenPromise = fetch(url)
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch Umami share token: ${response.status}`);
      }

      const data = await response.json() as Partial<ShareToken>;
      if (!data.token || !data.websiteId) {
        throw new Error('Invalid Umami share token response');
      }

      cachedShareToken = {
        token: data.token,
        websiteId: data.websiteId
      };

      return cachedShareToken;
    })
    .finally(() => {
      shareTokenPromise = null;
    });

  return shareTokenPromise;
}

export async function fetchPageViews(path: string): Promise<number> {
  const { token, websiteId } = await getShareToken();
  const { region, baseUrl } = siteConfig.services.umami;

  const url = new URL(`${baseUrl}/${region}/api/websites/${websiteId}/stats`);
  url.searchParams.set('startAt', '0');
  url.searchParams.set('endAt', String(Date.now()));
  url.searchParams.set('unit', 'hour');
  url.searchParams.set('timezone', 'Pacific/Auckland');
  url.searchParams.set('path', `eq.${path}`);

  const response = await fetch(url, {
    headers: {
      'x-umami-share-token': token,
      'x-umami-share-context': '1'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Umami page views: ${response.status}`);
  }

  const data = await response.json() as { pageviews?: unknown };
  return typeof data.pageviews === 'number' ? data.pageviews : 0;
}

export async function fetchPageViewsBatch(paths: string[]): Promise<number[]> {
  return Promise.all(paths.map((path) => fetchPageViews(path)));
}
