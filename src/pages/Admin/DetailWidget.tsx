import { ModuleConfig } from './types';

interface DetailWidgetProps {
  open: boolean;
  config: ModuleConfig;
  row: any | null;
  onEdit: () => void;
  onClose: () => void;
  onDelete: () => void;
  extraContent?: React.ReactNode;
}

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
  </svg>
);
const DeleteIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);

function Initials({ name }: { name: string }) {
  const parts = name?.split(' ') ?? ['?'];
  const initials = parts.slice(0, 2).map(w => w[0]).join('').toUpperCase();
  return (
    <div className="w-16 h-16 rounded-[20px] bg-purple-700/25 border border-purple-700/40 flex items-center justify-center flex-shrink-0">
      <span className="font-display text-2xl text-purple-400">{initials}</span>
    </div>
  );
}

export default function DetailWidget({ open, config, row, onEdit, onClose, onDelete, extraContent }: DetailWidgetProps) {
  if (!row) return null;

  const title = config.detailTitle?.(row) ?? String(row[config.columns[0]?.key] ?? '');
  const subtitle = config.detailSubtitle?.(row) ?? config.title;
  const fields = config.detailFields ?? config.columns.map(c => ({ key: c.key, label: c.label, render: c.render, wide: false }));

  return (
    <>
      {/* Backdrop */}
      <div
        className={[
          'fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        ].join(' ')}
        onClick={onClose}
      />

      {/* Card */}
      <div
        className={[
          'fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300',
          'w-full max-w-md',
          open ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none',
        ].join(' ')}
      >
        <div className="rounded-[20px] bg-surface border border-border overflow-hidden shadow-2xl shadow-black/60">
          {/* Header */}
          <div className="relative px-6 pt-6 pb-5 border-b border-border">
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-text hover:bg-border transition-all cursor-pointer"
            >
              <CloseIcon />
            </button>

            {/* Avatar + identity */}
            <div className="flex items-center gap-4">
              <Initials name={title} />
              <div className="min-w-0">
                <h2 className="font-display text-2xl text-text leading-tight truncate">{title}</h2>
                <p className="font-condensed text-sm uppercase tracking-wider text-purple-400 mt-0.5">{subtitle}</p>
              </div>
            </div>
          </div>

          {/* Fields grid */}
          <div className="px-6 py-5 grid grid-cols-2 gap-x-6 gap-y-4 max-h-[40vh] overflow-y-auto">
            {fields.map(field => {
              const val = row[field.key];
              if (val === undefined || val === null || val === '') return null;
              return (
                <div key={field.key} className={field.wide ? 'col-span-2' : ''}>
                  <div className="font-condensed text-xs uppercase tracking-wider text-text-muted mb-1">
                    {field.label}
                  </div>
                  <div className="font-body text-sm text-text">
                    {field.render ? field.render(val, row) : String(val)}
                  </div>
                </div>
              );
            })}
          </div>

          {extraContent && (
            <div className="col-span-2 pt-4 border-t border-border mt-2">
              {extraContent}
            </div>
          )}

          {/* Footer actions */}
          <div className="px-6 py-4 border-t border-border flex gap-3">
            <button
              onClick={onDelete}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-border text-text-muted hover:border-red-400/40 hover:text-red-400 hover:bg-red-400/8 font-condensed font-600 text-sm uppercase tracking-wider transition-all cursor-pointer"
            >
              <DeleteIcon />
              Eliminar
            </button>
            <button
              onClick={onEdit}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-purple-700 text-white hover:bg-purple-900 active:scale-[0.98] font-condensed font-600 text-sm uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-purple-700/20"
            >
              <EditIcon />
              Editar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
