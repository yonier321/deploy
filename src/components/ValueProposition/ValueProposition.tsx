const values = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
    title: '100% Hip Hop Urbano',
    description:
      'Especialización única en Colombia. Breakdance, Locking, Popping, New Style y más estilos auténticos de la cultura urbana.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    title: 'Para todas las edades',
    description:
      'Desde niños de 5 años hasta adultos mayores. Grupos por nivel y edad para garantizar un aprendizaje cómodo y efectivo.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    title: 'Comunidad real',
    description:
      'Más que clases: una familia. Eventos, batallas, viajes y conexiones que duran toda la vida dentro de la cultura hip hop.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: 'Entrena tu mente',
    description:
      'La danza urbana desarrolla disciplina, creatividad, memoria muscular y resiliencia emocional. Más que pasos: un estilo de vida.',
  },
];

export default function ValueProposition() {
  return (
    <section id="nosotros" className="relative py-28 bg-page overflow-hidden">
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, #A56ABD 0px, #A56ABD 1px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, #A56ABD 0px, #A56ABD 1px, transparent 1px, transparent 60px)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-8 mb-20 items-end">
          <div>
            <span className="font-condensed text-sm uppercase tracking-[0.3em] text-accent font-600">
              Por qué elegirnos
            </span>
            <h2 className="font-display text-[clamp(3rem,6vw,5rem)] leading-none uppercase text-text mt-3">
              MÁS QUE
              <br />
              <span className="text-accent">UNA ACADEMIA</span>
            </h2>
          </div>
          <p className="font-body text-text-soft text-lg leading-relaxed self-end">
            F&A Dance Company nació de la pasión por el Hip Hop auténtico. Somos la única
            academia en Antioquia enfocada 100% en la cultura urbana, con metodología real
            y sin atajos.
          </p>
        </div>

        {/* Values grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
          {values.map((v, i) => (
            <div
              key={i}
              className="group relative bg-page p-8 hover:bg-surface-alt transition-colors duration-300 cursor-default"
            >
              {/* Number */}
              <div className="font-display text-8xl text-accent/10 absolute top-4 right-4 leading-none select-none">
                {String(i + 1).padStart(2, '0')}
              </div>

              {/* Icon */}
              <div className="text-accent mb-6 group-hover:text-accent-strong transition-colors duration-300">
                {v.icon}
              </div>

              {/* Title */}
              <h3 className="font-condensed font-700 text-xl uppercase tracking-wider text-text mb-3 group-hover:text-accent transition-colors duration-300">
                {v.title}
              </h3>

              {/* Description */}
              <p className="font-body text-sm text-text-muted leading-relaxed">
                {v.description}
              </p>

              {/* Bottom accent */}
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}