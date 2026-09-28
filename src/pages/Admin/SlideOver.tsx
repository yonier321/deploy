import { useEffect, useState } from 'react';
import { ModuleConfig, SlideOverMode } from './types';

interface SlideOverProps {
  open: boolean;
  mode: SlideOverMode;
  config: ModuleConfig;
  initialData?: any;
  onSave: (data: any) => void;
  onClose: () => void;
  extraContent?: React.ReactNode | ((form: Record<string, any>, setForm: React.Dispatch<React.SetStateAction<Record<string, any>>>) => React.ReactNode);
  validate?: (form: Record<string, any>) => Record<string, string>;
}

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default function SlideOver({ open, mode, config, initialData, onSave, onClose, extraContent, validate }: SlideOverProps) {
  const [form, setForm] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setForm(initialData ? { ...initialData } : {});
      setErrors({});
    }
  }, [open, initialData]);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    for (const field of config.fields) {
      if (field.required && String(form[field.key] ?? '').trim() === '') nextErrors[field.key] = 'Este campo es obligatorio';
    }
    Object.assign(nextErrors, validate?.(form) ?? {});
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onSave(form);
  };

  // Build rows of fields
  const fieldRows: (typeof config.fields)[] = [];
  let halfBuffer: typeof config.fields = [];
  for (const field of config.fields) {
    if (field.span === 'full') {
      if (halfBuffer.length) { fieldRows.push([...halfBuffer]); halfBuffer = []; }
      fieldRows.push([field]);
    } else {
      halfBuffer.push(field);
      if (halfBuffer.length === 2) { fieldRows.push([...halfBuffer]); halfBuffer = []; }
    }
  }
  if (halfBuffer.length) fieldRows.push([...halfBuffer]);

  const inputCls = 'w-full rounded-[10px] bg-surface-alt border border-border px-4 py-2.5 text-text text-sm placeholder:text-text-muted focus:outline-none focus:border-purple-400 transition-colors font-body';

  return (
    <>
      {/* Backdrop */}
      <div
        className={[
          'fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        ].join(' ')}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={[
          'fixed right-0 top-0 bottom-0 z-50 w-full max-w-xl flex flex-col transition-transform duration-300 ease-out',
          'bg-surface border-l border-border',
          open ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-border flex-shrink-0">
          <h2 className="font-display text-xl uppercase text-text leading-none">
            {mode === 'create' ? (config.addLabel ?? 'Agregar') : `Editar ${config.title}`}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-text hover:bg-border transition-all cursor-pointer"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-4">
          {fieldRows.map((row, ri) => (
            <div key={ri} className={row.length === 2 ? 'grid grid-cols-2 gap-4' : ''}>
              {row.map(field => (
                <div key={field.key} className="flex flex-col gap-1.5">
                  <label className="font-condensed font-600 text-xs uppercase tracking-wider text-text-muted">
                    {field.label}{field.required && <span className="text-purple-400 ml-0.5">*</span>}
                  </label>

                  {field.type === 'select' ? (
                    <select
                      value={form[field.key] ?? ''}
                      onChange={set(field.key)}
                      required={field.required}
                      disabled={field.readOnly}
                      className={inputCls + ' cursor-pointer'}
                    >
                      <option value="">Seleccionar...</option>
                      {field.options?.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      value={form[field.key] ?? ''}
                      onChange={set(field.key)}
                      required={field.required}
                      readOnly={field.readOnly}
                      placeholder={field.placeholder}
                      rows={3}
                      className={inputCls + ' resize-none'}
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={form[field.key] ?? ''}
                      onChange={set(field.key)}
                      required={field.required}
                      readOnly={field.readOnly}
                      placeholder={field.placeholder}
                      className={inputCls}
                    />
                  )}
                  {errors[field.key] && <span className="font-body text-xs text-red-400">{errors[field.key]}</span>}
                </div>
              ))}
            </div>
          ))}
          {extraContent && (
            <div className="mt-6 pt-6 border-t border-border">
              {typeof extraContent === 'function' ? extraContent(form, setForm) : extraContent}
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full border border-border py-2.5 font-condensed font-600 text-sm uppercase tracking-wider text-text-soft hover:border-purple-400/50 hover:text-text transition-all cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 rounded-full bg-purple-700 py-2.5 font-condensed font-600 text-sm uppercase tracking-wider text-white hover:bg-purple-900 active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-purple-700/20"
          >
            {mode === 'create' ? 'Crear' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </>
  );
}
