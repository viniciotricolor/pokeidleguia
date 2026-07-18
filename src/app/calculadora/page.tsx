'use client';

import { useState, useMemo, useCallback, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { POKEMON } from '@/data/pokemon';
import type { Pokemon } from '@/lib/types';
import { pokemonSprite, pokemonToBases, STAT_KEYS, STAT_LABELS, type StatKey } from '@/lib/pokemon-utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/ui/select';
import { Zap, Scale } from 'lucide-react';
import { TypeBadge } from '@/components/type-badge';

// ─── Constants ───────────────────────────────────────────────────────────────
const STAT_EXP: Record<StatKey, number> = {
  hp: 0.95, atk: 0.8, def: 0.8, spAtk: 0.8, spDef: 0.8, speed: 0.95,
};

// ─── Calculation helpers ─────────────────────────────────────────────────────
function calcStat(base: number, growth: number, level: number, quality: number, exp: number): number {
  return Math.round((base + 2 * growth) * (level / 100) * Math.pow(quality, exp));
}
function calcAllStats(bases: Record<StatKey, number>, growth: number, level: number, quality: number): Record<StatKey, number> {
  const result = {} as Record<StatKey, number>;
  for (const key of STAT_KEYS) result[key] = calcStat(bases[key], growth, level, quality, STAT_EXP[key]);
  return result;
}
function calcPower(stats: Record<StatKey, number>, quality: number): number {
  return Math.round(Object.values(stats).reduce((a, b) => a + b, 0) * quality);
}

// ─── Motion variants ─────────────────────────────────────────────────────────
const fadeSlide = {
  hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

// ─── Shared input component ──────────────────────────────────────────────────
function StatInput({ label, value, onChange, min, max, step }: {
  label: string; value: number; onChange: (v: number) => void; min: number; max: number; step?: number;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <Input type="number" value={value} min={min} max={max} step={step ?? 1}
        onChange={(e) => { const n = parseFloat(e.target.value); if (!isNaN(n)) onChange(n); }}
        className="h-9" />
    </div>
  );
}

// ─── Animated stat bar ───────────────────────────────────────────────────────
function StatBar({ label, value, maxVal, color }: {
  label: string; value: number; maxVal: number; color?: string;
}) {
  const pct = Math.min((value / maxVal) * 100, 100);
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-12 text-xs text-muted-foreground font-medium">{label}</span>
      <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color || 'hsl(var(--primary))' }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
      <span className="w-10 text-right font-mono text-xs">{value}</span>
    </div>
  );
}

// ─── Diff cell ───────────────────────────────────────────────────────────────
function DiffCell({ value }: { value: number }) {
  const color = value > 0 ? 'text-emerald-500 bg-emerald-500/10' : value < 0 ? 'text-red-500 bg-red-500/10' : 'text-muted-foreground';
  const sign = value > 0 ? '+' : '';
  return <span className={`text-center font-mono text-xs px-1.5 py-0.5 rounded ${color}`}>{sign}{value}</span>;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  POWER CALCULATOR SECTION
// ═══════════════════════════════════════════════════════════════════════════════
function PowerCalculator() {
  const [bases, setBases] = useState<Record<StatKey, number>>({ hp: 45, atk: 49, def: 49, spAtk: 65, spDef: 65, speed: 45 });
  const [quality, setQuality] = useState(1.0);
  const [growth, setGrowth] = useState(10);
  const [level, setLevel] = useState(100);

  const setBase = useCallback((key: StatKey, val: number) => setBases(prev => ({ ...prev, [key]: val })), []);
  const result = useMemo(() => { const stats = calcAllStats(bases, growth, level, quality); return { stats, power: calcPower(stats, quality) }; }, [bases, growth, level, quality]);

  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Zap className="size-5 text-yellow-500" />Calculadora de Power</CardTitle></CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {STAT_KEYS.map(key => <StatInput key={key} label={STAT_LABELS[key]} value={bases[key]} onChange={v => setBase(key, v)} min={1} max={255} />)}
        </div>
        <div className="grid grid-cols-3 gap-3">
          <StatInput label="Quality" value={quality} onChange={setQuality} min={0.8} max={1.8} step={0.01} />
          <StatInput label="Growth" value={growth} onChange={setGrowth} min={1} max={32} />
          <StatInput label="Level" value={level} onChange={setLevel} min={1} max={999} />
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={`${quality}-${growth}-${level}-${JSON.stringify(bases)}`} variants={fadeSlide} initial="hidden" animate="visible" exit="exit" className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-primary/10 border border-primary/20">
              <span className="text-sm font-medium text-muted-foreground">Power Total</span>
              <span className="text-3xl font-bold text-primary">{result.power.toLocaleString()}</span>
            </div>
            <div className="space-y-2">
              {STAT_KEYS.map(key => <StatBar key={key} label={STAT_LABELS[key]} value={result.stats[key]} maxVal={300} />)}
            </div>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  VISUAL COMPARATOR SECTION (with sprites + diff highlighting)
// ═══════════════════════════════════════════════════════════════════════════════
interface CompareSlot { slug: string; quality: number; growth: number; }

function CompareCard({ label, slot, onSlotChange, otherStats }: {
  label: string; slot: CompareSlot; onSlotChange: (s: CompareSlot) => void;
  otherStats: Record<StatKey, number> | null;
}) {
  const pokemon = useMemo(() => POKEMON.find(p => p.slug === slot.slug) ?? POKEMON[0], [slot.slug]);
  const bases = useMemo(() => pokemonToBases(pokemon), [pokemon]);
  const result = useMemo(() => calcAllStats(bases, slot.growth, 100, slot.quality), [bases, slot.growth, slot.quality]);
  const power = useMemo(() => calcPower(result, slot.quality), [result, slot.quality]);

  return (
    <div className="space-y-3">
      {/* Header with sprite + name */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
        <motion.img
          key={pokemon.id}
          src={pokemonSprite(pokemon)}
          alt={pokemon.name}
          className="w-16 h-16 drop-shadow-lg"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        />
        <div className="flex-1 min-w-0">
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="font-bold text-lg truncate">{pokemon.name}</div>
          <div className="flex gap-1 mt-0.5">
            <TypeBadge type={pokemon.t1} size="sm" />
            {pokemon.t2 && <TypeBadge type={pokemon.t2} size="sm" />}
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">{power.toLocaleString()}</div>
          <div className="text-[10px] text-muted-foreground">Power</div>
        </div>
      </div>

      {/* Pokemon select */}
      <Select value={slot.slug} onValueChange={v => { if (v) onSlotChange({ ...slot, slug: v }); }}>
        <SelectTrigger className="w-full h-9"><SelectValue /></SelectTrigger>
        <SelectContent>
          {POKEMON.map(p => <SelectItem key={p.slug} value={p.slug}>{p.name}</SelectItem>)}
        </SelectContent>
      </Select>

      {/* Quality & Growth */}
      <div className="grid grid-cols-2 gap-2">
        <StatInput label="Quality" value={slot.quality} onChange={v => onSlotChange({ ...slot, quality: v })} min={0.8} max={1.8} step={0.01} />
        <StatInput label="Growth" value={slot.growth} onChange={v => onSlotChange({ ...slot, growth: v })} min={1} max={32} />
      </div>

      {/* Final stats with diff coloring */}
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground">Stats Finais (Lv 100)</p>
        {STAT_KEYS.map(key => {
          const diff = otherStats ? result[key] - otherStats[key] : 0;
          const barColor = diff > 0 ? '#22c55e' : diff < 0 ? '#ef4444' : undefined;
          return (
            <div key={key} className="flex items-center gap-2">
              <span className="w-12 text-xs text-muted-foreground font-medium">{STAT_LABELS[key]}</span>
              <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: barColor || 'hsl(var(--primary))' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((result[key] / 400) * 100, 100)}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
              <span className="w-10 text-right font-mono text-xs">{result[key]}</span>
              {otherStats && (
                <DiffCell value={result[key] - otherStats[key]} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Comparator() {
  const [slotA, setSlotA] = useState<CompareSlot>({ slug: 'bulbasaur', quality: 1.0, growth: 10 });
  const [slotB, setSlotB] = useState<CompareSlot>({ slug: 'charmander', quality: 1.0, growth: 10 });

  const pokemonA = useMemo(() => POKEMON.find(p => p.slug === slotA.slug) ?? POKEMON[0], [slotA.slug]);
  const pokemonB = useMemo(() => POKEMON.find(p => p.slug === slotB.slug) ?? POKEMON[0], [slotB.slug]);
  const basesA = useMemo(() => pokemonToBases(pokemonA), [pokemonA]);
  const basesB = useMemo(() => pokemonToBases(pokemonB), [pokemonB]);
  const statsA = useMemo(() => calcAllStats(basesA, slotA.growth, 100, slotA.quality), [basesA, slotA.growth, slotA.quality]);
  const statsB = useMemo(() => calcAllStats(basesB, slotB.growth, 100, slotB.quality), [basesB, slotB.growth, slotB.quality]);
  const powerA = useMemo(() => calcPower(statsA, slotA.quality), [statsA, slotA.quality]);
  const powerB = useMemo(() => calcPower(statsB, slotB.quality), [statsB, slotB.quality]);

  const swap = () => { setSlotA(slotB); setSlotB(slotA); };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale className="size-5 text-purple-500" />
          Comparador Visual de Pokémon
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CompareCard label="Pokémon A" slot={slotA} onSlotChange={setSlotA} otherStats={statsB} />
          <CompareCard label="Pokémon B" slot={slotB} onSlotChange={setSlotB} otherStats={statsA} />
        </div>

        {/* Swap button */}
        <div className="flex justify-center mt-4">
          <Button variant="outline" size="sm" onClick={swap}>🔄 Trocar A ↔ B</Button>
        </div>

        {/* Side-by-side stat comparison bars */}
        <AnimatePresence mode="wait">
          <motion.div key={`${slotA.slug}-${slotB.slug}-${slotA.quality}-${slotB.quality}-${slotA.growth}-${slotB.growth}`}
            variants={fadeSlide} initial="hidden" animate="visible" exit="exit" className="mt-6">
            <Card>
              <CardHeader><CardTitle>Comparação Lado a Lado</CardTitle></CardHeader>
              <CardContent>
                {/* Header row with sprites */}
                <div className="flex items-center justify-between mb-4 px-2">
                  <div className="flex items-center gap-2">
                    <img src={pokemonSprite(pokemonA)} alt={pokemonA.name} className="w-10 h-10" />
                    <span className="font-semibold text-sm">{pokemonA.name}</span>
                    <span className="text-xs font-bold text-primary">{powerA}</span>
                  </div>
                  <span className="text-muted-foreground text-lg font-bold">VS</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary">{powerB}</span>
                    <span className="font-semibold text-sm">{pokemonB.name}</span>
                    <img src={pokemonSprite(pokemonB)} alt={pokemonB.name} className="w-10 h-10" />
                  </div>
                </div>

                {/* Stat comparison bars */}
                <div className="space-y-3">
                  {STAT_KEYS.map(key => {
                    const valA = statsA[key];
                    const valB = statsB[key];
                    const maxVal = Math.max(valA, valB, 1);
                    const pctA = (valA / maxVal) * 100;
                    const pctB = (valB / maxVal) * 100;
                    const diff = valB - valA;

                    return (
                      <div key={key} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-muted-foreground">{STAT_LABELS[key]}</span>
                          <DiffCell value={diff} />
                        </div>
                        <div className="flex gap-1 items-center">
                          {/* Pokemon A bar (right-aligned) */}
                          <div className="flex-1 flex justify-end">
                            <div className="w-full h-3 rounded-full bg-muted overflow-hidden flex justify-end">
                              <motion.div
                                className="h-full rounded-full"
                                style={{ backgroundColor: diff < 0 ? '#ef4444' : diff > 0 ? '#888' : 'hsl(var(--primary))' }}
                                initial={{ width: 0 }}
                                animate={{ width: `${pctA}%` }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                              />
                            </div>
                          </div>
                          <span className="w-8 text-center font-mono text-[10px] text-muted-foreground">{valA}</span>
                          <span className="text-[10px] text-muted-foreground">|</span>
                          <span className="w-8 text-center font-mono text-[10px] text-muted-foreground">{valB}</span>
                          {/* Pokemon B bar (left-aligned) */}
                          <div className="flex-1">
                            <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
                              <motion.div
                                className="h-full rounded-full"
                                style={{ backgroundColor: diff > 0 ? '#22c55e' : diff < 0 ? '#888' : 'hsl(var(--primary))' }}
                                initial={{ width: 0 }}
                                animate={{ width: `${pctB}%` }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function CalculadoraPage() {
  return (
    <div className="py-8 space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="text-center">
        <h1 className="text-3xl font-bold mb-2">⚡ Calculadora</h1>
        <p className="text-muted-foreground">Calcule o Power dos seus Pokémon e compare estatísticas lado a lado.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <PowerCalculator />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <Comparator />
      </motion.div>
    </div>
  );
}
