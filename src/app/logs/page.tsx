'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

const LOGS = [
  {
    version: 'v2.1',
    date: '18/07/2026',
    title: 'Sistema de Profissões',
    items: ['Nova página: Profissões (Treinador de Prestígio completo)', 'Sidebar: link Profissões adicionado', 'Logs & Versão criada'],
    color: '#F97316',
  },
  {
    version: 'v2.0',
    date: '17/07/2026',
    title: 'Atualização Full Wiki',
    items: [
      'POKEMON array: 250 com stats individuais reais da Poképedia',
      'Tier List data-driven (antes hardcoded com erros)',
      'Comparador usa stats individuais (antes hardcoded)',
      'Fairy type adicionado ao sistema completo',
      'Lugia tipo corrigido (ACO → VOA)',
      'Pokédex: filtros completos 18 tipos',
      'Acentos PT-BR em todas as páginas',
      'Favicon + hero counter dinâmico',
    ],
    color: '#10B981',
  },
];

export default function LogsPage() {
  return (
    <div className="py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2">📋 Logs & Versão</h1>
        <p className="text-muted-foreground mb-8">Histórico de atualizações do Poke Idle Guia.</p>
      </motion.div>

      <div className="space-y-6">
        {LOGS.map((log, i) => (
          <motion.div
            key={log.version}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card style={{ borderLeftWidth: 3, borderLeftColor: log.color }}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-bold">🚀 {log.version} — {log.title}</h2>
                  <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: `${log.color}22`, color: log.color }}>
                    {log.date}
                  </span>
                </div>
                <ul className="space-y-1">
                  {log.items.map((item, j) => (
                    <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="mt-6 opacity-60">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold">🔮 Próximas</h2>
            <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">EM BREVE</span>
          </div>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Profissões: Botânico, Cientista, Pesquisador Pokémon</li>
            <li>• Árvore de Talentos do Treinador de Prestígio</li>
            <li>• Mais dados da wiki</li>
          </ul>
        </CardContent>
      </Card>

      <footer className="mt-16 text-center text-sm text-muted-foreground pb-8">
        Guia não oficial de <a href="https://poke.idleworld.online/?ref=N9YEEGV" target="_blank" className="underline hover:text-primary">Poke Idle World</a>. Dados da Poképedia oficial.
      </footer>
    </div>
  );
}
