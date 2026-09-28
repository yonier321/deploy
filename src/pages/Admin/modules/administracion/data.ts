import {
  acudientesSeed,
  estadoBadge,
  estadosSeed,
  getEstadoNombre,
  personasSeed,
} from "../seguridad/data"

export { acudientesSeed, estadoBadge, estadosSeed, getEstadoNombre, personasSeed }

export interface SedeMock { idSede: number; nombre: string; idEstado: number }
export interface GrupoMock { idGrupo: number; nombre: string; idSede: number; idAula: number; idInstructor: number; idNivel: number; idEstilo: number; idEstado: number }
export interface EstudianteMock { idEstudiante: number; idPersona: number; idSede: number }
export interface TallerMock { idTaller: number; descripcion: string; valor: number }
export interface InstructorMock { idInstructor: number; nombre: string; sedes: number[]; idEstado: number }
export interface NivelMock { idNivel: number; nombre: string; idEstado: number }
export interface EstiloMock { idEstilo: number; nombre: string; idEstado: number }

// MOCK local — reemplazar cuando exista el módulo real
export const sedeMock: SedeMock[] = [{ idSede: 1, nombre: "Bello", idEstado: 1 }, { idSede: 2, nombre: "Copacabana", idEstado: 1 }]
// MOCK local — reemplazar cuando exista el módulo real
export const instructorMock: InstructorMock[] = [
  { idInstructor: 1, nombre: "Mateo Álvarez", sedes: [1, 2], idEstado: 1 },
  { idInstructor: 2, nombre: "Sara Valencia", sedes: [1, 2], idEstado: 1 },
  { idInstructor: 3, nombre: "Dylan Torres", sedes: [1, 2], idEstado: 1 },
]
// MOCK local — reemplazar cuando exista el módulo real
export const nivelMock: NivelMock[] = [
  { idNivel: 1, nombre: "Básico", idEstado: 1 }, { idNivel: 2, nombre: "Intermedio", idEstado: 1 },
  { idNivel: 3, nombre: "Avanzado", idEstado: 1 },
]
// MOCK local — reemplazar cuando exista el módulo real
export const estiloMock: EstiloMock[] = [
  { idEstilo: 1, nombre: "Hip Hop", idEstado: 1 }, { idEstilo: 2, nombre: "Breaking", idEstado: 1 },
  { idEstilo: 3, nombre: "Dancehall", idEstado: 1 },
]
// MOCK local — reemplazar cuando exista el módulo real
export const grupoMock: GrupoMock[] = [
  { idGrupo: 1, nombre: "Hip Hop B2", idSede: 1, idAula: 1, idInstructor: 1, idNivel: 2, idEstilo: 1, idEstado: 1 },
  { idGrupo: 2, nombre: "Hip Hop C1", idSede: 2, idAula: 3, idInstructor: 2, idNivel: 1, idEstilo: 1, idEstado: 1 },
  { idGrupo: 3, nombre: "Breaking A1", idSede: 1, idAula: 2, idInstructor: 2, idNivel: 3, idEstilo: 2, idEstado: 1 },
]
// MOCK local — reemplazar cuando exista el módulo real
export const estudianteMock: EstudianteMock[] = [
  { idEstudiante: 1, idPersona: 7, idSede: 1 },
  { idEstudiante: 2, idPersona: 8, idSede: 2 },
  { idEstudiante: 3, idPersona: 6, idSede: 1 },
]
// MOCK local — reemplazar cuando exista el módulo real
export const tallerMock: TallerMock[] = [
  { idTaller: 1, descripcion: "Laboratorio de breaking", valor: 85000 },
  { idTaller: 2, descripcion: "Freestyle intensivo", valor: 120000 },
]

export interface Aula { idAula: number; capacidad: number; idSede: number; idEstado: number }
export interface AgendamientoInstructor { idAgendamiento: number; idGrupo: number; dia_semana: string; hora_inicio: string; hora_fin: string }
export interface Matricula {
  idMatricula: number; idEstudiante: number; idGrupo: number; fecha_matricula: string; valor_matricula: number
  idEstado: number // GAP: agregar en la BD real
}
export interface InscripcionTaller { idInscripcionT: number; idEstudiante: number; idTaller: number; fecha_inscripcion: string; idPago: number }
export interface Mensualidad { idMensualidad: number; idMatricula: number; fecha_pago: string | null; valor_pagar: number; fecha_limite: string; idEstado: number }
export interface Pago {
  idPago: number; monto: number; fecha_pago: string; idMetodo: number; idMensualidad: number | null; idMatricula: number | null
  idAcudiente: number | null
  idEstudiante: number | null // GAP: agregar en la BD real
}
export interface MetodoPago { idmetodo: number; nombre: string }
export interface Convocatoria {
  idConvocatoria: number
  idTipoconvo: number // GAP: agregar en la BD real
  nombre: string; fecha_inicio: string; fecha_fin: string | null; descripcion: string
}
export interface TipoConvocatoria { idTipoconvo: number; nombre: string }
export interface Postulacion { idConvocatoriaEst: number; idConvocatoria: number; idEstudiante: number; idEstado: number; beneficio: string }
export interface Contenido { idContenido: number; idtipocontenido: number; titulo: string; contenido: string; imagen_url: string | null; fecha_publicacion: string; fecha_expiracion: string | null; idEstado: number }
export interface TipoContenido { idtipocontenido: number; nombre: string }

export const estadoAprobada = {
  idEstado: 14, nombre: "Aprobada", categoria: "postulacion",
  descripcion: "Postulación aprobada; habilita matrícula con beneficio.",
}
export const estadosAdministracion = [...estadosSeed, estadoAprobada]

export const aulasSeed: Aula[] = [
  { idAula: 1, capacidad: 24, idSede: 1, idEstado: 1 },
  { idAula: 2, capacidad: 16, idSede: 1, idEstado: 1 },
  { idAula: 3, capacidad: 20, idSede: 2, idEstado: 1 },
]
export const agendamientosInstructoresSeed: AgendamientoInstructor[] = [
  { idAgendamiento: 1, idGrupo: 1, dia_semana: "Martes", hora_inicio: "18:00", hora_fin: "20:00" },
  { idAgendamiento: 2, idGrupo: 2, dia_semana: "Jueves", hora_inicio: "17:00", hora_fin: "19:00" },
]
export const matriculasSeed: Matricula[] = [
  { idMatricula: 1, idEstudiante: 1, idGrupo: 1, fecha_matricula: "2025-01-15", valor_matricula: 0, idEstado: 6 },
  { idMatricula: 2, idEstudiante: 2, idGrupo: 2, fecha_matricula: "2025-02-01", valor_matricula: 150000, idEstado: 6 },
]
export const metodosPagoSeed: MetodoPago[] = [{ idmetodo: 1, nombre: "Efectivo" }, { idmetodo: 2, nombre: "Transferencia" }, { idmetodo: 3, nombre: "Tarjeta" }]
export const pagosSeed: Pago[] = [
  { idPago: 1, monto: 150000, fecha_pago: "2025-02-01", idMetodo: 2, idMensualidad: null, idMatricula: 2, idAcudiente: 2, idEstudiante: null },
]
export const inscripcionesTallerSeed: InscripcionTaller[] = [{ idInscripcionT: 1, idEstudiante: 3, idTaller: 1, fecha_inscripcion: "2025-03-05", idPago: 2 }]
export const mensualidadesSeed: Mensualidad[] = [
  { idMensualidad: 1, idMatricula: 1, fecha_pago: null, valor_pagar: 110000, fecha_limite: "2025-03-15", idEstado: 5 },
  { idMensualidad: 2, idMatricula: 2, fecha_pago: "2025-03-10", valor_pagar: 110000, fecha_limite: "2025-03-15", idEstado: 4 },
]
export const tiposConvocatoriaSeed: TipoConvocatoria[] = [{ idTipoconvo: 1, nombre: "General" }, { idTipoconvo: 2, nombre: "Experiencia" }, { idTipoconvo: 3, nombre: "Competencia" }]
export const convocatoriasSeed: Convocatoria[] = [
  { idConvocatoria: 1, idTipoconvo: 3, nombre: "Crew Nacional 2025", fecha_inicio: "2025-01-10", fecha_fin: "2025-02-28", descripcion: "Selección del equipo de competencia." },
]
export const postulacionesSeed: Postulacion[] = [
  { idConvocatoriaEst: 1, idConvocatoria: 1, idEstudiante: 1, idEstado: 14, beneficio: "Matrícula gratis" },
  { idConvocatoriaEst: 2, idConvocatoria: 1, idEstudiante: 3, idEstado: 10, beneficio: "" },
]
export const tiposContenidoSeed: TipoContenido[] = [
  { idtipocontenido: 1, nombre: "Noticia" }, { idtipocontenido: 2, nombre: "Promoción" }, { idtipocontenido: 3, nombre: "Oferta" },
  { idtipocontenido: 4, nombre: "Taller" }, { idtipocontenido: 5, nombre: "Uniforme" },
]
export const contenidosSeed: Contenido[] = [
  { idContenido: 1, idtipocontenido: 4, titulo: "Masterclass de breaking", contenido: "Cupos limitados para nuestra nueva masterclass.", imagen_url: "", fecha_publicacion: "2025-03-01T09:00", fecha_expiracion: "2026-12-31T23:59", idEstado: 12 },
]

export function esMayorDeEdad(fechaNacimiento: string): boolean {
  const [y, m, d] = fechaNacimiento.split("-").map(Number)
  const hoy = new Date()
  let edad = hoy.getFullYear() - y
  if (hoy.getMonth() + 1 < m || (hoy.getMonth() + 1 === m && hoy.getDate() < d)) edad--
  return edad >= 18
}

export function estadoMensualidadVisual(fechaLimite: string, idEstado: number): "Al día" | "Mora" | "Vencida" {
  if (idEstado === 4) return "Al día"
  const atraso = Math.floor((Date.now() - new Date(`${fechaLimite}T23:59:59`).getTime()) / 86400000)
  return atraso <= 30 ? "Mora" : "Vencida"
}

export const personaEstudiante = (idEstudiante: number) => personasSeed.find((p) => p.idPersona === estudianteMock.find((e) => e.idEstudiante === idEstudiante)?.idPersona)
export const nombreEstudiante = (idEstudiante: number) => personaEstudiante(idEstudiante)?.nombre ?? "—"
export const nombreAcudiente = (idAcudiente: number) => personasSeed.find((p) => p.idPersona === acudientesSeed.find((a) => a.idAcudiente === idAcudiente)?.idPersona)?.nombre ?? "—"
