import { useState, useMemo } from 'react';
import { ModuleConfig } from './types';

interface CrudTableProps {
  config: ModuleConfig;
  data: any[];
  onAdd: () => void;
  onEdit: (row: any) => void;
  onView: (row: any) => void;
  onDelete: (row: any) => void;
}

/* ─── AVATAR INITIALS ─── */
function Avatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();
  return (
    <div className="w-8 h-8 rounded-full bg-purple-700/30 border border-purple-700/40 flex items-center justify-center flex-shrink-0">
      <span className="font-condensed font-700 text-xs text-purple-400">{initials}</span>
    </div>
  );
}

/* ─── ACTION ICONS ─── */
const ViewIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
  </svg>
);
const DeleteIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" />
  </svg>
);
const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

export default function CrudTable({ config, data, onAdd, onEdit, onView, onDelete }: CrudTableProps) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter(row =>
      Object.values(row).some(v => String(v).toLowerCase().includes(q))
    );
  }, [data, search]);

  return (
    <div className="flex flex-col gap-5 h-full">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display text-3xl uppercase text-text leading-none">
          {config.title}
        </h1>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
              <SearchIcon />
            </span>
            <input
              type="text"
              placeholder="Buscar..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-full bg-surface border border-border text-text text-sm placeholder:text-text-muted focus:outline-none focus:border-purple-400 transition-colors w-48"
            />
          </div>
          {/* Add button */}
          <button
            onClick={onAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-700 text-white font-condensed font-600 text-sm uppercase tracking-wider hover:bg-purple-900 active:scale-95 transition-all duration-150 cursor-pointer shadow-lg shadow-purple-700/20"
          >
            <PlusIcon />
            {config.addLabel ?? 'Agregar'}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 rounded-[20px] bg-surface border border-border overflow-hidden flex flex-col">
        {/* Table head */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full min-w-full">
            <thead>
              <tr className="border-b border-border">
                {config.avatarKey && <th className="w-12 px-4 py-3" />}
                {config.columns.map(col => (
                  <th
                    key={col.key}
                    className="px-4 py-3 text-left font-condensed font-600 text-xs uppercase tracking-widest text-text-muted whitespace-nowrap"
                    style={col.width ? { width: col.width } : undefined}
                  >
                    {col.label}
                  </th>
                ))}
                <th className="px-4 py-3 text-right font-condensed font-600 text-xs uppercase tracking-widest text-text-muted w-28">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={config.columns.length + 2} className="px-4 py-16 text-center text-text-muted font-body text-sm">
                    No se encontraron resultados
                  </td>
                </tr>
              ) : (
                filtered.map((row, i) => (
                  <tr
                    key={row.id ?? i}
                    className="border-b border-border last:border-0 hover:bg-purple-400/4 transition-colors group"
                  >
                    {config.avatarKey && (
                      <td className="px-4 py-3">
                        <Avatar name={String(row[config.avatarKey!])} />
                      </td>
                    )}
                    {config.columns.map(col => (
                      <td key={col.key} className="px-4 py-3 font-body text-sm text-text-soft whitespace-nowrap max-w-[200px] truncate">
                        {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '—')}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onView(row)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-purple-400 hover:bg-purple-400/10 transition-all cursor-pointer"
                          title="Ver detalle"
                        >
                          <ViewIcon />
                        </button>
                        <button
                          onClick={() => onEdit(row)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-blue-400 hover:bg-blue-400/10 transition-all cursor-pointer"
                          title="Editar"
                        >
                          <EditIcon />
                        </button>
                        <button
                          onClick={() => onDelete(row)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-red-400 hover:bg-red-400/10 transition-all cursor-pointer"
                          title="Eliminar"
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        <div className="border-t border-border px-5 py-3 flex items-center justify-between">
          <span className="font-condensed text-xs uppercase tracking-wider text-text-muted">
            {filtered.length} de {data.length} registro{data.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  );
}
