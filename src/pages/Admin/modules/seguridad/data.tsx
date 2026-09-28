import { ReactNode } from 'react';

/* ─── TYPES (matching academia_v2.sql exactly) ─── */

export interface Estado {
  idEstado: number;
  nombre: string;
  categoria: string;
  descripcion: string;
}

export interface Permiso {
  idPermiso: number;
  descripcion: string;
}

export interface Rol {
  idRol: number;
  nombre: string;
  idEstado: number;
  permisos: number[]; // idPermiso[]
}

export interface Persona {
  idPersona: number;
  nombre: string;
  documento: string;
  telefono: string;
  email: string;
  fecha_nacimiento: string;
  idEstado: number;
}

export interface Acudiente {
  idAcudiente: number;
  idPersona: number;
  idEstado: number;
}

export interface Usuario {
  idUsuario: number;
  persona_id: number;
  username: string;
  password_hash: string;
  idEstado: number;
  roles: number[]; // idRol[]
}

/* ─── SEED DATA ─── */

export const estadosSeed: Estado[] = [
  { idEstado: 1, nombre: 'Activo', categoria: 'general', descripcion: 'Registro activo y operativo en el sistema.' },
  { idEstado: 2, nombre: 'Inactivo', categoria: 'general', descripcion: 'Registro temporalmente suspendido.' },
  { idEstado: 3, nombre: 'Pendiente', categoria: 'general', descripcion: 'Esperando validación o acción.' },
  { idEstado: 4, nombre: 'Al día', categoria: 'mensualidad', descripcion: 'Mensualidad pagada y al corriente.' },
  { idEstado: 5, nombre: 'Vencida', categoria: 'mensualidad', descripcion: 'Mensualidad no pagada en la fecha límite.' },
  { idEstado: 6, nombre: 'Activa', categoria: 'matricula', descripcion: 'Matrícula vigente en el periodo académico.' },
  { idEstado: 7, nombre: 'Cancelada', categoria: 'matricula', descripcion: 'Matrícula cancelada por el estudiante o la academia.' },
  { idEstado: 8, nombre: 'Activo', categoria: 'usuario', descripcion: 'Cuenta de usuario activa con acceso al sistema.' },
  { idEstado: 9, nombre: 'Bloqueado', categoria: 'usuario', descripcion: 'Cuenta bloqueada por seguridad o inactividad.' },
  { idEstado: 10, nombre: 'Activa', categoria: 'postulacion', descripcion: 'Postulación recibida y en evaluación.' },
  { idEstado: 11, nombre: 'Rechazado', categoria: 'postulacion', descripcion: 'Postulación evaluada y no aprobada.' },
  { idEstado: 12, nombre: 'Publicada', categoria: 'contenido', descripcion: 'Contenido visible para todos los usuarios.' },
  { idEstado: 13, nombre: 'Borrador', categoria: 'contenido', descripcion: 'Contenido en preparación, no publicado.' },
];

export const permisosSeed: Permiso[] = [
  { idPermiso: 1, descripcion: 'ver_dashboard' },
  { idPermiso: 2, descripcion: 'gestionar_estudiantes' },
  { idPermiso: 3, descripcion: 'gestionar_instructores' },
  { idPermiso: 4, descripcion: 'gestionar_pagos' },
  { idPermiso: 5, descripcion: 'gestionar_grupos' },
  { idPermiso: 6, descripcion: 'gestionar_agendamientos_instructores' },
  { idPermiso: 7, descripcion: 'gestionar_sedes' },
  { idPermiso: 8, descripcion: 'gestionar_talleres' },
  { idPermiso: 9, descripcion: 'gestionar_usuarios' },
  { idPermiso: 10, descripcion: 'gestionar_roles' },
  { idPermiso: 11, descripcion: 'ver_reportes' },
  { idPermiso: 12, descripcion: 'gestionar_matriculas' },
  { idPermiso: 13, descripcion: 'gestionar_aulas' },
];

export const rolesSeed: Rol[] = [
  { idRol: 1, nombre: 'Administrador', idEstado: 1, permisos: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] },
  { idRol: 2, nombre: 'Recepcionista', idEstado: 1, permisos: [1, 2, 4, 12] },
  { idRol: 3, nombre: 'Instructor', idEstado: 1, permisos: [1, 5, 6] },
  { idRol: 4, nombre: 'Coordinador', idEstado: 1, permisos: [1, 2, 5, 6, 11] },
];

export const personasSeed: Persona[] = [
  { idPersona: 1, nombre: 'Andrea Salazar', documento: '1234567890', telefono: '3001234567', email: 'asalazar@fanda.co', fecha_nacimiento: '1990-05-15', idEstado: 1 },
  { idPersona: 2, nombre: 'Juan Peña', documento: '0987654321', telefono: '3114445566', email: 'jpena@fanda.co', fecha_nacimiento: '1988-11-22', idEstado: 1 },
  { idPersona: 3, nombre: 'Carlos Vélez', documento: '1122334455', telefono: '3001112233', email: 'cvelez@fanda.co', fecha_nacimiento: '1995-03-07', idEstado: 1 },
  { idPersona: 4, nombre: 'Valentina Reyes', documento: '5544332211', telefono: '3114445566', email: 'vreyes@fanda.co', fecha_nacimiento: '1997-08-19', idEstado: 1 },
  { idPersona: 5, nombre: 'Andrés Montoya', documento: '6677889900', telefono: '3227778899', email: 'amontoya@fanda.co', fecha_nacimiento: '1993-12-03', idEstado: 1 },
  { idPersona: 6, nombre: 'Daniela García', documento: '9900887766', telefono: '3340001122', email: 'dgarcia@fanda.co', fecha_nacimiento: '1999-04-25', idEstado: 1 },
  { idPersona: 7, nombre: 'Valentina Restrepo', documento: '1234509876', telefono: '3142567890', email: 'vrestrepo@mail.com', fecha_nacimiento: '2007-03-14', idEstado: 1 },
  { idPersona: 8, nombre: 'Santiago Gómez', documento: '5678901234', telefono: '3209871234', email: 'sgomez@mail.com', fecha_nacimiento: '2010-07-22', idEstado: 1 },
  { idPersona: 9, nombre: 'María Restrepo', documento: '1122334400', telefono: '3001112233', email: 'mrestrepo@mail.com', fecha_nacimiento: '1975-06-30', idEstado: 1 },
  { idPersona: 10, nombre: 'Luis Gómez', documento: '4400332211', telefono: '3114445566', email: 'lgomez@mail.com', fecha_nacimiento: '1972-09-12', idEstado: 1 },
  { idPersona: 11, nombre: 'Ana Cano', documento: '9876543210', telefono: '3227778899', email: 'acano@mail.com', fecha_nacimiento: '1980-01-08', idEstado: 2 },
];

export const acudientesSeed: Acudiente[] = [
  { idAcudiente: 1, idPersona: 9, idEstado: 1 },
  { idAcudiente: 2, idPersona: 10, idEstado: 1 },
  { idAcudiente: 3, idPersona: 11, idEstado: 2 },
];

export const usuariosSeed: Usuario[] = [
  { idUsuario: 1, persona_id: 1, username: 'asalazar', password_hash: '$2b$10$abc...', idEstado: 8, roles: [1] },
  { idUsuario: 2, persona_id: 2, username: 'jpena', password_hash: '$2b$10$def...', idEstado: 8, roles: [2] },
  { idUsuario: 3, persona_id: 3, username: 'cvelez', password_hash: '$2b$10$ghi...', idEstado: 8, roles: [3] },
  { idUsuario: 4, persona_id: 4, username: 'vreyes', password_hash: '$2b$10$jkl...', idEstado: 8, roles: [3] },
];

/* ─── HELPERS ─── */

export function getEstadoNombre(idEstado: number): string {
  return estadosSeed.find(e => e.idEstado === idEstado)?.nombre ?? '—';
}

export function getPersonaNombre(idPersona: number): string {
  return personasSeed.find(p => p.idPersona === idPersona)?.nombre ?? '—';
}

export function getRolNombre(idRol: number): string {
  return rolesSeed.find(r => r.idRol === idRol)?.nombre ?? '—';
}

export function getPermisoDesc(idPermiso: number): string {
  return permisosSeed.find(p => p.idPermiso === idPermiso)?.descripcion ?? '—';
}

/* ─── STATUS BADGE ─── */
export function estadoBadge(nombre: string): ReactNode {
  const map: Record<string, string> = {
    Activo: 'bg-purple-400/15 text-purple-400 border-purple-400/30',
    Activa: 'bg-purple-400/15 text-purple-400 border-purple-400/30',
    'Al día': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    Pendiente: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    Inactivo: 'bg-neutral-500/15 text-neutral-400 border-neutral-500/30',
    Inactiva: 'bg-neutral-500/15 text-neutral-400 border-neutral-500/30',
    Vencida: 'bg-red-500/15 text-red-400 border-red-500/30',
    Cancelada: 'bg-red-500/15 text-red-400 border-red-500/30',
    Rechazado: 'bg-red-500/15 text-red-400 border-red-500/30',
    Bloqueado: 'bg-red-500/15 text-red-400 border-red-500/30',
    Publicada: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    Borrador: 'bg-neutral-500/15 text-neutral-400 border-neutral-500/30',
  };
  const cls = map[nombre] ?? 'bg-purple-500/15 text-purple-400 border-purple-500/30';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-condensed font-600 uppercase tracking-wider border ${cls}`}>
      {nombre}
    </span>
  );
}
