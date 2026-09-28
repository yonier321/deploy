import { useState } from 'react';
import CrudTable from '../../CrudTable';
import SlideOver from '../../SlideOver';
import DetailWidget from '../../DetailWidget';
import { ModuleConfig } from '../../types';
import {
  usuariosSeed,
  personasSeed,
  rolesSeed,
  estadosSeed,
  getEstadoNombre,
  getPersonaNombre,
  getRolNombre,
  estadoBadge,
  Usuario,
} from '../seguridad/data';

const config: ModuleConfig = {
  id: 'seg-usuarios',
  title: 'Usuarios',
  addLabel: 'Nuevo usuario',
  avatarKey: 'username',
  icon: null,
  columns: [
    { key: 'username', label: 'Usuario', render: v => <span className="font-600 text-text font-condensed tracking-wider">{v}</span> },
    { key: 'persona_id', label: 'Persona', render: v => getPersonaNombre(Number(v)) },
    { key: 'roles', label: 'Roles', render: v => (
      <div className="flex gap-1 flex-wrap">
        {(v as number[]).map(id => (
          <span key={id} className="px-2 py-0.5 rounded-full bg-purple-700/20 text-purple-400 font-condensed text-xs uppercase tracking-wider border border-purple-700/30">
            {getRolNombre(id)}
          </span>
        ))}
      </div>
    )},
    { key: 'idEstado', label: 'Estado', render: v => estadoBadge(getEstadoNombre(Number(v))) },
  ],
  fields: [
    {
      key: 'persona_id',
      label: 'Persona',
      type: 'select',
      required: true,
      span: 'full',
      options: personasSeed.map(p => ({ label: p.nombre, value: String(p.idPersona) })),
    },
    { key: 'username', label: 'Nombre de usuario', type: 'text', required: true, span: 'half' },
    { key: 'password_hash', label: 'Contraseña', type: 'text', span: 'half', placeholder: '••••••••' },
    {
      key: 'idEstado',
      label: 'Estado',
      type: 'select',
      span: 'half',
      options: estadosSeed
        .filter(e => e.categoria === 'usuario')
        .map(e => ({ label: e.nombre, value: String(e.idEstado) })),
    },
  ],
  detailFields: [
    { key: 'username', label: 'Nombre de usuario' },
    { key: 'persona_id', label: 'Persona', render: v => getPersonaNombre(Number(v)) },
    { key: 'password_hash', label: 'Contraseña', render: () => '••••••••' },
    { key: 'idEstado', label: 'Estado', render: v => estadoBadge(getEstadoNombre(Number(v))) },
  ],
  detailTitle: r => r.username,
  detailSubtitle: r => `Usuario · ${getPersonaNombre(Number(r.persona_id))}`,
  data: [],
};

/* ─── ROLES CHECKBOXES ─── */
function RolesSelector({
  selected,
  onChange,
}: {
  selected: number[];
  onChange: (ids: number[]) => void;
}) {
  const toggle = (id: number) =>
    onChange(selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id]);

  return (
    <div>
      <p className="font-condensed font-600 text-xs uppercase tracking-wider text-purple-400 mb-3">
        Roles asignados
      </p>
      <div className="grid grid-cols-2 gap-2">
        {rolesSeed.map(rol => (
          <label
            key={rol.idRol}
            className="flex items-center gap-2.5 p-2.5 rounded-xl border border-border hover:border-purple-400/40 cursor-pointer transition-colors group"
          >
            <input
              type="checkbox"
              checked={selected.includes(rol.idRol)}
              onChange={() => toggle(rol.idRol)}
              className="w-4 h-4 accent-purple-400 rounded"
            />
            <span className="font-condensed text-sm text-text group-hover:text-purple-400 transition-colors">{rol.nombre}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

/* ─── SCREEN ─── */
export default function UsuariosScreen() {
  const [data, setData] = useState<Usuario[]>([...usuariosSeed]);
  const [slideOver, setSlideOver] = useState<{ open: boolean; mode: 'create' | 'edit'; row: any | null }>({
    open: false, mode: 'create', row: null,
  });
  const [detail, setDetail] = useState<{ open: boolean; row: Usuario | null }>({ open: false, row: null });
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);

  const handleAdd = () => {
    setSelectedRoles([]);
    setSlideOver({ open: true, mode: 'create', row: null });
  };
  const handleEdit = (row: Usuario) => {
    setDetail({ open: false, row: null });
    setSelectedRoles(row.roles ?? []);
    setSlideOver({ open: true, mode: 'edit', row });
  };
  const handleView = (row: Usuario) => setDetail({ open: true, row });
  const handleDelete = (row: Usuario) => { setDetail({ open: false, row: null }); setData(d => d.filter(r => r.idUsuario !== row.idUsuario)); };

  const handleSave = (form: any) => {
    const persona_id = Number(form.persona_id) || 1;
    const idEstado = Number(form.idEstado) || 8;
    if (slideOver.mode === 'create') {
      const newId = Math.max(0, ...data.map(r => r.idUsuario)) + 1;
      setData(d => [...d, { idUsuario: newId, persona_id, username: form.username, password_hash: form.password_hash || '[hash]', idEstado, roles: selectedRoles }]);
    } else {
      setData(d => d.map(r => r.idUsuario === form.idUsuario ? { ...r, ...form, persona_id, idEstado, roles: selectedRoles } : r));
    }
    setSlideOver(s => ({ ...s, open: false }));
  };

  const rolesDetail = (row: Usuario | null) => {
    if (!row) return null;
    return (
      <div>
        <p className="font-condensed font-600 text-xs uppercase tracking-wider text-text-muted mb-2">Roles asignados</p>
        <div className="flex gap-2 flex-wrap">
          {(row.roles ?? []).length === 0 ? (
            <span className="text-text-muted font-body text-xs">Sin roles asignados</span>
          ) : (row.roles ?? []).map(id => (
            <span key={id} className="px-2.5 py-0.5 rounded-full bg-purple-700/20 text-purple-400 font-condensed text-xs uppercase tracking-wider border border-purple-700/30">
              {getRolNombre(id)}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
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
        extraContent={
          <RolesSelector selected={selectedRoles} onChange={setSelectedRoles} />
        }
      />
      <DetailWidget
        open={detail.open}
        config={config}
        row={detail.row}
        onEdit={() => handleEdit(detail.row!)}
        onDelete={() => handleDelete(detail.row!)}
        onClose={() => setDetail({ open: false, row: null })}
        extraContent={rolesDetail(detail.row)}
      />
    </>
  );
}
