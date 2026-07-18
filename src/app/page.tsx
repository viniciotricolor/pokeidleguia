'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { POKEMON } from '@/data/pokemon';
import { TYPE_NAMES } from '@/data/types';
import { TYPE_COLORS } from '@/lib/types';
import { Trophy, Map, Calculator, BookOpen, ArrowUp, Users, Settings, Briefcase } from 'lucide-react';

const FEATURES = [
  { href: '/tierlist', icon: Trophy, title: 'Tier List', desc: 'Classificação S/A/B/C/D por stats base', color: '#F59E0B' },
  { href: '/rota', icon: Map, title: 'Rota de Up', desc: 'Melhores rotas pra farmar XP', color: '#10B981' },
  { href: '/calculadora', icon: Calculator, title: 'Calculadora', desc: 'Calcule Power e compare Pokémon', color: '#6366F1' },
  { href: '/pokedex', icon: BookOpen, title: 'Pokédex', desc: '250 Pokémon com stats completos', color: '#EF4444' },
  { href: '/evolucao', icon: ArrowUp, title: 'Simulador Evolução', desc: 'Custos e retenção de evolução', color: '#8B5CF6' },
  { href: '/time', icon: Users, title: 'Planejador de Time', desc: 'Monte seu time ideal', color: '#3B82F6' },
  { href: '/systems', icon: Settings, title: 'Sistemas', desc: 'Power, Quality, Growth, Tipos', color: '#64748B' },
  { href: '/profissoes', icon: Briefcase, title: 'Profissões', desc: 'Treinador de Prestígio e mais', color: '#F97316' },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Home() {
  return (
    <div className="py-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <div className="text-6xl mb-4">⚡</div>
        <h1 className="text-4xl font-bold mb-3">
          Poke<span className="text-primary">Idle</span>Guia
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto mb-6">
          Guia completo com dados reais da Poképedia: tier list, rotas de up, calculadoras e todas as mecânicas.
        </p>
        <div className="flex justify-center gap-8 mb-8">
          <div className="text-center">
            <div className="text-2xl font-bold">{POKEMON.length}</div>
            <div className="text-sm text-muted-foreground">Pokémon</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{Object.keys(TYPE_NAMES).length}</div>
            <div className="text-sm text-muted-foreground">Tipos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">12</div>
            <div className="text-sm text-muted-foreground">Sistemas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">10</div>
            <div className="text-sm text-muted-foreground">Clans</div>
          </div>
        </div>
        <a
          href="https://poke.idleworld.online/?ref=N9YEEGV"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
        >
          🎮 Jogar Poke Idle World
        </a>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {FEATURES.map(f => {
          const Icon = f.icon;
          return (
            <motion.div key={f.href} variants={item}>
              <Link
                href={f.href}
                className="block p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors group"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${f.color}20` }}
                >
                  <Icon className="w-5 h-5" style={{ color: f.color }} />
                </div>
                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Type chips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-12 text-center"
      >
        <p className="text-sm text-muted-foreground mb-3">18 tipos de batalha</p>
        <div className="flex flex-wrap justify-center gap-2">
          {Object.entries(TYPE_NAMES).map(([key, name]) => (
            <Link
              key={key}
              href={`/tipos#${key}`}
              className="px-3 py-1 rounded-full text-xs font-medium transition-transform hover:scale-105"
              style={{ backgroundColor: `${TYPE_COLORS[key]}22`, color: TYPE_COLORS[key] }}
            >
              {name}
            </Link>
          ))}
        </div>
      </motion.div>

      <footer className="mt-16 text-center text-sm text-muted-foreground pb-8">
        Guia não oficial de{' '}
        <a href="https://poke.idleworld.online/?ref=N9YEEGV" target="_blank" className="underline hover:text-primary">
          Poke Idle World
        </a>. Dados da Poképedia oficial.
      </footer>
    </div>
  );
}
