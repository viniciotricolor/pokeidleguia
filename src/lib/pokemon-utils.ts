import type { Pokemon } from '@/lib/types';

/** Get the PokeAPI sprite URL for a Pokemon by its id */
export function spriteUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

/** Get sprite URL from a Pokemon object */
export function pokemonSprite(p: Pokemon): string {
  return spriteUrl(p.id);
}

/** Stat label map */
export const STAT_LABELS: Record<string, string> = {
  hp: 'HP', atk: 'Atk', def: 'Def', spAtk: 'SpAtk', spDef: 'SpDef', speed: 'Speed',
};

export const STAT_KEYS = ['hp', 'atk', 'def', 'spAtk', 'spDef', 'speed'] as const;
export type StatKey = (typeof STAT_KEYS)[number];

/** Convert Pokemon object to keyed stat record */
export function pokemonToBases(p: Pokemon): Record<StatKey, number> {
  return { hp: p.hp, atk: p.atk, def: p.def, spAtk: p.spatk, spDef: p.spdef, speed: p.spd };
}

/** Get all unique types from a list of Pokemon */
export function getTypes(pokemon: Pokemon[]): string[] {
  const types = new Set<string>();
  pokemon.forEach(p => { types.add(p.t1); if (p.t2) types.add(p.t2); });
  return Array.from(types).sort();
}
