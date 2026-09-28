import { ModuleConfig } from '../types';

/* ─── SHARED BADGE RENDERER ─── */
const status = (val: string) => {
  const map: Record<string, string> = {
    Activo: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    Inactivo: 'bg-red-500/15 text-red-400 border-red-500/30',
    Pendiente: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    Pagado: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    Vencido: 'bg-red-500/15 text-red-400 border-red-500/30',
    Disponible: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    Ocupada: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    Confirmado: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    Cancelado: 'bg-red-500/15 text-red-400 border-red-500/30',
  };
  const cls = map[val] ?? 'bg-purple-500/15 text-purple-400 border-purple-500/30';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-condensed font-600 uppercase tracking-wider border ${cls}`}>
      {val}
    </span>
  );
};

/* ─── ESTUDIANTES ─── */
export const estudiantesConfig: ModuleConfig = {
  id: 'estudiantes',
  title: 'Estudiantes',
  addLabel: 'Nuevo estudiante',
  avatarKey: 'nombre',
  icon: null,
  columns: [
    { key: 'nombre', label: 'Nombre', render: (v, r) => <span className="font-600 text-text">{v} {r.apellido}</span> },
    { key: 'sede', label: 'Sede' },
    { key: 'nivel', label: 'Nivel' },
    { key: 'grupo', label: 'Grupo' },
    { key: 'edad', label: 'Edad', render: v => `${v} años` },
    { key: 'estado', label: 'Estado', render: status },
  ],
  fields: [
    { key: 'nombre', label: 'Nombre', type: 'text', required: true, span: 'half' },
    { key: 'apellido', label: 'Apellido', type: 'text', required: true, span: 'half' },
    { key: 'correo', label: 'Correo', type: 'email', span: 'half' },
    { key: 'telefono', label: 'Teléfono', type: 'tel', span: 'half' },
    { key: 'fecha_nacimiento', label: 'Fecha de nacimiento', type: 'date', span: 'half' },
    { key: 'edad', label: 'Edad', type: 'number', span: 'half' },
    { key: 'sede', label: 'Sede', type: 'select', options: [{ label: 'Bello', value: 'Bello' }, { label: 'Copacabana', value: 'Copacabana' }], span: 'half' },
    { key: 'nivel', label: 'Nivel', type: 'select', options: ['Básico', 'Intermedio', 'Avanzado'].map(v => ({ label: v, value: v })), span: 'half' },
    { key: 'grupo', label: 'Grupo', type: 'text', span: 'half' },
    { key: 'acudiente', label: 'Acudiente', type: 'text', span: 'half' },
    { key: 'estado', label: 'Estado', type: 'select', options: ['Activo', 'Inactivo'].map(v => ({ label: v, value: v })), span: 'half' },
    { key: 'observaciones', label: 'Observaciones', type: 'textarea', span: 'full' },
  ],
  detailFields: [
    { key: 'correo', label: 'Correo' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'fecha_nacimiento', label: 'Nacimiento' },
    { key: 'sede', label: 'Sede' },
    { key: 'nivel', label: 'Nivel' },
    { key: 'grupo', label: 'Grupo' },
    { key: 'acudiente', label: 'Acudiente' },
    { key: 'estado', label: 'Estado', render: status },
    { key: 'observaciones', label: 'Observaciones', wide: true },
  ],
  detailTitle: r => `${r.nombre} ${r.apellido}`,
  detailSubtitle: r => `Estudiante · ${r.nivel}`,
  data: [
    { id: 1, nombre: 'Valentina', apellido: 'Restrepo', correo: 'vrestrepo@mail.com', telefono: '3142567890', edad: 17, fecha_nacimiento: '2007-03-14', sede: 'Bello', nivel: 'Intermedio', grupo: 'Hip Hop B2', acudiente: 'María Restrepo', estado: 'Activo', observaciones: '' },
    { id: 2, nombre: 'Santiago', apellido: 'Gómez', correo: 'sgomez@mail.com', telefono: '3209871234', edad: 14, fecha_nacimiento: '2010-07-22', sede: 'Copacabana', nivel: 'Básico', grupo: 'Hip Hop C1', acudiente: 'Luis Gómez', estado: 'Activo', observaciones: 'Asiste los martes y jueves' },
    { id: 3, nombre: 'Camila', apellido: 'Herrera', correo: 'cherrera@mail.com', telefono: '3185432100', edad: 22, fecha_nacimiento: '2002-11-05', sede: 'Bello', nivel: 'Avanzado', grupo: 'Breaking A1', acudiente: '', estado: 'Activo', observaciones: '' },
    { id: 4, nombre: 'Sebastián', apellido: 'Cano', correo: 'scano@mail.com', telefono: '3001234567', edad: 16, fecha_nacimiento: '2008-01-30', sede: 'Bello', nivel: 'Básico', grupo: 'Hip Hop B1', acudiente: 'Ana Cano', estado: 'Inactivo', observaciones: 'Retirado por motivos académicos' },
    { id: 5, nombre: 'Laura', apellido: 'Martínez', correo: 'lmartinez@mail.com', telefono: '3216549870', edad: 19, fecha_nacimiento: '2005-06-18', sede: 'Copacabana', nivel: 'Intermedio', grupo: 'New Style I1', acudiente: '', estado: 'Activo', observaciones: '' },
    { id: 6, nombre: 'Andrés', apellido: 'Ospina', correo: 'aospina@mail.com', telefono: '3128765432', edad: 25, fecha_nacimiento: '1999-09-09', sede: 'Bello', nivel: 'Avanzado', grupo: 'Popping A1', acudiente: '', estado: 'Activo', observaciones: 'Instructor asistente' },
  ],
};

/* ─── ACUDIENTES ─── */
export const acudientesConfig: ModuleConfig = {
  id: 'acudientes',
  title: 'Acudientes',
  addLabel: 'Nuevo acudiente',
  avatarKey: 'nombre',
  icon: null,
  columns: [
    { key: 'nombre', label: 'Nombre', render: (v, r) => <span className="font-600 text-text">{v} {r.apellido}</span> },
    { key: 'relacion', label: 'Relación' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'correo', label: 'Correo' },
    { key: 'estudiante', label: 'Estudiante vinculado' },
  ],
  fields: [
    { key: 'nombre', label: 'Nombre', type: 'text', required: true, span: 'half' },
    { key: 'apellido', label: 'Apellido', type: 'text', required: true, span: 'half' },
    { key: 'relacion', label: 'Relación', type: 'select', options: ['Padre', 'Madre', 'Tutor', 'Abuelo/a', 'Otro'].map(v => ({ label: v, value: v })), span: 'half' },
    { key: 'telefono', label: 'Teléfono', type: 'tel', span: 'half' },
    { key: 'correo', label: 'Correo', type: 'email', span: 'full' },
    { key: 'estudiante', label: 'Estudiante vinculado', type: 'text', span: 'full' },
  ],
  detailTitle: r => `${r.nombre} ${r.apellido}`,
  detailSubtitle: r => `${r.relacion} de ${r.estudiante}`,
  data: [
    { id: 1, nombre: 'María', apellido: 'Restrepo', relacion: 'Madre', telefono: '3001112233', correo: 'mrestrepo@mail.com', estudiante: 'Valentina Restrepo' },
    { id: 2, nombre: 'Luis', apellido: 'Gómez', relacion: 'Padre', telefono: '3114445566', correo: 'lgomez@mail.com', estudiante: 'Santiago Gómez' },
    { id: 3, nombre: 'Ana', apellido: 'Cano', relacion: 'Madre', telefono: '3227778899', correo: 'acano@mail.com', estudiante: 'Sebastián Cano' },
  ],
};

/* ─── MATRÍCULAS ─── */
export const matriculasConfig: ModuleConfig = {
  id: 'matriculas',
  title: 'Matrículas',
  addLabel: 'Nueva matrícula',
  icon: null,
  columns: [
    { key: 'estudiante', label: 'Estudiante', render: v => <span className="font-600 text-text">{v}</span> },
    { key: 'grupo', label: 'Grupo' },
    { key: 'sede', label: 'Sede' },
    { key: 'fecha', label: 'Fecha' },
    { key: 'estado', label: 'Estado', render: status },
  ],
  fields: [
    { key: 'estudiante', label: 'Estudiante', type: 'text', required: true, span: 'full' },
    { key: 'grupo', label: 'Grupo', type: 'text', span: 'half' },
    { key: 'sede', label: 'Sede', type: 'select', options: ['Bello', 'Copacabana'].map(v => ({ label: v, value: v })), span: 'half' },
    { key: 'fecha', label: 'Fecha de matrícula', type: 'date', span: 'half' },
    { key: 'estado', label: 'Estado', type: 'select', options: ['Activo', 'Pendiente', 'Inactivo'].map(v => ({ label: v, value: v })), span: 'half' },
  ],
  detailTitle: r => r.estudiante,
  detailSubtitle: r => `Matrícula · ${r.grupo}`,
  data: [
    { id: 1, estudiante: 'Valentina Restrepo', grupo: 'Hip Hop B2', sede: 'Bello', fecha: '2025-01-15', estado: 'Activo' },
    { id: 2, estudiante: 'Santiago Gómez', grupo: 'Hip Hop C1', sede: 'Copacabana', fecha: '2025-01-20', estado: 'Activo' },
    { id: 3, estudiante: 'Camila Herrera', grupo: 'Breaking A1', sede: 'Bello', fecha: '2024-08-01', estado: 'Activo' },
    { id: 4, estudiante: 'Sebastián Cano', grupo: 'Hip Hop B1', sede: 'Bello', fecha: '2024-06-10', estado: 'Inactivo' },
    { id: 5, estudiante: 'Laura Martínez', grupo: 'New Style I1', sede: 'Copacabana', fecha: '2025-02-03', estado: 'Activo' },
  ],
};

/* ─── ESTILOS ─── */
export const estilosConfig: ModuleConfig = {
  id: 'estilos',
  title: 'Estilos de danza',
  addLabel: 'Nuevo estilo',
  icon: null,
  columns: [
    { key: 'nombre', label: 'Estilo', render: v => <span className="font-600 text-text">{v}</span> },
    { key: 'origen', label: 'Origen' },
    { key: 'grupos_activos', label: 'Grupos activos' },
    { key: 'descripcion', label: 'Descripción', render: v => <span className="text-text-muted truncate max-w-xs inline-block">{v}</span> },
  ],
  fields: [
    { key: 'nombre', label: 'Nombre del estilo', type: 'text', required: true, span: 'half' },
    { key: 'origen', label: 'Origen', type: 'text', span: 'half' },
    { key: 'grupos_activos', label: 'Grupos activos', type: 'number', span: 'half' },
    { key: 'descripcion', label: 'Descripción', type: 'textarea', span: 'full' },
  ],
  detailTitle: r => r.nombre,
  detailSubtitle: () => 'Estilo de danza',
  data: [
    { id: 1, nombre: 'Breaking', origen: 'Nueva York, EE.UU.', grupos_activos: 3, descripcion: 'Estilo fundacional del Hip Hop. Acrobático, atlético y expresivo.' },
    { id: 2, nombre: 'Popping', origen: 'Fresno, California', grupos_activos: 2, descripcion: 'Basado en contracciones musculares rítmicas para crear el efecto de "pop".' },
    { id: 3, nombre: 'Locking', origen: 'Los Ángeles, California', grupos_activos: 2, descripcion: 'Estilo funk con movimientos congelados y poses exageradas.' },
    { id: 4, nombre: 'New Style', origen: 'Nueva York / Francia', grupos_activos: 4, descripcion: 'Hip Hop urbano de club, coreografíado y versátil. Muy popular en competencias.' },
    { id: 5, nombre: 'Krump', origen: 'Los Ángeles, California', grupos_activos: 1, descripcion: 'Expresivo e intenso. Movimientos explosivos con carga emocional profunda.' },
    { id: 6, nombre: 'Freestyle', origen: 'Global', grupos_activos: 2, descripcion: 'Movimiento libre sin coreografía. Expresión pura del bailarín.' },
  ],
};

/* ─── NIVELES ─── */
export const nivelesConfig: ModuleConfig = {
  id: 'niveles',
  title: 'Niveles',
  addLabel: 'Nuevo nivel',
  icon: null,
  columns: [
    { key: 'nombre', label: 'Nivel', render: v => <span className="font-600 text-text">{v}</span> },
    { key: 'estilo', label: 'Estilo' },
    { key: 'duracion_meses', label: 'Duración', render: v => `${v} meses` },
    { key: 'descripcion', label: 'Descripción' },
  ],
  fields: [
    { key: 'nombre', label: 'Nombre del nivel', type: 'text', required: true, span: 'half' },
    { key: 'estilo', label: 'Estilo', type: 'select', options: ['Breaking', 'Popping', 'Locking', 'New Style', 'Krump', 'Freestyle'].map(v => ({ label: v, value: v })), span: 'half' },
    { key: 'duracion_meses', label: 'Duración (meses)', type: 'number', span: 'half' },
    { key: 'descripcion', label: 'Descripción', type: 'textarea', span: 'full' },
  ],
  detailTitle: r => `${r.nombre} — ${r.estilo}`,
  detailSubtitle: () => 'Nivel de formación',
  data: [
    { id: 1, nombre: 'Básico', estilo: 'Breaking', duracion_meses: 3, descripcion: 'Fundamentos y postura básica.' },
    { id: 2, nombre: 'Intermedio', estilo: 'Breaking', duracion_meses: 6, descripcion: 'Footwork y freezes básicos.' },
    { id: 3, nombre: 'Avanzado', estilo: 'Breaking', duracion_meses: 12, descripcion: 'Power moves y battle skills.' },
    { id: 4, nombre: 'Básico', estilo: 'New Style', duracion_meses: 3, descripcion: 'Ritmo, coordinación y bases.' },
    { id: 5, nombre: 'Intermedio', estilo: 'New Style', duracion_meses: 6, descripcion: 'Coreografía grupal y musicalidad.' },
    { id: 6, nombre: 'Avanzado', estilo: 'New Style', duracion_meses: 12, descripcion: 'Freestyle, coreografía propia.' },
  ],
};

/* ─── HORARIOS ─── */
export const horariosConfig: ModuleConfig = {
  id: 'horarios',
  title: 'Horarios',
  addLabel: 'Nuevo horario',
  icon: null,
  columns: [
    { key: 'dia', label: 'Día', render: v => <span className="font-600 text-text">{v}</span> },
    { key: 'hora_inicio', label: 'Inicio' },
    { key: 'hora_fin', label: 'Fin' },
    { key: 'grupo', label: 'Grupo' },
    { key: 'aula', label: 'Aula' },
  ],
  fields: [
    { key: 'dia', label: 'Día', type: 'select', options: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'].map(v => ({ label: v, value: v })), span: 'half' },
    { key: 'hora_inicio', label: 'Hora inicio', type: 'text', placeholder: '07:00', span: 'half' },
    { key: 'hora_fin', label: 'Hora fin', type: 'text', placeholder: '09:00', span: 'half' },
    { key: 'grupo', label: 'Grupo', type: 'text', span: 'half' },
    { key: 'aula', label: 'Aula', type: 'text', span: 'half' },
    { key: 'sede', label: 'Sede', type: 'select', options: ['Bello', 'Copacabana'].map(v => ({ label: v, value: v })), span: 'half' },
  ],
  detailTitle: r => `${r.dia} · ${r.hora_inicio}–${r.hora_fin}`,
  detailSubtitle: r => r.grupo,
  data: [
    { id: 1, dia: 'Lunes', hora_inicio: '07:00', hora_fin: '09:00', grupo: 'Breaking A1', aula: 'Sala 1', sede: 'Bello' },
    { id: 2, dia: 'Martes', hora_inicio: '16:00', hora_fin: '18:00', grupo: 'Hip Hop B2', aula: 'Sala 2', sede: 'Bello' },
    { id: 3, dia: 'Miércoles', hora_inicio: '18:00', hora_fin: '20:00', grupo: 'New Style I1', aula: 'Sala 1', sede: 'Copacabana' },
    { id: 4, dia: 'Jueves', hora_inicio: '09:00', hora_fin: '11:00', grupo: 'Popping A1', aula: 'Sala 2', sede: 'Bello' },
    { id: 5, dia: 'Sábado', hora_inicio: '10:00', hora_fin: '12:00', grupo: 'Hip Hop C1', aula: 'Sala 1', sede: 'Copacabana' },
  ],
};

/* ─── GRUPOS ─── */
export const gruposConfig: ModuleConfig = {
  id: 'grupos',
  title: 'Grupos',
  addLabel: 'Nuevo grupo',
  icon: null,
  columns: [
    { key: 'nombre', label: 'Nombre', render: v => <span className="font-600 text-text">{v}</span> },
    { key: 'estilo', label: 'Estilo' },
    { key: 'nivel', label: 'Nivel' },
    { key: 'instructor', label: 'Instructor' },
    { key: 'cupo', label: 'Cupo', render: (v, r) => <span className="font-600">{r.inscritos}/{v}</span> },
    { key: 'sede', label: 'Sede' },
  ],
  fields: [
    { key: 'nombre', label: 'Nombre del grupo', type: 'text', required: true, span: 'half' },
    { key: 'estilo', label: 'Estilo', type: 'text', span: 'half' },
    { key: 'nivel', label: 'Nivel', type: 'select', options: ['Básico', 'Intermedio', 'Avanzado'].map(v => ({ label: v, value: v })), span: 'half' },
    { key: 'instructor', label: 'Instructor', type: 'text', span: 'half' },
    { key: 'cupo', label: 'Cupo máximo', type: 'number', span: 'half' },
    { key: 'inscritos', label: 'Inscritos actuales', type: 'number', span: 'half' },
    { key: 'sede', label: 'Sede', type: 'select', options: ['Bello', 'Copacabana'].map(v => ({ label: v, value: v })), span: 'half' },
    { key: 'horario', label: 'Horario', type: 'text', span: 'half' },
  ],
  detailTitle: r => r.nombre,
  detailSubtitle: r => `${r.estilo} · ${r.nivel}`,
  data: [
    { id: 1, nombre: 'Breaking A1', estilo: 'Breaking', nivel: 'Avanzado', instructor: 'Carlos Vélez', cupo: 12, inscritos: 10, sede: 'Bello', horario: 'Lun 07:00–09:00' },
    { id: 2, nombre: 'Hip Hop B2', estilo: 'New Style', nivel: 'Intermedio', instructor: 'Valentina Reyes', cupo: 15, inscritos: 14, sede: 'Bello', horario: 'Mar 16:00–18:00' },
    { id: 3, nombre: 'Hip Hop C1', estilo: 'New Style', nivel: 'Básico', instructor: 'Valentina Reyes', cupo: 20, inscritos: 8, sede: 'Copacabana', horario: 'Sáb 10:00–12:00' },
    { id: 4, nombre: 'Popping A1', estilo: 'Popping', nivel: 'Avanzado', instructor: 'Andrés Montoya', cupo: 10, inscritos: 7, sede: 'Bello', horario: 'Jue 09:00–11:00' },
    { id: 5, nombre: 'New Style I1', estilo: 'New Style', nivel: 'Intermedio', instructor: 'Daniela García', cupo: 18, inscritos: 15, sede: 'Copacabana', horario: 'Mié 18:00–20:00' },
  ],
};

/* ─── INSTRUCTORES ─── */
export const instructoresConfig: ModuleConfig = {
  id: 'instructores',
  title: 'Instructores',
  addLabel: 'Nuevo instructor',
  avatarKey: 'nombre',
  icon: null,
  columns: [
    { key: 'nombre', label: 'Nombre', render: (v, r) => <span className="font-600 text-text">{v} {r.apellido}</span> },
    { key: 'especialidad', label: 'Especialidad' },
    { key: 'sede', label: 'Sede' },
    { key: 'grupos', label: 'Grupos activos' },
    { key: 'estado', label: 'Estado', render: status },
  ],
  fields: [
    { key: 'nombre', label: 'Nombre', type: 'text', required: true, span: 'half' },
    { key: 'apellido', label: 'Apellido', type: 'text', required: true, span: 'half' },
    { key: 'correo', label: 'Correo', type: 'email', span: 'half' },
    { key: 'telefono', label: 'Teléfono', type: 'tel', span: 'half' },
    { key: 'especialidad', label: 'Especialidad principal', type: 'text', span: 'half' },
    { key: 'sede', label: 'Sede', type: 'select', options: ['Bello', 'Copacabana', 'Ambas'].map(v => ({ label: v, value: v })), span: 'half' },
    { key: 'grupos', label: 'Grupos activos', type: 'number', span: 'half' },
    { key: 'estado', label: 'Estado', type: 'select', options: ['Activo', 'Inactivo'].map(v => ({ label: v, value: v })), span: 'half' },
    { key: 'bio', label: 'Biografía breve', type: 'textarea', span: 'full' },
  ],
  detailTitle: r => `${r.nombre} ${r.apellido}`,
  detailSubtitle: r => `Instructor · ${r.especialidad}`,
  data: [
    { id: 1, nombre: 'Carlos', apellido: 'Vélez', correo: 'cvelez@fanda.co', telefono: '3001112233', especialidad: 'Breaking', sede: 'Bello', grupos: 2, estado: 'Activo', bio: 'Campeón nacional de Breaking, 12 años de experiencia.' },
    { id: 2, nombre: 'Valentina', apellido: 'Reyes', correo: 'vreyes@fanda.co', telefono: '3114445566', especialidad: 'New Style', sede: 'Ambas', grupos: 3, estado: 'Activo', bio: 'Coreógrafa y bailarina con presentaciones internacionales.' },
    { id: 3, nombre: 'Andrés', apellido: 'Montoya', correo: 'amontoya@fanda.co', telefono: '3227778899', especialidad: 'Popping & Locking', sede: 'Bello', grupos: 2, estado: 'Activo', bio: 'Referente del Popping en Colombia.' },
    { id: 4, nombre: 'Daniela', apellido: 'García', correo: 'dgarcia@fanda.co', telefono: '3340001122', especialidad: 'Krump & Freestyle', sede: 'Copacabana', grupos: 2, estado: 'Activo', bio: 'Finalista del Battle of the Year Colombia 2022.' },
  ],
};

/* ─── ASIGNACIÓN DE ESTILOS ─── */
export const asignacionConfig: ModuleConfig = {
  id: 'asignacion',
  title: 'Asignación de estilos',
  addLabel: 'Nueva asignación',
  icon: null,
  columns: [
    { key: 'instructor', label: 'Instructor', render: v => <span className="font-600 text-text">{v}</span> },
    { key: 'estilo', label: 'Estilo' },
    { key: 'nivel', label: 'Nivel' },
    { key: 'fecha', label: 'Desde' },
  ],
  fields: [
    { key: 'instructor', label: 'Instructor', type: 'text', required: true, span: 'half' },
    { key: 'estilo', label: 'Estilo', type: 'select', options: ['Breaking', 'Popping', 'Locking', 'New Style', 'Krump', 'Freestyle'].map(v => ({ label: v, value: v })), span: 'half' },
    { key: 'nivel', label: 'Nivel', type: 'select', options: ['Básico', 'Intermedio', 'Avanzado'].map(v => ({ label: v, value: v })), span: 'half' },
    { key: 'fecha', label: 'Fecha desde', type: 'date', span: 'half' },
  ],
  detailTitle: r => r.instructor,
  detailSubtitle: r => `${r.estilo} · ${r.nivel}`,
  data: [
    { id: 1, instructor: 'Carlos Vélez', estilo: 'Breaking', nivel: 'Avanzado', fecha: '2023-01-15' },
    { id: 2, instructor: 'Valentina Reyes', estilo: 'New Style', nivel: 'Intermedio', fecha: '2023-01-15' },
    { id: 3, instructor: 'Valentina Reyes', estilo: 'New Style', nivel: 'Básico', fecha: '2024-03-01' },
    { id: 4, instructor: 'Andrés Montoya', estilo: 'Popping', nivel: 'Avanzado', fecha: '2023-06-10' },
    { id: 5, instructor: 'Daniela García', estilo: 'Krump', nivel: 'Intermedio', fecha: '2024-01-20' },
  ],
};

/* ─── PAGOS ─── */
export const pagosConfig: ModuleConfig = {
  id: 'pagos',
  title: 'Pagos',
  addLabel: 'Registrar pago',
  icon: null,
  columns: [
    { key: 'estudiante', label: 'Estudiante', render: v => <span className="font-600 text-text">{v}</span> },
    { key: 'concepto', label: 'Concepto' },
    { key: 'monto', label: 'Monto', render: v => `$${Number(v).toLocaleString('es-CO')}` },
    { key: 'fecha', label: 'Fecha' },
    { key: 'metodo', label: 'Método' },
    { key: 'estado', label: 'Estado', render: status },
  ],
  fields: [
    { key: 'estudiante', label: 'Estudiante', type: 'text', required: true, span: 'full' },
    { key: 'concepto', label: 'Concepto', type: 'select', options: ['Mensualidad', 'Matrícula', 'Taller', 'Alquiler'].map(v => ({ label: v, value: v })), span: 'half' },
    { key: 'monto', label: 'Monto (COP)', type: 'number', span: 'half' },
    { key: 'metodo', label: 'Método de pago', type: 'select', options: ['Efectivo', 'Transferencia', 'PSE', 'Nequi', 'Daviplata'].map(v => ({ label: v, value: v })), span: 'half' },
    { key: 'fecha', label: 'Fecha de pago', type: 'date', span: 'half' },
    { key: 'estado', label: 'Estado', type: 'select', options: ['Pagado', 'Pendiente', 'Vencido'].map(v => ({ label: v, value: v })), span: 'half' },
    { key: 'referencia', label: 'Referencia', type: 'text', span: 'half' },
    { key: 'notas', label: 'Notas', type: 'textarea', span: 'full' },
  ],
  detailTitle: r => r.estudiante,
  detailSubtitle: r => `${r.concepto} · $${Number(r.monto).toLocaleString('es-CO')}`,
  data: [
    { id: 1, estudiante: 'Valentina Restrepo', concepto: 'Mensualidad', monto: 120000, fecha: '2025-09-01', metodo: 'Nequi', estado: 'Pagado', referencia: 'NEQ001', notas: '' },
    { id: 2, estudiante: 'Santiago Gómez', concepto: 'Mensualidad', monto: 120000, fecha: '2025-09-02', metodo: 'Transferencia', estado: 'Pagado', referencia: 'TRF002', notas: '' },
    { id: 3, estudiante: 'Camila Herrera', concepto: 'Mensualidad', monto: 120000, fecha: '2025-09-03', metodo: 'Efectivo', estado: 'Pagado', referencia: 'EFE003', notas: '' },
    { id: 4, estudiante: 'Laura Martínez', concepto: 'Mensualidad', monto: 120000, fecha: '2025-09-05', metodo: 'PSE', estado: 'Pendiente', referencia: '', notas: 'Confirmación pendiente' },
    { id: 5, estudiante: 'Andrés Ospina', concepto: 'Mensualidad', monto: 120000, fecha: '2025-08-01', metodo: 'Daviplata', estado: 'Vencido', referencia: '', notas: 'Segundo mes sin pago' },
    { id: 6, estudiante: 'Valentina Restrepo', concepto: 'Taller', monto: 50000, fecha: '2025-08-20', metodo: 'Nequi', estado: 'Pagado', referencia: 'NEQ006', notas: '' },
  ],
};

/* ─── MÉTODOS DE PAGO ─── */
export const metodosPagoConfig: ModuleConfig = {
  id: 'metodosPago',
  title: 'Métodos de pago',
  addLabel: 'Nuevo método',
  icon: null,
  columns: [
    { key: 'nombre', label: 'Método', render: v => <span className="font-600 text-text">{v}</span> },
    { key: 'tipo', label: 'Tipo' },
    { key: 'activo', label: 'Estado', render: v => status(v ? 'Activo' : 'Inactivo') },
  ],
  fields: [
    { key: 'nombre', label: 'Nombre del método', type: 'text', required: true, span: 'half' },
    { key: 'tipo', label: 'Tipo', type: 'select', options: ['Efectivo', 'Digital', 'Bancario', 'Tarjeta'].map(v => ({ label: v, value: v })), span: 'half' },
    { key: 'activo', label: 'Activo', type: 'select', options: [{ label: 'Sí', value: 'true' }, { label: 'No', value: 'false' }], span: 'half' },
  ],
  detailTitle: r => r.nombre,
  detailSubtitle: r => r.tipo,
  data: [
    { id: 1, nombre: 'Efectivo', tipo: 'Efectivo', activo: true },
    { id: 2, nombre: 'Transferencia bancaria', tipo: 'Bancario', activo: true },
    { id: 3, nombre: 'PSE', tipo: 'Digital', activo: true },
    { id: 4, nombre: 'Nequi', tipo: 'Digital', activo: true },
    { id: 5, nombre: 'Daviplata', tipo: 'Digital', activo: true },
    { id: 6, nombre: 'Tarjeta crédito', tipo: 'Tarjeta', activo: false },
  ],
};

/* ─── SEDES ─── */
export const sedesConfig: ModuleConfig = {
  id: 'sedes',
  title: 'Sedes',
  addLabel: 'Nueva sede',
  icon: null,
  columns: [
    { key: 'nombre', label: 'Sede', render: v => <span className="font-600 text-text">{v}</span> },
    { key: 'ciudad', label: 'Ciudad' },
    { key: 'direccion', label: 'Dirección' },
    { key: 'capacidad', label: 'Capacidad' },
    { key: 'horario', label: 'Horario' },
  ],
  fields: [
    { key: 'nombre', label: 'Nombre de la sede', type: 'text', required: true, span: 'half' },
    { key: 'ciudad', label: 'Ciudad', type: 'text', span: 'half' },
    { key: 'direccion', label: 'Dirección', type: 'text', span: 'full' },
    { key: 'capacidad', label: 'Capacidad (personas)', type: 'number', span: 'half' },
    { key: 'horario', label: 'Horario de atención', type: 'text', span: 'half' },
    { key: 'descripcion', label: 'Descripción', type: 'textarea', span: 'full' },
  ],
  detailTitle: r => r.nombre,
  detailSubtitle: r => r.ciudad,
  data: [
    { id: 1, nombre: 'Bello', ciudad: 'Bello', direccion: 'Calle 33 #48-12, Bello, Antioquia', capacidad: 80, horario: 'Lun–Sáb 7:00–21:00', descripcion: 'Sede principal con 3 salones equipados.' },
    { id: 2, nombre: 'Copacabana', ciudad: 'Copacabana', direccion: 'Carrera 50 #21-80, Copacabana, Antioquia', capacidad: 50, horario: 'Lun–Sáb 8:00–20:00', descripcion: 'Sede moderna con 2 salones y estacionamiento.' },
  ],
};

/* ─── TALLERES ─── */
export const talleresConfig: ModuleConfig = {
  id: 'talleres',
  title: 'Talleres',
  addLabel: 'Nuevo taller',
  icon: null,
  columns: [
    { key: 'nombre', label: 'Taller', render: v => <span className="font-600 text-text">{v}</span> },
    { key: 'instructor', label: 'Instructor' },
    { key: 'fecha', label: 'Fecha' },
    { key: 'cupo', label: 'Cupo', render: (v, r) => `${r.inscritos}/${v}` },
    { key: 'estado', label: 'Estado', render: status },
  ],
  fields: [
    { key: 'nombre', label: 'Nombre del taller', type: 'text', required: true, span: 'full' },
    { key: 'instructor', label: 'Instructor', type: 'text', span: 'half' },
    { key: 'sede', label: 'Sede', type: 'select', options: ['Bello', 'Copacabana'].map(v => ({ label: v, value: v })), span: 'half' },
    { key: 'fecha', label: 'Fecha', type: 'date', span: 'half' },
    { key: 'duracion_horas', label: 'Duración (horas)', type: 'number', span: 'half' },
    { key: 'cupo', label: 'Cupo máximo', type: 'number', span: 'half' },
    { key: 'precio', label: 'Precio (COP)', type: 'number', span: 'half' },
    { key: 'estado', label: 'Estado', type: 'select', options: ['Activo', 'Cancelado', 'Confirmado'].map(v => ({ label: v, value: v })), span: 'half' },
    { key: 'descripcion', label: 'Descripción', type: 'textarea', span: 'full' },
  ],
  detailTitle: r => r.nombre,
  detailSubtitle: r => `${r.fecha} · ${r.instructor}`,
  data: [
    { id: 1, nombre: 'Masterclass Breaking Foundation', instructor: 'Carlos Vélez', sede: 'Bello', fecha: '2025-09-20', duracion_horas: 4, cupo: 20, inscritos: 15, precio: 80000, estado: 'Confirmado', descripcion: 'Fundamentos de la cultura B-Boy/B-Girl.' },
    { id: 2, nombre: 'Taller de Musicality', instructor: 'Valentina Reyes', sede: 'Copacabana', fecha: '2025-10-05', duracion_horas: 3, cupo: 25, inscritos: 8, precio: 60000, estado: 'Activo', descripcion: 'Cómo interpretar la música en el movimiento.' },
    { id: 3, nombre: 'Battle Preparation', instructor: 'Daniela García', sede: 'Bello', fecha: '2025-10-18', duracion_horas: 6, cupo: 30, inscritos: 22, precio: 100000, estado: 'Activo', descripcion: 'Preparación para competencias y battles.' },
  ],
};

/* ─── INSCRIPCIONES A TALLERES ─── */
export const inscripcionesConfig: ModuleConfig = {
  id: 'inscripciones',
  title: 'Inscripciones a talleres',
  addLabel: 'Nueva inscripción',
  icon: null,
  columns: [
    { key: 'estudiante', label: 'Estudiante', render: v => <span className="font-600 text-text">{v}</span> },
    { key: 'taller', label: 'Taller' },
    { key: 'fecha_inscripcion', label: 'Inscripción' },
    { key: 'pago', label: 'Pago', render: status },
    { key: 'estado', label: 'Asistencia', render: status },
  ],
  fields: [
    { key: 'estudiante', label: 'Estudiante', type: 'text', required: true, span: 'half' },
    { key: 'taller', label: 'Taller', type: 'text', required: true, span: 'half' },
    { key: 'fecha_inscripcion', label: 'Fecha inscripción', type: 'date', span: 'half' },
    { key: 'pago', label: 'Estado de pago', type: 'select', options: ['Pagado', 'Pendiente'].map(v => ({ label: v, value: v })), span: 'half' },
    { key: 'estado', label: 'Asistencia', type: 'select', options: ['Confirmado', 'Pendiente', 'Cancelado'].map(v => ({ label: v, value: v })), span: 'half' },
  ],
  detailTitle: r => r.estudiante,
  detailSubtitle: r => r.taller,
  data: [
    { id: 1, estudiante: 'Valentina Restrepo', taller: 'Masterclass Breaking Foundation', fecha_inscripcion: '2025-09-10', pago: 'Pagado', estado: 'Confirmado' },
    { id: 2, estudiante: 'Camila Herrera', taller: 'Masterclass Breaking Foundation', fecha_inscripcion: '2025-09-11', pago: 'Pagado', estado: 'Confirmado' },
    { id: 3, estudiante: 'Santiago Gómez', taller: 'Taller de Musicality', fecha_inscripcion: '2025-09-15', pago: 'Pendiente', estado: 'Pendiente' },
    { id: 4, estudiante: 'Laura Martínez', taller: 'Battle Preparation', fecha_inscripcion: '2025-09-18', pago: 'Pagado', estado: 'Confirmado' },
  ],
};

/* ─── AULAS ─── */
export const aulasConfig: ModuleConfig = {
  id: 'aulas',
  title: 'Aulas',
  addLabel: 'Nueva aula',
  icon: null,
  columns: [
    { key: 'nombre', label: 'Aula', render: v => <span className="font-600 text-text">{v}</span> },
    { key: 'sede', label: 'Sede' },
    { key: 'capacidad', label: 'Capacidad', render: v => `${v} personas` },
    { key: 'descripcion', label: 'Descripción' },
    { key: 'disponible', label: 'Estado', render: v => status(v ? 'Disponible' : 'Ocupada') },
  ],
  fields: [
    { key: 'nombre', label: 'Nombre del aula', type: 'text', required: true, span: 'half' },
    { key: 'sede', label: 'Sede', type: 'select', options: ['Bello', 'Copacabana'].map(v => ({ label: v, value: v })), span: 'half' },
    { key: 'capacidad', label: 'Capacidad (personas)', type: 'number', span: 'half' },
    { key: 'disponible', label: 'Disponible', type: 'select', options: [{ label: 'Sí', value: 'true' }, { label: 'No', value: 'false' }], span: 'half' },
    { key: 'descripcion', label: 'Descripción', type: 'textarea', span: 'full' },
  ],
  detailTitle: r => r.nombre,
  detailSubtitle: r => `Sede ${r.sede}`,
  data: [
    { id: 1, nombre: 'Sala 1', sede: 'Bello', capacidad: 30, descripcion: 'Sala principal con espejos de piso a techo y sistema de sonido profesional.', disponible: true },
    { id: 2, nombre: 'Sala 2', sede: 'Bello', capacidad: 25, descripcion: 'Sala secundaria con piso de madera flotante.', disponible: true },
    { id: 3, nombre: 'Sala 3', sede: 'Bello', capacidad: 20, descripcion: 'Sala de práctica libre y entrenamiento personal.', disponible: false },
    { id: 4, nombre: 'Sala 1', sede: 'Copacabana', capacidad: 28, descripcion: 'Sala principal con aire acondicionado y espejos.', disponible: true },
    { id: 5, nombre: 'Sala 2', sede: 'Copacabana', capacidad: 20, descripcion: 'Sala polivalente.', disponible: true },
  ],
};

/* ─── USUARIOS ─── */
export const usuariosConfig: ModuleConfig = {
  id: 'usuarios',
  title: 'Usuarios',
  addLabel: 'Nuevo usuario',
  avatarKey: 'nombre',
  icon: null,
  columns: [
    { key: 'nombre', label: 'Nombre', render: (v, r) => <span className="font-600 text-text">{v} {r.apellido}</span> },
    { key: 'correo', label: 'Correo' },
    { key: 'rol', label: 'Rol', render: v => <span className="font-condensed text-xs uppercase tracking-wider text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded-full">{v}</span> },
    { key: 'estado', label: 'Estado', render: status },
  ],
  fields: [
    { key: 'nombre', label: 'Nombre', type: 'text', required: true, span: 'half' },
    { key: 'apellido', label: 'Apellido', type: 'text', required: true, span: 'half' },
    { key: 'correo', label: 'Correo', type: 'email', required: true, span: 'full' },
    { key: 'rol', label: 'Rol', type: 'select', options: ['Administrador', 'Recepcionista', 'Instructor', 'Coordinador'].map(v => ({ label: v, value: v })), span: 'half' },
    { key: 'estado', label: 'Estado', type: 'select', options: ['Activo', 'Inactivo'].map(v => ({ label: v, value: v })), span: 'half' },
  ],
  detailTitle: r => `${r.nombre} ${r.apellido}`,
  detailSubtitle: r => r.rol,
  data: [
    { id: 1, nombre: 'Andrea', apellido: 'Salazar', correo: 'asalazar@fanda.co', rol: 'Administrador', estado: 'Activo' },
    { id: 2, nombre: 'Juan', apellido: 'Peña', correo: 'jpena@fanda.co', rol: 'Recepcionista', estado: 'Activo' },
    { id: 3, nombre: 'Carlos', apellido: 'Vélez', correo: 'cvelez@fanda.co', rol: 'Instructor', estado: 'Activo' },
    { id: 4, nombre: 'Valentina', apellido: 'Reyes', correo: 'vreyes@fanda.co', rol: 'Instructor', estado: 'Activo' },
  ],
};

/* ─── ROLES ─── */
export const rolesConfig: ModuleConfig = {
  id: 'roles',
  title: 'Roles',
  addLabel: 'Nuevo rol',
  icon: null,
  columns: [
    { key: 'nombre', label: 'Rol', render: v => <span className="font-600 text-text">{v}</span> },
    { key: 'usuarios', label: 'Usuarios asignados' },
    { key: 'descripcion', label: 'Descripción' },
  ],
  fields: [
    { key: 'nombre', label: 'Nombre del rol', type: 'text', required: true, span: 'half' },
    { key: 'usuarios', label: 'Usuarios asignados', type: 'number', span: 'half' },
    { key: 'descripcion', label: 'Descripción y permisos', type: 'textarea', span: 'full' },
  ],
  detailTitle: r => r.nombre,
  detailSubtitle: () => 'Rol del sistema',
  data: [
    { id: 1, nombre: 'Administrador', usuarios: 1, descripcion: 'Acceso total al sistema. Puede gestionar usuarios, pagos, configuración y todos los módulos.' },
    { id: 2, nombre: 'Recepcionista', usuarios: 1, descripcion: 'Puede registrar estudiantes, matrículas y pagos. Sin acceso a configuración.' },
    { id: 3, nombre: 'Instructor', usuarios: 4, descripcion: 'Puede ver su horario, grupos asignados y marcar asistencia.' },
    { id: 4, nombre: 'Coordinador', usuarios: 0, descripcion: 'Puede gestionar grupos, horarios y reportes de la sede asignada.' },
  ],
};

export const allModules: Record<string, ModuleConfig> = {
  estudiantes: estudiantesConfig,
  acudientes: acudientesConfig,
  matriculas: matriculasConfig,
  estilos: estilosConfig,
  niveles: nivelesConfig,
  horarios: horariosConfig,
  grupos: gruposConfig,
  instructores: instructoresConfig,
  asignacion: asignacionConfig,
  pagos: pagosConfig,
  metodosPago: metodosPagoConfig,
  sedes: sedesConfig,
  talleres: talleresConfig,
  inscripciones: inscripcionesConfig,
  aulas: aulasConfig,
  usuarios: usuariosConfig,
  roles: rolesConfig,
};
