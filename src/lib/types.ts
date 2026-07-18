export interface Pokemon {
  id: number;
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

export const TYPE_GRADIENTS: Record<string, { from: string; to: string }> = {
  normal:  { from: '#C6C6A7', to: '#A8A878' },
  fire:    { from: '#F08030', to: '#DD2E1D' },
  water:   { from: '#6890F0', to: '#00B0E8' },
  grass:   { from: '#78C850', to: '#3D8B37' },
  electric:{ from: '#F8D030', to: '#E8A000' },
  ice:     { from: '#98D8D8', to: '#5DADE2' },
  fighting:{ from: '#C03028', to: '#8B1A13' },
  poison:  { from: '#A040A0', to: '#7D2E7D' },
  ground:  { from: '#E0C068', to: '#C09030' },
  flying:  { from: '#A890F0', to: '#7A5DC7' },
  psychic: { from: '#F85888', to: '#E02050' },
  bug:     { from: '#A8B820', to: '#6D8B0A' },
  rock:    { from: '#B8A038', to: '#8B7520' },
  ghost:   { from: '#705898', to: '#4A2E6E' },
  dragon:  { from: '#7038F8', to: '#4A00B0' },
  dark:    { from: '#705848', to: '#403028' },
  steel:   { from: '#B8B8D0', to: '#8090A8' },
  fairy:   { from: '#EE99AC', to: '#DD6680' },
};
