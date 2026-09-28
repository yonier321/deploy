import { useState, useEffect } from 'react';
import logoFna from '@/imports/logo-fna.png';
import ThemeToggle from '@/components/UI/ThemeToggle';
import Button from '@/components/UI/Button';

interface NavbarProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onLoginClick: () => void;
}

const navLinks = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Instructores', href: '#instructores' },
  { label: 'Sedes', href: '#sedes' },
  { label: 'Planes', href: '#planes' },
  { label: 'Alquila un aula', href: '#alquiler' },
];

export default function Navbar({ isDark, onToggleTheme, onLoginClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className={[
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-page/95 backdrop-blur-md border-b border-border'
          : 'bg-transparent',
      ].join(' ')}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => scrollTo('#inicio')} className="flex items-center gap-3 cursor-pointer">
          <img
            src={logoFna}
            alt="F&A Dance Company"
            className="h-10 w-auto object-contain"
          />
        </button>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="font-condensed font-600 text-sm uppercase tracking-widest text-text-soft hover:text-accent transition-colors duration-200 cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Right controls */}
        <div className="hidden lg:flex items-center gap-4">
          <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
          <button
            onClick={onLoginClick}
            className="font-condensed font-600 text-sm uppercase tracking-widest text-text-soft hover:text-accent transition-colors duration-200 cursor-pointer"
          >
            Iniciar sesión
          </button>
          <Button size="sm" onClick={() => scrollTo('#alquiler')}>
            Regístrate
          </Button>
        </div>

        {/* Mobile hamburger */}
        <div className="lg:hidden flex items-center gap-3">
          <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-text p-2 cursor-pointer"
            aria-label="Menu"
          >
            <div className="flex flex-col gap-1.5">
              <span
                className={[
                  'block w-6 h-0.5 bg-accent transition-all duration-300',
                  menuOpen ? 'rotate-45 translate-y-2' : '',
                ].join(' ')}
              />
              <span
                className={[
                  'block w-6 h-0.5 bg-accent transition-all duration-300',
                  menuOpen ? 'opacity-0' : '',
                ].join(' ')}
              />
              <span
                className={[
                  'block w-6 h-0.5 bg-accent transition-all duration-300',
                  menuOpen ? '-rotate-45 -translate-y-2' : '',
                ].join(' ')}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={[
          'lg:hidden overflow-hidden transition-all duration-300 bg-page/98 backdrop-blur-md border-b border-border',
          menuOpen ? 'max-h-screen py-6' : 'max-h-0',
        ].join(' ')}
      >
        <div className="flex flex-col px-6 gap-4">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="font-condensed font-700 text-xl uppercase tracking-widest text-text-soft hover:text-accent text-left transition-colors cursor-pointer"
            >
              {link.label}
            </button>
          ))}
          <div className="flex gap-3 mt-4">
            <button
              onClick={onLoginClick}
              className="flex-1 font-condensed font-600 text-sm uppercase tracking-widest border border-accent/40 text-accent py-3 hover:bg-accent/10 transition-colors cursor-pointer"
            >
              Iniciar sesión
            </button>
            <Button size="md" className="flex-1" onClick={() => scrollTo('#alquiler')}>
              Regístrate
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}