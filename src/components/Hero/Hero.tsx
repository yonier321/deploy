import { useEffect, useRef } from 'react';
import Button from '@/components/UI/Button';

export default function Hero() {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!textRef.current) return;
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 16;
      const y = (e.clientY / innerHeight - 0.5) * 8;
      textRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="inicio" className="relative min-h-screen flex items-center overflow-hidden bg-page">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1761882619891-6529ff92df0a?w=1400&h=900&fit=crop&auto=format"
          alt="Hip hop dancer performing in studio"
          className="w-full h-full object-cover object-center opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-page via-page/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-page via-transparent to-transparent" />
      </div>

      {/* Purple accent glow */}
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-60 h-60 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24 grid lg:grid-cols-2 gap-12 items-center">
        <div ref={textRef} className="transition-transform duration-75 ease-out">
          {/* Label */}
          <div className="flex items-center gap-3 mb-6">
            <span className="block w-8 h-px bg-accent" />
            <span className="font-condensed text-sm uppercase tracking-[0.3em] text-accent font-600">
              Academia de Hip Hop Urbano
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-[clamp(4rem,10vw,8rem)] leading-none uppercase text-text mb-6">
            BAILAMOS
            <br />
            <span className="text-accent">SIN</span>
            <br />
            LÍMITES
          </h1>

          {/* Subtext */}
          <p className="font-body text-text-soft text-lg leading-relaxed max-w-md mb-10">
            La única academia especializada 100% en Hip Hop urbano. Entrena con los mejores,
            expresa quién eres y transforma tu vida a través del movimiento.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" onClick={() => scrollTo('#alquiler')}>
              Regístrate ahora
            </Button>
            <Button size="lg" variant="outline" onClick={() => scrollTo('#nosotros')}>
              Conoce más
            </Button>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-14 pt-8 border-t border-accent/20">
            {[
              { value: '500+', label: 'Estudiantes activos' },
              { value: '8+', label: 'Años de experiencia' },
              { value: '2', label: 'Sedes en Antioquia' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-3xl text-accent">{stat.value}</div>
                <div className="font-condensed text-xs uppercase tracking-wider text-text-muted mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side — secondary image */}
        <div className="hidden lg:block relative">
          <div className="relative ml-auto w-[420px] h-[560px]">
            <img
              src="https://images.unsplash.com/flagged/photo-1562053690-62f7812fd0de?w=840&h=1120&fit=crop&auto=format"
              alt="Urban dancer in front of graffiti wall"
              className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
            />
            {/* Overlay corner accent */}
            <div className="absolute -bottom-4 -left-4 w-24 h-24 border-l-2 border-b-2 border-accent" />
            <div className="absolute -top-4 -right-4 w-24 h-24 border-r-2 border-t-2 border-accent-strong" />
            {/* Tag */}
            <div className="absolute bottom-6 right-0 translate-x-6 bg-accent px-4 py-2">
              <span className="font-condensed text-xs uppercase tracking-widest text-on-accent">
                Est. 2016
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="font-condensed text-xs uppercase tracking-widest text-accent/60">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-accent/60 to-transparent" />
      </div>
    </section>
  );
}