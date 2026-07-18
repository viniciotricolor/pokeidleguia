'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TYPE_NAMES } from '@/data/types';
import { TYPE_COLORS } from '@/lib/types';
import { TYPE_CHART } from '@/data/types';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.03 } } };
const item = { hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1 } };

export default function TiposPage() {
  return (
    <div className="py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2">🎯 Tabela de Tipos</h1>
        <p className="text-muted-foreground mb-8">18 tipos com dados 100% extraídos da Poképedia.</p>
      </motion.div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(TYPE_CHART).map(([type, data]) => (
          <motion.div key={type} variants={item}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: TYPE_COLORS[type] }} />
                  {TYPE_NAMES[type] || type}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                {data.weak.length > 0 && (
                  <div>
                    <span className="text-muted-foreground">Fraco contra: </span>
                    {data.weak.map(t => (
                      <span key={t} className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold mr-1"
                        style={{ backgroundColor: `${TYPE_COLORS[t]}22`, color: TYPE_COLORS[t] }}>
                        {TYPE_NAMES[t] || t}
                      </span>
                    ))}
                  </div>
                )}
                {data.resist.length > 0 && (
                  <div>
                    <span className="text-muted-foreground">Resistente: </span>
                    {data.resist.map(t => (
                      <span key={t} className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold mr-1"
                        style={{ backgroundColor: `${TYPE_COLORS[t]}22`, color: TYPE_COLORS[t] }}>
                        {TYPE_NAMES[t] || t}
                      </span>
                    ))}
                  </div>
                )}
                {data.immune.length > 0 && (
                  <div>
                    <span className="text-muted-foreground">Imune: </span>
                    {data.immune.map(t => (
                      <span key={t} className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold mr-1"
                        style={{ backgroundColor: `${TYPE_COLORS[t]}22`, color: TYPE_COLORS[t] }}>
                        {TYPE_NAMES[t] || t}
                      </span>
                    ))}
                  </div>
                )}
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
