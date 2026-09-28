import { useState, useMemo } from 'react';
import CrudTable from '../../CrudTable';
import SlideOver from '../../SlideOver';
import { ModuleConfig } from '../../types';
import { estadosSeed, estadoBadge, Estado } from '../seguridad/data';

const CATEGORIAS = ['general', 'mensualidad', 'matricula', 'usuario', 'postulacion', 'contenido'];

const config: ModuleConfig = {
  id: 'seg-estados',
  title: 'Estados',
  addLabel: 'Nuevo estado',
  icon: null,
  columns: [
    { key: 'nombre', label: 'Nombre', render: v => estadoBadge(v) },
    { key: 'categoria', label: 'Categoría', render: v => (
      <span className="font-condensed text-xs uppercase tracking-wider text-text-muted bg-surface-alt px-2 py-0.5 rounded">
        {v}
      </span>
    )},
    { key: 'descripcion', label: 'Descripción', render: v => (
      <span className="text-text-muted truncate max-w-xs inline-block">{v}</span>
    )},
  ],
  fields: [
    { key: 'nombre', label: 'Nombre del estado', type: 'text', required: true, span: 'half' },
    {
      key: 'categoria',
      label: 'Categoría',
      type: 'select',
      required: true,
      span: 'half',
      options: CATEGORIAS.map(c => ({ label: c, value: c })),
    },
    { key: 'descripcion', label: 'Descripción', type: 'textarea', span: 'full' },
  ],
  detailTitle: r => r.nombre,
  detailSubtitle: r => `Categoría: ${r.categoria}`,
  data: [],
};

/* ─── WARNING NOTICE ─── */
const WarningNotice = () => (
  <div className="flex gap-2 p-3 rounded-xl bg-amber-500/8 border border-amber-500/20">
    <svg className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
    <p className="font-body text-xs text-amber-400/80 leading-relaxed">
      Este catálogo es usado por múltiples módulos del sistema. Editar o eliminar un estado en uso puede afectar otros registros.
    </p>
  </div>
);

export default function EstadosScreen() {
  const [data, setData] = useState<Estado[]>([...estadosSeed]);
  const [filtroCategoria, setFiltroCategoria] = useState<string>('');
  const [slideOver, setSlideOver] = useState<{ open: boolean; mode: 'create' | 'edit'; row: any | null }>({
    open: false, mode: 'create', row: null,
  });

  const filtered = useMemo(() =>
    filtroCategoria ? data.filter(e => e.categoria === filtroCategoria) : data,
    [data, filtroCategoria]
  );

  const handleAdd = () => setSlideOver({ open: true, mode: 'create', row: null });
  const handleEdit = (row: Estado) => setSlideOver({ open: true, mode: 'edit', row });
  const handleDelete = (row: Estado) => setData(d => d.filter(r => r.idEstado !== row.idEstado));

  const handleSave = (form: any) => {
    if (slideOver.mode === 'create') {
      const newId = Math.max(0, ...data.map(r => r.idEstado)) + 1;
      setData(d => [...d, { idEstado: newId, nombre: form.nombre, categoria: form.categoria, descripcion: form.descripcion ?? '' }]);
    } else {
      setData(d => d.map(r => r.idEstado === form.idEstado ? { ...r, ...form } : r));
    }
    setSlideOver(s => ({ ...s, open: false }));
  };

  return (
    <>
      <div className="mb-1">
        <span className="font-condensed text-xs uppercase tracking-[0.2em] text-purple-400">Seguridad</span>
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2 mb-5">
        <button
          onClick={() => setFiltroCategoria('')}
          className={[
            'px-3 py-1 rounded-full font-condensed text-xs uppercase tracking-wider transition-all cursor-pointer border',
            !filtroCategoria
              ? 'bg-purple-700 text-white border-purple-700'
              : 'text-text-muted border-border hover:border-purple-400/40 hover:text-text',
          ].join(' ')}
        >
          Todos
        </button>
        {CATEGORIAS.map(cat => (
          <button
            key={cat}
            onClick={() => setFiltroCategoria(cat === filtroCategoria ? '' : cat)}
            className={[
              'px-3 py-1 rounded-full font-condensed text-xs uppercase tracking-wider transition-all cursor-pointer border',
              filtroCategoria === cat
                ? 'bg-purple-700/80 text-white border-purple-700'
                : 'text-text-muted border-border hover:border-purple-400/40 hover:text-text',
            ].join(' ')}
          >
            {cat}
          </button>
        ))}
      </div>

      <CrudTable
        config={config}
        data={filtered}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onView={handleEdit}
        onDelete={handleDelete}
      />
      <SlideOver
        open={slideOver.open}
        mode={slideOver.mode}
        config={config}
        initialData={slideOver.row}
        onSave={handleSave}
        onClose={() => setSlideOver(s => ({ ...s, open: false }))}
        extraContent={<WarningNotice />}
      />
    </>
  );
}
