export async function searchTracks(query) {
  const url = new URL('https://itunes.apple.com/search');
  url.searchParams.set('term', query);
  url.searchParams.set('entity', 'song');
  url.searchParams.set('limit', '24');

  const res = await fetch(url.toString());
  if (!res.ok) return [];
  const data = await res.json();
  return (data.results || []).map((r) => ({
    trackId: r.trackId,
    trackName: r.trackName,
    artistName: r.artistName,
    artworkUrl100: r.artworkUrl100,
    previewUrl: r.previewUrl,
  }));
}
