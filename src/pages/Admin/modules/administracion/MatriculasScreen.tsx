import AdminCrudScreen from "./AdminCrudScreen"
import { ModuleConfig } from "../../types"
import { estadoBadge, estadosSeed, getEstadoNombre, grupoMock, nombreEstudiante } from "./data"
import { useAdministration } from "./AdministrationContext"

const config: ModuleConfig = {
  id: "adm-matriculas", title: "Matrículas", addLabel: "Nueva matrícula", icon: null, data: [],
  columns: [
    { key: "idEstudiante", label: "Estudiante", render: (v) => nombreEstudiante(Number(v)) },
    { key: "idGrupo", label: "Grupo", render: (v) => grupoMock.find((g) => g.idGrupo === Number(v))?.nombre ?? "—" },
    { key: "fecha_matricula", label: "Fecha" }, { key: "valor_matricula", label: "Valor", render: (v) => `$${Number(v).toLocaleString("es-CO")}` },
    { key: "idEstado", label: "Estado", render: (v) => estadoBadge(getEstadoNombre(Number(v))) },
  ],
  fields: [
    { key: "idEstudiante", label: "Estudiante", type: "select", required: true, span: "full", options: [1, 2, 3].map((id) => ({ label: nombreEstudiante(id), value: String(id) })) },
    { key: "idGrupo", label: "Grupo", type: "select", required: true, options: grupoMock.map((g) => ({ label: g.nombre, value: String(g.idGrupo) })) },
    { key: "fecha_matricula", label: "Fecha matrícula", type: "date", required: true },
    { key: "valor_matricula", label: "Valor matrícula", type: "number", required: true },
    { key: "idEstado", label: "Estado", type: "select", required: true, options: estadosSeed.filter((e) => e.categoria === "matricula").map((e) => ({ label: e.nombre, value: String(e.idEstado) })) },
  ],
  detailTitle: (r) => nombreEstudiante(Number(r.idEstudiante)), detailSubtitle: () => "Matrícula",
}
export default function MatriculasScreen() {
  const { data } = useAdministration()
  const approved = (id: number) => data.postulaciones.find((p) => p.idEstudiante === id && p.idEstado === 14)
  return <AdminCrudScreen table="matriculas" idKey="idMatricula" config={config}
    initialCreate={{ fecha_matricula: new Date().toISOString().slice(0, 10), idEstado: 6 }}
    beforeSave={(f) => {
      // GAP: no existe FK formal matricula↔convocatoria_estudiante; el cruce temporal se hace por idEstudiante.
      const post = approved(Number(f.idEstudiante))
      return { ...f, idEstudiante: Number(f.idEstudiante), idGrupo: Number(f.idGrupo), valor_matricula: post ? 0 : Number(f.valor_matricula), idEstado: Number(f.idEstado) }
    }}
    extraForm={(form) => {
      const post = approved(Number(form.idEstudiante))
      const convocatoria = data.convocatorias.find((c) => c.idConvocatoria === post?.idConvocatoria)
      return post ? <div className="rounded-xl border border-purple-400/30 bg-purple-400/10 p-3 font-body text-sm text-text-soft">Este estudiante tiene una postulación aprobada en la convocatoria {convocatoria?.nombre} — beneficio: {post.beneficio}. El valor se guardará en $0.</div> : null
    }}
    extraDetail={(r) => <button type="button" className="font-condensed uppercase tracking-wider text-purple-400">Inscribir a taller: selecciona al estudiante en el módulo de inscripciones</button>}
  />
}
