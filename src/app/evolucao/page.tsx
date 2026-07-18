'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useState, useMemo } from 'react';
import { POKEMON } from '@/data/pokemon';
import { pokemonSprite } from '@/lib/pokemon-utils';
import { TypeBadge } from '@/components/type-badge';
import { Calculator } from 'lucide-react';

function xpToLevel(lvl: number): number {
  if (lvl <= 1) return 0;
  return Math.round((50 / 3) * (Math.pow(lvl, 3) - 6 * Math.pow(lvl, 2) + 17 * lvl - 12));
}

const RETENTION = [
  { pct: 0, label: '0% — Começa do nv.1', mult: 1.0, diamonds: 0 },
  { pct: 25, label: '25% — Perde 75%', mult: 1.5, diamonds: 0 },
  { pct: 50, label: '50% — Perde 50%', mult: 2.5, diamonds: 5 },
  { pct: 75, label: '75% — Perde 25%', mult: 4.0, diamonds: 15 },
  { pct: 100, label: '100% — Mantém nível', mult: 6.0, diamonds: 30 },
];

const NATURES = [
  { name: 'Hardy', plus: '', minus: '' },
  { name: 'Lonely', plus: 'atk', minus: 'def' },
  { name: 'Brave', plus: 'atk', minus: 'spd' },
  { name: 'Adamant', plus: 'atk', minus: 'spatk' },
  { name: 'Naughty', plus: 'atk', minus: 'spdef' },
  { name: 'Bold', plus: 'def', minus: 'atk' },
  { name: 'Docile', plus: '', minus: '' },
  { name: 'Relaxed', plus: 'def', minus: 'spd' },
  { name: 'Impish', plus: 'def', minus: 'spatk' },
  { name: 'Lax', plus: 'def', minus: 'spdef' },
  { name: 'Timid', plus: 'spd', minus: 'atk' },
  { name: 'Hasty', plus: 'spd', minus: 'def' },
  { name: 'Serious', plus: '', minus: '' },
  { name: 'Jolly', plus: 'spd', minus: 'spatk' },
  { name: 'Naive', plus: 'spd', minus: 'spdef' },
  { name: 'Modest', plus: 'spatk', minus: 'atk' },
  { name: 'Mild', plus: 'spatk', minus: 'def' },
  { name: 'Quiet', plus: 'spatk', minus: 'spd' },
  { name: 'Bashful', plus: '', minus: '' },
  { name: 'Rash', plus: 'spatk', minus: 'spdef' },
  { name: 'Calm', plus: 'spdef', minus: 'atk' },
  { name: 'Gentle', plus: 'spdef', minus: 'def' },
  { name: 'Sassy', plus: 'spdef', minus: 'spd' },
  { name: 'Careful', plus: 'spdef', minus: 'spatk' },
  { name: 'Quirky', plus: '', minus: '' },
];

const STAT_NAMES = ['hp', 'atk', 'def', 'spatk', 'spdef', 'spd'] as const;
type StatName = typeof STAT_NAMES[number];
const STAT_LABELS: Record<StatName, string> = { hp: 'HP', atk: 'Atk', def: 'Def', spatk: 'SpAtk', spdef: 'SpDef', spd: 'Speed' };

// ─── IV Calculator ───────────────────────────────────────────────────────────
function IVCalculator() {
  const [selectedPokemon, setSelectedPokemon] = useState<string>('bulbasaur');
  const [level, setLevel] = useState(50);
  const [nature, setNature] = useState('Hardy');
  const [evs, setEvs] = useState<Record<StatName, number>>({ hp: 0, atk: 0, def: 0, spatk: 0, spdef: 0, spd: 0 });
  const [actualStats, setActualStats] = useState<Record<StatName, number>>({ hp: 45, atk: 49, def: 49, spatk: 65, spdef: 65, spd: 45 });

  const pokemon = useMemo(() => POKEMON.find(p => p.slug === selectedPokemon) ?? POKEMON[0], [selectedPokemon]);
  const natureData = useMemo(() => NATURES.find(n => n.name === nature) ?? NATURES[0], [nature]);

  const ivRanges = useMemo(() => {
    const result: Record<StatName, { min: number; max: number; possible: number[] }> = {
      hp: { min: 0, max: 31, possible: [] },
      atk: { min: 0, max: 31, possible: [] },
      def: { min: 0, max: 31, possible: [] },
      spatk: { min: 0, max: 31, possible: [] },
      spdef: { min: 0, max: 31, possible: [] },
      spd: { min: 0, max: 31, possible: [] },
    };

    const baseMap: Record<StatName, number> = {
      hp: pokemon.hp, atk: pokemon.atk, def: pokemon.def,
      spatk: pokemon.spatk, spdef: pokemon.spdef, spd: pokemon.spd,
    };

    const natureMult = (stat: StatName): number => {
      if (natureData.plus === stat) return 1.1;
      if (natureData.minus === stat) return 0.9;
      return 1.0;
    };

    for (const stat of STAT_NAMES) {
      const base = baseMap[stat];
      const ev = evs[stat];
      const actual = actualStats[stat];
      const natMult = natureMult(stat);

      const possible: number[] = [];
      for (let iv = 0; iv <= 31; iv++) {
        let calc: number;
        if (stat === 'hp') {
          // HP formula: floor(((2*base + iv + floor(ev/4)) * level / 100) + level + 10)
          calc = Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level / 100) + level + 10);
        } else {
          // Other stats: floor(((2*base + iv + floor(ev/4)) * level / 100 + 5) * nature)
          calc = Math.floor((Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level / 100) + 5) * natMult));
        }
        if (Math.round(calc) === actual) {
          possible.push(iv);
        }
      }

      result[stat] = {
        min: possible.length > 0 ? possible[0] : -1,
        max: possible.length > 0 ? possible[possible.length - 1] : -1,
        possible,
      };
    }
    return result;
  }, [pokemon, level, natureData, evs, actualStats]);

  // Sync actual stats to base when pokemon changes
  useMemo(() => {
    setActualStats({ hp: pokemon.hp, atk: pokemon.atk, def: pokemon.def, spatk: pokemon.spatk, spdef: pokemon.spdef, spd: pokemon.spd });
  }, [pokemon]);

  const allPerfect = Object.values(ivRanges).every(r => r.min === 31 && r.max === 31);
  const anyImpossible = Object.values(ivRanges).some(r => r.possible.length === 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="size-5 text-blue-500" />
            Calculadora de IVs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Pokemon select + level + nature */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Pokémon</label>
              <Select value={selectedPokemon} onValueChange={v => { if (v) setSelectedPokemon(v); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {POKEMON.map(p => <SelectItem key={p.slug} value={p.slug}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Nível</label>
              <Input type="number" value={level} min={1} max={100} onChange={e => setLevel(+e.target.value)} className="h-9" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Nature</label>
              <Select value={nature} onValueChange={v => { if (v) setNature(v); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {NATURES.map(n => (
                    <SelectItem key={n.name} value={n.name}>
                      {n.name}{n.plus ? ` (+${n.plus.toUpperCase()}, -${n.minus.toUpperCase()})` : ' (neutral)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Pokemon display */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
            <img src={pokemonSprite(pokemon)} alt={pokemon.name} className="w-16 h-16" />
            <div>
              <div className="font-bold text-lg">{pokemon.name}</div>
              <div className="flex gap-1 mt-1">
                <TypeBadge type={pokemon.t1} />
                {pokemon.t2 && <TypeBadge type={pokemon.t2} />}
              </div>
            </div>
            {natureData.plus && (
              <div className="ml-auto text-xs text-muted-foreground">
                Nature: <span className="text-emerald-500 font-medium">+{natureData.plus.toUpperCase()}</span>{' / '}
                <span className="text-red-500 font-medium">-{natureData.minus.toUpperCase()}</span>
              </div>
            )}
          </div>

          {/* EVs + Actual Stats inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground">EVs (0-252)</h3>
              <div className="space-y-2">
                {STAT_NAMES.map(stat => (
                  <div key={stat} className="flex items-center gap-2">
                    <span className="w-12 text-xs text-muted-foreground">{STAT_LABELS[stat]}</span>
                    <Input type="number" value={evs[stat]} min={0} max={252} step={4}
                      onChange={e => setEvs(prev => ({ ...prev, [stat]: +e.target.value }))}
                      className="h-8 text-sm" />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Stats Reais</h3>
              <div className="space-y-2">
                {STAT_NAMES.map(stat => (
                  <div key={stat} className="flex items-center gap-2">
                    <span className="w-12 text-xs text-muted-foreground">{STAT_LABELS[stat]}</span>
                    <Input type="number" value={actualStats[stat]} min={1} max={999}
                      onChange={e => setActualStats(prev => ({ ...prev, [stat]: +e.target.value }))}
                      className="h-8 text-sm" />
                    <span className="text-[10px] text-muted-foreground w-16">
                      Base: {stat === 'hp' ? pokemon.hp : stat === 'atk' ? pokemon.atk : stat === 'def' ? pokemon.def : stat === 'spatk' ? pokemon.spatk : stat === 'spdef' ? pokemon.spdef : pokemon.spd}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="p-4 rounded-xl bg-muted/50 space-y-3">
            <h3 className="font-semibold text-sm">Ranges de IV Possíveis</h3>
            {allPerfect && (
              <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm font-medium">
                🎉 Todos os IVs podem ser 31 (perfeito)!
              </div>
            )}
            {anyImpossible && (
              <div className="p-2 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium">
                ⚠️ Alguns stats não combinam com os inputs — verifique os EVs e stats reais.
              </div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {STAT_NAMES.map(stat => {
                const range = ivRanges[stat];
                const isPerfect = range.min === 31 && range.max === 31;
                const isImpossible = range.possible.length === 0;
                return (
                  <div key={stat} className={`p-3 rounded-lg border ${isPerfect ? 'bg-emerald-500/10 border-emerald-500/30' : isImpossible ? 'bg-red-500/10 border-red-500/30' : 'bg-background border-border'}`}>
                    <div className="text-xs text-muted-foreground mb-1">{STAT_LABELS[stat]}</div>
                    <div className="flex items-baseline gap-1">
                      {isImpossible ? (
                        <span className="text-red-500 font-mono text-lg font-bold">?</span>
                      ) : (
                        <>
                          <span className="font-mono text-lg font-bold">{range.min}</span>
                          <span className="text-muted-foreground">—</span>
                          <span className="font-mono text-lg font-bold">{range.max}</span>
                          {isPerfect && <span className="text-emerald-500 text-xs ml-1">✨ PERFECT</span>}
                        </>
                      )}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-0.5">
                      {range.possible.slice(0, 10).map(iv => (
                        <span key={iv} className="text-[9px] font-mono px-1 py-0.5 rounded bg-muted">{iv}</span>
                      ))}
                      {range.possible.length > 10 && <span className="text-[9px] text-muted-foreground">+{range.possible.length - 10}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  EVOLUTION PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function EvolucaoPage() {
  const [evoLevel, setEvoLevel] = useState(50);
  const [retention, setRetention] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(30);
  const [targetLevel, setTargetLevel] = useState(50);

  const evoCost = Math.round(evoLevel * evoLevel * 500 * RETENTION.find(r => r.pct === retention)!.mult);
  const xpNeeded = Math.max(0, xpToLevel(targetLevel) - xpToLevel(currentLevel));

  return (
    <div className="py-8 space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2">⬆️ Simulador de Evolução & XP</h1>
        <p className="text-muted-foreground mb-8">Calcule custos de evolução, XP, e IVs dos seus Pokémon.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Evo Simulator */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader><CardTitle>Simulador de Evolução</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Nível do Pokémon</label>
                <Input type="number" value={evoLevel} onChange={e => setEvoLevel(+e.target.value)} min={1} max={100} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Retenção</label>
                <Select value={String(retention)} onValueChange={v => { if (v) setRetention(+v); }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {RETENTION.map(r => <SelectItem key={r.pct} value={String(r.pct)}>{r.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="text-center p-4 rounded-lg bg-primary/10">
                <div className="text-2xl font-bold text-primary">{evoCost.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Custo em Gold</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* XP Calculator */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader><CardTitle>Calculadora de XP</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Nível Atual</label>
                <Input type="number" value={currentLevel} onChange={e => setCurrentLevel(+e.target.value)} min={1} max={999} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Nível Alvo</label>
                <Input type="number" value={targetLevel} onChange={e => setTargetLevel(+e.target.value)} min={1} max={999} />
              </div>
              <div className="text-center p-4 rounded-lg bg-primary/10">
                <div className="text-2xl font-bold text-primary">{xpNeeded.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">XP Total Necessário</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Retention Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader><CardTitle>Tabela de Retenção</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2">Retenção</th>
                    <th className="text-left py-2">Multiplicador</th>
                    <th className="text-left py-2">Diamonds</th>
                  </tr>
                </thead>
                <tbody>
                  {RETENTION.map(r => (
                    <tr key={r.pct} className="border-b border-border/50">
                      <td className="py-2">{r.pct}%</td>
                      <td className="py-2">×{r.mult}</td>
                      <td className="py-2">{r.diamonds || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="mt-4 p-3 rounded-lg bg-muted text-sm text-muted-foreground">
        <strong>Fórmula:</strong> Custo = nível² × 500 × multiplicador da retenção
      </div>

      {/* IV Calculator */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <IVCalculator />
      </motion.div>

      <footer className="mt-16 text-center text-sm text-muted-foreground pb-8">
        Guia não oficial de <a href="https://poke.idleworld.online/?ref=N9YEEGV" target="_blank" className="underline hover:text-primary">Poke Idle World</a>. Dados da Poképedia oficial.
      </footer>
    </div>
  );
}
