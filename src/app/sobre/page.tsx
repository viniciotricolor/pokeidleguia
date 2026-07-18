'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

export default function SobrePage() {
  return (
    <div className="py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2">ℹ️ Sobre</h1>
        <p className="text-muted-foreground mb-8">Sobre o Poke Idle Guia.</p>
      </motion.div>

      <Card className="mb-6">
        <CardContent className="p-6 space-y-4">
          <p className="text-muted-foreground">
            O <strong>Poke Idle Guia</strong> é um guia não oficial criado por fãs do{' '}
            <a href="https://poke.idleworld.online/?ref=N9YEEGV" target="_blank" className="underline hover:text-primary">
              Poke Idle World
            </a>.
          </p>
          <p className="text-muted-foreground">
            Todos os dados são extraídos diretamente da{' '}
            <a href="https://poke.idleworld.online/pokepedia" target="_blank" className="underline hover:text-primary">
              Poképedia oficial
            </a>{' '}
            do jogo. Cobrimos Geração 1 + 2 — 250 Pokémon com stats completos, 18 tipos de batalha, sistemas de Power/Quality/Growth e mais.
          </p>
          <p className="text-muted-foreground">
            Tech stack: Next.js, React, Tailwind CSS, shadcn/ui, Framer Motion.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-3">🔗 Links Úteis</h3>
          <div className="space-y-2 text-sm">
            <a href="https://poke.idleworld.online/?ref=N9YEEGV" target="_blank" className="block text-primary hover:underline">🎮 Jogar Poke Idle World</a>
            <a href="https://poke.idleworld.online/pokepedia" target="_blank" className="block text-primary hover:underline">📖 Poképedia Oficial</a>
            <a href="https://github.com/viniciotricolor/pokeidleguia" target="_blank" className="block text-primary hover:underline">💻 Código Fonte (GitHub)</a>
          </div>
        </CardContent>
      </Card>

      <footer className="mt-16 text-center text-sm text-muted-foreground pb-8">
        Guia não oficial de <a href="https://poke.idleworld.online/?ref=N9YEEGV" target="_blank" className="underline hover:text-primary">Poke Idle World</a>. Dados da Poképedia oficial.
      </footer>
    </div>
  );
}
