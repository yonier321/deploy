import AdminCrudScreen from "./AdminCrudScreen"
import { ModuleConfig } from "../../types"
import { estadoBadge, estadosAdministracion, nombreEstudiante } from "./data"
import { useAdministration } from "./AdministrationContext"
export default function ConvocatoriasScreen() {
  const { data } = useAdministration()
  const config: ModuleConfig = {
    id: "adm-convocatorias", title: "Convocatorias", addLabel: "Nueva convocatoria", icon: null, data: [],
    columns: [
      { key: "nombre", label: "Nombre" }, { key: "idTipoconvo", label: "Tipo", render: (v) => data.tiposConvocatoria.find((t) => t.idTipoconvo === Number(v))?.nombre ?? "—" },
      { key: "fecha_inicio", label: "Inicio" }, { key: "fecha_fin", label: "Fin" },
    ],
    fields: [
      { key: "idTipoconvo", label: "Tipo", type: "select", required: true, span: "full", options: data.tiposConvocatoria.map((t) => ({ label: t.nombre, value: String(t.idTipoconvo) })) },
      { key: "nombre", label: "Nombre", type: "text", required: true, span: "full" }, { key: "fecha_inicio", label: "Fecha inicio", type: "date", required: true },
      { key: "fecha_fin", label: "Fecha fin", type: "date" }, { key: "descripcion", label: "Descripción", type: "textarea", required: true, span: "full" },
    ],
    detailTitle: (r) => r.nombre, detailSubtitle: () => "Convocatoria",
  }
  return <AdminCrudScreen table="convocatorias" idKey="idConvocatoria" config={config}
    validate={(f) => f.fecha_fin && f.fecha_fin <= f.fecha_inicio ? { fecha_fin: "La fecha final debe ser posterior a la fecha inicial" } : {}}
    beforeSave={(f) => ({ ...f, idTipoconvo: Number(f.idTipoconvo), fecha_fin: f.fecha_fin || null })}
    extraDetail={(r) => {
      const posts = data.postulaciones.filter((p) => p.idConvocatoria === r.idConvocatoria)
      return <div className="font-body text-sm text-text-soft"><p className="font-condensed uppercase tracking-wider text-text-muted mb-2">Postulaciones</p>{posts.length ? posts.map((p) => <div key={p.idConvocatoriaEst} className="flex justify-between gap-3 py-1"><span>{nombreEstudiante(p.idEstudiante)}</span>{estadoBadge(estadosAdministracion.find((e) => e.idEstado === p.idEstado)?.nombre ?? "—")}</div>) : <p>Sin postulaciones</p>}</div>
    }}
  />
}
