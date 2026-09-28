import AdminCrudScreen from "./AdminCrudScreen"
import { estadoBadge, estadosSeed, getEstadoNombre, grupoMock, sedeMock } from "./data"
import { ModuleConfig } from "./types"
import { useAdministration } from "./AdministrationContext"

const config: ModuleConfig = {
  id: "aulas",
  title: "Aulas",
  addLabel: "Nueva aula",
  icon: null,
  data: [],
  columns: [
    { key: "idSede", label: "Sede", render: (v) => sedeMock.find((s) => s.idSede === Number(v))?.nombre ?? "—" },
    { key: "capacidad", label: "Capacidad", render: (v) => `${v} personas` },
    { key: "idEstado", label: "Estado", render: (v) => estadoBadge(getEstadoNombre(Number(v))) },
  ],
  fields: [
    { key: "capacidad", label: "Capacidad", type: "number", required: true },
    { key: "idSede", label: "Sede", type: "select", required: true, options: sedeMock.map((s) => ({ label: s.nombre, value: s.idSede })) },
    { key: "idEstado", label: "Estado", type: "select", required: true, options: estadosSeed.filter((e) => e.categoria === "aula").map((e) => ({ label: e.nombre, value: e.idEstado })) },
  ],
  detailTitle: (r) => `Aula ${r.idAula}`,
  detailSubtitle: (r) => sedeMock.find((s) => s.idSede === Number(r.idSede))?.nombre ?? "",
  detailFields: [
    { key: "idAula", label: "ID" },
    { key: "idSede", label: "Sede", render: (v) => sedeMock.find((s) => s.idSede === Number(v))?.nombre ?? "—" },
    { key: "capacidad", label: "Capacidad" },
    { key: "idEstado", label: "Estado", render: (v) => estadoBadge(getEstadoNombre(Number(v))) },
  ],
}

export default function AulasScreen() {
  const { data } = useAdministration()

  return (
    <AdminCrudScreen
      table="aulas"
      idKey="idAula"
      config={config}
      initialCreate={{ idEstado: 1 }}
      validate={(form) => {
        const errores: Record<string, string> = {}
        if (Number(form.capacidad) <= 0) {
          errores.capacidad = "La capacidad debe ser mayor que 0"
        }
        return errores
      }}
      beforeSave={(form) => ({
        ...form,
        idSede: Number(form.idSede),
        idEstado: Number(form.idEstado),
        capacidad: Number(form.capacidad),
      })}
      extraDetail={(row) => {
        const agendamientos = data.agendamientosInstructores.filter(
          (item) => grupoMock.some((g) => g.idGrupo === item.idGrupo && g.idAula === row.idAula)
        )
        if (agendamientos.length === 0) return null
        return (
          <div>
            <h3 className="font-condensed text-xs uppercase tracking-wider text-purple-400 mb-2">Agendamientos activos</h3>
            <p className="text-sm text-text-soft">{agendamientos.length} agendamiento(s) asociado(s)</p>
          </div>
        )
      }}
      deleteLabel={(row) => {
        const sede = sedeMock.find((s) => s.idSede === Number(row.idSede))?.nombre || "Sin sede"
        return `Aula ${row.idAula} — ${sede}`
      }}
    />
  )
}