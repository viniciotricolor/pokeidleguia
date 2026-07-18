'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ITEMS = [
  { cat: 'Pokébolas', items: [
    { name: 'Poké Ball', desc: 'Captura básica. 1x de chance.' },
    { name: 'Great Ball', desc: '1.5x de chance. Boa pra Pokémon comuns.' },
    { name: 'Ultra Ball', desc: '2x de chance. Padrão pra mid-game.' },
    { name: 'Master Ball', desc: '100% de chance. Uma só. Use com sabedoria.' },
  ]},
  { cat: 'Berries', items: [
    { name: 'Oran Berry', desc: 'Cura 30 HP em batalha.' },
    { name: 'Sitrus Berry', desc: 'Cura 50 HP em batalha.' },
    { name: 'Leba Berry', desc: 'Aumenta defesa em 1 estágio.' },
    { name: 'Lum Berry', desc: 'Cura status negativos.' },
  ]},
  { cat: 'Evolução', items: [
    { name: 'Fire Stone', desc: 'Evolui Vulpix → Ninetales, Growlithe → Arcanine.' },
    { name: 'Water Stone', desc: 'Evolui Poliwhirl → Poliwrath, Shellder → Cloyster.' },
    { name: 'Thunder Stone', desc: 'Evolui Pikachu → Raichu, Eevee → Jolteon.' },
    { name: 'Moon Stone', desc: 'Evolui Clefairy → Clefable, Jigglypuff → Wigglytuff.' },
  ]},
];

export default function ItensPage() {
  return (
    <div className="py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2">🎒 Guia de Itens</h1>
        <p className="text-muted-foreground mb-8">Itens disponíveis no Poke Idle World.</p>
      </motion.div>

      <div className="space-y-6">
        {ITEMS.map((cat, i) => (
          <motion.div
            key={cat.cat}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card>
              <CardHeader><CardTitle>{cat.cat}</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {cat.items.map(item => (
                    <div key={item.name} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center shrink-0 text-sm">
                        {cat.cat === 'Pokébolas' ? '🔴' : cat.cat === 'Berries' ? '🫐' : '💎'}
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.desc}</div>
                      </div>
                    </div>
                  ))}
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
