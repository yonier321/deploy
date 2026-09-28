import Button from '@/components/UI/Button';

const locations = [
  {
    name: 'BELLO',
    address: 'Calle 33 #48-12, Bello, Antioquia',
    schedule: 'Lun – Sáb · 7:00 AM – 9:00 PM',
    description:
      'Nuestra sede principal, con 3 salones equipados, espejos profesionales, sistema de sonido de alta fidelidad y zona de entrenamiento libre.',
    img: 'https://images.unsplash.com/photo-1783824246318-0d06b33b3d1d?w=800&h=600&fit=crop&auto=format',
    tag: 'Sede principal',
  },
  {
    name: 'COPACABANA',
    address: 'Carrera 50 #21-80, Copacabana, Antioquia',
    schedule: 'Lun – Sáb · 8:00 AM – 8:00 PM',
    description:
      'Sede moderna con 2 salones de práctica, aire acondicionado, vestieres y estacionamiento propio para un entrenamiento sin contratiempos.',
    img: 'https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?w=800&h=600&fit=crop&auto=format',
    tag: 'Nueva sede',
  },
];

export default function Locations() {
  return (
    <section id="sedes" className="relative py-28 bg-page overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16">
          <span className="font-condensed text-sm uppercase tracking-[0.3em] text-accent font-600">
            Dónde entrenar
          </span>
          <h2 className="font-display text-[clamp(3rem,6vw,5rem)] leading-none uppercase text-text mt-3">
            NUESTRAS
            <br />
            <span className="text-accent">SEDES</span>
          </h2>
        </div>

        {/* Locations grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {locations.map((loc, i) => (
            <div key={i} className="group relative overflow-hidden cursor-pointer">
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-surface-alt">
                <img
                  src={loc.img}
                  alt={`Sede ${loc.name}`}
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-page via-page/40 to-transparent" />

                {/* Tag */}
                <div className="absolute top-4 left-4">
                  <span className="bg-accent font-condensed text-xs uppercase tracking-widest text-on-accent px-3 py-1">
                    {loc.tag}
                  </span>
                </div>

                {/* Name over image */}
                <div className="absolute bottom-6 left-6">
                  <h3 className="font-display text-5xl text-purple-50 leading-none drop-shadow-lg">{loc.name}</h3>
                </div>
              </div>

              {/* Info */}
              <div className="bg-surface p-6 border border-border border-t-0">
                <div className="flex flex-col gap-3 mb-4">
                  <div className="flex items-center gap-2 text-text-soft">
                    <svg className="w-4 h-4 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <span className="font-body text-sm">{loc.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-text-soft">
                    <svg className="w-4 h-4 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-body text-sm">{loc.schedule}</span>
                  </div>
                </div>

                <p className="font-body text-sm text-text-muted leading-relaxed mb-5">
                  {loc.description}
                </p>

                <Button variant="outline" size="sm">
                  Ver sede →
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}