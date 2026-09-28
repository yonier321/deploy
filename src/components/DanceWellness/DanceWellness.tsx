import Button from '@/components/UI/Button';

const benefits = [
  {
    icon: '🧠',
    title: 'Reduce el estrés',
    description: 'El movimiento libera endorfinas y cortisol disminuye hasta un 40% después de bailar.',
  },
  {
    icon: '🎯',
    title: 'Mejora la concentración',
    description: 'Memorizar rutinas y coordinar cuerpo con música entrena la mente tanto como el gimnasio.',
  },
  {
    icon: '💜',
    title: 'Fortalece la confianza',
    description: 'Superar retos físicos y artísticos construye una autoestima sólida y duradera.',
  },
  {
    icon: '🤝',
    title: 'Conecta con otros',
    description: 'La danza es un idioma universal. Aquí encontrarás tu tribu y vínculos auténticos.',
  },
];

export default function DanceWellness() {
  return (
    <section id="bienestar" className="relative py-28 bg-page overflow-hidden">
      {/* Purple glow background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1770739723922-a4fd700bdb3b?w=700&h=900&fit=crop&auto=format"
                alt="Dancer expressing emotion under neon light"
                className="w-full max-w-md mx-auto lg:mx-0 object-cover aspect-[3/4] hover:brightness-110 transition-all duration-700"
              />
              {/* Decorative line */}
              <div className="absolute -right-8 top-1/2 -translate-y-1/2 hidden lg:block">
                <div className="flex flex-col gap-2">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="w-16 h-px bg-accent/30" />
                  ))}
                </div>
              </div>
              {/* Stat card */}
              <div className="absolute -bottom-6 -right-6 lg:right-auto lg:-left-6 bg-accent p-6">
                <div className="font-display text-4xl text-on-accent">40%</div>
                <div className="font-condensed text-xs uppercase tracking-wider text-on-accent/80 mt-1">
                  Reducción<br />del estrés
                </div>
              </div>
            </div>
          </div>

          {/* Right — content */}
          <div className="order-1 lg:order-2">
            <span className="font-condensed text-sm uppercase tracking-[0.3em] text-accent font-600">
              Danza & Bienestar
            </span>
            <h2 className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-none uppercase text-text mt-3 mb-6">
              EL CUERPO
              <br />
              <span className="text-accent">QUE BAILA</span>
              <br />
              NO MIENTE
            </h2>
            <p className="font-body text-text-soft text-lg leading-relaxed mb-10">
              La ciencia lo confirma: bailar mejora la salud mental, fortalece vínculos
              sociales y desarrolla inteligencia emocional. Más allá de la técnica, la danza
              urbana es una herramienta de transformación personal que actúa desde adentro.
            </p>

            {/* Benefits list */}
            <div className="grid sm:grid-cols-2 gap-6 mb-10">
              {benefits.map((b, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="text-2xl flex-shrink-0 mt-0.5">{b.icon}</div>
                  <div>
                    <h4 className="font-condensed font-700 uppercase text-sm tracking-wider text-text mb-1 group-hover:text-accent transition-colors">
                      {b.title}
                    </h4>
                    <p className="font-body text-xs text-text-muted leading-relaxed">
                      {b.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Button size="lg" onClick={() => document.querySelector('#alquiler')?.scrollIntoView({ behavior: 'smooth' })}>
              Descubre cómo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}