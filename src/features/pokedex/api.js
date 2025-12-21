export async function fetchPokemon(name) {
  const n = name.toLowerCase().trim();
  if (!n) return null;
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(n)}`);
  if (!res.ok) return null;
  const d = await res.json();
  return {
    id: d.id,
    name: d.name,
    sprite: d.sprites?.front_default || '',
    types: (d.types || []).map((t) => t.type?.name).filter(Boolean),
  };
}
