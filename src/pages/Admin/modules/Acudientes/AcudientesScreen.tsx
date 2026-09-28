import { useState } from 'react';
import CrudTable from '../../CrudTable';
import SlideOver from '../../SlideOver';
import DetailWidget from '../../DetailWidget';
import { ModuleConfig } from '../../types';
import {
  acudientesSeed,
  personasSeed,
  estadosSeed,
  getEstadoNombre,
  getPersonaNombre,
  estadoBadge,
  Acudiente,
} from '../seguridad/data';
import { guardianRecords } from '../guardianRegistry';

type AcudienteRow = Acudiente & {
  nombre?: string;
  tipoDocumento?: string;
  documento?: string;
  telefono?: string;
  email?: string;
  nacimiento?: string;
};

const config: ModuleConfig = {
  id: 'seg-acudientes',
  title: 'Acudientes',
  addLabel: 'Nuevo acudiente',
  icon: null,
  columns: [
    {
      key: 'idPersona',
      label: 'Persona',
      render: (v, row) => <span className="font-600 text-text">{row.nombre ?? getPersonaNombre(Number(v))}</span>,
    },
    {
      key: 'idPersona',
      label: 'Teléfono',
      render: (v, row) => {
        if (row.telefono) return row.telefono;
        const p = personasSeed.find(x => x.idPersona === Number(v));
        return p?.telefono ?? '—';
      },
    },
    {
      key: 'idPersona',
      label: 'Correo',
      render: (v, row) => {
        if (row.email) return row.email;
        const p = personasSeed.find(x => x.idPersona === Number(v));
        return p?.email ?? '—';
      },
    },
    { key: 'documento', label: 'Documento' },
    { key: 'idEstado', label: 'Estado', render: v => estadoBadge(getEstadoNombre(Number(v))) },
  ],
  fields: [
    {
      key: 'idPersona',
      label: 'Persona',
      type: 'select',
      required: true,
      span: 'full',
      options: personasSeed.map(p => ({ label: p.nombre, value: String(p.idPersona) })),
    },
    {
      key: 'idEstado',
      label: 'Estado',
      type: 'select',
      span: 'half',
      options: estadosSeed
        .filter(e => e.categoria === 'general')
        .map(e => ({ label: e.nombre, value: String(e.idEstado) })),
    },
  ],
  detailFields: [
    {
      key: 'idPersona',
      label: 'Nombre',
      render: (v, row) => row.nombre ?? getPersonaNombre(Number(v)),
    },
    {
      key: 'idPersona',
      label: 'Teléfono',
      render: (v, row) => row.telefono ?? personasSeed.find(x => x.idPersona === Number(v))?.telefono ?? '—',
    },
    {
      key: 'idPersona',
      label: 'Correo',
      render: (v, row) => row.email ?? personasSeed.find(x => x.idPersona === Number(v))?.email ?? '—',
      wide: true,
    },
    { key: 'tipoDocumento', label: 'Tipo de documento' },
    { key: 'documento', label: 'Documento' },
    { key: 'nacimiento', label: 'Fecha de nacimiento' },
    { key: 'idEstado', label: 'Estado', render: v => estadoBadge(getEstadoNombre(Number(v))) },
  ],
  detailTitle: r => r.nombre ?? getPersonaNombre(Number(r.idPersona)),
  detailSubtitle: () => 'Acudiente',
  data: [],
};

export default function AcudientesScreen() {
  const [data, setData] = useState<AcudienteRow[]>(() => {
    const shared = guardianRecords.map(record => ({
      idAcudiente: record.idAcudiente,
      idPersona: record.idPersona,
      idEstado: record.idEstado,
      nombre: record.nombre,
      tipoDocumento: record.tipoDocumento,
      documento: record.documento,
      telefono: record.telefono,
      email: record.email,
      nacimiento: record.nacimiento,
    }));
    const sharedIds = new Set(shared.map(record => record.idAcudiente));
    return [...shared, ...acudientesSeed.filter(record => !sharedIds.has(record.idAcudiente))];
  });
  const [slideOver, setSlideOver] = useState<{ open: boolean; mode: 'create' | 'edit'; row: any | null }>({
    open: false, mode: 'create', row: null,
  });
  const [detail, setDetail] = useState<{ open: boolean; row: AcudienteRow | null }>({ open: false, row: null });
  const [success, setSuccess] = useState('');

  const handleAdd = () => setSlideOver({ open: true, mode: 'create', row: null });
  const handleEdit = (row: AcudienteRow) => { setDetail({ open: false, row: null }); setSlideOver({ open: true, mode: 'edit', row }); };
  const handleView = (row: AcudienteRow) => setDetail({ open: true, row });
  const handleDelete = (row: AcudienteRow) => { setDetail({ open: false, row: null }); setData(d => d.filter(r => r.idAcudiente !== row.idAcudiente)); };

  const handleSave = (form: any) => {
    const idPersona = Number(form.idPersona) || 1;
    const idEstado = Number(form.idEstado) || 1;
    if (slideOver.mode === 'create') {
      const newId = Math.max(0, ...data.map(r => r.idAcudiente)) + 1;
      setData(d => [...d, { idAcudiente: newId, idPersona, idEstado }]);
    } else {
      setData(d => d.map(r => r.idAcudiente === form.idAcudiente ? { ...r, idPersona, idEstado } : r));
    }
    setSlideOver(s => ({ ...s, open: false }));
    setSuccess(slideOver.mode === 'create' ? 'El acudiente se creó correctamente.' : 'El acudiente se actualizó correctamente.');
    window.setTimeout(() => setSuccess(''), 3500);
  };

  return (
    <>
      {success && (
        <div role="status" className="fixed right-6 top-6 z-[70] rounded-2xl border border-emerald-500/25 bg-surface px-5 py-4 font-body text-sm font-semibold text-emerald-300 shadow-2xl shadow-black/30">
          {success}
        </div>
      )}
      <div className="mb-1">
        <span className="font-condensed text-xs uppercase tracking-[0.2em] text-purple-400">Seguridad</span>
      </div>
      <CrudTable
        config={config}
        data={data}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
      />
      <SlideOver
        open={slideOver.open}
        mode={slideOver.mode}
        config={config}
        initialData={slideOver.row}
        onSave={handleSave}
        onClose={() => setSlideOver(s => ({ ...s, open: false }))}
      />
      <DetailWidget
        open={detail.open}
        config={config}
        row={detail.row}
        onEdit={() => handleEdit(detail.row!)}
        onDelete={() => handleDelete(detail.row!)}
        onClose={() => setDetail({ open: false, row: null })}
      />
    </>
  );
}
