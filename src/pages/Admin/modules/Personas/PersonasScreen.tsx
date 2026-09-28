import { ReactNode, useEffect, useMemo, useState } from "react"
import {
  personasSeed,
  acudientesSeed,
  usuariosSeed,
  permisosSeed,
  getEstadoNombre,
  Persona,
  Acudiente,
  Rol,
} from "../seguridad/data"

/* ═══════════════════════════════════════════════════════════════════
 * MÓDULO PERSONAS — VISTA ADMINISTRADOR
 * Sigue el wireframe pieza por pieza:
 *
 *  1. Cabecera con silueta + engranaje  → menú desplegable
 *  2. 3 KPI: Usuarios en mora · Usuarios al día · Pago vencido
 *  3. Buscador + botón "+"              → tarjeta "Nueva persona"
 *  4. Lista: nombre · ícono acudiente · chip de pago · ojo
 *       - ojo             → tarjeta de la persona (edición con lápiz)
 *       - ícono acudiente → tarjeta del acudiente (toggle Activo)
 *       - chip de pago    → mini-menú Mora / Check / Vencido
 *  5. Filtro por estado de mensualidad (chips + KPI comparten filtro)
 *  6. Permisos = módulos que la persona puede ver según su rol
 *     (tarjeta de la persona + editor en el menú del engranaje)
 *
 * Roles válidos: Administrador · Instructor · Estudiante · Acudiente.
 * Nadie puede quedar sin rol.
 *
 * NO modifica seguridad/data.ts. Lo que el schema aún no tiene
 * (tipo de documento, estado de pago, vínculo estudiante↔acudiente,
 * roles y módulos por rol) se simula localmente en la sección MOCK.
 * ═══════════════════════════════════════════════════════════════════ */

/* ───────────────────────── TIPOS ───────────────────────── */

type PagoKey = "mora" | "check" | "vencido"
type Filtro = "todos" | PagoKey

interface PersonaRow extends Persona {
  tipoDocumento: string
}
interface Vinculo {
  idAcudiente: number
  parentesco: string
}
interface AcudienteInfo {
  acudiente: Acudiente
  persona: PersonaRow
  vinculo: Vinculo
}
interface NuevaPersona {
  nombre: string
  tipoDocumento: string
  documento: string
  telefono: string
  email: string
  fecha_nacimiento: string
  idRol: number
  acudiente: { idAcudiente: number } | { nombre: string; telefono: string } | null
  parentesco: string
}

type Acceso =
  | { tipo: "total" }
  | { tipo: "limitado"; nota: string }
  | { tipo: "bloqueado"; nota: string }
  | { tipo: "ninguno" }

interface AccesoModulo {
  idPermiso: number
  label: string
  acceso: Acceso
}

/* ───────────────────────── MOCK LOCAL ─────────────────────────
 * Mientras el backend no exponga esto, se simula aquí.
 * Quitar cuando se conecte a la API real.
 * ─────────────────────────────────────────────────────────── */

const ROL_ADMIN = 1
const ROL_INSTRUCTOR = 3
const ROL_ESTUDIANTE = 5
const ROL_ACUDIENTE = 6

/* Permisos = MÓDULOS que la persona puede ver según su rol.
 * Se reutilizan los 13 permisos de la BD, mostrados con el nombre del módulo. */
const MODULO_LABEL: Record<number, string> = {
  1: "Dashboard",
  2: "Estudiantes",
  3: "Instructores",
  4: "Pagos",
  5: "Grupos",
  6: "Agendamiento de Instructores",
  7: "Sedes",
  8: "Talleres",
  9: "Usuarios",
  10: "Roles y permisos",
  11: "Reportes",
  12: "Matrícula",
  13: "Aulas",
}

const permisoLabel = (desc: string) => {
  const s = desc.replace(/_/g, " ")
  return s.charAt(0).toUpperCase() + s.slice(1)
}

const PERMISOS = permisosSeed.map((p) => ({
  idPermiso: p.idPermiso,
  label: MODULO_LABEL[p.idPermiso] ?? permisoLabel(p.descripcion),
}))

// Solo existen 4 roles (rolesSeed trae otros; aquí no aplican).
const ROLES_LOCALES: Rol[] = [
  { idRol: ROL_ADMIN, nombre: "Administrador", idEstado: 1, permisos: PERMISOS.map((p) => p.idPermiso) },
  { idRol: ROL_INSTRUCTOR, nombre: "Instructor", idEstado: 1, permisos: [1, 5, 6, 9] },
  { idRol: ROL_ESTUDIANTE, nombre: "Estudiante", idEstado: 1, permisos: [4, 5, 6, 8, 9, 12] },
  { idRol: ROL_ACUDIENTE, nombre: "Acudiente", idEstado: 1, permisos: [4, 6, 9, 12] },
]

/* Condiciones sobre un módulo concedido por un rol (clave "idRol:idPermiso"). */
interface Restriccion {
  nota?: string // acceso limitado: se ve, pero con alcance reducido
  soloMayorEdad?: boolean // solo aplica si la persona es mayor de edad
  bloqueo?: string // texto cuando no aplica por edad
}
const SOLO_PROPIO = "Solo su propio usuario (credenciales de acceso)"
const RESTRICCIONES: Record<string, Restriccion> = {
  [`${ROL_INSTRUCTOR}:9`]: { nota: SOLO_PROPIO },
  [`${ROL_ESTUDIANTE}:9`]: { nota: SOLO_PROPIO },
  [`${ROL_ACUDIENTE}:9`]: { nota: SOLO_PROPIO },
  [`${ROL_ESTUDIANTE}:4`]: { soloMayorEdad: true, bloqueo: "Solo mayores de edad · lo gestiona su acudiente" },
  [`${ROL_ACUDIENTE}:4`]: { nota: "Pagos de sus estudiantes" },
}

const restriccionTexto = (idRol: number, idPermiso: number) => {
  const r = RESTRICCIONES[`${idRol}:${idPermiso}`]
  if (!r) return undefined
  return r.nota ?? (r.soloMayorEdad ? "Solo si es mayor de edad" : undefined)
}

function resolverAcceso(idPermiso: number, idsRoles: number[], roles: Rol[], esMayor: boolean): Acceso {
  let limitado: string | null = null
  let bloqueado: string | null = null
  for (const idRol of idsRoles) {
    const rol = roles.find((r) => r.idRol === idRol)
    if (!rol || !rol.permisos.includes(idPermiso)) continue
    const r = RESTRICCIONES[`${idRol}:${idPermiso}`]
    if (!r) return { tipo: "total" }
    if (r.soloMayorEdad && !esMayor) {
      bloqueado = bloqueado ?? r.bloqueo ?? "Solo mayores de edad"
      continue
    }
    if (r.nota) limitado = limitado ?? r.nota
    else return { tipo: "total" }
  }
  if (limitado) return { tipo: "limitado", nota: limitado }
  if (bloqueado) return { tipo: "bloqueado", nota: bloqueado }
  return { tipo: "ninguno" }
}

const TIPO_DOC_SEED: Record<number, string> = { 8: "T.I." } // Valentina (id 7, nac. 2007) ya es mayor de edad → C.C.

const PERSONAS_MOCK: PersonaRow[] = [
  { idPersona: 12, nombre: "Mariana Díaz Mesa", tipoDocumento: "C.C.", documento: "100264985", telefono: "3105550112", email: "marianadc@gmail.com", fecha_nacimiento: "2000-09-15", idEstado: 1 },
  { idPersona: 13, nombre: "Mario Cardona", tipoDocumento: "C.C.", documento: "1017223344", telefono: "3126667788", email: "mcardona@mail.com", fecha_nacimiento: "1998-02-11", idEstado: 1 },
  { idPersona: 14, nombre: "Sara Ospina", tipoDocumento: "C.C.", documento: "1001887766", telefono: "3158889900", email: "sospina@mail.com", fecha_nacimiento: "2001-06-30", idEstado: 1 },
  { idPersona: 15, nombre: "Fernando López", tipoDocumento: "T.I.", documento: "1102334455", telefono: "", email: "", fecha_nacimiento: "2011-04-09", idEstado: 1 },
  { idPersona: 16, nombre: "Juan López", tipoDocumento: "C.C.", documento: "71889900", telefono: "3098749546", email: "jlopez@mail.com", fecha_nacimiento: "1979-10-02", idEstado: 1 },
]

const ACUDIENTES_MOCK: Acudiente[] = [{ idAcudiente: 4, idPersona: 16, idEstado: 1 }]

// idPersona del estudiante → su acudiente y parentesco
const VINCULOS_INICIAL: Record<number, Vinculo> = {
  8: { idAcudiente: 2, parentesco: "Padre" },
  15: { idAcudiente: 4, parentesco: "Padre" },
}

const ESTUDIANTES_IDS = [7, 8, 12, 13, 14, 15]

// Estado de pago (mensualidad) por estudiante.
// En BD solo hay "Al día" (4) y "Vencida" (5): Mora y Vencido son ambos idEstado 5
// y se distinguen por los días de atraso (mora ≤ 30 días, vencido > 30).
const PAGOS_INICIAL: Record<number, PagoKey> = {
  7: "check",
  8: "vencido",
  12: "mora",
  13: "check",
  14: "mora",
  15: "check",
}

/* ───────────────────────── CONSTANTES / HELPERS ───────────────────────── */

const PAGO_ORDER: PagoKey[] = ["mora", "check", "vencido"]

const PAGO_META: Record<
  PagoKey,
  { label: string; kpi: string; idEstado: number; chip: string; dot: string; text: string; ring: string }
> = {
  mora: {
    label: "Mora",
    kpi: "Usuarios en mora",
    idEstado: 5,
    chip: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    dot: "bg-amber-400",
    text: "text-amber-400",
    ring: "border-amber-500/60",
  },
  check: {
    label: "Al día",
    kpi: "Usuarios al día",
    idEstado: 4,
    chip: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    dot: "bg-emerald-400",
    text: "text-emerald-400",
    ring: "border-emerald-500/60",
  },
  vencido: {
    label: "Vencido",
    kpi: "Pago vencido",
    idEstado: 5,
    chip: "bg-red-500/15 text-red-400 border-red-500/30",
    dot: "bg-red-400",
    text: "text-red-400",
    ring: "border-red-500/60",
  },
}

const nextId = (ids: number[]) => Math.max(0, ...ids) + 1

const formatFecha = (iso: string) => {
  if (!iso) return "—"
  const [y, m, d] = iso.split("-")
  return y && m && d ? `${d}-${m}-${y}` : iso
}

function esMayorDeEdad(p: PersonaRow): boolean {
  if (!p.fecha_nacimiento) return p.tipoDocumento !== "T.I."
  const [y, m, d] = p.fecha_nacimiento.split("-").map(Number)
  const hoy = new Date()
  let edad = hoy.getFullYear() - y
  if (hoy.getMonth() + 1 < m || (hoy.getMonth() + 1 === m && hoy.getDate() < d)) edad--
  return edad >= 18
}

function buildRolesIniciales(): Record<number, number[]> {
  const validos = new Set(ROLES_LOCALES.map((r) => r.idRol))
  const acuIds = new Set([...acudientesSeed, ...ACUDIENTES_MOCK].map((a) => a.idPersona))
  const out: Record<number, number[]> = {}
  for (const p of [...personasSeed, ...PERSONAS_MOCK]) {
    const u = usuariosSeed.find((x) => x.persona_id === p.idPersona)
    // Recepcionista / Coordinador ya no existen → Instructor (menor privilegio)
    let ids = Array.from(new Set((u?.roles ?? []).filter((id) => validos.has(id))))
    if (ids.length === 0) {
      if (ESTUDIANTES_IDS.includes(p.idPersona)) ids = [ROL_ESTUDIANTE]
      else if (acuIds.has(p.idPersona)) ids = [ROL_ACUDIENTE]
      else ids = [ROL_INSTRUCTOR]
    }
    out[p.idPersona] = ids
  }
  return out
}

/* ───────────────────────── ÍCONOS ───────────────────────── */

const PATHS = {
  eye: [
    "M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z",
    "M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  ],
  pencil: [
    "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125",
  ],
  trash: [
    "M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0",
  ],
  search: ["M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z"],
  plus: ["M12 4.5v15m7.5-7.5h-15"],
  close: ["M6 18L18 6M6 6l12 12"],
  check: ["M4.5 12.75l6 6 9-13.5"],
  user: [
    "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z",
  ],
  cog: [
    "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z",
    "M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  ],
  shield: [
    "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
  ],
  chevron: ["M19.5 8.25l-7.5 7.5-7.5-7.5"],
  reset: [
    "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99",
  ],
}

function Icon({ name, className = "w-4 h-4" }: { name: keyof typeof PATHS; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      {PATHS[name].map((d, i) => (
        <path key={i} strokeLinecap="round" strokeLinejoin="round" d={d} />
      ))}
    </svg>
  )
}

function Silhouette({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <circle cx="60" cy="40" r="20" />
      <path strokeLinecap="round" d="M18 114c0-26 19-42 42-42s42 16 42 42" />
    </svg>
  )
}

/* ───────────────────────── ATOMS ───────────────────────── */

const labelCls = "font-condensed text-[11px] uppercase tracking-wider text-text-muted mb-1"
const underlineInput =
  "w-full bg-transparent border-0 border-b border-border px-0 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-purple-400 transition-colors font-body"

function Modal({
  onClose,
  children,
  z = "z-40",
  width = "max-w-md",
  escape = true,
}: {
  onClose: () => void
  children: ReactNode
  z?: string
  width?: string
  escape?: boolean
}) {
  useEffect(() => {
    if (!escape) return
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !(e.target instanceof HTMLInputElement)) onClose()
    }
    window.addEventListener("keydown", h)
    return () => window.removeEventListener("keydown", h)
  }, [onClose, escape])

  return (
    <div
      className={`fixed inset-0 ${z} flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm`}
      onMouseDown={onClose}
    >
      <div
        className={`w-full ${width} max-h-[90vh] overflow-y-auto rounded-[20px] bg-surface border border-border shadow-2xl shadow-black/60`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Cerrar"
      className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-text hover:bg-border transition-all cursor-pointer"
    >
      <Icon name="close" className="w-5 h-5" />
    </button>
  )
}

function PagoChip({ pago, onClick, open }: { pago: PagoKey; onClick?: () => void; open?: boolean }) {
  const m = PAGO_META[pago]
  const cls = `inline-flex items-center justify-center gap-1.5 min-w-[88px] px-3 py-1 rounded-full border text-xs font-condensed font-600 uppercase tracking-wider ${m.chip}`
  const content = (
    <>
      {pago === "check" && <Icon name="check" className="w-3.5 h-3.5" />}
      {m.label}
    </>
  )
  if (!onClick) return <span className={cls}>{content}</span>
  return (
    <button
      type="button"
      onClick={onClick}
      aria-haspopup="menu"
      aria-expanded={open}
      title="Cambiar estado de pago"
      className={`${cls} cursor-pointer hover:brightness-125 transition`}
    >
      {content}
    </button>
  )
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full border transition-colors cursor-pointer ${
        checked ? "bg-purple-700 border-purple-400/50" : "bg-surface-alt border-border"
      }`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${
          checked ? "left-[22px]" : "left-0.5"
        }`}
      />
    </button>
  )
}

/* Fila con línea inferior + lápiz (edición en línea, como en el wireframe) */
function EditableRow({
  label,
  value,
  type = "text",
  required = false,
  onSave,
}: {
  label: string
  value: string
  type?: string
  required?: boolean
  onSave: (v: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  useEffect(() => {
    if (!editing) setDraft(value)
  }, [value, editing])

  const commit = () => {
    const v = draft.trim()
    if (required && !v) return
    if (v !== value) onSave(v)
    setEditing(false)
  }

  return (
    <div>
      <p className={labelCls}>{label}</p>
      <div className="flex items-center gap-2 border-b border-border pb-1.5 min-h-[30px]">
        {editing ? (
          <input
            autoFocus
            type={type}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit()
              if (e.key === "Escape") setEditing(false)
            }}
            className="flex-1 min-w-0 bg-transparent text-sm text-text focus:outline-none font-body"
          />
        ) : (
          <span className="flex-1 min-w-0 font-body text-sm text-text truncate">{value || "—"}</span>
        )}
        {editing ? (
          <>
            <button type="button" onClick={commit} title="Guardar" className="text-emerald-400 hover:bg-emerald-400/10 rounded-md p-1 cursor-pointer">
              <Icon name="check" />
            </button>
            <button type="button" onClick={() => setEditing(false)} title="Cancelar" className="text-text-muted hover:bg-border rounded-md p-1 cursor-pointer">
              <Icon name="close" />
            </button>
          </>
        ) : (
          <button type="button" onClick={() => setEditing(true)} title={`Editar ${label.toLowerCase()}`} className="text-text-muted hover:text-purple-400 hover:bg-purple-400/10 rounded-md p-1 cursor-pointer">
            <Icon name="pencil" />
          </button>
        )}
      </div>
    </div>
  )
}

function StaticRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className={labelCls}>{label}</p>
      <div className="border-b border-border pb-1.5 min-h-[30px] flex items-center">
        <span className="font-body text-sm text-text">{value || "—"}</span>
      </div>
    </div>
  )
}

/* ───────────────────────── TARJETA: VER PERSONA ───────────────────────── */

interface ViewModalProps {
  persona: PersonaRow
  roles: Rol[]
  idsRoles: number[]
  accesos: AccesoModulo[]
  pago: PagoKey | null
  acu: AcudienteInfo | null
  escape: boolean
  onClose: () => void
  onUpdate: (patch: Partial<PersonaRow>) => void
  onSetRoles: (ids: number[]) => void
  onSetPago: (k: PagoKey) => void
  onDelete: () => void
  onOpenAcudiente: () => void
}

function ViewModal({
  persona,
  roles,
  idsRoles,
  accesos,
  pago,
  acu,
  escape,
  onClose,
  onUpdate,
  onSetRoles,
  onSetPago,
  onDelete,
  onOpenAcudiente,
}: ViewModalProps) {
  const [confirmDel, setConfirmDel] = useState(false)
  const [editRol, setEditRol] = useState(false)
  const [draftRoles, setDraftRoles] = useState<number[]>(idsRoles)
  const [verPermisos, setVerPermisos] = useState(true)

  const nombresRoles = idsRoles.map((id) => roles.find((r) => r.idRol === id)?.nombre ?? "—")

  // Nadie puede quedar sin rol: el último rol seleccionado no se puede quitar
  const toggleDraft = (id: number) =>
    setDraftRoles((d) => (d.includes(id) ? (d.length > 1 ? d.filter((x) => x !== id) : d) : [...d, id]))

  const conAcceso = accesos.filter((a) => a.acceso.tipo === "total" || a.acceso.tipo === "limitado")
  const bloqueados = accesos.filter((a) => a.acceso.tipo === "bloqueado")
  const sinAcceso = accesos.filter((a) => a.acceso.tipo === "ninguno")
  const activo = persona.idEstado === 1

  return (
    <Modal onClose={onClose} escape={escape}>
      <div className="relative px-6 pt-6 pb-2">
        <CloseButton onClick={onClose} />
        {/* Avatar */}
        <div className="mx-auto mb-5 w-full max-w-[220px] h-20 rounded-xl bg-surface-alt border border-border flex items-center justify-center text-purple-400">
          <Icon name="user" className="w-9 h-9" />
        </div>

        {/* Datos editables (lápiz) */}
        <div className="flex flex-col gap-4">
          <EditableRow label="Nombre" value={persona.nombre} required onSave={(v) => onUpdate({ nombre: v })} />
          <EditableRow label="Correo" value={persona.email} type="email" onSave={(v) => onUpdate({ email: v })} />
          <EditableRow label="Teléfono" value={persona.telefono} type="tel" onSave={(v) => onUpdate({ telefono: v })} />
          <div className="grid grid-cols-2 gap-4">
            <StaticRow label="Fecha de nacimiento" value={formatFecha(persona.fecha_nacimiento)} />
            <StaticRow label="Documento" value={`${persona.tipoDocumento} ${persona.documento}`} />
          </div>

          {/* Rol (lápiz) */}
          <div>
            <p className={labelCls}>Rol</p>
            <div className="flex items-start gap-2 border-b border-border pb-2 min-h-[30px]">
              {editRol ? (
                <div className="flex-1 flex flex-wrap gap-1.5">
                  {roles.map((r) => {
                    const on = draftRoles.includes(r.idRol)
                    return (
                      <button
                        key={r.idRol}
                        type="button"
                        onClick={() => toggleDraft(r.idRol)}
                        className={`px-2.5 py-0.5 rounded-full border text-xs font-condensed font-600 uppercase tracking-wider cursor-pointer transition-colors ${
                          on
                            ? "bg-purple-700/25 text-purple-300 border-purple-400/50"
                            : "border-border text-text-muted hover:border-purple-400/40"
                        }`}
                      >
                        {r.nombre}
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="flex-1 flex flex-wrap gap-1.5">
                  {nombresRoles.map((n) => (
                    <span key={n} className="px-2.5 py-0.5 rounded-full border text-xs font-condensed font-600 uppercase tracking-wider bg-purple-700/15 text-purple-300 border-purple-700/30">
                      {n}
                    </span>
                  ))}
                </div>
              )}
              {editRol ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      onSetRoles(draftRoles)
                      setEditRol(false)
                    }}
                    title="Guardar rol"
                    className="text-emerald-400 hover:bg-emerald-400/10 rounded-md p-1 cursor-pointer"
                  >
                    <Icon name="check" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDraftRoles(idsRoles)
                      setEditRol(false)
                    }}
                    title="Cancelar"
                    className="text-text-muted hover:bg-border rounded-md p-1 cursor-pointer"
                  >
                    <Icon name="close" />
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setDraftRoles(idsRoles)
                    setEditRol(true)
                  }}
                  title="Editar rol"
                  className="text-text-muted hover:text-purple-400 hover:bg-purple-400/10 rounded-md p-1 cursor-pointer"
                >
                  <Icon name="pencil" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Datos generales: estado de la persona + mensualidad + acudiente */}
      <div className="px-6 py-4 mt-2 border-t border-border flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className={`${labelCls} mb-0.5`}>Estado de la persona</p>
              <p className={`font-body text-sm ${activo ? "text-text" : "text-text-muted"}`}>
                {getEstadoNombre(persona.idEstado)}
              </p>
            </div>
            <Toggle checked={activo} onChange={() => onUpdate({ idEstado: activo ? 2 : 1 })} />
          </div>
          {pago && (
            <div>
              <p className={labelCls}>Mensualidad</p>
              <div className="grid grid-cols-3 gap-2">
                {PAGO_ORDER.map((k) => {
                  const m = PAGO_META[k]
                  const on = pago === k
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => onSetPago(k)}
                      className={`flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-condensed font-600 uppercase tracking-wider cursor-pointer transition-colors ${
                        on ? m.chip : "border-border text-text-muted hover:border-purple-400/40"
                      }`}
                    >
                      {k === "check" && <Icon name="check" className="w-3.5 h-3.5" />}
                      {m.label}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
          {acu && (
            <div>
              <p className={labelCls}>Acudiente</p>
              <button
                type="button"
                onClick={onOpenAcudiente}
                className="w-full flex items-center gap-3 rounded-xl border border-border bg-surface-alt/50 px-3 py-2.5 hover:border-purple-400/50 transition-colors cursor-pointer text-left"
              >
                <span className="w-8 h-8 rounded-full bg-purple-700/25 border border-purple-700/40 flex items-center justify-center text-purple-400 flex-shrink-0">
                  <Icon name="user" />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block font-body text-sm text-text truncate">{acu.persona.nombre}</span>
                  <span className="block font-condensed text-xs uppercase tracking-wider text-text-muted">
                    {acu.vinculo.parentesco} · {getEstadoNombre(acu.acudiente.idEstado)}
                  </span>
                </span>
                <Icon name="eye" className="w-4 h-4 text-text-muted" />
              </button>
            </div>
          )}
      </div>

      {/* Permisos = módulos que puede ver según su rol */}
      <div className="px-6 py-4 border-t border-border">
        <button
          type="button"
          onClick={() => setVerPermisos((v) => !v)}
          className="w-full flex items-center justify-between cursor-pointer"
        >
          <span className={`${labelCls} mb-0 flex items-center gap-2`}>
            <Icon name="shield" className="w-4 h-4 text-purple-400" />
            Permisos · {conAcceso.length} de {accesos.length} módulos
          </span>
          <span className={`text-text-muted transition-transform ${verPermisos ? "rotate-180" : ""}`}>
            <Icon name="chevron" />
          </span>
        </button>

        {verPermisos && (
          <div className="mt-3 flex flex-col gap-3">
            <p className="font-body text-xs text-text-muted">
              Módulos que puede ver y usar como {nombresRoles.join(" / ")}.
            </p>

            <ul className="grid sm:grid-cols-2 gap-2">
              {conAcceso.map((a) => (
                <li
                  key={a.idPermiso}
                  className="flex items-start gap-2.5 rounded-xl border border-purple-700/40 bg-purple-700/10 px-3 py-2"
                >
                  <span className="mt-0.5 text-purple-400 flex-shrink-0">
                    <Icon name="check" className="w-4 h-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-body text-sm text-text">{a.label}</span>
                    {a.acceso.tipo === "limitado" && (
                      <span className="block font-body text-xs text-amber-400 leading-snug mt-0.5">
                        {a.acceso.nota}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>

            {bloqueados.map((a) => (
              <div
                key={a.idPermiso}
                className="rounded-xl border border-dashed border-border px-3 py-2 flex items-start gap-2.5"
              >
                <span className="mt-0.5 text-text-muted flex-shrink-0">
                  <Icon name="close" className="w-4 h-4" />
                </span>
                <span className="min-w-0">
                  <span className="block font-body text-sm text-text-muted">{a.label}</span>
                  {a.acceso.tipo === "bloqueado" && (
                    <span className="block font-body text-xs text-text-muted leading-snug mt-0.5">
                      No disponible · {a.acceso.nota}
                    </span>
                  )}
                </span>
              </div>
            ))}

            {sinAcceso.length > 0 && (
              <p className="font-body text-xs text-text-muted leading-relaxed">
                <span className="font-600">Sin acceso:</span> {sinAcceso.map((a) => a.label).join(", ")}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Eliminar */}
      <div className="px-6 py-4 border-t border-border flex items-center justify-between gap-3">
        {confirmDel ? (
          <>
            <span className="font-body text-sm text-text-soft">¿Eliminar a {persona.nombre}?</span>
            <div className="flex gap-2">
              <button type="button" onClick={() => setConfirmDel(false)} className="px-4 py-2 rounded-full border border-border text-text-soft font-condensed font-600 text-xs uppercase tracking-wider hover:text-text cursor-pointer">
                Cancelar
              </button>
              <button type="button" onClick={onDelete} className="px-4 py-2 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 font-condensed font-600 text-xs uppercase tracking-wider hover:bg-red-500/30 cursor-pointer">
                Eliminar
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmDel(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-border text-text-muted hover:border-red-400/40 hover:text-red-400 font-condensed font-600 text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            <Icon name="trash" />
            Eliminar persona
          </button>
        )}
      </div>
    </Modal>
  )
}

/* ───────────────────────── TARJETA: ACUDIENTE ───────────────────────── */

function AcudienteModal({
  info,
  estudiantes,
  onToggle,
  onClose,
}: {
  info: AcudienteInfo
  estudiantes: { persona: PersonaRow; parentesco: string }[]
  onToggle: () => void
  onClose: () => void
}) {
  const activo = info.acudiente.idEstado === 1
  return (
    <Modal onClose={onClose} z="z-50" width="max-w-sm">
      <div className="relative px-6 pt-6 pb-2">
        <CloseButton onClick={onClose} />
        <p className="font-condensed text-xs uppercase tracking-wider text-purple-400 mb-4">Acudiente</p>
        <div className="flex flex-col gap-4">
          <StaticRow label="Nombre" value={info.persona.nombre} />
          <StaticRow label="Teléfono" value={info.persona.telefono} />
          {estudiantes.map((e) => (
            <div key={e.persona.idPersona} className="grid grid-cols-2 gap-4">
              <StaticRow label="Estudiante" value={e.persona.nombre} />
              <StaticRow label="Parentesco" value={e.parentesco} />
            </div>
          ))}
        </div>
      </div>
      <div className="px-6 py-5 flex items-center justify-between">
        <div>
          <p className="font-body text-sm text-text">{getEstadoNombre(info.acudiente.idEstado)}</p>
          <p className="font-body text-xs text-text-muted">Estado del acudiente</p>
        </div>
        <Toggle checked={activo} onChange={onToggle} />
      </div>
    </Modal>
  )
}

/* ───────────────────────── TARJETA: NUEVA PERSONA ───────────────────────── */

function CrearModal({
  roles,
  acudientesDisponibles,
  onClose,
  onCreate,
}: {
  roles: Rol[]
  acudientesDisponibles: { idAcudiente: number; nombre: string }[]
  onClose: () => void
  onCreate: (n: NuevaPersona) => void
}) {
  const [form, setForm] = useState({
    nombre: "",
    tipoDocumento: "C.C.",
    documento: "",
    telefono: "",
    email: "",
    fecha_nacimiento: "",
    idRol: "",
    acuModo: "nuevo",
    acuNombre: "",
    acuTelefono: "",
    parentesco: "",
  })
  const set =
    (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }))

  // Al elegir T.I. el rol sugerido es Estudiante (se puede cambiar)
  const setTipoDoc = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tipo = e.target.value
    setForm((f) => ({
      ...f,
      tipoDocumento: tipo,
      idRol: tipo === "T.I." && !f.idRol ? String(ROL_ESTUDIANTE) : f.idRol,
    }))
  }

  const esMenor = form.tipoDocumento === "T.I."

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    let acudiente: NuevaPersona["acudiente"] = null
    if (esMenor) {
      acudiente =
        form.acuModo === "nuevo"
          ? { nombre: form.acuNombre.trim(), telefono: form.acuTelefono.trim() }
          : { idAcudiente: Number(form.acuModo) }
    }
    onCreate({
      nombre: form.nombre.trim(),
      tipoDocumento: form.tipoDocumento,
      documento: form.documento.trim(),
      telefono: form.telefono.trim(),
      email: form.email.trim(),
      fecha_nacimiento: form.fecha_nacimiento,
      idRol: Number(form.idRol),
      acudiente,
      parentesco: form.parentesco.trim(),
    })
  }

  return (
    <Modal onClose={onClose}>
      <form onSubmit={submit}>
        <div className="relative px-6 pt-6 pb-2">
          <CloseButton onClick={onClose} />
          <h2 className="font-display text-xl uppercase text-text leading-none mb-5">Nueva persona</h2>
          <div className="flex flex-col gap-4">
            <div>
              <p className={labelCls}>Nombre</p>
              <input required autoFocus value={form.nombre} onChange={set("nombre")} className={underlineInput} placeholder="Nombre completo" />
            </div>
            <div className="grid grid-cols-[1fr_96px] gap-4">
              <div>
                <p className={labelCls}>Documento</p>
                <input value={form.documento} onChange={set("documento")} className={underlineInput} placeholder="Número" />
              </div>
              <div>
                <p className={labelCls}>Tipo</p>
                <select value={form.tipoDocumento} onChange={setTipoDoc} className={`${underlineInput} cursor-pointer`}>
                  {["C.C.", "T.I.", "C.E.", "PAS"].map((t) => (
                    <option key={t} value={t} className="bg-surface">
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className={labelCls}>Teléfono</p>
                <input type="tel" value={form.telefono} onChange={set("telefono")} className={underlineInput} />
              </div>
              <div>
                <p className={labelCls}>Fecha de nacimiento</p>
                <input type="date" value={form.fecha_nacimiento} onChange={set("fecha_nacimiento")} className={underlineInput} />
              </div>
            </div>
            <div>
              <p className={labelCls}>Correo</p>
              <input type="email" value={form.email} onChange={set("email")} className={underlineInput} />
            </div>
            <div>
              <p className={labelCls}>Rol <span className="text-purple-400">*</span></p>
              <select required value={form.idRol} onChange={set("idRol")} className={`${underlineInput} cursor-pointer`}>
                <option value="" className="bg-surface">
                  Seleccionar rol…
                </option>
                {roles.map((r) => (
                  <option key={r.idRol} value={r.idRol} className="bg-surface">
                    {r.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Si es T.I. → datos del acudiente */}
            {esMenor && (
              <div className="rounded-xl border border-purple-700/40 bg-purple-700/5 p-4 flex flex-col gap-4">
                <p className="font-condensed text-xs uppercase tracking-wider text-purple-400">
                  Menor de edad · datos del acudiente
                </p>
                <div>
                  <p className={labelCls}>Acudiente</p>
                  <select value={form.acuModo} onChange={set("acuModo")} className={`${underlineInput} cursor-pointer`}>
                    <option value="nuevo" className="bg-surface">
                      Registrar nuevo acudiente
                    </option>
                    {acudientesDisponibles.map((a) => (
                      <option key={a.idAcudiente} value={a.idAcudiente} className="bg-surface">
                        {a.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                {form.acuModo === "nuevo" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className={labelCls}>Nombre del acudiente</p>
                      <input required value={form.acuNombre} onChange={set("acuNombre")} className={underlineInput} />
                    </div>
                    <div>
                      <p className={labelCls}>Teléfono</p>
                      <input type="tel" value={form.acuTelefono} onChange={set("acuTelefono")} className={underlineInput} />
                    </div>
                  </div>
                )}
                <div>
                  <p className={labelCls}>Parentesco</p>
                  <input value={form.parentesco} onChange={set("parentesco")} className={underlineInput} placeholder="Padre, madre, tutor…" />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="px-6 py-5 flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 rounded-full border border-border py-2.5 font-condensed font-600 text-sm uppercase tracking-wider text-text-soft hover:border-purple-400/50 hover:text-text transition-all cursor-pointer">
            Cancelar
          </button>
          <button type="submit" className="flex-1 rounded-full bg-purple-700 py-2.5 font-condensed font-600 text-sm uppercase tracking-wider text-white hover:bg-purple-900 active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-purple-700/20">
            Crear persona
          </button>
        </div>
      </form>
    </Modal>
  )
}

/* ───────────────────────── TARJETA: ROLES Y PERMISOS ───────────────────────── */

function RolesPermisosModal({
  roles,
  personasPorRol,
  onTogglePermiso,
  onClose,
}: {
  roles: Rol[]
  personasPorRol: Record<number, number>
  onTogglePermiso: (idRol: number, idPermiso: number) => void
  onClose: () => void
}) {
  const [sel, setSel] = useState(roles[0]?.idRol ?? 0)
  const rol = roles.find((r) => r.idRol === sel) ?? roles[0]

  return (
    <Modal onClose={onClose} width="max-w-2xl">
      <div className="relative px-6 pt-6 pb-4 border-b border-border">
        <CloseButton onClick={onClose} />
        <h2 className="font-display text-xl uppercase text-text leading-none">Roles y permisos</h2>
        <p className="font-body text-xs text-text-muted mt-2 max-w-md">
          Cada permiso es un módulo que el rol puede ver y usar. Los cambios aplican a todas las personas con ese rol.
        </p>
      </div>
      <div className="grid sm:grid-cols-[200px_1fr]">
        <div className="p-3 flex sm:flex-col gap-1.5 overflow-x-auto sm:border-r border-b sm:border-b-0 border-border">
          {roles.map((r) => {
            const n = personasPorRol[r.idRol] ?? 0
            return (
              <button
                key={r.idRol}
                type="button"
                onClick={() => setSel(r.idRol)}
                className={`flex-shrink-0 text-left rounded-xl px-3 py-2 border transition-colors cursor-pointer ${
                  r.idRol === sel
                    ? "bg-purple-700/20 border-purple-400/40 text-purple-300"
                    : "border-transparent text-text-soft hover:bg-purple-400/5"
                }`}
              >
                <span className="block font-body text-sm font-600">{r.nombre}</span>
                <span className="block font-condensed text-[11px] uppercase tracking-wider text-text-muted">
                  {n} persona{n === 1 ? "" : "s"} · {r.permisos.length} módulos
                </span>
              </button>
            )
          })}
        </div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2 content-start">
          {rol &&
            PERMISOS.map((p) => {
              const on = rol.permisos.includes(p.idPermiso)
              const hint = on ? restriccionTexto(rol.idRol, p.idPermiso) : undefined
              return (
                <button
                  key={p.idPermiso}
                  type="button"
                  onClick={() => onTogglePermiso(rol.idRol, p.idPermiso)}
                  className={`flex items-start gap-2.5 rounded-xl border px-3 py-2 text-left transition-colors cursor-pointer ${
                    on ? "border-purple-700/50 bg-purple-700/10" : "border-border hover:border-purple-400/30"
                  }`}
                >
                  <span
                    className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 ${
                      on ? "bg-purple-700 border-purple-400/60 text-white" : "border-border"
                    }`}
                  >
                    {on && <Icon name="check" className="w-3.5 h-3.5" />}
                  </span>
                  <span className="min-w-0">
                    <span className={`block font-body text-sm ${on ? "text-text" : "text-text-muted"}`}>{p.label}</span>
                    {hint && <span className="block font-body text-xs text-amber-400 leading-snug mt-0.5">{hint}</span>}
                  </span>
                </button>
              )
            })}
        </div>
      </div>
    </Modal>
  )
}

/* ═════════════════════════ PANTALLA ═════════════════════════ */

export default function PersonasScreen() {
  const [personas, setPersonas] = useState<PersonaRow[]>(() => [
    ...personasSeed.map((p) => ({ ...p, tipoDocumento: TIPO_DOC_SEED[p.idPersona] ?? "C.C." })),
    ...PERSONAS_MOCK,
  ])
  const [acudientes, setAcudientes] = useState<Acudiente[]>([...acudientesSeed, ...ACUDIENTES_MOCK])
  const [vinculos, setVinculos] = useState<Record<number, Vinculo>>(VINCULOS_INICIAL)
  const [pagos, setPagos] = useState<Record<number, PagoKey>>(PAGOS_INICIAL)
  const [roles, setRoles] = useState<Rol[]>(ROLES_LOCALES)
  const [rolesPersona, setRolesPersona] = useState<Record<number, number[]>>(buildRolesIniciales)

  const [search, setSearch] = useState("")
  const [filtro, setFiltro] = useState<Filtro>("todos")
  const [menuOpen, setMenuOpen] = useState(false)
  const [pagoPopover, setPagoPopover] = useState<number | null>(null)

  const [viewId, setViewId] = useState<number | null>(null)
  const [acuFor, setAcuFor] = useState<number | null>(null)
  const [crearOpen, setCrearOpen] = useState(false)
  const [rolesOpen, setRolesOpen] = useState(false)

  /* ── derivados ── */

  const acudienteDe = (idPersona: number): AcudienteInfo | null => {
    const v = vinculos[idPersona]
    if (!v) return null
    const acudiente = acudientes.find((a) => a.idAcudiente === v.idAcudiente)
    const persona = personas.find((p) => p.idPersona === acudiente?.idPersona)
    return acudiente && persona ? { acudiente, persona, vinculo: v } : null
  }

  const nombresRoles = (idPersona: number) =>
    (rolesPersona[idPersona] ?? []).map((id) => roles.find((r) => r.idRol === id)?.nombre ?? "—")

  const accesosDe = (p: PersonaRow): AccesoModulo[] => {
    const ids = rolesPersona[p.idPersona] ?? []
    const mayor = esMayorDeEdad(p)
    return PERMISOS.map((pm) => ({ ...pm, acceso: resolverAcceso(pm.idPermiso, ids, roles, mayor) }))
  }

  const kpis = useMemo(() => {
    const c: Record<PagoKey, number> = { mora: 0, check: 0, vencido: 0 }
    for (const p of personas) {
      const k = pagos[p.idPersona]
      if (k) c[k]++
    }
    return c
  }, [personas, pagos])

  const personasPorRol = useMemo(() => {
    const c: Record<number, number> = {}
    for (const ids of Object.values(rolesPersona)) for (const id of ids) c[id] = (c[id] ?? 0) + 1
    return c
  }, [rolesPersona])

  const lista = useMemo(() => {
    const q = search.trim().toLowerCase()
    const out = personas.filter((p) => {
      if (filtro !== "todos" && pagos[p.idPersona] !== filtro) return false
      if (!q) return true
      return [p.nombre, p.documento, p.email, p.telefono].some((v) => v.toLowerCase().includes(q))
    })
    // estudiantes (con estado de pago) primero, como en el wireframe
    return [...out].sort((a, b) => Number(!!pagos[b.idPersona]) - Number(!!pagos[a.idPersona]))
  }, [personas, pagos, search, filtro])

  const viewPersona = personas.find((p) => p.idPersona === viewId) ?? null
  const acuInfo = acuFor != null ? acudienteDe(acuFor) : null

  /* ── acciones ── */

  const updatePersona = (id: number, patch: Partial<PersonaRow>) =>
    setPersonas((ps) => ps.map((p) => (p.idPersona === id ? { ...p, ...patch } : p)))

  const setPago = (id: number, k: PagoKey) => {
    setPagos((p) => ({ ...p, [id]: k }))
    setPagoPopover(null)
  }

  const setRolesDe = (id: number, ids: number[]) => {
    if (ids.length === 0) return // nadie sin rol
    setRolesPersona((r) => ({ ...r, [id]: ids }))
    if (ids.includes(ROL_ESTUDIANTE)) setPagos((p) => (p[id] ? p : { ...p, [id]: "check" }))
    else
      setPagos((p) => {
        if (!p[id]) return p
        const { [id]: _omit, ...rest } = p
        return rest
      })
  }

  const togglePermiso = (idRol: number, idPermiso: number) =>
    setRoles((rs) =>
      rs.map((r) =>
        r.idRol !== idRol
          ? r
          : {
              ...r,
              permisos: r.permisos.includes(idPermiso)
                ? r.permisos.filter((x) => x !== idPermiso)
                : [...r.permisos, idPermiso].sort((a, b) => a - b),
            },
      ),
    )

  const toggleAcudiente = (idAcudiente: number) =>
    setAcudientes((as) =>
      as.map((a) => (a.idAcudiente === idAcudiente ? { ...a, idEstado: a.idEstado === 1 ? 2 : 1 } : a)),
    )

  const eliminarPersona = (id: number) => {
    const idsAcudienteEliminados = acudientes.filter((a) => a.idPersona === id).map((a) => a.idAcudiente)
    setPersonas((ps) => ps.filter((p) => p.idPersona !== id))
    setAcudientes((as) => as.filter((a) => a.idPersona !== id))
    setVinculos((vs) => {
      const out: Record<number, Vinculo> = {}
      for (const [k, v] of Object.entries(vs)) {
        if (Number(k) === id || idsAcudienteEliminados.includes(v.idAcudiente)) continue
        out[Number(k)] = v
      }
      return out
    })
    setPagos((p) => {
      const { [id]: _omit, ...rest } = p
      return rest
    })
    setRolesPersona((r) => {
      const { [id]: _omit, ...rest } = r
      return rest
    })
    setViewId(null)
    setAcuFor(null)
  }

  const crearPersona = (n: NuevaPersona) => {
    const idPersona = nextId(personas.map((p) => p.idPersona))
    const nuevas: PersonaRow[] = [
      {
        idPersona,
        nombre: n.nombre,
        tipoDocumento: n.tipoDocumento,
        documento: n.documento,
        telefono: n.telefono,
        email: n.email,
        fecha_nacimiento: n.fecha_nacimiento,
        idEstado: 1,
      },
    ]

    const idRol = n.idRol

    if (n.acudiente) {
      let idAcudiente: number
      if ("idAcudiente" in n.acudiente) {
        idAcudiente = n.acudiente.idAcudiente
      } else {
        const idPersonaAcu = idPersona + 1
        idAcudiente = nextId(acudientes.map((a) => a.idAcudiente))
        nuevas.push({
          idPersona: idPersonaAcu,
          nombre: n.acudiente.nombre,
          tipoDocumento: "C.C.",
          documento: "",
          telefono: n.acudiente.telefono,
          email: "",
          fecha_nacimiento: "",
          idEstado: 1,
        })
        setAcudientes((as) => [...as, { idAcudiente, idPersona: idPersonaAcu, idEstado: 1 }])
        setRolesPersona((r) => ({ ...r, [idPersonaAcu]: [ROL_ACUDIENTE] }))
      }
      setVinculos((v) => ({ ...v, [idPersona]: { idAcudiente, parentesco: n.parentesco || "Acudiente" } }))
    }

    setPersonas((ps) => [...ps, ...nuevas])
    setRolesPersona((r) => ({ ...r, [idPersona]: [idRol] }))
    if (idRol === ROL_ESTUDIANTE) setPagos((p) => ({ ...p, [idPersona]: "check" }))
    setCrearOpen(false)
  }

  const limpiarFiltros = () => {
    setSearch("")
    setFiltro("todos")
    setMenuOpen(false)
  }

  const acudientesDisponibles = acudientes
    .map((a) => ({ idAcudiente: a.idAcudiente, nombre: personas.find((p) => p.idPersona === a.idPersona)?.nombre ?? "—" }))
    .filter((a) => a.nombre !== "—")

  const chipsFiltro: { key: Filtro; label: string }[] = [
    { key: "todos", label: "Todos" },
    { key: "mora", label: "Mora" },
    { key: "check", label: "Al día" },
    { key: "vencido", label: "Vencido" },
  ]

  /* ── render ── */

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-5">
      {/* Título */}
      <div>
        <span className="font-condensed text-xs uppercase tracking-[0.2em] text-purple-400">Seguridad</span>
        <h1 className="font-display text-3xl uppercase text-text leading-none mt-1">Personas</h1>
      </div>

      {/* 1 · Cabecera: silueta + engranaje (menú desplegable) */}
      <div className="rounded-[20px] bg-surface border border-border p-4">
        <div className="relative h-44 rounded-2xl bg-surface-alt border border-border flex items-center justify-center text-text-muted/60">
          <Silhouette className="h-36 w-36" />
          <div className="absolute left-1/2 top-8 ml-12">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              title="Configuración"
              className="w-11 h-11 rounded-full bg-purple-700 text-white flex items-center justify-center shadow-lg shadow-purple-700/30 hover:bg-purple-900 active:scale-95 transition-all cursor-pointer"
            >
              <Icon name="cog" className="w-6 h-6" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setMenuOpen(false)} />
                <div role="menu" className="absolute left-0 top-full mt-2 z-30 w-56 rounded-xl bg-surface border border-border shadow-2xl shadow-black/50 p-1">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false)
                      setRolesOpen(true)
                    }}
                    className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-left font-body text-sm text-text hover:bg-purple-400/10 cursor-pointer"
                  >
                    <Icon name="shield" className="w-4 h-4 text-purple-400" />
                    Roles y permisos
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={limpiarFiltros}
                    className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-left font-body text-sm text-text hover:bg-purple-400/10 cursor-pointer"
                  >
                    <Icon name="reset" className="w-4 h-4 text-purple-400" />
                    Limpiar búsqueda y filtros
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2 · KPI: en mora · al día · pago vencido (clic = filtrar) */}
      <div className="grid grid-cols-3 gap-3">
        {PAGO_ORDER.map((k) => {
          const m = PAGO_META[k]
          const on = filtro === k
          return (
            <button
              key={k}
              type="button"
              aria-pressed={on}
              onClick={() => setFiltro(on ? "todos" : k)}
              className={`rounded-2xl bg-surface border px-4 py-3 text-left transition-colors cursor-pointer ${
                on ? m.ring : "border-border hover:border-purple-400/30"
              }`}
            >
              <span className="block font-condensed text-[11px] uppercase tracking-wider text-text-muted leading-tight">
                {m.kpi}
              </span>
              <span className="flex items-baseline gap-1.5 mt-2">
                <span className={`font-display text-3xl leading-none ${m.text}`}>{kpis[k]}</span>
                <span className="font-condensed text-xs uppercase tracking-wider text-text-muted">
                  {k === "check" ? "check" : m.label.toLowerCase()}
                </span>
              </span>
            </button>
          )
        })}
      </div>

      {/* 3 · Buscador + botón "+" */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar"
            className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-surface border border-border text-text text-sm placeholder:text-text-muted focus:outline-none focus:border-purple-400 transition-colors font-body"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
            <Icon name="search" />
          </span>
        </div>
        <button
          type="button"
          onClick={() => setCrearOpen(true)}
          title="Nueva persona"
          aria-label="Nueva persona"
          className="flex items-center justify-center gap-2 h-[42px] px-6 rounded-xl bg-purple-700 text-white hover:bg-purple-900 active:scale-95 transition-all cursor-pointer shadow-lg shadow-purple-700/20"
        >
          <Icon name="plus" className="w-5 h-5" />
        </button>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-2 flex-wrap -mt-2">
        <span className="font-condensed text-[11px] uppercase tracking-wider text-text-muted mr-1">
          Filtrar por mensualidad
        </span>
        {chipsFiltro.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => setFiltro(c.key)}
            className={`px-3 py-1 rounded-full border text-xs font-condensed font-600 uppercase tracking-wider transition-colors cursor-pointer ${
              filtro === c.key
                ? "bg-purple-700/25 border-purple-400/50 text-purple-300"
                : "border-border text-text-muted hover:border-purple-400/30 hover:text-text"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* 4 · Lista: nombre · acudiente · chip de pago · ojo */}
      <div className="rounded-[20px] bg-surface border border-border">
        {lista.length === 0 ? (
          <div className="px-5 py-14 text-center font-body text-sm text-text-muted">
            No hay personas con esos filtros.
          </div>
        ) : (
          lista.map((p) => {
            const pago = pagos[p.idPersona] ?? null
            const acu = acudienteDe(p.idPersona)
            const roles0 = nombresRoles(p.idPersona)
            return (
              <div
                key={p.idPersona}
                className="relative flex items-center gap-3 px-5 py-3 border-b border-border last:border-0 first:rounded-t-[20px] last:rounded-b-[20px] hover:bg-purple-400/5 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm font-600 text-text truncate">{p.nombre}</p>
                </div>

                {/* ícono acudiente */}
                <div className="w-8 flex justify-center flex-shrink-0">
                  {acu && (
                    <button
                      type="button"
                      onClick={() => setAcuFor(p.idPersona)}
                      title={`Acudiente: ${acu.persona.nombre}`}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                        acu.acudiente.idEstado === 1
                          ? "text-purple-400 hover:bg-purple-400/10"
                          : "text-text-muted hover:bg-border"
                      }`}
                    >
                      <Icon name="user" className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* chip de pago → mini-menú Mora / Check / Vencido */}
                <div className="relative w-[104px] flex justify-end flex-shrink-0">
                  {pago ? (
                    <>
                      <PagoChip pago={pago} open={pagoPopover === p.idPersona} onClick={() => setPagoPopover(pagoPopover === p.idPersona ? null : p.idPersona)} />
                      {pagoPopover === p.idPersona && (
                        <>
                          <div className="fixed inset-0 z-20" onClick={() => setPagoPopover(null)} />
                          <div role="menu" className="absolute right-0 top-full mt-1.5 z-30 w-40 rounded-xl bg-surface border border-border shadow-2xl shadow-black/50 p-1">
                            {PAGO_ORDER.map((k) => (
                              <button
                                key={k}
                                type="button"
                                role="menuitemradio"
                                aria-checked={pago === k}
                                onClick={() => setPago(p.idPersona, k)}
                                className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-left font-body text-sm text-text hover:bg-purple-400/10 cursor-pointer"
                              >
                                <span className={`w-2 h-2 rounded-full ${PAGO_META[k].dot}`} />
                                <span className="flex-1">{PAGO_META[k].label}</span>
                                {pago === k && <Icon name="check" className="w-4 h-4 text-purple-400" />}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <span className="inline-flex items-center justify-center min-w-[88px] px-3 py-1 rounded-full border text-xs font-condensed font-600 uppercase tracking-wider bg-neutral-500/15 text-neutral-400 border-neutral-500/30 max-w-[104px] truncate">
                      {roles0[0] ?? "—"}
                    </span>
                  )}
                </div>

                {/* ojo → tarjeta de la persona */}
                <button
                  type="button"
                  onClick={() => setViewId(p.idPersona)}
                  title="Ver persona"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-purple-400 hover:bg-purple-400/10 transition-all cursor-pointer flex-shrink-0"
                >
                  <Icon name="eye" className="w-5 h-5" />
                </button>
              </div>
            )
          })
        )}
        <div className="border-t border-border px-5 py-3 rounded-b-[20px]">
          <span className="font-condensed text-xs uppercase tracking-wider text-text-muted">
            {lista.length} de {personas.length} persona{personas.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* ── Tarjetas ── */}
      {viewPersona && (
        <ViewModal
          persona={viewPersona}
          roles={roles}
          idsRoles={rolesPersona[viewPersona.idPersona] ?? []}
          accesos={accesosDe(viewPersona)}
          pago={pagos[viewPersona.idPersona] ?? null}
          acu={acudienteDe(viewPersona.idPersona)}
          escape={acuFor === null}
          onClose={() => setViewId(null)}
          onUpdate={(patch) => updatePersona(viewPersona.idPersona, patch)}
          onSetRoles={(ids) => setRolesDe(viewPersona.idPersona, ids)}
          onSetPago={(k) => setPago(viewPersona.idPersona, k)}
          onDelete={() => eliminarPersona(viewPersona.idPersona)}
          onOpenAcudiente={() => setAcuFor(viewPersona.idPersona)}
        />
      )}

      {acuInfo && (
        <AcudienteModal
          info={acuInfo}
          estudiantes={personas
            .filter((p) => vinculos[p.idPersona]?.idAcudiente === acuInfo.acudiente.idAcudiente)
            .map((p) => ({ persona: p, parentesco: vinculos[p.idPersona].parentesco }))}
          onToggle={() => toggleAcudiente(acuInfo.acudiente.idAcudiente)}
          onClose={() => setAcuFor(null)}
        />
      )}

      {crearOpen && (
        <CrearModal
          roles={roles}
          acudientesDisponibles={acudientesDisponibles}
          onClose={() => setCrearOpen(false)}
          onCreate={crearPersona}
        />
      )}

      {rolesOpen && (
        <RolesPermisosModal
          roles={roles}
          personasPorRol={personasPorRol}
          onTogglePermiso={togglePermiso}
          onClose={() => setRolesOpen(false)}
        />
      )}
    </div>
  )
}
