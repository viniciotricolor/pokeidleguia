'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SYSTEMS = [
  { title: '⚡ Power', desc: 'Power = (HP + Atk + Def + SpAtk + SpDef + Spd) × Quality. A métrica principal de poder do Pokémon.' },
  { title: '💎 Quality', desc: '11 bandas de 0.8 a 1.8. Aparece DUAS vezes (dentro do stat e no Power final). Dominante sobre IV.' },
  { title: '📈 Growth', desc: 'IV de 1 a 32 por stat. Cresce linearmente mas pesa menos que Quality por causa da fórmula exponencial.' },
  { title: '🎯 Tipos', desc: '18 tipos com efetividade: super efetivo (×2), pouco efetivo (×0.5), sem efeito (×0).' },
  { title: '⬆️ Evolução', desc: 'Custo = nível² × 500. 5 tiers de retenção: 0% a 100% com multiplicadores de ×1 a ×6.' },
  { title: '📸 Profissões', desc: 'Escolha uma carreira: Treinador de Prestígio, Botânico, Cientista, Pesquisador.' },
  { title: '🏆 Clans', desc: '10 clans disponíveis. Junte-se a um pra ganhar bônus de XP e habilidades exclusivas.' },
  { title: '🎒 Itens', desc: 'Pokébolas, berries, evolução items, battle items e mais. Cada um com efeito único.' },
  { title: '🔄 Reroll', desc: 'Reroll de stats com diamonds. Risco de perder quality se não usar lock.' },
  { title: '🛡️ Held Items', desc: 'Itens equipáveis que dão bônus passivos. Essenciais pra builds otimizadas.' },
  { title: '🌍 Mapas', desc: 'Múltiplas regiões com Pokémon exclusivos e rotas de farm por nível.' },
  { title: '⚔️ Batalha', desc: 'Sistema de turnos com vantagem de tipo, crítico e habilidades especiais.' },
];

export default function SystemsPage() {
  return (
    <div className="py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2">⚙️ Sistemas do Jogo</h1>
        <p className="text-muted-foreground mb-8">Todas as mecânicas do Poke Idle World explicadas.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {SYSTEMS.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
          >
            <Card className="h-full">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <footer className="mt-16 text-center text-sm text-muted-foreground pb-8">
        Guia não oficial de <a href="https://poke.idleworld.online/?ref=N9YEEGV" target="_blank" className="underline hover:text-primary">Poke Idle World</a>. Dados da Poképedia oficial.
      </footer>
    </div>
  );
}
