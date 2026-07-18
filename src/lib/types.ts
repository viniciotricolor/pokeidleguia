export interface Pokemon {
  slug: string;
  name: string;
  t1: string;
  t2: string;
  rarity: string;
  base: number;
  hp: number;
  atk: number;
  def: number;
  spatk: number;
  spdef: number;
  spd: number;
}

export interface TypeChartEntry {
  weak: string[];
  resist: string[];
  immune: string[];
  strong: string[];
}

export type TypeChart = Record<string, TypeChartEntry>;
export type TypeNames = Record<string, string>;

export const TYPE_ABBR: Record<string, string> = {
  normal: 'NOR', fire: 'FOG', water: 'AGU', grass: 'PLA',
  electric: 'ELE', ice: 'GEL', fighting: 'LUT', poison: 'VEN',
  ground: 'TER', flying: 'VOA', psychic: 'PSI', bug: 'INS',
  rock: 'PED', ghost: 'FAN', dragon: 'DRA', dark: 'SOM',
  steel: 'ACO', fairy: 'FAD',
};

export const TYPE_COLORS: Record<string, string> = {
  normal: '#A8A878', fire: '#F08030', water: '#6890F0', grass: '#78C850',
  electric: '#F8D030', ice: '#98D8D8', fighting: '#C03028', poison: '#A040A0',
  ground: '#E0C068', flying: '#A890F0', psychic: '#F85888', bug: '#A8B820',
  rock: '#B8A038', ghost: '#705898', dragon: '#7038F8', dark: '#705848',
  steel: '#B8B8D0', fairy: '#EE99AC',
};
