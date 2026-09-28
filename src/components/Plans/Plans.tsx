import Button from '@/components/UI/Button';

const plans = [
  {
    id: 'monthly',
    name: 'MENSUALIDAD',
    tagline: 'Flexibilidad total',
    description:
      'Perfecto para quienes quieren comenzar sin compromisos. Accede a todas las clases del nivel asignado con libertad mes a mes.',
    benefits: [
      'Acceso a todas las clases de tu nivel',
      'Evaluación inicial gratuita',
      'Acceso a la comunidad F&A',
      'Descuento en eventos y batallas',
      'Clases de recuperación disponibles',
    ],
    recommended: false,
    cta: 'Empieza ya',
  },
  {
    id: 'annual',
    name: 'ANUAL',
    tagline: 'El plan del comprometido',
    description:
      'Para quien sabe que la danza es su camino. El mejor valor, con acceso completo, prioridad en inscripciones y beneficios exclusivos.',
    benefits: [
      'Todo lo del plan mensual',
      'Prioridad en inscripción a talleres especiales',
      'Acceso a masterclasses de invitados',
      'Kit de bienvenida F&A exclusivo',
      'Descuento en alquiler de aulas',
      '2 meses gratis (vs mensual)',
    ],
    recommended: true,
    cta: 'Elige este plan',
  },
];

export default function Plans() {
  return (
    <section id="planes" className="relative py-28 bg-surface-alt overflow-hidden">
      {/* Diagonal accent */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage:
            'repeating-linear-gradient(-45deg, #6E3482 0px, #6E3482 1px, transparent 1px, transparent 40px)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="font-condensed text-sm uppercase tracking-[0.3em] text-accent font-600">
            Membresías
          </span>
          <h2 className="font-display text-[clamp(3rem,6vw,5rem)] leading-none uppercase text-text mt-3">
            ELIGE TU <span className="text-accent">RITMO</span>
          </h2>
          <p className="font-body text-text-soft mt-4 max-w-md mx-auto">
            Sin excusas. Elige el plan que se adapta a tu estilo de vida y empieza a bailar hoy.
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={[
                'relative flex flex-col p-8 border transition-all duration-300 hover:translate-y-[-4px]',
                plan.recommended
                  ? 'border-accent bg-purple-700/10'
                  : 'border-border bg-surface hover:border-accent/60',
              ].join(' ')}
            >
              {/* Recommended badge */}
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-accent text-on-accent font-condensed font-700 text-xs uppercase tracking-widest px-4 py-1">
                    Recomendado
                  </span>
                </div>
              )}

              {/* Plan name */}
              <div className="mb-6">
                <div className="font-condensed text-xs uppercase tracking-[0.3em] text-accent mb-2">
                  {plan.tagline}
                </div>
                <h3 className="font-display text-4xl text-text leading-none">{plan.name}</h3>
              </div>

              {/* Description */}
              <p className="font-body text-sm text-text-soft leading-relaxed mb-8">
                {plan.description}
              </p>

              {/* Benefits */}
              <ul className="flex flex-col gap-3 mb-10 flex-1">
                {plan.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-4 h-4 rounded-full border border-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-accent" />
                    </span>
                    <span className="font-body text-sm text-text-soft">{b}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                size="lg"
                variant={plan.recommended ? 'primary' : 'outline'}
                fullWidth
                onClick={() => document.querySelector('#alquiler')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* Note */}
        <p className="text-center font-body text-xs text-text-muted mt-8">
          Consulta disponibilidad y condiciones en cada sede. Los planes incluyen acceso a clases regulares de lunes a sábado.
        </p>
      </div>
    </section>
  );
}