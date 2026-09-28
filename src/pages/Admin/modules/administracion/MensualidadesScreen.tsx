import AdminCrudScreen from "./AdminCrudScreen"
import { ModuleConfig } from "../../types"
import { estadoBadge, estadoMensualidadVisual, estadosSeed, nombreEstudiante } from "./data"
import { useAdministration } from "./AdministrationContext"
const visualBadge = (v: string) => v === "Mora" ? <span className="rounded-full border border-amber-500/30 bg-amber-500/15 px-2.5 py-0.5 font-condensed text-xs uppercase text-amber-400">Mora</span> : estadoBadge(v)
export default function MensualidadesScreen() {
  const { data } = useAdministration()
  const config: ModuleConfig = {
    id: "adm-mensualidades", title: "Mensualidades", addLabel: "Nueva mensualidad", icon: null, data: [],
    columns: [
      { key: "idMatricula", label: "Estudiante", render: (v) => nombreEstudiante(data.matriculas.find((m) => m.idMatricula === Number(v))?.idEstudiante) },
      { key: "valor_pagar", label: "Valor", render: (v) => `$${Number(v).toLocaleString("es-CO")}` }, { key: "fecha_limite", label: "Fecha límite" },
      { key: "idEstado", label: "Estado visual", render: (v, r) => visualBadge(estadoMensualidadVisual(r.fecha_limite, Number(v))) },
    ],
    fields: [
      { key: "idMatricula", label: "Matrícula / estudiante", type: "select", required: true, span: "full", options: data.matriculas.map((m) => ({ label: nombreEstudiante(m.idEstudiante), value: String(m.idMatricula) })) },
      { key: "fecha_pago", label: "Fecha pago (se completa desde Pagos)", type: "date", readOnly: true },
      { key: "valor_pagar", label: "Valor a pagar", type: "number", required: true }, { key: "fecha_limite", label: "Fecha límite", type: "date", readOnly: true },
      { key: "idEstado", label: "Estado", type: "select", required: true, options: estadosSeed.filter((e) => e.categoria === "mensualidad").map((e) => ({ label: e.nombre, value: String(e.idEstado) })) },
    ],
    detailTitle: (r) => nombreEstudiante(data.matriculas.find((m) => m.idMatricula === Number(r.idMatricula))?.idEstudiante), detailSubtitle: () => "Mensualidad",
  }
  return <AdminCrudScreen table="mensualidades" idKey="idMensualidad" config={config}
    initialCreate={{ idEstado: 5 }}
    beforeSave={(f) => {
      const matricula = data.matriculas.find((m) => m.idMatricula === Number(f.idMatricula))
      const base = matricula?.fecha_matricula ? new Date(`${matricula.fecha_matricula}T12:00`) : new Date()
      const fecha_limite = `${base.getFullYear()}-${String(base.getMonth() + 1).padStart(2, "0")}-15`
      return { ...f, idMatricula: Number(f.idMatricula), valor_pagar: Number(f.valor_pagar), fecha_limite: f.fecha_limite || fecha_limite, fecha_pago: f.fecha_pago || null, idEstado: Number(f.idEstado) }
    }}
    extraDetail={(r) => <p className="font-body text-sm text-text-muted">Para registrar el pago, abre Pagos y selecciona la mensualidad #{r.idMensualidad}.</p>}
  />
}
