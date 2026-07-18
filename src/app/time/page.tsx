'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useMemo, Fragment } from 'react';
import { POKEMON } from '@/data/pokemon';
import { TYPE_NAMES } from '@/data/types';
import { TYPE_COLORS } from '@/lib/types';
import { TYPE_CHART } from '@/data/types';
import { TypeBadge } from '@/components/type-badge';
import { pokemonSprite } from '@/lib/pokemon-utils';
import { Shield, Swords, BarChart3 } from 'lucide-react';

// ─── Stat comparison helpers ──────────────────────────────────────────────────
function TeamStatRadar({ label, values, maxVal }: { label: string; values: number[]; maxVal: number }) {
  const avg = values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;
  const pct = Math.min((avg / maxVal) * 100, 100);
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-14 text-xs text-muted-foreground font-medium">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
        <motion.div className="h-full rounded-full bg-primary" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.5, ease: 'easeOut' }} />
      </div>
      <span className="w-10 text-right font-mono text-xs">{avg}</span>
    </div>
  );
}

export default function TimePage() {
  const [team, setTeam] = useState<(string | null)[]>([null, null, null, null, null, null]);

  const teamPokemon = useMemo(
    () => team.map(slug => slug ? POKEMON.find(p => p.slug === slug) : null).filter(Boolean) as typeof POKEMON[number][],
    [team]
  );

  const teamTypes = useMemo(() => new Set(teamPokemon.flatMap(p => [p.t1, p.t2].filter(Boolean))), [teamPokemon]);
  const totalBase = useMemo(() => teamPokemon.reduce((sum, p) => sum + p.base, 0), [teamPokemon]);

  // ── Team A vs Team B ─────────────────────────────────────────────────────
  const [teamB, setTeamB] = useState<(string | null)[]>([null, null, null, null, null, null]);
  const teamBPokemon = useMemo(
    () => teamB.map(slug => slug ? POKEMON.find(p => p.slug === slug) : null).filter(Boolean) as typeof POKEMON[number][],
    [teamB]
  );

  const aggregateStats = (poks: typeof POKEMON) => {
    if (!poks.length) return { hp: 0, atk: 0, def: 0, spatk: 0, spdef: 0, spd: 0, base: 0 };
    return {
      hp: Math.round(poks.reduce((s, p) => s + p.hp, 0) / poks.length),
      atk: Math.round(poks.reduce((s, p) => s + p.atk, 0) / poks.length),
      def: Math.round(poks.reduce((s, p) => s + p.def, 0) / poks.length),
      spatk: Math.round(poks.reduce((s, p) => s + p.spatk, 0) / poks.length),
      spdef: Math.round(poks.reduce((s, p) => s + p.spdef, 0) / poks.length),
      spd: Math.round(poks.reduce((s, p) => s + p.spd, 0) / poks.length),
      base: Math.round(poks.reduce((s, p) => s + p.base, 0) / poks.length),
    };
  };

  const getTeamTypes = (poks: typeof POKEMON) => {
    const types = new Set<string>();
    poks.forEach(p => { types.add(p.t1); if (p.t2) types.add(p.t2); });
    return types;
  };

  const getTeamWeaknesses = (poks: typeof POKEMON) => {
    const weakCount: Record<string, number> = {};
    poks.forEach(p => {
      [p.t1, p.t2].filter(Boolean).forEach(t => {
        const chart = TYPE_CHART[t];
        if (chart) chart.weak.forEach(w => { weakCount[w] = (weakCount[w] || 0) + 1; });
      });
    });
    return Object.entries(weakCount).sort((a, b) => b[1] - a[1]);
  };

  const getTeamResistances = (poks: typeof POKEMON) => {
    const resCount: Record<string, number> = {};
    poks.forEach(p => {
      [p.t1, p.t2].filter(Boolean).forEach(t => {
        const chart = TYPE_CHART[t];
        if (chart) {
          chart.resist.forEach(r => { resCount[r] = (resCount[r] || 0) + 1; });
          chart.immune.forEach(r => { resCount[r] = (resCount[r] || 0) + 2; });
        }
      });
    });
    return Object.entries(resCount).sort((a, b) => b[1] - a[1]);
  };

  const statsA = useMemo(() => aggregateStats(teamPokemon), [teamPokemon]);
  const statsB = useMemo(() => aggregateStats(teamBPokemon), [teamBPokemon]);
  const typesA = useMemo(() => getTeamTypes(teamPokemon), [teamPokemon]);
  const typesB = useMemo(() => getTeamTypes(teamBPokemon), [teamBPokemon]);
  const weakA = useMemo(() => getTeamWeaknesses(teamPokemon), [teamPokemon]);
  const weakB = useMemo(() => getTeamWeaknesses(teamBPokemon), [teamBPokemon]);
  const resA = useMemo(() => getTeamResistances(teamPokemon), [teamPokemon]);
  const resB = useMemo(() => getTeamResistances(teamBPokemon), [teamBPokemon]);

  const showCompare = teamPokemon.length > 0 && teamBPokemon.length > 0;

  return (
    <div className="py-8 space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2">👥 Planejador de Time</h1>
        <p className="text-muted-foreground mb-8">Monte seu time ideal de até 6 Pokémon e compare dois times.</p>
      </motion.div>

      {/* Team Builder */}
      <Card>
        <CardHeader><CardTitle>Time A — Seu Time</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            {team.map((slug, i) => (
              <div key={i}>
                <label className="text-xs text-muted-foreground mb-1 block">Slot {i + 1}</label>
                <Select value={slug || ''} onValueChange={v => { const next = [...team]; next[i] = v || null; setTeam(next); }}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {POKEMON.map(p => <SelectItem key={p.slug} value={p.slug}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>

          {teamPokemon.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="p-4 rounded-lg bg-muted">
                <div className="text-sm text-muted-foreground mb-2">Tipos do time:</div>
                <div className="flex flex-wrap gap-2">{Array.from(teamTypes).map(t => <TypeBadge key={t} type={t} size="md" />)}</div>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <div className="text-sm text-muted-foreground">Base Stats Total: <strong>{totalBase}</strong></div>
                <div className="text-sm text-muted-foreground">Média por Pokémon: <strong>{Math.round(totalBase / teamPokemon.length)}</strong></div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {teamPokemon.map(p => (
                  <div key={p.slug} className="flex items-center gap-2 p-3 rounded-lg border border-border">
                    <img src={pokemonSprite(p)} alt={p.name} className="w-10 h-10" />
                    <div>
                      <div className="font-semibold text-sm">{p.name}</div>
                      <div className="flex gap-1 mt-0.5"><TypeBadge type={p.t1} />{p.t2 && <TypeBadge type={p.t2} />}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">Base: {p.base}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Team B Builder */}
      <Card>
        <CardHeader><CardTitle>Time B — Oponente</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            {teamB.map((slug, i) => (
              <div key={i}>
                <label className="text-xs text-muted-foreground mb-1 block">Slot {i + 1}</label>
                <Select value={slug || ''} onValueChange={v => { const next = [...teamB]; next[i] = v || null; setTeamB(next); }}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {POKEMON.map(p => <SelectItem key={p.slug} value={p.slug}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
          {teamBPokemon.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {teamBPokemon.map(p => (
                <div key={p.slug} className="flex items-center gap-2 p-3 rounded-lg border border-border">
                  <img src={pokemonSprite(p)} alt={p.name} className="w-10 h-10" />
                  <div>
                    <div className="font-semibold text-sm">{p.name}</div>
                    <div className="flex gap-1 mt-0.5"><TypeBadge type={p.t1} />{p.t2 && <TypeBadge type={p.t2} />}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Base: {p.base}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comparison */}
      {showCompare && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="size-5 text-primary" />
                Comparação dos Times
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Stat comparison */}
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><Swords className="size-4" /> Estatísticas Médias</h3>
                <div className="grid grid-cols-[auto_1fr_80px_80px_1fr] gap-x-2 gap-y-2 items-center text-sm">
                  <span className="text-xs font-medium text-muted-foreground">Stat</span>
                  <span className="text-xs font-medium text-muted-foreground text-center">Time A</span>
                  <span></span>
                  <span className="text-xs font-medium text-muted-foreground text-center">Time B</span>
                  <span></span>
                  {(['hp', 'atk', 'def', 'spatk', 'spdef', 'spd'] as const).map(key => {
                    const valA = statsA[key];
                    const valB = statsB[key];
                    const diff = valB - valA;
                    const pctA = Math.min((valA / 150) * 100, 100);
                    const pctB = Math.min((valB / 150) * 100, 100);
                    return (
                      <Fragment key={key}>
                        <span className="text-xs text-muted-foreground capitalize">{key}</span>
                        <div className="flex justify-end"><div className="w-full h-2 rounded-full bg-muted overflow-hidden flex justify-end"><motion.div className="h-full rounded-full" style={{ backgroundColor: diff > 0 ? '#888' : '#ef4444' }} initial={{ width: 0 }} animate={{ width: `${pctA}%` }} transition={{ duration: 0.5 }} /></div></div>
                        <span className="text-center font-mono text-xs">{valA}</span>
                        <span className="text-center font-mono text-xs">{valB}</span>
                        <div className="flex"><div className="w-full h-2 rounded-full bg-muted overflow-hidden"><motion.div className="h-full rounded-full" style={{ backgroundColor: diff < 0 ? '#888' : '#22c55e' }} initial={{ width: 0 }} animate={{ width: `${pctB}%` }} transition={{ duration: 0.5 }} /></div></div>
                      </Fragment>
                    );
                  })}
                </div>
              </div>

              {/* Type coverage */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="text-xs font-semibold text-muted-foreground mb-2">Tipos — Time A ({typesA.size})</div>
                  <div className="flex flex-wrap gap-1">{Array.from(typesA).map(t => <TypeBadge key={t} type={t} size="md" />)}</div>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="text-xs font-semibold text-muted-foreground mb-2">Tipos — Time B ({typesB.size})</div>
                  <div className="flex flex-wrap gap-1">{Array.from(typesB).map(t => <TypeBadge key={t} type={t} size="md" />)}</div>
                </div>
              </div>

              {/* Weaknesses & Resistances */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                  <div className="text-xs font-semibold text-red-500 mb-2 flex items-center gap-1">⚠️ Fraquezas</div>
                  <div className="space-y-1">
                    {weakA.slice(0, 6).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between text-xs">
                        <TypeBadge type={type} size="sm" />
                        <span className="text-muted-foreground">×{count}</span>
                      </div>
                    ))}
                    {weakA.length === 0 && <span className="text-xs text-muted-foreground">Nenhuma</span>}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                  <div className="text-xs font-semibold text-emerald-500 mb-2 flex items-center gap-1">🛡️ Resistências</div>
                  <div className="space-y-1">
                    {resA.slice(0, 6).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between text-xs">
                        <TypeBadge type={type} size="sm" />
                        <span className="text-muted-foreground">×{count}</span>
                      </div>
                    ))}
                    {resA.length === 0 && <span className="text-xs text-muted-foreground">Nenhuma</span>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <footer className="mt-16 text-center text-sm text-muted-foreground pb-8">
        Guia não oficial de <a href="https://poke.idleworld.online/?ref=N9YEEGV" target="_blank" className="underline hover:text-primary">Poke Idle World</a>. Dados da Poképedia oficial.
      </footer>
    </div>
  );
}

