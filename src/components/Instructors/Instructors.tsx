import { useRef, useState } from 'react';
import Button from '@/components/UI/Button';

const instructors = [
  {
    name: 'Carlos "Krazy" Vélez',
    specialty: 'Breaking & Power Moves',
    description:
      'Campeón nacional de Breaking, 12 años de experiencia en competencias internacionales. Formado en la escuela neoyorquina.',
    img: 'https://images.unsplash.com/photo-1769535348339-b004086b6809?w=400&h=400&fit=crop&auto=format',
  },
  {
    name: 'Valentina "Flame" Reyes',
    specialty: 'New Style & Coreografía',
    description:
      'Coreógrafa y bailarina con presentaciones en festivales de toda Latinoamérica. Especialista en fusión urbana contemporánea.',
    img: 'https://images.unsplash.com/photo-1759720107956-1cbad755e952?w=400&h=400&fit=crop&auto=format',
  },
  {
    name: 'Andrés "Flex" Montoya',
    specialty: 'Popping & Locking',
    description:
      'Referente del Popping en Colombia, discípulo directo de maestros de la Costa Oeste. Instructor certificado internacionalmente.',
    img: 'https://images.unsplash.com/photo-1724439692201-b991c941709f?w=400&h=400&fit=crop&auto=format',
  },
  {
    name: 'Daniela "Storm" García',
    specialty: 'Freestyle & Krump',
    description:
      'Finalista del Battle of the Year Colombia 2022. Especialista en movimiento libre, expresión corporal y entrenamiento mental.',
    img: 'https://images.unsplash.com/photo-1777158375313-60eb6dc76413?w=400&h=400&fit=crop&auto=format',
  },
];

export default function Instructors() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
  };

  return (
    <section id="instructores" className="relative py-28 bg-surface-alt overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
          <div>
            <span className="font-condensed text-sm uppercase tracking-[0.3em] text-accent font-600">
              El equipo
            </span>
            <h2 className="font-display text-[clamp(3rem,6vw,5rem)] leading-none uppercase text-text mt-3">
              NUESTROS
              <br />
              <span className="text-accent">INSTRUCTORES</span>
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => scroll('left')}
              className="w-12 h-12 border border-accent text-accent hover:bg-accent hover:text-on-accent transition-all duration-200 flex items-center justify-center cursor-pointer"
              aria-label="Anterior"
            >
              ←
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-12 h-12 border border-accent text-accent hover:bg-accent hover:text-on-accent transition-all duration-200 flex items-center justify-center cursor-pointer"
              aria-label="Siguiente"
            >
              →
            </button>
          </div>
        </div>

        {/* Horizontal scroll */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none' }}
        >
          {instructors.map((inst, i) => (
            <div
              key={i}
              onMouseEnter={() => setActiveIdx(i)}
              onMouseLeave={() => setActiveIdx(null)}
              className="group flex-shrink-0 snap-start w-72 lg:w-80 cursor-pointer"
            >
              {/* Image container */}
              <div className="relative overflow-hidden mb-6">
                <div className="w-full aspect-[3/4] bg-surface">
                  <img
                    src={inst.img}
                    alt={inst.name}
                    className={[
                      'w-full h-full object-cover transition-all duration-700',
                      activeIdx === i ? 'scale-105 grayscale-0' : 'grayscale-[30%]',
                    ].join(' ')}
                  />
                </div>
                {/* Overlay */}
                <div
                  className={[
                    'absolute inset-0 bg-accent/30 transition-opacity duration-300',
                    activeIdx === i ? 'opacity-100' : 'opacity-0',
                  ].join(' ')}
                />
                {/* Specialty tag */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#120D16] to-transparent pt-12 pb-4 px-4">
                  <span className="font-condensed text-xs uppercase tracking-widest text-purple-300">
                    {inst.specialty}
                  </span>
                </div>
              </div>

              {/* Info */}
              <h3 className="font-condensed font-700 text-xl uppercase text-text mb-2 group-hover:text-accent transition-colors duration-200">
                {inst.name}
              </h3>
              <p className="font-body text-sm text-text-muted leading-relaxed">
                {inst.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Button variant="outline" size="lg">
            Ver todos los instructores
          </Button>
        </div>
      </div>
    </section>
  );
}