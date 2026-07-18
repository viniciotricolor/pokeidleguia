'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TypeBadge } from '@/components/type-badge';
import { POKEMON } from '@/data/pokemon';
import { TYPE_NAMES } from '@/data/types';
import { TYPE_COLORS } from '@/lib/types';
import { Search, X } from 'lucide-react';

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
  const [caught, setCaught] = useState<Set<string>>(new Set());

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
      if (q && !p.name.toLowerCase().includes(q) && !p.slug.includes(q)) return false;
      if (selectedTypes.size > 0) {
        const hasType = selectedTypes.has(p.t1) || (p.t2 && selectedTypes.has(p.t2));
        if (!hasType) return false;
      }
      return true;
    });
  }, [search, selectedTypes]);

  const caughtCount = caught.size;
  const totalCount = POKEMON.length;
  const progressPct = totalCount > 0 ? (caughtCount / totalCount) * 100 : 0;

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

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative mb-6"
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Buscar Pokémon..."
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
      </motion.div>

      {/* Type filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex flex-wrap gap-2 mb-8"
      >
        <Button
          variant={selectedTypes.size === 0 ? 'default' : 'outline'}
          size="xs"
          onClick={() => setSelectedTypes(new Set())}
        >
          Todos
        </Button>
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
      </motion.div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-4">
        {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* Pokemon grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        key={`${search}-${[...selectedTypes].sort().join(',')}`}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((p) => {
            const isCaught = caught.has(p.slug);
            return (
              <motion.div
                key={p.slug}
                variants={item}
                layout
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card
                  className={`relative transition-all ${
                    isCaught ? 'ring-2 ring-green-500/60 bg-green-500/5' : ''
                  }`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        {p.name}
                      </CardTitle>
                      <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={isCaught}
                          onChange={() => toggleCaught(p.slug)}
                          className="sr-only peer"
                        />
                        <span className="size-4 rounded border border-input peer-checked:bg-green-500 peer-checked:border-green-500 flex items-center justify-center transition-colors">
                          {isCaught && (
                            <svg className="size-3 text-white" viewBox="0 0 12 12" fill="none">
                              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </span>
                        Capturado
                      </label>
                    </div>
                    <div className="flex gap-1.5 mt-1">
                      <TypeBadge type={p.t1} size="md" />
                      {p.t2 && <TypeBadge type={p.t2} size="md" />}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {/* Base total */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                      <span>Base Total</span>
                      <span className="font-mono font-semibold text-foreground">{p.base}</span>
                    </div>
                    {/* Stat bars */}
                    <div className="space-y-1.5">
                      {STAT_KEYS.map((key) => {
                        const val = p[key];
                        const pct = Math.min((val / 255) * 100, 100);
                        return (
                          <div key={key} className="flex items-center gap-2 text-xs">
                            <span className="w-12 text-muted-foreground font-mono">{STAT_LABELS[key]}</span>
                            <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full rounded-full bg-primary/70 transition-all duration-300"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="w-6 text-right font-mono text-muted-foreground">{val}</span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Empty state */}
      {filtered.length === 0 && (
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
