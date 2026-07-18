'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { POKEMON } from '@/data/pokemon';
import { TYPE_NAMES } from '@/data/types';
import { TYPE_COLORS } from '@/lib/types';
import { TypeBadge } from '@/components/type-badge';

export default function TimePage() {
  const [team, setTeam] = useState<(string | null)[]>([null, null, null, null, null, null]);

  const teamPokemon = team.map(slug => slug ? POKEMON.find(p => p.slug === slug) : null).filter(Boolean);
  const teamTypes = new Set(teamPokemon.flatMap(p => [p!.t1, p!.t2].filter(Boolean)));
  const totalBase = teamPokemon.reduce((sum, p) => sum + p!.base, 0);

  return (
    <div className="py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2">👥 Planejador de Time</h1>
        <p className="text-muted-foreground mb-8">Monte seu time ideal de até 6 Pokémon.</p>
      </motion.div>

      <Card className="mb-6">
        <CardHeader><CardTitle>Seu Time</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            {team.map((slug, i) => (
              <div key={i}>
                <label className="text-xs text-muted-foreground mb-1 block">Slot {i + 1}</label>
                <Select value={slug || ''} onValueChange={v => {
                  const next = [...team];
                  next[i] = v || null;
                  setTeam(next);
                }}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {POKEMON.map(p => (
                      <SelectItem key={p.slug} value={p.slug}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>

          {teamPokemon.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="p-4 rounded-lg bg-muted">
                <div className="text-sm text-muted-foreground mb-2">Tipos do time:</div>
                <div className="flex flex-wrap gap-2">
                  {Array.from(teamTypes).map(t => (
                    <TypeBadge key={t} type={t} size="md" />
                  ))}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <div className="text-sm text-muted-foreground">Base Stats Total: <strong>{totalBase}</strong></div>
                <div className="text-sm text-muted-foreground">Média por Pokémon: <strong>{Math.round(totalBase / teamPokemon.length)}</strong></div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {teamPokemon.map(p => (
                  <div key={p!.slug} className="p-3 rounded-lg border border-border">
                    <div className="font-semibold text-sm">{p!.name}</div>
                    <div className="flex gap-1 mt-1">
                      <TypeBadge type={p!.t1} />
                      {p!.t2 && <TypeBadge type={p!.t2} />}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Base: {p!.base}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      <footer className="mt-16 text-center text-sm text-muted-foreground pb-8">
        Guia não oficial de <a href="https://poke.idleworld.online/?ref=N9YEEGV" target="_blank" className="underline hover:text-primary">Poke Idle World</a>. Dados da Poképedia oficial.
      </footer>
    </div>
  );
}
