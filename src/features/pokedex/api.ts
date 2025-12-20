export type Pokemon = {
  id: number;
  name: string;
  sprite: string;
  types: string[];
};

export async function fetchPokemon(name: string): Promise<Pokemon | null> {
  const n = name.toLowerCase().trim();
  if (!n) return null;
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(n)}`);
  if (!res.ok) return null;
  const d = await res.json();
  return {
    id: d.id,
    name: d.name,
    sprite: d.sprites?.front_default || '',
    types: (d.types || []).map((t: any) => t.type?.name).filter(Boolean),
  };
}
