'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TypeBadge } from '@/components/type-badge';
import { POKEMON } from '@/data/pokemon';
import { TYPE_NAMES } from '@/data/types';
import { TYPE_COLORS } from '@/lib/types';
import { getSpriteUrl } from '@/lib/sprites';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

const TYPE_KEYS = Object.keys(TYPE_NAMES);

const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  atk: 'ATK',
  def: 'DEF',
  spatk: 'SP.ATK',
  spdef: 'SP.DEF',
  spd: 'SPD',
};

const STAT_KEYS = ['hp', 'atk', 'def', 'spatk', 'spdef', 'spd'] as const;

const RARITY_OPTIONS = [
  { value: 'common', label: 'Common', color: '#888' },
  { value: 'uncommon', label: 'Uncommon', color: '#4CAF50' },
  { value: 'rare', label: 'Rare', color: '#2196F3' },
  { value: 'epic', label: 'Epic', color: '#9C27B0' },
  { value: 'legendary', label: 'Legendary', color: '#FF9800' },
  { value: 'mythic', label: 'Mythic', color: '#F44336' },
];

const SORT_OPTIONS = [
  { value: 'id', label: 'Pokédex #' },
  { value: 'name', label: 'Name' },
  { value: 'base', label: 'Base Stats' },
  { value: 'hp', label: 'HP' },
  { value: 'atk', label: 'Attack' },
  { value: 'def', label: 'Defense' },
  { value: 'spd', label: 'Speed' },
];

type SortField = 'id' | 'name' | 'base' | 'hp' | 'atk' | 'def' | 'spd';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.02 } },
};

const item = {
  hidden: { opacity: 0, y: 12, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1 },
};

export default function PokedexPage() {
  const [search, setSearch] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());
  const [selectedRarities, setSelectedRarities] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortAsc, setSortAsc] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [caught, setCaught] = useState<Set<string>>(new Set());
  const [minBase, setMinBase] = useState(0);
  const [maxBase, setMaxBase] = useState(720);
  const [minStat, setMinStat] = useState(0);
  const [maxStat, setMaxStat] = useState(260);
  const [minTotal, setMinTotal] = useState(0);
  const [maxTotal, setMaxTotal] = useState(800);

  // Load caught from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('pokedex-caught');
      if (stored) {
        setCaught(new Set(JSON.parse(stored)));
      }
    } catch {
      // ignore
    }
  }, []);

  // Save caught to localStorage on change
  useEffect(() => {
    if (caught.size > 0 || typeof window !== 'undefined') {
      try {
        localStorage.setItem('pokedex-caught', JSON.stringify([...caught]));
      } catch {
        // ignore
      }
    }
  }, [caught]);

  const toggleType = (type: string) => {
    setSelectedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  const toggleRarity = (rarity: string) => {
    setSelectedRarities((prev) => {
      const next = new Set(prev);
      if (next.has(rarity)) next.delete(rarity);
      else next.add(rarity);
      return next;
    });
  };

  const toggleCaught = (slug: string) => {
    setCaught((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return POKEMON.filter((p) => {
      // Text search
      if (q && !p.name.toLowerCase().includes(q) && !p.slug.includes(q) && !String(p.id).includes(q)) return false;
      // Type filter
      if (selectedTypes.size > 0) {
        const hasType = selectedTypes.has(p.t1) || (p.t2 && selectedTypes.has(p.t2));
        if (!hasType) return false;
      }
      // Rarity filter
      if (selectedRarities.size > 0 && !selectedRarities.has(p.rarity)) return false;
      // Stat range filters
      if (p.base < minTotal || p.base > maxTotal) return false;
      if (p.hp < minStat || p.hp > maxStat) return false;
      if (p.atk < minStat || p.atk > maxStat) return false;
      if (p.def < minStat || p.def > maxStat) return false;
      if (p.spatk < minStat || p.spatk > maxStat) return false;
      if (p.spdef < minStat || p.spdef > maxStat) return false;
      if (p.spd < minStat || p.spd > maxStat) return false;
      return true;
    });
  }, [search, selectedTypes, selectedRarities, minStat, maxStat, minTotal, maxTotal]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'name':
          cmp = a.name.localeCompare(b.name);
          break;
        case 'base':
          cmp = a.base - b.base;
          break;
        case 'hp':
        case 'atk':
        case 'def':
        case 'spd':
          cmp = a[sortField] - b[sortField];
          break;
        default:
          cmp = a.id - b.id;
      }
      return sortAsc ? cmp : -cmp;
    });
    return arr;
  }, [filtered, sortField, sortAsc]);

  const caughtCount = caught.size;
  const totalCount = POKEMON.length;
  const progressPct = totalCount > 0 ? (caughtCount / totalCount) * 100 : 0;

  const clearFilters = () => {
    setSearch('');
    setSelectedTypes(new Set());
    setSelectedRarities(new Set());
    setSortField('id');
    setSortAsc(true);
    setMinBase(0);
    setMaxBase(720);
    setMinStat(0);
    setMaxStat(260);
    setMinTotal(0);
    setMaxTotal(800);
  };

  const hasActiveFilters = search || selectedTypes.size > 0 || selectedRarities.size > 0 ||
    sortField !== 'id' || !sortAsc || minTotal > 0 || maxTotal < 800 || minStat > 0 || maxStat < 260;

  return (
    <div className="py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2">📖 Pokédex</h1>
        <p className="text-muted-foreground mb-6">
          {totalCount} Pokémon — {caughtCount} capturados
        </p>
      </motion.div>

      {/* Progress bar */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="origin-left mb-8"
      >
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-1.5">
          <span>Progresso da Pokédex</span>
          <span className="font-mono font-semibold text-foreground">
            {caughtCount}/{totalCount}
          </span>
        </div>
        <div className="h-3 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-green-500"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </motion.div>

      {/* Search + Filter Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 mb-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou número..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-9 h-9"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        <Button
          variant={showFilters ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-1.5 shrink-0"
        >
          <SlidersHorizontal className="size-4" />
          Filtros
        </Button>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-muted-foreground">
            Limpar
          </Button>
        )}
      </motion.div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-4"
          >
            <Card className="bg-card/50">
              <CardContent className="p-4 space-y-4">
                {/* Type filters */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Types</label>
                  <div className="flex flex-wrap gap-1.5">
                    {TYPE_KEYS.map((type) => {
                      const active = selectedTypes.has(type);
                      return (
                        <Button
                          key={type}
                          variant={active ? 'default' : 'outline'}
                          size="xs"
                          onClick={() => toggleType(type)}
                          className="gap-1"
                          style={
                            active
                              ? { backgroundColor: TYPE_COLORS[type], borderColor: TYPE_COLORS[type], color: '#fff' }
                              : undefined
                          }
                        >
                          <span
                            className="size-2 rounded-full"
                            style={{ backgroundColor: TYPE_COLORS[type] }}
                          />
                          {TYPE_NAMES[type]}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Rarity filter */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Rarity</label>
                  <div className="flex flex-wrap gap-1.5">
                    {RARITY_OPTIONS.map((r) => {
                      const active = selectedRarities.has(r.value);
                      return (
                        <Button
                          key={r.value}
                          variant={active ? 'default' : 'outline'}
                          size="xs"
                          onClick={() => toggleRarity(r.value)}
                          style={active ? { backgroundColor: r.color, borderColor: r.color, color: '#fff' } : undefined}
                        >
                          {r.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Sort */}
                <div className="flex flex-wrap items-center gap-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <ArrowUpDown className="size-3 inline mr-1" />Sort
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {SORT_OPTIONS.map((s) => (
                      <Button
                        key={s.value}
                        variant={sortField === s.value ? 'default' : 'outline'}
                        size="xs"
                        onClick={() => {
                          if (sortField === s.value) setSortAsc(!sortAsc);
                          else { setSortField(s.value as SortField); setSortAsc(s.value === 'name' || s.value === 'id'); }
                        }}
                      >
                        {s.label} {sortField === s.value ? (sortAsc ? '↑' : '↓') : ''}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Stat range sliders */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">
                      Base Stats Total: {minTotal}–{maxTotal}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range" min={0} max={800} value={minTotal}
                        onChange={(e) => setMinTotal(Number(e.target.value))}
                        className="flex-1 h-1.5 accent-primary"
                      />
                      <input
                        type="range" min={0} max={800} value={maxTotal}
                        onChange={(e) => setMaxTotal(Number(e.target.value))}
                        className="flex-1 h-1.5 accent-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">
                      Individual Stat Range: {minStat}–{maxStat}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range" min={0} max={260} value={minStat}
                        onChange={(e) => setMinStat(Number(e.target.value))}
                        className="flex-1 h-1.5 accent-primary"
                      />
                      <input
                        type="range" min={0} max={260} value={maxStat}
                        onChange={(e) => setMaxStat(Number(e.target.value))}
                        className="flex-1 h-1.5 accent-primary"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-4">
        {sorted.length} resultado{sorted.length !== 1 ? 's' : ''}
      </p>

      {/* Pokemon grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        key={`${search}-${[...selectedTypes].sort().join(',')}-${sortField}-${sortAsc}-${minTotal}-${maxTotal}-${minStat}-${maxStat}`}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3"
      >
        <AnimatePresence mode="popLayout">
          {sorted.map((p) => {
            const isCaught = caught.has(p.slug);
            return (
              <motion.div
                key={p.slug}
                variants={item}
                layout
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card
                  className={`relative transition-all overflow-hidden ${
                    isCaught ? 'ring-2 ring-green-500/60 bg-green-500/5' : 'hover:shadow-lg hover:scale-[1.02]'
                  }`}
                >
                  <CardContent className="p-3">
                    {/* Sprite + Name row */}
                    <div className="flex items-center gap-3 mb-2">
                      <div className="relative shrink-0">
                        <img
                          src={getSpriteUrl(p.id)}
                          alt={p.name}
                          width={64}
                          height={64}
                          className="size-16 image-render-pixelated"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[10px] font-mono text-muted-foreground">#{String(p.id).padStart(3, '0')}</span>
                          {p.rarity && (
                            <span
                              className="text-[9px] font-bold uppercase px-1 py-0.5 rounded"
                              style={{
                                backgroundColor: `${RARITY_OPTIONS.find(r => r.value === p.rarity)?.color || '#888'}22`,
                                color: RARITY_OPTIONS.find(r => r.value === p.rarity)?.color || '#888',
                              }}
                            >
                              {RARITY_OPTIONS.find(r => r.value === p.rarity)?.label || p.rarity}
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-semibold leading-tight truncate">{p.name}</h3>
                        <div className="flex gap-1 mt-1">
                          <TypeBadge type={p.t1} size="sm" />
                          {p.t2 && <TypeBadge type={p.t2} size="sm" />}
                        </div>
                      </div>
                    </div>

                    {/* Base total */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                      <span>Total</span>
                      <span className="font-mono font-semibold text-foreground">{p.base}</span>
                    </div>

                    {/* Stat bars - compact 2-column */}
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                      {STAT_KEYS.map((key) => {
                        const val = p[key];
                        const pct = Math.min((val / 255) * 100, 100);
                        return (
                          <div key={key} className="flex items-center gap-1 text-[10px]">
                            <span className="w-8 text-muted-foreground font-mono shrink-0">{STAT_LABELS[key]}</span>
                            <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-300"
                                style={{
                                  width: `${pct}%`,
                                  backgroundColor:
                                    val >= 150 ? '#ef4444' :
                                    val >= 100 ? '#f59e0b' :
                                    val >= 70 ? '#22c55e' :
                                    '#6b7280',
                                }}
                              />
                            </div>
                            <span className="w-5 text-right font-mono text-muted-foreground">{val}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Caught checkbox */}
                    <div className="mt-2 pt-2 border-t border-border/50">
                      <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={isCaught}
                          onChange={() => toggleCaught(p.slug)}
                          className="sr-only peer"
                        />
                        <span className="size-3.5 rounded border border-input peer-checked:bg-green-500 peer-checked:border-green-500 flex items-center justify-center transition-colors shrink-0">
                          {isCaught && (
                            <svg className="size-2.5 text-white" viewBox="0 0 12 12" fill="none">
                              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </span>
                        Capturado
                      </label>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Empty state */}
      {sorted.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 text-muted-foreground"
        >
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-lg">Nenhum Pokémon encontrado</p>
          <p className="text-sm mt-1">Tente outros filtros ou limpe a busca</p>
        </motion.div>
      )}

      {/* Footer */}
      <footer className="mt-16 text-center text-sm text-muted-foreground pb-8">
        Guia não oficial de{' '}
        <a
          href="https://poke.idleworld.online/?ref=N9YEEGV"
          target="_blank"
          className="underline hover:text-primary"
        >
          Poke Idle World
        </a>
        . Dados da Poképedia oficial.
      </footer>
    </div>
  );
}
