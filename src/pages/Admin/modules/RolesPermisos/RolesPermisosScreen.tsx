import { useMemo, useState } from "react"
import SlideOver from "../../SlideOver"
import { ModuleConfig } from "../../types"
import {
  rolesSeed,
  estadosSeed,
  usuariosSeed,
  permisosSeed,
  getEstadoNombre,
  estadoBadge,
  Rol,
} from "../seguridad/data"

/* ─── Etiquetas legibles por módulo ───
   El catálogo de permisos (permisosSeed) guarda claves técnicas
   (ej. "gestionar_pagos"); esta tabla solo las traduce para mostrarlas.
   El orden de permisosSeed ya coincide con el layout de 2 columnas. */
const MODULO_LABELS: Record<string, string> = {
  ver_dashboard: "Dashboard",
  gestionar_estudiantes: "Estudiantes",
  gestionar_instructores: "Instructores",
  gestionar_pagos: "Pagos",
  gestionar_grupos: "Grupos",
  gestionar_agendamientos_instructores: "Agendamiento de Instructores",
  gestionar_sedes: "Sedes",
  gestionar_talleres: "Talleres",
  gestionar_usuarios: "Usuarios",
  gestionar_roles: "Roles y permisos",
  ver_reportes: "Reportes",
  gestionar_matriculas: "Matrícula",
  gestionar_aulas: "Aulas",
}

const rolConfig: ModuleConfig = {
  id: "seg-roles-permisos",
  title: "Roles y Permisos",
  addLabel: "Nuevo rol",
  icon: null,
  columns: [
    {
      key: "nombre",
      label: "Nombre",
      render: (v) => <span className="font-600 text-text">{v}</span>,
    },
  ],
  fields: [
    {
      key: "nombre",
      label: "Nombre del rol",
      type: "text",
      required: true,
      span: "half",
    },
    {
      key: "idEstado",
      label: "Estado",
      type: "select",
      span: "half",
      options: estadosSeed
        .filter((e) => e.categoria === "general")
        .map((e) => ({ label: e.nombre, value: String(e.idEstado) })),
    },
  ],
  detailTitle: (r) => r.nombre,
  detailSubtitle: () => "Rol del sistema",
  data: [],
}

// Iniciales para el avatar de cada rol, ej. "Coordinador Académico" -> "CA"
const iniciales = (nombre: string) =>
  nombre
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("") || "?"

export default function RolesPermisosScreen() {
  const [roles, setRoles] = useState<Rol[]>([...rolesSeed])
  const [selectedId, setSelectedId] = useState<number>(rolesSeed[0]?.idRol ?? 0)
  const [search, setSearch] = useState("")
  const [filtroEstado, setFiltroEstado] = useState<number | "todos">("todos")
  const [slideOver, setSlideOver] = useState<{
    open: boolean
    mode: "create" | "edit"
    row: any | null
  }>({
    open: false,
    mode: "create",
    row: null,
  })

  // Solo para este módulo: los roles no manejan estado "Pendiente",
  // así que se excluye del filtro sin tocar el seed compartido.
  const estadosGenerales = useMemo(
    () =>
      estadosSeed.filter(
        (e) =>
          e.categoria === "general" &&
          !e.nombre.trim().toLowerCase().includes("pendiente"),
      ),
    [],
  )

  const selected = roles.find((r) => r.idRol === selectedId) ?? null

  const personasDeRol = (idRol: number) =>
    usuariosSeed.filter((u) => u.roles.includes(idRol)).length

  const filteredRoles = useMemo(() => {
    const q = search.trim().toLowerCase()
    return roles.filter((r) => {
      const matchTexto = q === "" || r.nombre.toLowerCase().includes(q)
      const matchEstado =
        filtroEstado === "todos" || r.idEstado === filtroEstado
      return matchTexto && matchEstado
    })
  }, [roles, search, filtroEstado])

  const handleAdd = () =>
    setSlideOver({ open: true, mode: "create", row: null })
  const handleEdit = (row: Rol) =>
    setSlideOver({ open: true, mode: "edit", row })

  const handleDelete = (row: Rol) => {
    setRoles((rs) => {
      const next = rs.filter((r) => r.idRol !== row.idRol)
      if (selectedId === row.idRol) setSelectedId(next[0]?.idRol ?? 0)
      return next
    })
  }

  const handleSave = (form: any) => {
    const idEstado = Number(form.idEstado) || 1
    if (slideOver.mode === "create") {
      const newId = Math.max(0, ...roles.map((r) => r.idRol)) + 1
      const nuevo: Rol = {
        idRol: newId,
        nombre: form.nombre,
        idEstado,
        permisos: [],
      }
      setRoles((rs) => [...rs, nuevo])
      setSelectedId(newId)
    } else {
      setRoles((rs) =>
        rs.map((r) =>
          r.idRol === form.idRol ? { ...r, nombre: form.nombre, idEstado } : r,
        ),
      )
    }
    setSlideOver((s) => ({ ...s, open: false }))
  }

  const togglePermiso = (idPermiso: number) => {
    if (!selected) return
    setRoles((rs) =>
      rs.map((r) => {
        if (r.idRol !== selected.idRol) return r
        const tiene = r.permisos.includes(idPermiso)
        return {
          ...r,
          permisos: tiene
            ? r.permisos.filter((p) => p !== idPermiso)
            : [...r.permisos, idPermiso],
        }
      }),
    )
  }

  const allSelected = selected
    ? selected.permisos.length === permisosSeed.length
    : false
  const toggleAll = () => {
    if (!selected) return
    const target = selected.idRol
    setRoles((rs) =>
      rs.map((r) =>
        r.idRol === target
          ? {
              ...r,
              permisos: allSelected ? [] : permisosSeed.map((p) => p.idPermiso),
            }
          : r,
      ),
    )
  }

  return (
    <>
      <div className="mb-1">
        <span className="font-condensed text-xs uppercase tracking-[0.2em] text-purple-400">
          Seguridad
        </span>
      </div>

      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-condensed font-700 text-2xl uppercase tracking-wide text-text">
            Roles y Permisos
          </h1>
          <p className="font-body text-sm text-text-muted mt-1 max-w-lg">
            Cada permiso es un módulo que el rol puede ver y usar. Los cambios
            aplican a todas las personas con ese rol.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="font-condensed font-700 text-sm uppercase tracking-wider text-purple-400 border border-purple-400/40 px-4 py-2 rounded-lg hover:bg-purple-400/10 hover:border-purple-400/60 transition-colors cursor-pointer flex-shrink-0"
        >
          {rolConfig.addLabel}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
        {/* ─── Sidebar de roles ─── */}
        <div className="flex flex-col gap-4">
          {/* Buscador */}
          <div className="relative">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none"
            >
              <circle
                cx="11"
                cy="11"
                r="7"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="m20 20-3.5-3.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar rol..."
              className="w-full bg-surface border border-border rounded-lg pl-9 pr-8 py-2.5 font-body text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-purple-400/50 transition-colors"
            />
            {search !== "" && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Limpiar búsqueda"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors cursor-pointer"
              >
                <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5">
                  <path
                    d="M6 6l12 12M18 6 6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Filtro por estado */}
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setFiltroEstado("todos")}
              className={[
                "font-condensed font-600 text-xs uppercase tracking-wider px-3 py-1.5 rounded-full border transition-colors cursor-pointer",
                filtroEstado === "todos"
                  ? "bg-purple-400 border-purple-400 text-page"
                  : "bg-surface border-border text-text-muted hover:border-purple-400/40 hover:text-text",
              ].join(" ")}
            >
              Todos
            </button>
            {estadosGenerales.map((e) => (
              <button
                key={e.idEstado}
                type="button"
                onClick={() => setFiltroEstado(e.idEstado)}
                className={[
                  "font-condensed font-600 text-xs uppercase tracking-wider px-3 py-1.5 rounded-full border transition-colors cursor-pointer",
                  filtroEstado === e.idEstado
                    ? "bg-purple-400 border-purple-400 text-page"
                    : "bg-surface border-border text-text-muted hover:border-purple-400/40 hover:text-text",
                ].join(" ")}
              >
                {e.nombre}
              </button>
            ))}
          </div>

          {/* Lista de roles */}
          <div className="flex flex-col gap-1.5">
            {filteredRoles.length === 0 ? (
              <p className="font-body text-sm text-text-muted px-1 py-6 text-center">
                Ningún rol coincide con la búsqueda.
              </p>
            ) : (
              filteredRoles.map((rol) => {
                const activo = rol.idRol === selectedId
                const n = personasDeRol(rol.idRol)
                return (
                  <button
                    key={rol.idRol}
                    type="button"
                    onClick={() => setSelectedId(rol.idRol)}
                    className={[
                      "group text-left px-3.5 py-3 rounded-lg border transition-colors cursor-pointer flex items-start gap-3",
                      activo
                        ? "bg-purple-400/10 border-purple-400/40"
                        : "bg-surface border-border hover:border-purple-400/30",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-condensed font-700 text-xs",
                        activo
                          ? "bg-purple-400 text-page"
                          : "bg-page text-text-muted border border-border",
                      ].join(" ")}
                    >
                      {iniciales(rol.nombre)}
                    </span>

                    <span className="flex-1 min-w-0">
                      <span className="flex items-center justify-between gap-2">
                        <span
                          className={[
                            "font-condensed font-700 text-sm uppercase tracking-wide truncate",
                            activo ? "text-purple-400" : "text-text",
                          ].join(" ")}
                        >
                          {rol.nombre}
                        </span>
                        <span className="flex items-center gap-2.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                          <span
                            role="button"
                            tabIndex={0}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEdit(rol)
                            }}
                            className="text-text-muted hover:text-purple-400 text-xs font-condensed uppercase tracking-wider cursor-pointer"
                          >
                            Editar
                          </span>
                          <span
                            role="button"
                            tabIndex={0}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(rol)
                            }}
                            className="text-text-muted hover:text-red-400 text-xs font-condensed uppercase tracking-wider cursor-pointer"
                          >
                            Eliminar
                          </span>
                        </span>
                      </span>
                      <span className="font-condensed text-xs text-text-muted mt-0.5 flex items-center gap-1.5">
                        <span>
                          {n} {n === 1 ? "persona" : "personas"}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span>
                          {rol.permisos.length}{" "}
                          {rol.permisos.length === 1 ? "módulo" : "módulos"}
                        </span>
                        <span className="ml-auto">
                          {estadoBadge(getEstadoNombre(rol.idEstado))}
                        </span>
                      </span>
                    </span>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* ─── Permisos del rol seleccionado ─── */}
        <div className="bg-surface border border-border rounded-lg p-6">
          {!selected ? (
            <p className="font-body text-sm text-text-muted">
              Crea un rol para empezar a asignarle permisos.
            </p>
          ) : (
            <>
              <div className="flex items-center justify-between mb-5 pb-5 border-b border-border">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-purple-400 text-page flex items-center justify-center font-condensed font-700 text-sm flex-shrink-0">
                    {iniciales(selected.nombre)}
                  </span>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h2 className="font-condensed font-700 text-lg uppercase tracking-wide text-text">
                        {selected.nombre}
                      </h2>
                      {estadoBadge(getEstadoNombre(selected.idEstado))}
                    </div>
                    <p className="font-condensed text-xs text-text-muted mt-0.5">
                      {selected.permisos.length} de {permisosSeed.length}{" "}
                      módulos activos · {personasDeRol(selected.idRol)}{" "}
                      {personasDeRol(selected.idRol) === 1
                        ? "persona"
                        : "personas"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={toggleAll}
                  className="font-condensed font-700 text-xs uppercase tracking-wider text-purple-400 border border-purple-400/40 px-3 py-1.5 rounded-lg hover:bg-purple-400/10 transition-colors cursor-pointer flex-shrink-0"
                >
                  {allSelected ? "Desmarcar todo" : "Marcar todo"}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {permisosSeed.map((p) => {
                  const checked = selected.permisos.includes(p.idPermiso)
                  return (
                    <label
                      key={p.idPermiso}
                      className={[
                        "flex items-center gap-2.5 px-4 py-3 rounded-lg border cursor-pointer transition-colors",
                        checked
                          ? "bg-purple-400/8 border-purple-400/30"
                          : "bg-page border-border hover:border-purple-400/20",
                      ].join(" ")}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => togglePermiso(p.idPermiso)}
                        className="w-4 h-4 accent-purple-400 flex-shrink-0"
                      />
                      <span className="font-condensed font-600 text-sm text-text tracking-wide">
                        {MODULO_LABELS[p.descripcion] ?? p.descripcion}
                      </span>
                    </label>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>

      <SlideOver
        open={slideOver.open}
        mode={slideOver.mode}
        config={rolConfig}
        initialData={slideOver.row}
        onSave={handleSave}
        onClose={() => setSlideOver((s) => ({ ...s, open: false }))}
      />
    </>
  )
}
