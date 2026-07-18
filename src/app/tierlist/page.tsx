'use client';

import { motion } from 'framer-motion';
import { POKEMON } from '@/data/pokemon';
import { TYPE_ABBR, TYPE_COLORS, TYPE_GRADIENTS } from '@/lib/types';
import { TypeBadge } from '@/components/type-badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Trophy, SlidersHorizontal } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { pokemonSprite, getTypes } from '@/lib/pokemon-utils';
import type { Pokemon } from '@/lib/types';

interface Tier {
  label: string;
  min: number;
  max: number | null;
  color: string;
  gradient: string;
}

const TIERS: Tier[] = [
  { label: 'S', min: 650, max: null, color: '#EF4444', gradient: 'from-red-500/20 to-red-600/5' },
  { label: 'A', min: 530, max: 649, color: '#F59E0B', gradient: 'from-amber-500/20 to-amber-600/5' },
  { label: 'B', min: 470, max: 529, color: '#3B82F6', gradient: 'from-blue-500/20 to-blue-600/5' },
  { label: 'C', min: 400, max: 469, color: '#10B981', gradient: 'from-emerald-500/20 to-emerald-600/5' },
  { label: 'D', min: 0, max: 399, color: '#6B7280', gradient: 'from-gray-500/20 to-gray-600/5' },
];

function getTier(base: number): Tier {
  return TIERS.find(t => t.max === null ? base >= t.min : base >= t.min && base <= t.max)!;
}

const RARITIES = ['', 'common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];
const RARITY_LABELS: Record<string, string> = {
  '': 'Comum', common: 'Comum', uncommon: 'Incomum', rare: 'Raro', epic: 'Épico', legendary: 'Lendário', mythic: 'Mítico',
};

const allTypes = getTypes(POKEMON);

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const tierVariant = { hidden: { opacity: 0, x: -30 }, show: { opacity: 1, x: 0, transition: { duration: 0.4 } } };
const pokeItem = { hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1 } };

type SortMode = 'base-desc' | 'base-asc' | 'name-asc' | 'hp' | 'atk' | 'def' | 'spatk' | 'spdef' | 'spd';

export default function TierListPage() {
  const [filterType, setFilterType] = useState<string>('all');
  const [filterRarity, setFilterRarity] = useState<string>('all');
  const [minBase, setMinBase] = useState<number>(0);
  const [maxBase, setMaxBase] = useState<number>(999);
  const [sortBy, setSortBy] = useState<SortMode>('base-desc');

  const filteredPokemon = useMemo(() => {
    let list = [...POKEMON];

    if (filterType !== 'all') {
      list = list.filter(p => p.t1 === filterType || p.t2 === filterType);
    }
    if (filterRarity !== 'all') {
      const r = filterRarity;
      list = list.filter(p => p.rarity === r || (r === '' && (p.rarity === '' || p.rarity === 'common')));
    }
    list = list.filter(p => p.base >= minBase && p.base <= maxBase);

    list.sort((a, b) => {
      switch (sortBy) {
        case 'base-desc': return b.base - a.base;
        case 'base-asc': return a.base - b.base;
        case 'name-asc': return a.name.localeCompare(b.name);
        case 'hp': return b.hp - a.hp;
        case 'atk': return b.atk - a.atk;
        case 'def': return b.def - a.def;
        case 'spatk': return b.spatk - a.spatk;
        case 'spdef': return b.spdef - a.spdef;
        case 'spd': return b.spd - a.spd;
      }
    });
    return list;
  }, [filterType, filterRarity, minBase, maxBase, sortBy]);

  const tierGroups = TIERS.map(tier => ({
    ...tier,
    pokemon: filteredPokemon.filter(p => tier.max === null ? p.base >= tier.min : p.base >= tier.min && p.base <= tier.max),
  }));

  const totalFiltered = filteredPokemon.length;

  return (
    <div className="py-8">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Trophy className="w-8 h-8 text-amber-400" />
          <h1 className="text-4xl font-bold">Tier <span className="text-primary">List</span></h1>
        </div>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Classificação de {totalFiltered} Pokémon por stats base totais — de {TIERS[0].label} a {TIERS[TIERS.length - 1].label}.
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <SlidersHorizontal className="size-4" /> Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Tipo</label>
                <Select value={filterType} onValueChange={v => { if (v) setFilterType(v); }}>
                  <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {allTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Raridade</label>
                <Select value={filterRarity} onValueChange={v => { if (v) setFilterRarity(v); }}>
                  <SelectTrigger><SelectValue placeholder="Todas" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {RARITIES.map(r => <SelectItem key={r} value={r}>{RARITY_LABELS[r]}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Base Mín</label>
                <Input type="number" value={minBase} min={0} max={999} onChange={e => setMinBase(+e.target.value)} className="h-9" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Base Máx</label>
                <Input type="number" value={maxBase} min={0} max={999} onChange={e => setMaxBase(+e.target.value)} className="h-9" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Ordenar</label>
                <Select value={sortBy} onValueChange={v => { if (v) setSortBy(v as SortMode); }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="base-desc">Base ↓</SelectItem>
                    <SelectItem value="base-asc">Base ↑</SelectItem>
                    <SelectItem value="name-asc">Nome A-Z</SelectItem>
                    <SelectItem value="hp">HP ↓</SelectItem>
                    <SelectItem value="atk">Atk ↓</SelectItem>
                    <SelectItem value="def">Def ↓</SelectItem>
                    <SelectItem value="spatk">SpAtk ↓</SelectItem>
                    <SelectItem value="spdef">SpDef ↓</SelectItem>
                    <SelectItem value="spd">Speed ↓</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tier groups */}
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        {tierGroups.map(group => (
          <motion.div key={group.label} variants={tierVariant}>
            <Card className={`bg-gradient-to-r ${group.gradient} border-border/50`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg text-lg font-black"
                    style={{ backgroundColor: `${group.color}25`, color: group.color }}>
                    {group.label}
                  </span>
                  <span className="text-base">
                    Base Stats {group.min}+
                    {group.max !== null ? ` (max ${group.max})` : ''}
                  </span>
                  <span className="ml-auto text-xs text-muted-foreground font-normal">
                    {group.pokemon.length} Pokémon
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {group.pokemon.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhum Pokémon nesta tier.</p>
                ) : (
                  <motion.div variants={container} initial="hidden" animate="show"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {group.pokemon.map(p => (
                      <motion.div key={p.slug} variants={pokeItem}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background/50 border border-border/30 hover:border-border/60 transition-colors">
                        <img src={pokemonSprite(p)} alt={p.name} className="w-8 h-8 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-sm truncate block">{p.name}</span>
                          <div className="flex gap-1 shrink-0">
                            <TypeBadge type={p.t1} size="sm" />
                            {p.t2 && <TypeBadge type={p.t2} size="sm" />}
                          </div>
                        </div>
                        <span className="text-xs font-mono font-bold shrink-0 tabular-nums" style={{ color: group.color }}>
                          {p.base}
                        </span>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
