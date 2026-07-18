'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const RANKS = [
  { rank: 'E', title: 'Aprendiz', bonus: '+3%', color: '#9CA3AF' },
  { rank: 'D', title: 'Aventureiro', bonus: '+6%', color: '#6EE7B7' },
  { rank: 'C', title: 'Especialista', bonus: '+9%', color: '#93C5FD' },
  { rank: 'B', title: 'Elite', bonus: '+12%', color: '#C4B5FD' },
  { rank: 'A', title: 'Campeão', bonus: '+15%', color: '#FCD34D' },
  { rank: 'S', title: 'Mestre Pokémon', bonus: '+18%', color: '#FCA5A5' },
];

const REQUIREMENTS = [
  { evo: 'E → D', species: 50, photos: 20, defeats: '—' },
  { evo: 'D → C', species: 100, photos: 50, defeats: '200' },
  { evo: 'C → B', species: 200, photos: 150, defeats: '500' },
  { evo: 'B → A', species: 300, photos: 300, defeats: '1.000' },
  { evo: 'A → S', species: 450, photos: 600, defeats: '2.000' },
];

export default function ProfissoesPage() {
  return (
    <div className="py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2">💼 Profissões</h1>
        <p className="text-muted-foreground mb-8">Escolha uma carreira e evolua seus ranks. Atualização 18/07.</p>
      </motion.div>

      <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 mb-8">
        <strong>📅 Novidade!</strong> O Sistema de Profissões está disponível. Escolha entre Treinador de Prestígio, Botânico, Cientista e Pesquisador Pokémon (em breve).
      </div>

      {/* Profession Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">📸 Treinador de Prestígio</h3>
              <p className="text-sm text-muted-foreground">Especialista em encontrar e documentar Pokémon Shiny.</p>
              <span className="inline-block mt-2 px-2 py-0.5 rounded text-xs font-semibold bg-primary/20 text-primary">DISPONÍVEL</span>
            </CardContent>
          </Card>
        </motion.div>
        {['🌿 Botânico', '🔬 Cientista', '📖 Pesquisador Pokémon'].map((name, i) => (
          <motion.div key={name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05 }}>
            <Card className="opacity-60">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">{name}</h3>
                <p className="text-sm text-muted-foreground">Em breve.</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Ranks */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <Card className="mb-6">
          <CardHeader><CardTitle>⚔️ Mecânica: Fotografia de Shiny</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Ao entrar em combate com um Pokémon Shiny selvagem, seu treinador tira uma foto. Só <strong>30%</strong> das fotos saem boas e viram uma <strong>Rare Pokémon Picture</strong>.
            </p>
            <div className="p-3 rounded-lg bg-muted text-sm">
              💡 A Rare Picture pode ser vendida no Mark por $5.000 — mas cada foto vendida é uma foto que não sobe seu rank!
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Requirements Table */}
      <Card className="mb-6">
        <CardHeader><CardTitle>📊 Requisitos de Rank</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2">Evolução</th>
                  <th className="text-left py-2">Espécies</th>
                  <th className="text-left py-2">Fotos</th>
                  <th className="text-left py-2">Derrotas/Tipagem</th>
                </tr>
              </thead>
              <tbody>
                {REQUIREMENTS.map(r => (
                  <tr key={r.evo} className="border-b border-border/50">
                    <td className="py-2 font-semibold">{r.evo}</td>
                    <td className="py-2">{r.species}</td>
                    <td className="py-2">{r.photos}</td>
                    <td className="py-2">{r.defeats}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Capture Bonus */}
      <Card className="mb-6">
        <CardHeader><CardTitle>🎯 Bônus de Captura por Rank</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Cada rank aumenta a chance DIRETA da sua Pokébola, independentemente do tipo.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {RANKS.map(r => (
              <div key={r.rank} className="p-3 rounded-lg border border-border text-center">
                <div className="text-2xl font-bold" style={{ color: r.color }}>{r.rank}</div>
                <div className="text-xs text-muted-foreground">{r.title}</div>
                <div className="text-sm font-semibold mt-1" style={{ color: r.color }}>{r.bonus}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <footer className="mt-16 text-center text-sm text-muted-foreground pb-8">
        Guia não oficial de <a href="https://poke.idleworld.online/?ref=N9YEEGV" target="_blank" className="underline hover:text-primary">Poke Idle World</a>. Dados da Poképedia oficial.
      </footer>
    </div>
  );
}
