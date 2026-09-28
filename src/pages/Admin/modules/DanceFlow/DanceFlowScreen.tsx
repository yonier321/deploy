import { useMemo, useState } from 'react';
import { createGuardianRecord, findGuardianByDocument } from '../guardianRegistry';

type ModuleId = 'instructores' | 'niveles' | 'grupos' | 'sedes' | 'estilos' | 'talleres' | 'estudiantes';
type Row = Record<string, string | number | string[]> & { id: number; estado: string };
interface PersonaCreada {
  idPersona: number;
  nombre: string;
  tipoDocumento: string;
  documento: string;
  telefono: string;
  email: string;
  fechaNacimiento: string;
}

interface Field {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'email' | 'tel' | 'textarea' | 'select';
  options?: string[];
  required?: boolean;
  section?: string;
  help?: string;
}

interface ModuleDefinition {
  title: string;
  eyebrow: string;
  addLabel: string;
  columns: { key: string; label: string }[];
  fields: Field[];
  search?: boolean;
  filters?: { key: string; label: string; options: string[] }[];
}

const sedes = ['Sede Bello', 'Sede Copacabana'];
const aulasBySede: Record<string, string[]> = {
  'Sede Bello': ['Studio A · 30 cupos', 'Studio B · 20 cupos'],
  'Sede Copacabana': ['Sala Flow · 25 cupos'],
};
const documentTypes = ['Registro civil', 'Tarjeta de identidad', 'Cédula de ciudadanía'];
interface Guardian {
  nombre: string;
  tipoDocumento: string;
  documento: string;
  telefono: string;
  email: string;
  nacimiento: string;
  parentesco: string;
}

const encodeGuardian = (guardian: Guardian) => [
  guardian.nombre, guardian.tipoDocumento, guardian.documento, guardian.telefono,
  guardian.email, guardian.nacimiento, guardian.parentesco,
].join('::');

const parseGuardian = (value: string): Guardian => {
  const [nombre = '', tipoDocumento = '', documento = '', telefono = '', email = '', nacimiento = '', parentesco = ''] = value.split('::');
  return { nombre, tipoDocumento, documento, telefono, email, nacimiento, parentesco };
};
const instructorsBySede: Record<string, string[]> = {
  'Sede Bello': ['Mateo Álvarez', 'Sara Valencia'],
  'Sede Copacabana': ['Sara Valencia', 'Dylan Torres'],
};

const definitions: Record<ModuleId, ModuleDefinition> = {
  instructores: {
    title: 'Instructores',
    eyebrow: 'Gestión Académica',
    addLabel: 'Agregar instructor',
    search: true,
    filters: [{ key: 'sede', label: 'Sede', options: sedes }],
    columns: [
      { key: 'nombre', label: 'Nombre' }, { key: 'documento', label: 'Documento' },
      { key: 'telefono', label: 'Teléfono' }, { key: 'sede', label: 'Sedes asignadas' },
      { key: 'estado', label: 'Estado' },
    ],
    fields: [
      { key: 'nombre', label: 'Nombre', required: true, section: 'Datos personales' },
      { key: 'tipoDocumento', label: 'Tipo de documento', type: 'select', options: documentTypes, required: true },
      { key: 'documento', label: 'Documento', required: true },
      { key: 'telefono', label: 'Teléfono', type: 'tel', required: true },
      { key: 'correo', label: 'Email', type: 'email', required: true },
      { key: 'nacimiento', label: 'Fecha de nacimiento', type: 'date', required: true },
    ],
  },
  niveles: {
    title: 'Niveles',
    eyebrow: 'Gestión Académica',
    addLabel: 'Agregar nivel',
    columns: [
      { key: 'nombre', label: 'Nombre' }, { key: 'orden', label: 'Orden' },
      { key: 'edadMin', label: 'Edad mínima' }, { key: 'edadMax', label: 'Edad máxima' },
      { key: 'estado', label: 'Estado' },
    ],
    fields: [
      { key: 'nombre', label: 'Nombre', required: true },
      { key: 'orden', label: 'Orden', type: 'number', required: true, help: 'Posición en la secuencia: 1 = más básico' },
      { key: 'edadMin', label: 'Edad mínima', type: 'number', required: true },
      { key: 'edadMax', label: 'Edad máxima', type: 'number', required: true },
    ],
  },
  grupos: {
    title: 'Grupos',
    eyebrow: 'Gestión Académica',
    addLabel: 'Crear grupo',
    search: true,
    filters: [
      { key: 'nivel', label: 'Nivel', options: ['Inicial', 'Intermedio', 'Avanzado'] },
      { key: 'estilo', label: 'Estilo', options: ['Hip Hop', 'Breaking', 'Dancehall'] },
      { key: 'instructor', label: 'Instructor', options: ['Mateo Álvarez', 'Sara Valencia', 'Dylan Torres'] },
      { key: 'sede', label: 'Sede', options: sedes },
      { key: 'tipo', label: 'Tipo', options: ['Regular', 'Competencia'] },
      { key: 'convocatoria', label: 'Convocatoria', options: ['Battle Team 2025', 'Crew Nacional 2025'] },
      { key: 'aula', label: 'Aula', options: Object.values(aulasBySede).flat() },
    ],
    columns: [
      { key: 'nombre', label: 'Nombre' }, { key: 'nivel', label: 'Nivel' },
      { key: 'estilo', label: 'Estilo' }, { key: 'instructor', label: 'Instructor' },
      { key: 'sede', label: 'Sede' }, { key: 'aula', label: 'Aula' },
      { key: 'tipo', label: 'Tipo' }, { key: 'capacidad', label: 'Capacidad' },
      { key: 'estado', label: 'Estado' },
    ],
    fields: [
      { key: 'nombre', label: 'Nombre', required: true },
      { key: 'nivel', label: 'Nivel', type: 'select', options: ['Inicial', 'Intermedio', 'Avanzado'], required: true },
      { key: 'estilo', label: 'Estilo', type: 'select', options: ['Hip Hop', 'Breaking', 'Dancehall'], required: true },
      { key: 'tipo', label: 'Tipo de grupo', type: 'select', options: ['Regular', 'Competencia'], required: true },
      { key: 'sede', label: 'Sede', type: 'select', options: sedes, required: true },
      { key: 'aula', label: 'Aula', type: 'select', required: true },
      { key: 'capacidad', label: 'Capacidad', type: 'number', required: true },
      { key: 'instructor', label: 'Instructor', type: 'select', required: true },
      { key: 'convocatoria', label: 'Convocatoria', type: 'select', options: ['Battle Team 2025', 'Crew Nacional 2025'] },
    ],
  },
  sedes: {
    title: 'Sedes',
    eyebrow: 'Gestión Académica',
    addLabel: 'Agregar sede',
    search: true,
    columns: [
      { key: 'nombre', label: 'Nombre' }, { key: 'direccion', label: 'Dirección' },
      { key: 'estado', label: 'Estado' },
    ],
    fields: [
      { key: 'nombre', label: 'Nombre', required: true },
      { key: 'direccion', label: 'Dirección', required: true },
    ],
  },
  estilos: {
    title: 'Estilos',
    eyebrow: 'Oferta',
    addLabel: 'Agregar estilo',
    search: true,
    columns: [{ key: 'nombre', label: 'Nombre' }, { key: 'estado', label: 'Estado' }],
    fields: [{ key: 'nombre', label: 'Nombre', required: true }],
  },
  talleres: {
    title: 'Talleres',
    eyebrow: 'Oferta',
    addLabel: 'Crear taller',
    columns: [
      { key: 'descripcion', label: 'Descripción' }, { key: 'valor', label: 'Valor' },
      { key: 'estado', label: 'Estado' },
    ],
    fields: [
      { key: 'descripcion', label: 'Descripción', type: 'textarea', required: true },
      { key: 'valor', label: 'Valor', type: 'number', required: true, help: 'Valor en pesos colombianos (COP)' },
    ],
  },
  estudiantes: {
    title: 'Estudiantes',
    eyebrow: 'Matrícula',
    addLabel: 'Agregar estudiante',
    search: true,
    filters: [
      { key: 'sede', label: 'Sede', options: sedes },
      { key: 'tipoDocumento', label: 'Tipo de documento', options: documentTypes },
    ],
    columns: [
      { key: 'nombre', label: 'Nombre' }, { key: 'documento', label: 'Documento' },
      { key: 'sede', label: 'Sede' }, { key: 'acudientes', label: 'Acudiente(s)' },
      { key: 'estado', label: 'Estado' },
    ],
    fields: [
      { key: 'nombre', label: 'Nombre', required: true, section: 'Datos personales' },
      { key: 'tipoDocumento', label: 'Tipo de documento', type: 'select', options: documentTypes, required: true },
      { key: 'documento', label: 'Documento', required: true },
      { key: 'nacimiento', label: 'Fecha de nacimiento', type: 'date', required: true },
      { key: 'telefono', label: 'Teléfono', type: 'tel', required: true },
      { key: 'email', label: 'Email', type: 'email', required: true },
      { key: 'sede', label: 'Sede', type: 'select', options: sedes, required: true, section: 'Datos de estudiante' },
    ],
  },
};

const initialRows: Record<ModuleId, Row[]> = {
  instructores: [
    { id: 1, nombre: 'Mateo Álvarez', tipoDocumento: 'Cédula de ciudadanía', documento: '1.037.415.820', telefono: '310 402 1860', correo: 'mateo@danceflow.co', nacimiento: '1994-06-12', sede: ['Sede Bello'], estado: 'Activo' },
    { id: 2, nombre: 'Sara Valencia', tipoDocumento: 'Cédula de ciudadanía', documento: '1.045.876.211', telefono: '315 822 9071', correo: 'sara@danceflow.co', nacimiento: '1996-02-18', sede: sedes, estado: 'Activo' },
    { id: 3, nombre: 'Dylan Torres', tipoDocumento: 'Cédula de ciudadanía', documento: '1.020.332.984', telefono: '300 674 3092', correo: 'dylan@danceflow.co', nacimiento: '1991-11-03', sede: ['Sede Copacabana'], estado: 'Inactivo' },
  ],
  niveles: [
    { id: 1, nombre: 'Inicial', orden: 1, edadMin: 7, edadMax: 12, estado: 'Activo' },
    { id: 2, nombre: 'Intermedio', orden: 2, edadMin: 12, edadMax: 17, estado: 'Activo' },
    { id: 3, nombre: 'Avanzado', orden: 3, edadMin: 16, edadMax: 30, estado: 'Activo' },
  ],
  grupos: [
    { id: 1, nombre: 'Urban Kids 01', nivel: 'Inicial', estilo: 'Hip Hop', instructor: 'Mateo Álvarez', sede: 'Sede Bello', aula: 'Studio A · 30 cupos', tipo: 'Regular', convocatoria: '—', capacidad: 24, estado: 'Activo' },
    { id: 2, nombre: 'Bello Crew', nivel: 'Avanzado', estilo: 'Breaking', instructor: 'Sara Valencia', sede: 'Sede Bello', aula: 'Studio B · 20 cupos', tipo: 'Competencia', convocatoria: 'Battle Team 2025', capacidad: 16, estado: 'Activo' },
    { id: 3, nombre: 'Flow 17', nivel: 'Intermedio', estilo: 'Dancehall', instructor: 'Dylan Torres', sede: 'Sede Copacabana', aula: 'Sala Flow · 25 cupos', tipo: 'Regular', convocatoria: '—', capacidad: 20, estado: 'Activo' },
  ],
  sedes: [
    { id: 1, nombre: 'Sede Bello', direccion: 'Carrera 43 # 72–18, Bello', estado: 'Activo', asociados: 8 },
    { id: 2, nombre: 'Sede Copacabana', direccion: 'Calle 50 # 48–22, Copacabana', estado: 'Activo', asociados: 6 },
  ],
  estilos: [
    { id: 1, nombre: 'Hip Hop', estado: 'Activo' }, { id: 2, nombre: 'Breaking', estado: 'Activo' },
    { id: 3, nombre: 'Dancehall', estado: 'Activo' }, { id: 4, nombre: 'Popping', estado: 'Inactivo' },
  ],
  talleres: [
    { id: 1, descripcion: 'Musicalidad aplicada al freestyle', valor: 85000, estado: 'Activo', asociados: 12 },
    { id: 2, descripcion: 'Breaking foundations intensivo', valor: 110000, estado: 'Activo', asociados: 0 },
  ],
  estudiantes: [
    { id: 1, nombre: 'Valentina Restrepo', tipoDocumento: 'Tarjeta de identidad', documento: '1.024.332.876', nacimiento: '2008-03-14', telefono: '315 410 2287', email: 'valentina@mail.com', sede: 'Sede Bello', acudientes: [encodeGuardian({ nombre: 'María Restrepo', tipoDocumento: 'Cédula de ciudadanía', documento: '43.582.910', telefono: '310 448 9021', email: 'maria.restrepo@mail.com', nacimiento: '1982-04-16', parentesco: 'Madre' })], estado: 'Activo' },
    { id: 2, nombre: 'Samuel Ortiz', tipoDocumento: 'Registro civil', documento: '1.008.224.512', nacimiento: '2011-09-22', telefono: '301 772 1044', email: 'samuel@mail.com', sede: 'Sede Copacabana', acudientes: [encodeGuardian({ nombre: 'Carlos Ortiz', tipoDocumento: 'Cédula de ciudadanía', documento: '71.203.445', telefono: '300 771 2280', email: 'carlos.ortiz@mail.com', nacimiento: '1979-08-11', parentesco: 'Padre' })], estado: 'Activo' },
    { id: 3, nombre: 'Laura Mejía', tipoDocumento: 'Cédula de ciudadanía', documento: '1.017.934.110', nacimiento: '2006-01-08', telefono: '320 119 8765', email: 'laura@mail.com', sede: 'Sede Bello', acudientes: [], estado: 'Inactivo' },
  ],
};

const iconButton = 'grid h-8 w-8 place-items-center rounded-lg text-text-muted transition hover:bg-purple-400/10 hover:text-purple-400';
const inputClass = 'w-full rounded-xl border border-border bg-surface-alt px-3.5 py-2.5 text-sm text-text outline-none transition focus:border-purple-400';

function Icon({ name }: { name: 'search' | 'filter' | 'plus' | 'eye' | 'edit' | 'power' | 'trash' | 'close' }) {
  const paths = {
    search: 'M21 21l-4.35-4.35m1.35-5.4a6.75 6.75 0 11-13.5 0 6.75 6.75 0 0113.5 0z',
    filter: 'M3 5h18l-7 8v5l-4 2v-7L3 5z',
    plus: 'M12 5v14M5 12h14',
    eye: 'M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6zm9.5 2.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',
    edit: 'M15.5 5.5l3 3M4 20l4.5-1 10-10a2.12 2.12 0 00-3-3l-10 10L4 20z',
    power: 'M12 2v10m6.36-6.36a9 9 0 11-12.72 0',
    trash: 'M4 7h16M9 7V4h6v3m3 0-1 13H7L6 7',
    close: 'M6 6l12 12M18 6L6 18',
  };
  return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={paths[name]} /></svg>;
}

function StatusBadge({ value }: { value: string }) {
  const active = value === 'Activo';
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${active ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-400' : 'border-white/10 bg-white/5 text-text-muted'}`}>{value}</span>;
}

export default function DanceFlowScreen({ moduleId }: { moduleId: ModuleId }) {
  const config = definitions[moduleId];
  const [rows, setRows] = useState(() => initialRows[moduleId]);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [modal, setModal] = useState<'form' | 'detail' | 'state' | 'delete' | null>(null);
  const [selected, setSelected] = useState<Row | null>(null);
  const [form, setForm] = useState<Record<string, string | string[]>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [guardianModal, setGuardianModal] = useState(false);
  const [guardianDraft, setGuardianDraft] = useState<Record<string, string>>({});
  const [guardianErrors, setGuardianErrors] = useState<Record<string, string>>({});
  const [editingGuardianIndex, setEditingGuardianIndex] = useState<number | null>(null);
  const [guardianContext, setGuardianContext] = useState<'form' | 'detail'>('form');
  const [success, setSuccess] = useState('');
  const [personasCreadas, setPersonasCreadas] = useState<PersonaCreada[]>([]);
  const [selectedGuardianDocument, setSelectedGuardianDocument] = useState('');

  const filteredRows = useMemo(() => rows.filter(row => {
    const matchesSearch = !search || Object.values(row).some(value => String(value).toLowerCase().includes(search.toLowerCase()));
    const matchesFilters = Object.entries(filters).every(([key, values]) => {
      if (!values.length) return true;
      const rowValue = row[key];
      return Array.isArray(rowValue)
        ? values.some(value => rowValue.includes(value))
        : values.includes(String(rowValue));
    });
    return matchesSearch && matchesFilters;
  }), [filters, rows, search]);

  const openForm = (row?: Row, competition = false) => {
    setSelected(row ?? null);
    setForm(row ? Object.fromEntries(Object.entries(row).map(([key, value]) => [key, Array.isArray(value) ? [...value] : String(value)])) : {
      estado: 'Activo',
      ...(moduleId === 'instructores' ? { sede: ['Sede Bello'] } : {}),
      ...(moduleId === 'grupos' ? { tipo: competition ? 'Competencia' : 'Regular', ...(competition ? { nivel: 'Avanzado' } : {}) } : {}),
      ...(moduleId === 'estudiantes' ? { acudientes: [] } : {}),
    });
    setErrors({});
    setModal('form');
  };

  const setValue = (key: string, value: string | string[]) => {
    if (moduleId === 'estudiantes' && key === 'tipoDocumento') {
      setForm(prev => ({
        ...prev,
        tipoDocumento: value,
        ...(value === 'Cédula de ciudadanía' ? { acudientes: [] } : {}),
      }));
      setErrors(prev => ({ ...prev, tipoDocumento: '', acudientes: '' }));
      return;
    }
    if (moduleId === 'grupos' && key === 'sede') {
      const currentAula = String(form.aula ?? '');
      const currentInstructor = String(form.instructor ?? '');
      const aulaIsValid = (aulasBySede[String(value)] ?? []).includes(currentAula);
      const instructorIsValid = (instructorsBySede[String(value)] ?? []).includes(currentInstructor);
      setForm(prev => ({
        ...prev,
        sede: value,
        aula: aulaIsValid ? currentAula : '',
        instructor: instructorIsValid ? currentInstructor : '',
      }));
      setErrors(prev => ({
        ...prev,
        sede: '',
        aula: currentAula && !aulaIsValid ? 'El aula no pertenece a la nueva sede. Selecciona otra.' : '',
        instructor: currentInstructor && !instructorIsValid ? 'El instructor no trabaja en la nueva sede. Selecciona otro.' : '',
      }));
      return;
    }
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    config.fields.forEach(field => {
      if (field.required && !String(form[field.key] ?? '').trim()) next[field.key] = 'Este campo es obligatorio.';
    });
    if (moduleId === 'instructores' && (!Array.isArray(form.sede) || !form.sede.length)) next.sede = 'Selecciona al menos una sede.';
    if (moduleId === 'niveles') {
      if (Number(form.edadMin) >= Number(form.edadMax)) next.edadMax = 'La edad máxima debe ser mayor que la edad mínima.';
      if (rows.some(row => row.id !== selected?.id && Number(row.orden) === Number(form.orden))) next.orden = 'Este orden ya está en uso.';
    }
    if (moduleId === 'grupos') {
      const capacity = String(form.aula).includes('30') ? 30 : String(form.aula).includes('20') ? 20 : 25;
      if (Number(form.capacidad) > capacity) next.capacidad = `La capacidad del aula es de ${capacity} personas.`;
      if (form.tipo === 'Competencia' && !form.convocatoria) next.convocatoria = 'Selecciona una convocatoria abierta.';
    }
    if (moduleId === 'talleres' && Number(form.valor) < 0) next.valor = 'El valor no puede ser negativo.';
    const studentNeedsGuardian = form.tipoDocumento === 'Registro civil' || form.tipoDocumento === 'Tarjeta de identidad';
    if (moduleId === 'estudiantes' && studentNeedsGuardian && (!Array.isArray(form.acudientes) || !form.acudientes.length)) next.acudientes = 'Agrega al menos un acudiente responsable.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const save = () => {
    if (!validate()) return;
    const normalized = Object.fromEntries(Object.entries(form).map(([key, value]) => {
      const field = config.fields.find(item => item.key === key);
      return [key, field?.type === 'number' ? Number(value) : value];
    })) as Row;
    if (selected) setRows(prev => prev.map(row => row.id === selected.id ? { ...row, ...normalized } : row));
    else {
      let idPersona: number | undefined;
      if (moduleId === 'estudiantes' || moduleId === 'instructores') {
        /*
         * Guardado encadenado: la API debe persistir primero Persona y usar el
         * idPersona resultante al crear Estudiante o Instructor. La interfaz
         * mantiene una sola acción de Guardar para las dos operaciones.
         */
        idPersona = Math.max(1000, ...personasCreadas.map(persona => persona.idPersona)) + 1;
        setPersonasCreadas(prev => [...prev, {
          idPersona: idPersona!,
          nombre: String(form.nombre),
          tipoDocumento: String(form.tipoDocumento),
          documento: String(form.documento),
          telefono: String(form.telefono),
          email: String(form.email ?? form.correo),
          fechaNacimiento: String(form.nacimiento),
        }]);
      }
      setRows(prev => [...prev, {
        ...normalized,
        ...(idPersona ? { idPersona } : {}),
        id: Math.max(0, ...prev.map(row => row.id)) + 1,
        estado: 'Activo',
      }]);
    }
    const subject = config.title === 'Sedes' ? 'La sede' : config.title === 'Estilos' ? 'El estilo' : config.title === 'Talleres' ? 'El taller' : config.title === 'Niveles' ? 'El nivel' : config.title === 'Grupos' ? 'El grupo' : config.title === 'Estudiantes' ? 'El estudiante' : 'El instructor';
    setSuccess(`${subject} se ${selected ? 'actualizó' : 'creó'} correctamente.`);
    window.setTimeout(() => setSuccess(''), 3500);
    setModal(null);
  };

  const confirmState = () => {
    if (!selected) return;
    setRows(prev => prev.map(row => row.id === selected.id ? { ...row, estado: row.estado === 'Activo' ? 'Inactivo' : 'Activo' } : row));
    setModal(null);
  };

  const confirmDelete = () => {
    if (!selected || Number(selected.asociados) > 0) return;
    setRows(prev => prev.filter(row => row.id !== selected.id));
    setModal(null);
  };

  const instructorOptions = instructorsBySede[String(form.sede ?? '')] ?? [];
  const aulaOptions = aulasBySede[String(form.sede ?? '')] ?? [];
  const studentNeedsGuardian = form.tipoDocumento === 'Registro civil' || form.tipoDocumento === 'Tarjeta de identidad';
  const guardianSearchResult = findGuardianByDocument(guardianDraft.busqueda ?? '');
  const selectedExistingGuardian = findGuardianByDocument(selectedGuardianDocument);

  const openGuardianForm = () => {
    setGuardianDraft({});
    setGuardianErrors({});
    setEditingGuardianIndex(null);
    setGuardianContext('form');
    setSelectedGuardianDocument('');
    setGuardianModal(true);
  };

  const openGuardianEdit = (value: string, index: number, context: 'form' | 'detail') => {
    setGuardianDraft(parseGuardian(value));
    setGuardianErrors({});
    setEditingGuardianIndex(index);
    setGuardianContext(context);
    setSelectedGuardianDocument('');
    setGuardianModal(true);
  };

  const saveGuardian = () => {
    const required = selectedExistingGuardian ? ['parentesco'] : ['nombre', 'tipoDocumento', 'documento', 'telefono', 'email', 'nacimiento', 'parentesco'];
    const next = Object.fromEntries(required.filter(key => !guardianDraft[key]?.trim()).map(key => [key, 'Este campo es obligatorio.']));
    setGuardianErrors(next);
    if (Object.keys(next).length) return;
    const guardian: Guardian = selectedExistingGuardian ? {
      nombre: selectedExistingGuardian.nombre,
      tipoDocumento: selectedExistingGuardian.tipoDocumento,
      documento: selectedExistingGuardian.documento,
      telefono: selectedExistingGuardian.telefono,
      email: selectedExistingGuardian.email,
      nacimiento: selectedExistingGuardian.nacimiento,
      parentesco: guardianDraft.parentesco,
    } : guardianDraft as unknown as Guardian;
    if (!selectedExistingGuardian && editingGuardianIndex === null) {
      createGuardianRecord({
        nombre: guardian.nombre,
        tipoDocumento: guardian.tipoDocumento,
        documento: guardian.documento,
        telefono: guardian.telefono,
        email: guardian.email,
        nacimiento: guardian.nacimiento,
      });
    }
    const encoded = encodeGuardian(guardian);
    if (guardianContext === 'detail' && selected) {
      const current = Array.isArray(selected.acudientes) ? selected.acudientes : [];
      const updated = current.map((item, index) => index === editingGuardianIndex ? encoded : item);
      const updatedStudent = { ...selected, acudientes: updated };
      setSelected(updatedStudent);
      setRows(prev => prev.map(row => row.id === selected.id ? updatedStudent : row));
    } else {
      const guardians = Array.isArray(form.acudientes) ? form.acudientes : [];
      const updated = editingGuardianIndex === null
        ? [...guardians, encoded]
        : guardians.map((item, index) => index === editingGuardianIndex ? encoded : item);
      setValue('acudientes', updated);
    }
    setGuardianModal(false);
    setSuccess(editingGuardianIndex === null ? 'El acudiente se creó y vinculó correctamente.' : 'El acudiente se actualizó correctamente.');
    window.setTimeout(() => setSuccess(''), 3500);
  };

  return (
    <div className="flex flex-col gap-6">
      {success && <div role="status" className="fixed right-6 top-6 z-[70] flex items-center gap-3 rounded-2xl border border-emerald-500/25 bg-surface px-5 py-4 text-sm font-semibold text-emerald-300 shadow-2xl shadow-black/30"><span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-500/20">✓</span>{success}</div>}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 font-condensed text-xs font-semibold uppercase tracking-[0.22em] text-purple-400">{config.eyebrow}</p>
          <h1 className="font-display text-4xl uppercase leading-none text-text">{config.title}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {moduleId === 'grupos' && <button onClick={() => openForm(undefined, true)} className="rounded-full border border-purple-400/35 px-4 py-2.5 font-condensed text-sm font-semibold uppercase tracking-wider text-purple-400 transition hover:bg-purple-400/10">Crear grupo de competencia</button>}
          <button onClick={() => openForm()} className="flex items-center gap-2 rounded-full bg-purple-700 px-4 py-2.5 font-condensed text-sm font-semibold uppercase tracking-wider text-white shadow-lg shadow-purple-700/20 transition hover:bg-purple-900"><Icon name="plus" />{config.addLabel}</button>
        </div>
      </div>

      {(config.search || config.filters?.length) && (
        <div className="relative flex flex-wrap gap-3 rounded-2xl border border-border bg-surface p-3">
          {config.search && <label className="relative min-w-56 flex-1"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"><Icon name="search" /></span><input value={search} onChange={event => setSearch(event.target.value)} placeholder={`Buscar ${config.title.toLowerCase()}...`} className={`${inputClass} pl-9`} /></label>}
          {config.filters?.length ? <button
            type="button"
            onClick={() => setFiltersOpen(open => !open)}
            className={`relative grid h-11 w-11 place-items-center rounded-xl border transition ${filtersOpen || Object.values(filters).some(values => values.length > 0) ? 'border-purple-400/50 bg-purple-400/10 text-purple-400' : 'border-border text-text-muted hover:text-text'}`}
            aria-label="Abrir filtros"
            aria-expanded={filtersOpen}
          >
            <Icon name="filter" />
            {Object.values(filters).flat().length > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-purple-700 px-1 text-[10px] font-bold text-white">{Object.values(filters).flat().length}</span>}
          </button> : null}
          {filtersOpen && config.filters?.length ? <div className="absolute right-3 top-[calc(100%+8px)] z-30 w-72 rounded-2xl border border-border bg-surface p-4 shadow-2xl shadow-black/30">
            <div className="mb-3 flex items-center justify-between"><p className="font-condensed text-xs font-bold uppercase tracking-widest text-text">Filtrar por</p><button type="button" onClick={() => setFilters({})} className="text-xs font-semibold text-purple-400">Limpiar</button></div>
            <div className="flex max-h-[55vh] flex-col gap-4 overflow-y-auto pr-1">{config.filters.map(filter => <fieldset key={filter.key}><legend className="mb-2 font-condensed text-[11px] font-semibold uppercase tracking-wider text-text-muted">{filter.label}</legend><div className="flex flex-wrap gap-2">{filter.options.map(option => {
              const checked = (filters[filter.key] ?? []).includes(option);
              return <label key={option} className={`flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition ${checked ? 'border-purple-400/50 bg-purple-400/10 text-purple-400' : 'border-border text-text-soft hover:border-purple-400/30'}`}><input type="checkbox" checked={checked} onChange={() => setFilters(prev => {
                const current = prev[filter.key] ?? [];
                return { ...prev, [filter.key]: checked ? current.filter(value => value !== option) : [...current, option] };
              })} className="sr-only" /><span className={`grid h-3.5 w-3.5 place-items-center rounded border ${checked ? 'border-purple-400 bg-purple-700 text-white' : 'border-text-muted'}`}>{checked ? '✓' : ''}</span>{option}</label>;
            })}</div></fieldset>)}</div>
            <button type="button" onClick={() => setFiltersOpen(false)} className="mt-4 w-full rounded-full bg-purple-700 py-2 font-condensed text-xs font-bold uppercase tracking-wider text-white">Aplicar filtros</button>
          </div> : null}
        </div>
      )}

      <div className="overflow-hidden rounded-[20px] border border-border bg-surface">
        {filteredRows.length === 0 ? <div className="flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-2xl border border-purple-400/20 bg-purple-400/10 text-purple-400"><Icon name="plus" /></div>
          <h2 className="mt-4 font-display text-xl uppercase text-text">No hay información disponible</h2>
          <p className="mt-2 max-w-sm text-sm leading-6 text-text-muted">No hay registros para mostrar en el módulo de {config.title.toLowerCase()}.</p>
          <button type="button" onClick={() => openForm()} className="mt-5 flex items-center gap-2 rounded-full bg-purple-700 px-5 py-2.5 font-condensed text-sm font-semibold uppercase tracking-wider text-white"><Icon name="plus" /> Crear primer registro</button>
        </div> : <>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead><tr className="border-b border-border bg-white/[0.02]">{config.columns.map(column => <th key={column.key} className="px-4 py-3.5 text-left font-condensed text-xs font-semibold uppercase tracking-widest text-text-muted">{column.label}</th>)}<th className="px-4 py-3 text-right font-condensed text-xs font-semibold uppercase tracking-widest text-text-muted">Acciones</th></tr></thead>
            <tbody>{filteredRows.map(row => <tr key={row.id} className="group border-b border-border last:border-0 hover:bg-purple-400/[0.04]">
              {config.columns.map((column, index) => <td key={column.key} className={`max-w-56 px-4 py-4 text-sm ${index === 0 ? 'font-semibold text-text' : 'text-text-soft'}`}>
                {column.key === 'estado' ? <StatusBadge value={String(row.estado)} /> : column.key === 'tipo' ? <span className="rounded-full bg-purple-400/10 px-2.5 py-1 text-xs font-semibold text-purple-400">{String(row[column.key])}</span> : column.key === 'valor' ? `$${Number(row.valor).toLocaleString('es-CO')}` : column.key === 'acudientes' && Array.isArray(row[column.key]) ? (row[column.key] as string[]).map(parseGuardian).map(guardian => guardian.nombre).join(', ') || '—' : Array.isArray(row[column.key]) ? <div className="flex gap-1">{(row[column.key] as string[]).map(value => <span key={value} className="rounded-full border border-purple-400/20 bg-purple-400/10 px-2 py-1 text-xs text-purple-400">{value}</span>)}</div> : String(row[column.key] ?? '—')}
              </td>)}
              <td className="px-4 py-3"><div className="flex justify-end gap-1">
                {moduleId !== 'estilos' && <button className={iconButton} title="Ver detalle" onClick={() => { setSelected(row); setModal('detail'); }}><Icon name="eye" /></button>}
                <button className={iconButton} title="Editar" onClick={() => openForm(row)}><Icon name="edit" /></button>
                <button className={iconButton} title="Cambiar estado" onClick={() => { setSelected(row); setModal('state'); }}><Icon name="power" /></button>
                {(moduleId === 'sedes' || moduleId === 'talleres') && <button className={`${iconButton} hover:text-red-400`} title="Eliminar" onClick={() => { setSelected(row); setModal('delete'); }}><Icon name="trash" /></button>}
              </div></td>
            </tr>)}</tbody>
          </table>
        </div>
        <div className="border-t border-border px-5 py-3 font-condensed text-xs uppercase tracking-wider text-text-muted">{filteredRows.length} de {rows.length} registros</div>
        </>}
      </div>

      {modal && <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm" onMouseDown={event => event.target === event.currentTarget && setModal(null)}>
        <div className={`max-h-[92vh] w-full overflow-y-auto rounded-[24px] border border-border bg-surface shadow-2xl ${modal === 'form' ? 'max-w-2xl' : 'max-w-lg'}`}>
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface px-6 py-5">
            <div><p className="font-condensed text-[11px] font-semibold uppercase tracking-[0.2em] text-purple-400">{config.eyebrow}</p><h2 className="mt-1 font-display text-2xl uppercase text-text">{modal === 'form' ? `${selected ? 'Editar' : 'Crear'} ${config.title.toLowerCase()}` : modal === 'detail' ? 'Detalle' : modal === 'state' ? 'Cambiar estado' : 'Eliminar registro'}</h2></div>
            <button className={iconButton} onClick={() => setModal(null)}><Icon name="close" /></button>
          </div>

          {modal === 'form' && <form onSubmit={event => { event.preventDefault(); save(); }} className="p-6">
            <div className="grid gap-5 sm:grid-cols-2">
              {config.fields.map((field, index) => {
                if (moduleId === 'grupos' && field.key === 'convocatoria' && form.tipo !== 'Competencia') return null;
                const sectionStart = field.section && (index === 0 || config.fields[index - 1].section !== field.section);
                const options = moduleId === 'grupos' && field.key === 'instructor'
                  ? instructorOptions
                  : moduleId === 'grupos' && field.key === 'aula'
                    ? aulaOptions
                    : moduleId === 'grupos' && field.key === 'tipo'
                      ? [String(form.tipo ?? 'Regular')]
                      : field.options;
                return <div key={field.key} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
                  {sectionStart && <h3 className="mb-4 border-b border-border pb-2 font-condensed text-sm font-bold uppercase tracking-widest text-text sm:col-span-2">{field.section}</h3>}
                  <label className="mb-1.5 block font-condensed text-xs font-semibold uppercase tracking-wider text-text-muted">{field.label}{field.required && <span className="ml-1 text-purple-400">*</span>}</label>
                  {field.type === 'select' ? <select disabled={moduleId === 'grupos' && (field.key === 'aula' || field.key === 'instructor') && !form.sede} value={String(form[field.key] ?? '')} onChange={event => setValue(field.key, event.target.value)} className={`${inputClass} disabled:cursor-not-allowed disabled:opacity-45`}><option value="">{moduleId === 'grupos' && (field.key === 'aula' || field.key === 'instructor') && !form.sede ? 'Selecciona una sede primero' : 'Seleccionar...'}</option>{options?.map(option => <option key={option}>{option}</option>)}</select> : field.type === 'textarea' ? <textarea value={String(form[field.key] ?? '')} onChange={event => setValue(field.key, event.target.value)} rows={3} className={inputClass} /> : <input type={field.type ?? 'text'} value={String(form[field.key] ?? '')} onChange={event => setValue(field.key, event.target.value)} className={inputClass} />}
                  {field.help && <p className="mt-1.5 text-xs text-text-muted">{field.help}</p>}
                  {errors[field.key] && <p className="mt-1.5 text-xs text-red-400">{errors[field.key]}</p>}
                </div>;
              })}

              {moduleId === 'instructores' && <div className="sm:col-span-2"><h3 className="mb-4 border-b border-border pb-2 font-condensed text-sm font-bold uppercase tracking-widest text-text">Datos de instructor</h3><p className="mb-2 font-condensed text-xs font-semibold uppercase tracking-wider text-text-muted">Sedes asignadas *</p><div className="overflow-hidden rounded-xl border border-border">{sedes.map(sede => {
                const selectedSedes = Array.isArray(form.sede) ? form.sede : [];
                const checked = selectedSedes.includes(sede);
                return <label key={sede} className="flex cursor-pointer items-center justify-between border-b border-border px-4 py-3 last:border-0"><span className="text-sm text-text">{sede}</span><input type="checkbox" checked={checked} onChange={() => setValue('sede', checked ? selectedSedes.filter(item => item !== sede) : [...selectedSedes, sede])} className="peer sr-only" /><span className="h-6 w-11 rounded-full bg-white/10 p-0.5 transition peer-checked:bg-purple-700"><span className={`block h-5 w-5 rounded-full bg-white transition ${checked ? 'translate-x-5' : ''}`} /></span></label>;
              })}</div>{errors.sede && <p className="mt-1.5 text-xs text-red-400">{errors.sede}</p>}</div>}

              {moduleId === 'grupos' && form.tipo === 'Competencia' && <div className="sm:col-span-2 rounded-xl border border-purple-400/20 bg-purple-400/5 p-4"><p className="font-condensed text-xs font-bold uppercase tracking-wider text-purple-400">Seleccionar estudiantes aceptados</p><div className="mt-3 grid gap-2 sm:grid-cols-2">{['Valentina Restrepo', 'Samuel Ortiz', 'Laura Mejía'].map(student => <label key={student} className="flex items-center gap-2 text-sm text-text-soft"><input type="checkbox" className="accent-purple-700" />{student}</label>)}</div></div>}

              {moduleId === 'estudiantes' && studentNeedsGuardian && <div className="sm:col-span-2">
                <div className="mb-2 flex items-center justify-between"><label className="font-condensed text-xs font-semibold uppercase tracking-wider text-text-muted">Acudientes responsables *</label><button type="button" onClick={openGuardianForm} className="flex items-center gap-1.5 rounded-full border border-purple-400/30 px-3 py-1.5 font-condensed text-xs font-bold uppercase tracking-wider text-purple-400 hover:bg-purple-400/10"><Icon name="plus" /> Agregar acudiente</button></div>
                <div className="grid gap-2">{Array.isArray(form.acudientes) && form.acudientes.length ? form.acudientes.map((value, index) => {
                  const guardian = parseGuardian(value);
                  return <div key={`${value}-${index}`} className="rounded-xl border border-border bg-surface-alt px-4 py-3"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold text-text">{guardian.nombre}</p><p className="mt-0.5 text-xs text-purple-400">{guardian.parentesco}</p></div><div className="flex"><button type="button" onClick={() => openGuardianEdit(value, index, 'form')} className={iconButton} title="Editar acudiente"><Icon name="edit" /></button><button type="button" onClick={() => { if (window.confirm(`¿Deseas quitar a ${guardian.nombre} como acudiente responsable?`)) setValue('acudientes', (form.acudientes as string[]).filter((_, itemIndex) => itemIndex !== index)); }} className={`${iconButton} hover:text-red-400`} title="Quitar acudiente"><Icon name="trash" /></button></div></div><div className="mt-3 grid gap-1 text-xs text-text-muted sm:grid-cols-3"><span>Doc. {guardian.documento}</span><span>{guardian.telefono}</span><span className="truncate">{guardian.email}</span></div></div>;
                }) : <div className="rounded-xl border border-dashed border-border px-4 py-5 text-center text-sm text-text-muted">No hay acudientes agregados.</div>}</div>
                {errors.acudientes && <p className="mt-1.5 text-xs text-red-400">{errors.acudientes}</p>}
              </div>}
            </div>
            <div className="mt-7 flex justify-end gap-3 border-t border-border pt-5"><button type="button" onClick={() => setModal(null)} className="rounded-full border border-border px-5 py-2.5 font-condensed text-sm font-semibold uppercase tracking-wider text-text-soft">Cancelar</button><button type="submit" className="rounded-full bg-purple-700 px-6 py-2.5 font-condensed text-sm font-semibold uppercase tracking-wider text-white hover:bg-purple-900">Guardar</button></div>
          </form>}

          {modal === 'detail' && selected && <div className="p-6">
            <div className="grid grid-cols-2 gap-4">{Object.entries(selected).filter(([key]) => key !== 'id' && key !== 'idPersona' && key !== 'asociados' && !(moduleId === 'estudiantes' && key === 'acudientes')).map(([key, value]) => <div key={key} className={Array.isArray(value) ? 'col-span-2' : ''}><p className="font-condensed text-[11px] font-semibold uppercase tracking-wider text-text-muted">{config.columns.find(column => column.key === key)?.label ?? config.fields.find(field => field.key === key)?.label ?? key}</p><div className="mt-1 text-sm font-medium text-text">{key === 'estado' ? <StatusBadge value={String(value)} /> : Array.isArray(value) ? value.join(', ') : String(value)}</div></div>)}</div>
            {moduleId === 'estudiantes' && <div className="mt-6"><h3 className="mb-3 font-condensed text-xs font-bold uppercase tracking-widest text-text-muted">Acudientes responsables</h3><div className="grid gap-3">{Array.isArray(selected.acudientes) && selected.acudientes.length ? selected.acudientes.map((value, index) => {
              const guardian = parseGuardian(value);
              return <div key={`${value}-${index}`} className="rounded-xl border border-border bg-surface-alt p-4"><div className="flex items-start justify-between"><div><p className="font-semibold text-text">{guardian.nombre}</p><p className="mt-0.5 text-xs font-semibold text-purple-400">{guardian.parentesco}</p></div><button type="button" onClick={() => openGuardianEdit(value, index, 'detail')} className={iconButton} title="Editar acudiente"><Icon name="edit" /></button></div><dl className="mt-3 grid gap-2 text-xs sm:grid-cols-2"><div><dt className="text-text-muted">Documento</dt><dd className="mt-0.5 text-text">{guardian.documento}</dd></div><div><dt className="text-text-muted">Teléfono</dt><dd className="mt-0.5 text-text">{guardian.telefono}</dd></div><div className="sm:col-span-2"><dt className="text-text-muted">Email</dt><dd className="mt-0.5 text-text">{guardian.email}</dd></div></dl></div>;
            }) : <p className="rounded-xl border border-dashed border-border p-4 text-center text-sm text-text-muted">No tiene acudientes registrados.</p>}</div></div>}
            <div className="mt-6 rounded-xl border border-border bg-surface-alt p-4 text-sm text-text-soft">{moduleId === 'instructores' ? 'Grupos actuales: Urban Kids 01 · Lunes y miércoles, 5:00 p. m.' : moduleId === 'niveles' ? 'Grupos asociados: 2 grupos activos' : moduleId === 'grupos' ? 'Horario: martes y jueves, 6:00 p. m. · 18 estudiantes matriculados' : moduleId === 'sedes' ? '3 aulas · 4 instructores habilitados · 6 grupos activos' : moduleId === 'talleres' ? `${Number(selected.asociados)} estudiantes inscritos` : moduleId === 'estudiantes' ? 'Matrícula activa · Estado de cuenta al día' : 'Registro de oferta académica'}</div>
          </div>}

          {(modal === 'state' || modal === 'delete') && selected && <div className="p-6"><p className="text-sm leading-6 text-text-soft">{modal === 'state' ? `¿Deseas cambiar el estado de “${selected.nombre ?? selected.descripcion}” a ${selected.estado === 'Activo' ? 'Inactivo' : 'Activo'}?` : `¿Deseas eliminar “${selected.nombre ?? selected.descripcion}”? Esta acción no se puede deshacer.`}</p>{modal === 'delete' && Number(selected.asociados) > 0 && <div className="mt-4 rounded-xl border border-amber-500/25 bg-amber-500/10 p-3 text-sm text-amber-300">No se puede eliminar porque tiene {String(selected.asociados)} {moduleId === 'sedes' ? 'aulas, instructores o grupos asociados' : 'inscripciones activas'}.</div>}<div className="mt-6 flex justify-end gap-3"><button onClick={() => setModal(null)} className="rounded-full border border-border px-5 py-2.5 font-condensed text-sm font-semibold uppercase tracking-wider text-text-soft">Cancelar</button><button disabled={modal === 'delete' && Number(selected.asociados) > 0} onClick={modal === 'state' ? confirmState : confirmDelete} className="rounded-full bg-red-600 px-5 py-2.5 font-condensed text-sm font-semibold uppercase tracking-wider text-white disabled:cursor-not-allowed disabled:opacity-40">{modal === 'state' ? 'Confirmar cambio' : 'Eliminar'}</button></div></div>}
        </div>

        {guardianModal && <div className="absolute inset-0 z-20 grid place-items-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[24px] border border-border bg-surface shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface px-6 py-5">
              <div><p className="font-condensed text-[11px] font-semibold uppercase tracking-[0.2em] text-purple-400">Acudientes responsables</p><h3 className="mt-1 font-display text-2xl uppercase text-text">{editingGuardianIndex === null ? 'Agregar acudiente' : 'Editar acudiente'}</h3></div>
              <button type="button" className={iconButton} onClick={() => setGuardianModal(false)}><Icon name="close" /></button>
            </div>
            <div className="p-6">
              <label className="block"><span className="mb-1.5 block font-condensed text-xs font-semibold uppercase tracking-wider text-text-muted">Verificar persona por documento</span><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"><Icon name="search" /></span><input value={guardianDraft.busqueda ?? ''} onChange={event => { setGuardianDraft(prev => ({ ...prev, busqueda: event.target.value })); setSelectedGuardianDocument(''); }} placeholder="Ingresa el número de documento" className={`${inputClass} pl-9`} /></div></label>
              {guardianDraft.busqueda && (guardianSearchResult
                ? <button type="button" onClick={() => setSelectedGuardianDocument(guardianSearchResult.documento)} className={`mt-3 flex w-full items-center justify-between rounded-xl border p-3 text-left text-sm transition ${selectedExistingGuardian ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' : 'border-purple-400/30 bg-purple-400/5 text-text-soft hover:border-purple-400'}`}><span><strong className="block">{guardianSearchResult.nombre}</strong>Documento {guardianSearchResult.documento}</span><span className="font-condensed text-xs font-bold uppercase tracking-wider">{selectedExistingGuardian ? 'Seleccionado' : 'Seleccionar'}</span></button>
                : <div className="mt-3 rounded-xl border border-purple-400/20 bg-purple-400/5 p-3 text-sm text-text-soft">No encontramos una persona con este documento. Completa sus datos para crearla.</div>)}

              {!selectedExistingGuardian && <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {[
                  { key: 'nombre', label: 'Nombre', type: 'text' },
                  { key: 'tipoDocumento', label: 'Tipo de documento', type: 'select' },
                  { key: 'documento', label: 'Documento', type: 'text' },
                  { key: 'telefono', label: 'Teléfono', type: 'tel' },
                  { key: 'email', label: 'Email', type: 'email' },
                  { key: 'nacimiento', label: 'Fecha de nacimiento', type: 'date' },
                ].map(field => <label key={field.key} className={field.key === 'email' ? 'sm:col-span-2' : ''}><span className="mb-1.5 block font-condensed text-xs font-semibold uppercase tracking-wider text-text-muted">{field.label} *</span>{field.type === 'select' ? <select value={guardianDraft[field.key] ?? ''} onChange={event => setGuardianDraft(prev => ({ ...prev, [field.key]: event.target.value }))} className={inputClass}><option value="">Seleccionar...</option>{documentTypes.map(option => <option key={option}>{option}</option>)}</select> : <input type={field.type} value={guardianDraft[field.key] ?? ''} onChange={event => setGuardianDraft(prev => ({ ...prev, [field.key]: event.target.value }))} className={inputClass} />}{guardianErrors[field.key] && <p className="mt-1 text-xs text-red-400">{guardianErrors[field.key]}</p>}</label>)}
              </div>}

              <label className="mt-4 block"><span className="mb-1.5 block font-condensed text-xs font-semibold uppercase tracking-wider text-text-muted">Parentesco con el estudiante *</span><select value={guardianDraft.parentesco ?? ''} onChange={event => setGuardianDraft(prev => ({ ...prev, parentesco: event.target.value }))} className={inputClass}><option value="">Seleccionar...</option><option>Madre</option><option>Padre</option><option>Hermano/a</option><option>Acudiente</option></select>{guardianErrors.parentesco && <p className="mt-1 text-xs text-red-400">{guardianErrors.parentesco}</p>}</label>
              <div className="mt-6 flex justify-end gap-3 border-t border-border pt-5"><button type="button" onClick={() => setGuardianModal(false)} className="rounded-full border border-border px-5 py-2.5 font-condensed text-sm font-semibold uppercase tracking-wider text-text-soft">Cancelar</button><button type="button" onClick={saveGuardian} className="rounded-full bg-purple-700 px-6 py-2.5 font-condensed text-sm font-semibold uppercase tracking-wider text-white">Guardar acudiente</button></div>
            </div>
          </div>
        </div>}
      </div>}
    </div>
  );
}
