'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Home, Map, Trophy, Target, BookOpen, Backpack,
  Calculator, ArrowUp, Users, Settings, Briefcase,
  FileText, Info, Menu, X, Sun, Moon, Search
} from 'lucide-react';

const NAV = [
  { href: '/', icon: Home, label: 'Home', section: 'Início' },
  { href: '/rota', icon: Map, label: 'Rota de Up', section: 'Guia' },
  { href: '/tierlist', icon: Trophy, label: 'Tier List' },
  { href: '/tipos', icon: Target, label: 'Tabela de Tipos' },
  { href: '/pokedex', icon: BookOpen, label: 'Pokédex' },
  { href: '/itens', icon: Backpack, label: 'Guia de Itens' },
  { href: '/calculadora', icon: Calculator, label: 'Calculadora', section: 'Ferramentas' },
  { href: '/evolucao', icon: ArrowUp, label: 'Simulador Evolução' },
  { href: '/time', icon: Users, label: 'Planejador de Time' },
  { href: '/systems', icon: Settings, label: 'Sistemas', section: 'Referência' },
  { href: '/profissoes', icon: Briefcase, label: 'Profissões' },
  { href: '/logs', icon: FileText, label: 'Logs & Versão' },
  { href: '/sobre', icon: Info, label: 'Sobre' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [navQuery, setNavQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setMounted(true), []);

  // Filter NAV links by label
  const filteredNav = useMemo(() => {
    if (!navQuery || navQuery.length < 1) return null;
    return NAV.filter(item =>
      item.label.toLowerCase().includes(navQuery.toLowerCase())
    );
  }, [navQuery]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-card border border-border md:hidden"
      >
        <Menu className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border
        transform transition-transform duration-200
        ${open ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:z-auto
      `}>
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <span className="font-bold text-lg">
              Poke<span className="text-primary">Idle</span>Guia
            </span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 md:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Search — filters NAV links */}
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Buscar páginas..."
              value={navQuery}
              onChange={e => {
                setNavQuery(e.target.value);
                setSearchOpen(e.target.value.length > 0);
              }}
              onFocus={() => { if (navQuery) setSearchOpen(true); }}
              onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <AnimatePresence>
              {searchOpen && filteredNav && filteredNav.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scaleY: 0.95 }}
                  animate={{ opacity: 1, y: 0, scaleY: 1 }}
                  exit={{ opacity: 0, y: -4, scaleY: 0.95 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 origin-top"
                >
                  {filteredNav.map(item => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-accent text-sm"
                        onClick={() => { setNavQuery(''); setSearchOpen(false); setOpen(false); }}
                      >
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        <span>{item.label}</span>
                        {item.section && (
                          <span className="ml-auto text-xs text-muted-foreground">{item.section}</span>
                        )}
                      </Link>
                    );
                  })}
                </motion.div>
              )}
              {searchOpen && filteredNav && filteredNav.length === 0 && navQuery.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 p-3 text-sm text-muted-foreground"
                >
                  Nenhum resultado para &quot;{navQuery}&quot;
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-3">
          {NAV.map((item, i) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            const showSection = item.section && (i === 0 || NAV[i - 1].section !== item.section);

            return (
              <div key={item.href}>
                {showSection && (
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-4 mb-2 px-3">
                    {item.section}
                  </div>
                )}
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
                    ${isActive
                      ? 'bg-primary text-primary-foreground font-medium'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              </div>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm"
          >
            {mounted ? (
              <>
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {theme === 'dark' ? 'Light' : 'Dark'}
              </>
            ) : (
              <>
                <Sun className="w-4 h-4" />
                Light
              </>
            )}
          </button>
          <a
            href="https://poke.idleworld.online/?ref=N9YEEGV"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block text-center py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
          >
            🎮 Jogar Agora
          </a>
        </div>
      </aside>
    </>
  );
}
