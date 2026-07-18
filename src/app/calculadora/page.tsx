'use client';

import { useState, useMemo, useCallback, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { POKEMON } from '@/data/pokemon';
import type { Pokemon } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Zap, Scale } from 'lucide-react';

// ─── Constants ───────────────────────────────────────────────────────────────
const STAT_EXP: Record<string, number> = {
  hp: 0.95,
  atk: 0.8,
  def: 0.8,
  spAtk: 0.8,
  spDef: 0.8,
  speed: 0.95,
};

const STAT_KEYS = ['hp', 'atk', 'def', 'spAtk', 'spDef', 'speed'] as const;
const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  atk: 'Atk',
  def: 'Def',
  spAtk: 'SpAtk',
  spDef: 'SpDef',
  speed: 'Speed',
};

type StatKey = (typeof STAT_KEYS)[number];

// ─── Calculation helpers ─────────────────────────────────────────────────────
function calcStat(
  base: number,
  growth: number,
  level: number,
  quality: number,
  exp: number,
): number {
  return Math.round((base + 2 * growth) * (level / 100) * Math.pow(quality, exp));
}

function calcPower(stats: Record<StatKey, number>, quality: number): number {
  const total = Object.values(stats).reduce((a, b) => a + b, 0);
  return Math.round(total * quality);
}

function calcAllStats(
  bases: Record<StatKey, number>,
  growth: number,
  level: number,
  quality: number,
): Record<StatKey, number> {
  const result = {} as Record<StatKey, number>;
  for (const key of STAT_KEYS) {
    result[key] = calcStat(bases[key], growth, level, quality, STAT_EXP[key]);
  }
  return result;
}

function pokemonToBases(p: Pokemon): Record<StatKey, number> {
  return { hp: p.hp, atk: p.atk, def: p.def, spAtk: p.spatk, spDef: p.spdef, speed: p.spd };
}

// ─── Motion variants ─────────────────────────────────────────────────────────
const fadeSlide = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

// ─── Shared input component ──────────────────────────────────────────────────
function StatInput({
  label,
  value,
  onChange,
  min,
  max,
  step,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <Input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step ?? 1}
        onChange={(e) => {
          const n = parseFloat(e.target.value);
          if (!isNaN(n)) onChange(n);
        }}
        className="h-9"
      />
    </div>
  );
}

// ─── Stat bar for visual flair ───────────────────────────────────────────────
function StatBar({ label, value, maxVal }: { label: string; value: number; maxVal: number }) {
  const pct = Math.min((value / maxVal) * 100, 100);
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-12 text-xs text-muted-foreground font-medium">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      <span className="w-10 text-right font-mono text-xs">{value}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  POWER CALCULATOR SECTION
// ═══════════════════════════════════════════════════════════════════════════════
function PowerCalculator() {
  const [bases, setBases] = useState<Record<StatKey, number>>({
    hp: 45, atk: 49, def: 49, spAtk: 65, spDef: 65, speed: 45,
  });
  const [quality, setQuality] = useState(1.0);
  const [growth, setGrowth] = useState(10);
  const [level, setLevel] = useState(100);

  const setBase = useCallback((key: StatKey, val: number) => {
    setBases((prev) => ({ ...prev, [key]: val }));
  }, []);

  const result = useMemo(() => {
    const stats = calcAllStats(bases, growth, level, quality);
    const power = calcPower(stats, quality);
    return { stats, power };
  }, [bases, growth, level, quality]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="size-5 text-yellow-500" />
          Calculadora de Power
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Inputs grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {STAT_KEYS.map((key) => (
            <StatInput
              key={key}
              label={STAT_LABELS[key]}
              value={bases[key]}
              onChange={(v) => setBase(key, v)}
              min={1}
              max={255}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <StatInput
            label="Quality"
            value={quality}
            onChange={setQuality}
            min={0.8}
            max={1.8}
            step={0.01}
          />
          <StatInput
            label="Growth"
            value={growth}
            onChange={setGrowth}
            min={1}
            max={32}
          />
          <StatInput
            label="Level"
            value={level}
            onChange={setLevel}
            min={1}
            max={999}
          />
        </div>

        {/* Results */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${quality}-${growth}-${level}-${JSON.stringify(bases)}`}
            variants={fadeSlide}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-4"
          >
            {/* Power result */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-primary/10 border border-primary/20">
              <span className="text-sm font-medium text-muted-foreground">Power Total</span>
              <span className="text-3xl font-bold text-primary">{result.power.toLocaleString()}</span>
            </div>

            {/* Individual stats */}
            <div className="space-y-2">
              {STAT_KEYS.map((key) => (
                <StatBar
                  key={key}
                  label={STAT_LABELS[key]}
                  value={result.stats[key]}
                  maxVal={300}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  COMPARATOR SECTION
// ═══════════════════════════════════════════════════════════════════════════════
interface CompareSlot {
  slug: string;
  quality: number;
  growth: number;
}

function defaultSlot(): CompareSlot {
  return { slug: POKEMON[0]?.slug ?? 'bulbasaur', quality: 1.0, growth: 10 };
}

function CompareCard({
  label,
  slot,
  onSlotChange,
}: {
  label: string;
  slot: CompareSlot;
  onSlotChange: (s: CompareSlot) => void;
}) {
  const pokemon = useMemo(
    () => POKEMON.find((p) => p.slug === slot.slug) ?? POKEMON[0],
    [slot.slug],
  );
  const bases = useMemo(() => pokemonToBases(pokemon), [pokemon]);
  const result = useMemo(
    () => calcAllStats(bases, slot.growth, 100, slot.quality),
    [bases, slot.growth, slot.quality],
  );
  const power = useMemo(() => calcPower(result, slot.quality), [result, slot.quality]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg font-semibold">{label}:</span>
        <span className="text-lg font-bold text-primary">{pokemon.name}</span>
        <span className="ml-auto text-sm font-bold text-primary">⚡ {power.toLocaleString()}</span>
      </div>

      {/* Pokemon select */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">Pokémon</label>
        <Select value={slot.slug} onValueChange={(v) => { if (v) onSlotChange({ ...slot, slug: v }); }}>
          <SelectTrigger className="w-full h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {POKEMON.map((p) => (
              <SelectItem key={p.slug} value={p.slug}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Quality & Growth */}
      <div className="grid grid-cols-2 gap-3">
        <StatInput
          label="Quality"
          value={slot.quality}
          onChange={(v) => onSlotChange({ ...slot, quality: v })}
          min={0.8}
          max={1.8}
          step={0.01}
        />
        <StatInput
          label="Growth"
          value={slot.growth}
          onChange={(v) => onSlotChange({ ...slot, growth: v })}
          min={1}
          max={32}
        />
      </div>

      {/* Base stats */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">Stats Base</p>
        <div className="space-y-1">
          {STAT_KEYS.map((key) => (
            <StatBar key={key} label={STAT_LABELS[key]} value={bases[key]} maxVal={255} />
          ))}
        </div>
      </div>

      {/* Final stats */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">
          Stats Finais (Lv 100)
        </p>
        <div className="space-y-1">
          {STAT_KEYS.map((key) => (
            <StatBar key={key} label={STAT_LABELS[key]} value={result[key]} maxVal={400} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Comparator() {
  const [slotA, setSlotA] = useState<CompareSlot>(() => ({
    slug: 'bulbasaur',
    quality: 1.0,
    growth: 10,
  }));
  const [slotB, setSlotB] = useState<CompareSlot>(() => ({
    slug: 'charmander',
    quality: 1.0,
    growth: 10,
  }));

  const pokemonA = useMemo(() => POKEMON.find((p) => p.slug === slotA.slug) ?? POKEMON[0], [slotA.slug]);
  const pokemonB = useMemo(() => POKEMON.find((p) => p.slug === slotB.slug) ?? POKEMON[0], [slotB.slug]);

  const basesA = useMemo(() => pokemonToBases(pokemonA), [pokemonA]);
  const basesB = useMemo(() => pokemonToBases(pokemonB), [pokemonB]);

  const statsA = useMemo(() => calcAllStats(basesA, slotA.growth, 100, slotA.quality), [basesA, slotA.growth, slotA.quality]);
  const statsB = useMemo(() => calcAllStats(basesB, slotB.growth, 100, slotB.quality), [basesB, slotB.growth, slotB.quality]);

  const powerA = useMemo(() => calcPower(statsA, slotA.quality), [statsA, slotA.quality]);
  const powerB = useMemo(() => calcPower(statsB, slotB.quality), [statsB, slotB.quality]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale className="size-5 text-purple-500" />
          Comparador de Pokémon
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Slot A */}
          <CompareCard
            label="Pokémon A"
            slot={slotA}
            onSlotChange={setSlotA}
          />

          {/* Slot B */}
          <CompareCard
            label="Pokémon B"
            slot={slotB}
            onSlotChange={setSlotB}
          />
        </div>

        {/* Diff table */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${slotA.slug}-${slotB.slug}-${slotA.quality}-${slotB.quality}-${slotA.growth}-${slotB.growth}`}
            variants={fadeSlide}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="mt-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Diferença</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-[1fr_3rem_3rem_3rem] gap-x-2 gap-y-1 text-sm items-center">
                  {/* Header */}
                  <span className="text-xs font-medium text-muted-foreground">Stat</span>
                  <span className="text-xs font-medium text-muted-foreground text-center">A</span>
                  <span className="text-xs font-medium text-muted-foreground text-center">B</span>
                  <span className="text-xs font-medium text-muted-foreground text-center">Diff</span>

                  {/* Power row */}
                  <span className="font-semibold">Power</span>
                  <span className="text-center font-mono">{powerA}</span>
                  <span className="text-center font-mono">{powerB}</span>
                  <DiffCell value={powerB - powerA} />

                  {/* Stat rows */}
                  {STAT_KEYS.map((key) => {
                    const diff = statsB[key] - statsA[key];
                    return (
                      <Fragment key={key}>
                        <span className="text-muted-foreground">{STAT_LABELS[key]}</span>
                        <span className="text-center font-mono">{statsA[key]}</span>
                        <span className="text-center font-mono">{statsB[key]}</span>
                        <DiffCell value={diff} />
                      </Fragment>
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

// ─── Diff cell with color ────────────────────────────────────────────────────
function DiffCell({ value }: { value: number }) {
  const color =
    value > 0 ? 'text-emerald-500' : value < 0 ? 'text-red-500' : 'text-muted-foreground';
  const sign = value > 0 ? '+' : '';
  return (
    <span className={`text-center font-mono text-xs ${color}`}>
      {sign}{value}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function CalculadoraPage() {
  return (
    <div className="py-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold mb-2">
          ⚡ Calculadora
        </h1>
        <p className="text-muted-foreground">
          Calcule o Power dos seus Pokémon e compare estatísticas lado a lado.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <PowerCalculator />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Comparator />
      </motion.div>
    </div>
  );
}
