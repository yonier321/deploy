import { useState, FormEvent } from 'react';
import Button from '@/components/UI/Button';

interface FormState {
  nombre: string;
  correo: string;
  telefono: string;
  sede: string;
  fecha: string;
  hora: string;
  personas: string;
  mensaje: string;
}

const initialState: FormState = {
  nombre: '',
  correo: '',
  telefono: '',
  sede: '',
  fecha: '',
  hora: '',
  personas: '',
  mensaje: '',
};

export default function RentalForm() {
  const [form, setForm] = useState<FormState>(initialState);

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const buildWhatsAppMessage = () => {
    const msg = [
      `*Solicitud de Alquiler de Aula — F&A Dance Company*`,
      ``,
      `👤 *Nombre:* ${form.nombre}`,
      `📧 *Correo:* ${form.correo}`,
      `📱 *Teléfono:* ${form.telefono}`,
      `🏢 *Sede:* ${form.sede}`,
      `📅 *Fecha:* ${form.fecha}`,
      `🕐 *Hora:* ${form.hora}`,
      `👥 *Personas:* ${form.personas}`,
      `💬 *Mensaje:* ${form.mensaje || 'Sin mensaje adicional'}`,
    ].join('\n');
    return encodeURIComponent(msg);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const phone = '573001234567';
    const url = `https://wa.me/${phone}?text=${buildWhatsAppMessage()}`;
    window.open(url, '_blank');
  };

  const inputClass =
    'bg-surface border border-border text-text placeholder:text-text-muted px-4 py-3 font-body text-sm w-full focus:outline-none focus:border-accent transition-colors duration-200';
  const labelClass = 'font-condensed text-xs uppercase tracking-wider text-accent mb-1.5 block';

  return (
    <section id="alquiler" className="relative py-28 bg-surface-alt overflow-hidden">
      {/* Background accent */}
      <div className="absolute right-0 top-0 w-1/2 h-full bg-accent/5 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-px bg-border pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left — info */}
          <div className="lg:sticky lg:top-28">
            <span className="font-condensed text-sm uppercase tracking-[0.3em] text-accent font-600">
              Espacio profesional
            </span>
            <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-none uppercase text-text mt-3 mb-6">
              ¿NECESITAS
              <br />
              UN ESPACIO
              <br />
              <span className="text-accent">PARA BAILAR?</span>
            </h2>
            <p className="font-body text-text-soft text-lg leading-relaxed mb-8">
              Alquila nuestras aulas por horas. Ideales para ensayos, audiciones, rodajes,
              talleres privados o clases particulares. Equipadas con espejos, sonido profesional
              y piso de madera especializado.
            </p>

            {/* Features */}
            <div className="flex flex-col gap-4">
              {[
                'Espejos de piso a techo',
                'Sistema de sonido profesional',
                'Piso de madera flotante',
                'Vestieres incluidos',
                'Disponible 7 días a la semana',
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="w-1 h-1 rounded-full bg-accent" />
                  <span className="font-condensed text-sm uppercase tracking-wider text-text-soft">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div className="bg-surface border border-border p-8">
            <h3 className="font-condensed font-700 text-xl uppercase tracking-wider text-text mb-8">
              Solicita tu espacio
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Nombre completo</label>
                  <input
                    className={inputClass}
                    placeholder="Tu nombre"
                    value={form.nombre}
                    onChange={set('nombre')}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Correo electrónico</label>
                  <input
                    className={inputClass}
                    type="email"
                    placeholder="tu@correo.com"
                    value={form.correo}
                    onChange={set('correo')}
                    required
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Teléfono</label>
                  <input
                    className={inputClass}
                    type="tel"
                    placeholder="+57 300 000 0000"
                    value={form.telefono}
                    onChange={set('telefono')}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Sede</label>
                  <select
                    className={inputClass + ' cursor-pointer'}
                    value={form.sede}
                    onChange={set('sede')}
                    required
                  >
                    <option value="">Selecciona una sede</option>
                    <option value="Bello">Bello</option>
                    <option value="Copacabana">Copacabana</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Fecha</label>
                  <input
                    className={inputClass}
                    type="date"
                    value={form.fecha}
                    onChange={set('fecha')}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Hora</label>
                  <input
                    className={inputClass}
                    type="time"
                    value={form.hora}
                    onChange={set('hora')}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Personas</label>
                  <input
                    className={inputClass}
                    type="number"
                    min="1"
                    max="100"
                    placeholder="Ej: 10"
                    value={form.personas}
                    onChange={set('personas')}
                    required
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Mensaje adicional</label>
                <textarea
                  className={inputClass + ' resize-none'}
                  rows={4}
                  placeholder="Cuéntanos el motivo del alquiler, estilo de danza, equipamiento especial, etc."
                  value={form.mensaje}
                  onChange={set('mensaje')}
                />
              </div>

              <Button type="submit" size="lg" fullWidth className="mt-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M11.5 0C5.149 0 0 5.149 0 11.5c0 2.031.531 3.94 1.46 5.588L.048 23l6.047-1.38A11.454 11.454 0 0011.5 23C17.851 23 23 17.851 23 11.5S17.851 0 11.5 0zm0 21.077a9.562 9.562 0 01-4.942-1.372l-.354-.21-3.589.82.878-3.496-.231-.36a9.528 9.528 0 01-1.685-5.459c0-5.283 4.295-9.577 9.578-9.577 5.282 0 9.577 4.294 9.577 9.577 0 5.283-4.295 9.577-9.577 9.577z"/>
                </svg>
                Solicitar aula por WhatsApp
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}