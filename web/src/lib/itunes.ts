export type Track = {
  trackId: number;
  trackName: string;
  artistName: string;
  artworkUrl100: string;
  previewUrl?: string;
};

interface ItunesResult {
  trackId?: number;
  trackName?: string;
  artistName?: string;
  artworkUrl100?: string;
  previewUrl?: string;
}

// Previews come from Apple's public search API. `explicit=No` keeps grown-up lyrics out.
export async function searchTracks(term: string, signal?: AbortSignal): Promise<Track[]> {
  const url = new URL('https://itunes.apple.com/search');
  url.searchParams.set('term', term);
  url.searchParams.set('media', 'music');
  url.searchParams.set('entity', 'song');
  url.searchParams.set('limit', '24');
  url.searchParams.set('country', 'MX');
  url.searchParams.set('explicit', 'No');

  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error('No pudimos buscar música ahora');
  const data = (await res.json()) as { results?: ItunesResult[] };

  return (data.results ?? []).flatMap((r) =>
    r.trackId && r.trackName && r.artistName && r.artworkUrl100 && r.previewUrl
      ? [
          {
            trackId: r.trackId,
            trackName: r.trackName,
            artistName: r.artistName,
            artworkUrl100: r.artworkUrl100,
            previewUrl: r.previewUrl,
          },
        ]
      : [],
  );
}
