'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Map } from 'lucide-react';

const ROUTES = [
  { level: '1-10', location: 'Route 1 (Kanto)', pokemon: 'Pidgey, Rattata, Caterpie', tip: 'Foque em evolve starters' },
  { level: '10-25', location: 'Route 4 (Kanto)', pokemon: 'Sandshrew, Spearow, Ekans', tip: 'Pikachu aparece raro aqui' },
  { level: '25-40', location: 'Route 8 (Kanto)', pokemon: 'Abra, Machop, Magnemite', tip: 'Boa pra XP e rare spawns' },
  { level: '40-60', location: 'Route 12 (Kanto)', pokemon: 'Oddish, Pidgey, Spearow', tip: 'Farming de evoluções' },
  { level: '60-80', location: 'Route 15 (Kanto)', pokemon: 'Pidgeotto, Raticate, Fearow', tip: 'Pokémon de nível alto' },
  { level: '80-100', location: 'Route 23 (Kanto)', pokemon: 'Sandslash, Machoke, Magneton', tip: 'Pré-Elite Four' },
  { level: '100+', location: 'Victory Road', pokemon: 'Machoke, Graveler, Onix', tip: 'Farm final antes do Elite Four' },
  { level: '100+', location: 'Silver Cave (Johto)', pokemon: 'Tyranitar, Ursaring, Magneton', tip: 'Endgame farm' },
];

export default function RotaPage() {
  return (
    <div className="py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2">🗺️ Rota de Up</h1>
        <p className="text-muted-foreground mb-8">Melhores locais pra farmar XP por nível.</p>
      </motion.div>

      <div className="space-y-4">
        {ROUTES.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card>
              <CardContent className="flex items-start gap-4 p-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Map className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm font-bold text-primary">{r.level}</span>
                    <span className="font-semibold">{r.location}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{r.pokemon}</p>
                  <p className="text-xs text-muted-foreground mt-1">💡 {r.tip}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <footer className="mt-16 text-center text-sm text-muted-foreground pb-8">
        Guia não oficial de <a href="https://poke.idleworld.online/?ref=N9YEEGV" target="_blank" className="underline hover:text-primary">Poke Idle World</a>. Dados da Poképedia oficial.
      </footer>
    </div>
  );
}
