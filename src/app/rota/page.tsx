'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Map, ArrowRight, Sparkles } from 'lucide-react';
import { POKEMON } from '@/data/pokemon';
import { TypeBadge } from '@/components/type-badge';
import { pokemonSprite } from '@/lib/pokemon-utils';
import type { Pokemon } from '@/lib/types';

// ─── Route data ──────────────────────────────────────────────────────────────
interface RouteStop {
  level: string;
  location: string;
  pokemonSlugs: string[];
  tip: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
  region: string;
}

const ROUTES: RouteStop[] = [
  {
    level: '1-10', location: 'Route 1 (Kanto)', pokemonSlugs: ['pidgey', 'rattata', 'caterpie'],
    tip: 'Foque em evolve starters', color: '#22c55e', bgColor: 'bg-emerald-500/5', borderColor: 'border-emerald-500/20', icon: '🌿', region: 'Kanto',
  },
  {
    level: '10-25', location: 'Route 4 (Kanto)', pokemonSlugs: ['sandshrew', 'spearow', 'ekans'],
    tip: 'Pikachu aparece raro aqui', color: '#f59e0b', bgColor: 'bg-amber-500/5', borderColor: 'border-amber-500/20', icon: '⛰️', region: 'Kanto',
  },
  {
    level: '25-40', location: 'Route 8 (Kanto)', pokemonSlugs: ['abra', 'machop', 'magnemite'],
    tip: 'Boa pra XP e rare spawns', color: '#8b5cf6', bgColor: 'bg-violet-500/5', borderColor: 'border-violet-500/20', icon: '🏙️', region: 'Kanto',
  },
  {
    level: '40-60', location: 'Route 12 (Kanto)', pokemonSlugs: ['oddish', 'pidgey', 'spearow'],
    tip: 'Farming de evoluções', color: '#06b6d4', bgColor: 'bg-cyan-500/5', borderColor: 'border-cyan-500/20', icon: '🌊', region: 'Kanto',
  },
  {
    level: '60-80', location: 'Route 15 (Kanto)', pokemonSlugs: ['pidgeotto', 'raticate', 'fearow'],
    tip: 'Pokémon de nível alto', color: '#f97316', bgColor: 'bg-orange-500/5', borderColor: 'border-orange-500/20', icon: '🔥', region: 'Kanto',
  },
  {
    level: '80-100', location: 'Route 23 (Kanto)', pokemonSlugs: ['sandslash', 'machoke', 'magneton'],
    tip: 'Pré-Elite Four', color: '#ef4444', bgColor: 'bg-red-500/5', borderColor: 'border-red-500/20', icon: '⚔️', region: 'Kanto',
  },
  {
    level: '100', location: 'Victory Road', pokemonSlugs: ['machoke', 'graveler', 'onix'],
    tip: 'Farm final antes do Elite Four', color: '#dc2626', bgColor: 'bg-red-600/10', borderColor: 'border-red-600/30', icon: '🏆', region: 'Kanto',
  },
  {
    level: '100+', location: 'Silver Cave (Johto)', pokemonSlugs: ['tyranitar', 'ursaring', 'magneton'],
    tip: 'Endgame farm', color: '#7c3aed', bgColor: 'bg-purple-600/10', borderColor: 'border-purple-600/30', icon: '🏔️', region: 'Johto',
  },
];

function RouteCard({ route, index }: { route: RouteStop; index: number }) {
  const routePokemon = route.pokemonSlugs
    .map(slug => POKEMON.find(p => p.slug === slug))
    .filter(Boolean) as Pokemon[];

  return (
    <motion.div
      initial={{ opacity: 0, x: -30, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Card className={`${route.bgColor} ${route.borderColor} border overflow-hidden hover:shadow-lg transition-shadow`}>
        <CardContent className="p-0">
          {/* Header bar with level and location */}
          <div className="flex items-center gap-3 px-4 py-3" style={{ borderLeft: `4px solid ${route.color}` }}>
            <span className="text-2xl">{route.icon}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold px-2 py-0.5 rounded" style={{ backgroundColor: `${route.color}20`, color: route.color }}>
                  Lv {route.level}
                </span>
                <span className="font-semibold">{route.location}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">{route.region}</div>
            </div>
          </div>

          {/* Pokemon grid with sprites */}
          <div className="px-4 py-3 border-t border-border/30">
            <div className="text-xs text-muted-foreground mb-2 font-medium">Pokémon disponíveis:</div>
            <div className="grid grid-cols-3 gap-2">
              {routePokemon.map(p => (
                <motion.div
                  key={p.slug}
                  className="flex flex-col items-center gap-1 p-2 rounded-lg bg-background/50 border border-border/30 hover:border-primary/30 transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  <img src={pokemonSprite(p)} alt={p.name} className="w-12 h-12 drop-shadow-sm" />
                  <span className="text-[10px] font-medium text-center leading-tight">{p.name}</span>
                  <div className="flex gap-0.5">
                    <TypeBadge type={p.t1} size="sm" />
                    {p.t2 && <TypeBadge type={p.t2} size="sm" />}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Tip */}
          <div className="px-4 py-2 border-t border-border/30 text-xs text-muted-foreground">
            💡 {route.tip}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function RotaPage() {
  return (
    <div className="py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Map className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold">🗺️ Rota de <span className="text-primary">Up</span></h1>
        </div>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Melhores locais pra farmar XP por nível — com sprites e tipos dos Pokémon disponíveis.
        </p>
      </motion.div>

      {/* Route progression line */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 via-amber-500 to-red-600 hidden sm:block" />

        <div className="space-y-4">
          {ROUTES.map((route, i) => (
            <div key={i} className="relative">
              {/* Level dot on the timeline */}
              <div className="absolute left-4 top-4 w-5 h-5 rounded-full border-2 border-background hidden sm:flex items-center justify-center z-10"
                style={{ backgroundColor: route.color }}>
                <span className="text-[8px] text-white font-bold">{i + 1}</span>
              </div>
              <div className="sm:ml-14">
                <RouteCard route={route} index={i} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Arrow progression */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
        className="flex items-center justify-center gap-2 mt-8 text-muted-foreground text-sm">
        <span>Rota 1</span>
        <ArrowRight className="size-4" />
        <span>Route 4</span>
        <ArrowRight className="size-4" />
        <span>Route 8</span>
        <ArrowRight className="size-4" />
        <span>Route 12</span>
        <ArrowRight className="size-4" />
        <span>Route 15</span>
        <ArrowRight className="size-4" />
        <span>Route 23</span>
        <ArrowRight className="size-4" />
        <span className="text-primary font-semibold">Victory Road</span>
        <Sparkles className="size-4 text-amber-400" />
        <span className="text-purple-500 font-semibold">Silver Cave</span>
      </motion.div>

      <footer className="mt-16 text-center text-sm text-muted-foreground pb-8">
        Guia não oficial de <a href="https://poke.idleworld.online/?ref=N9YEEGV" target="_blank" className="underline hover:text-primary">Poke Idle World</a>. Dados da Poképedia oficial.
      </footer>
    </div>
  );
}
