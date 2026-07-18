'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

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

export default function EvolucaoPage() {
  const [evoLevel, setEvoLevel] = useState(50);
  const [retention, setRetention] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(30);
  const [targetLevel, setTargetLevel] = useState(50);

  const evoCost = Math.round(evoLevel * evoLevel * 500 * RETENTION.find(r => r.pct === retention)!.mult);
  const xpNeeded = Math.max(0, xpToLevel(targetLevel) - xpToLevel(currentLevel));

  return (
    <div className="py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2">⬆️ Simulador de Evolução & XP</h1>
        <p className="text-muted-foreground mb-8">Calcule custos de evolução e quanto XP falta.</p>
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
                    {RETENTION.map(r => (
                      <SelectItem key={r.pct} value={String(r.pct)}>{r.label}</SelectItem>
                    ))}
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
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-8">
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

      <footer className="mt-16 text-center text-sm text-muted-foreground pb-8">
        Guia não oficial de <a href="https://poke.idleworld.online/?ref=N9YEEGV" target="_blank" className="underline hover:text-primary">Poke Idle World</a>. Dados da Poképedia oficial.
      </footer>
    </div>
  );
}
