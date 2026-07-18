/**
 * Sprites utility – maps Pokemon slugs to PokeAPI sprite URLs.
 * The national-dex IDs are derived from the POKEMON array order
 * (index 0 → #1 Bulbasaur, index 1 → #2 Ivysaur, …).
 */

const SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

export function getSpriteUrl(id: number): string {
  return `${SPRITE_BASE}/${id}.png`;
}
