'use client';

import { motion } from 'framer-motion';
import { POKEMON } from '@/data/pokemon';
import { TYPE_ABBR } from '@/lib/types';
import { TypeBadge } from '@/components/type-badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

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
  return TIERS.find(t => {
    if (t.max === null) return base >= t.min;
    return base >= t.min && base <= t.max;
  })!;
}

const sortedPokemon = [...POKEMON].sort((a, b) => b.base - a.base);

const tierGroups = TIERS.map(tier => ({
  ...tier,
  pokemon: sortedPokemon.filter(p => {
    if (tier.max === null) return p.base >= tier.min;
    return p.base >= tier.min && p.base <= tier.max;
  }),
}));

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const tierVariant = {
  hidden: { opacity: 0, x: -30 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

const pokeItem = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function TierListPage() {
  return (
    <div className="py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <div className="flex items-center justify-center gap-3 mb-3">
          <Trophy className="w-8 h-8 text-amber-400" />
          <h1 className="text-4xl font-bold">
            Tier <span className="text-primary">List</span>
          </h1>
        </div>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Classificação dos {POKEMON.length} Pokémon por stats base totais — de {TIERS[0].label} a {TIERS[TIERS.length - 1].label}.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {tierGroups.map(group => (
          <motion.div key={group.label} variants={tierVariant}>
            <Card className={`bg-gradient-to-r ${group.gradient} border-border/50`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span
                    className="inline-flex items-center justify-center w-10 h-10 rounded-lg text-lg font-black"
                    style={{ backgroundColor: `${group.color}25`, color: group.color }}
                  >
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
                  <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2"
                  >
                    {group.pokemon.map(p => (
                      <motion.div
                        key={p.slug}
                        variants={pokeItem}
                        className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-background/50 border border-border/30 hover:border-border/60 transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-medium truncate">{p.name}</span>
                          <div className="flex gap-1 shrink-0">
                            <TypeBadge type={p.t1} size="sm" />
                            {p.t2 && <TypeBadge type={p.t2} size="sm" />}
                          </div>
                        </div>
                        <span
                          className="text-xs font-mono font-bold shrink-0 tabular-nums"
                          style={{ color: group.color }}
                        >
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
