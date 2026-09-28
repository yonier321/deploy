import AdminCrudScreen from "./AdminCrudScreen"
import { ModuleConfig } from "../../types"
import { acudientesSeed, esMayorDeEdad, nombreEstudiante, personaEstudiante, tallerMock } from "./data"
import { useAdministration } from "./AdministrationContext"

const config: ModuleConfig = {
  id: "adm-inscripciones-taller", title: "Inscripciones a talleres", addLabel: "Nueva inscripción", icon: null, data: [],
  columns: [
    { key: "idEstudiante", label: "Estudiante", render: (v) => nombreEstudiante(Number(v)) },
    { key: "idTaller", label: "Taller", render: (v) => tallerMock.find((t) => t.idTaller === Number(v))?.descripcion ?? "—" },
    { key: "fecha_inscripcion", label: "Fecha" }, { key: "idPago", label: "Pago", render: (v) => `#${v}` },
  ],
  fields: [
    { key: "idEstudiante", label: "Estudiante", type: "select", required: true, span: "full", options: [1, 2, 3].map((id) => ({ label: nombreEstudiante(id), value: String(id) })) },
    { key: "idTaller", label: "Taller", type: "select", required: true, span: "full", options: tallerMock.map((t) => ({ label: `${t.descripcion} · $${t.valor.toLocaleString("es-CO")}`, value: String(t.idTaller) })) },
    { key: "fecha_inscripcion", label: "Fecha inscripción", type: "date", required: true },
    { key: "idMetodo", label: "Método de pago", type: "select", required: true, options: [] },
    { key: "quienPaga", label: "Quién paga", type: "select", required: true, options: [{ label: "Acudiente", value: "acudiente" }, { label: "El propio estudiante", value: "estudiante" }] },
    { key: "idAcudiente", label: "Acudiente", type: "select", options: acudientesSeed.map((a) => ({ label: `Acudiente #${a.idAcudiente}`, value: String(a.idAcudiente) })) },
  ],
  detailTitle: (r) => nombreEstudiante(Number(r.idEstudiante)), detailSubtitle: () => "Inscripción a taller",
}
export default function TalleresInscripcionScreen() {
  const { data, setTable } = useAdministration()
  const dynamicConfig = { ...config, fields: config.fields.map((f) => f.key === "idMetodo" ? { ...f, options: data.metodos.map((m) => ({ label: m.nombre, value: String(m.idmetodo) })) } : f) }
  return <AdminCrudScreen table="inscripciones" idKey="idInscripcionT" config={dynamicConfig}
    initialCreate={{ fecha_inscripcion: new Date().toISOString().slice(0, 10) }}
    validate={(f, rows, editing) => {
      const errors: Record<string, string> = {}
      if (rows.some((r) => r.idInscripcionT !== editing?.idInscripcionT && r.idEstudiante === Number(f.idEstudiante) && r.idTaller === Number(f.idTaller))) errors.idTaller = "El estudiante ya está inscrito en este taller"
      const person = personaEstudiante(Number(f.idEstudiante))
      if (f.quienPaga === "estudiante" && (!person || !esMayorDeEdad(person.fecha_nacimiento))) errors.quienPaga = "Solo mayores de edad pueden pagar directamente — lo gestiona su acudiente"
      if (f.quienPaga === "acudiente" && !f.idAcudiente) errors.idAcudiente = "Selecciona el acudiente que realiza el pago"
      return errors
    }}
    beforeSave={(f, editing) => {
      if (editing) return { ...editing, idEstudiante: Number(f.idEstudiante), idTaller: Number(f.idTaller), fecha_inscripcion: f.fecha_inscripcion }
      const idPago = Math.max(0, ...data.pagos.map((p) => p.idPago)) + 1
      const taller = tallerMock.find((t) => t.idTaller === Number(f.idTaller))!
      setTable("pagos", (rows) => [...rows, { idPago, monto: taller.valor, fecha_pago: f.fecha_inscripcion, idMetodo: Number(f.idMetodo), idMensualidad: null, idMatricula: null, idAcudiente: f.quienPaga === "acudiente" ? Number(f.idAcudiente) : null, idEstudiante: f.quienPaga === "estudiante" ? Number(f.idEstudiante) : null }])
      return { idEstudiante: Number(f.idEstudiante), idTaller: Number(f.idTaller), fecha_inscripcion: f.fecha_inscripcion, idPago }
    }}
    extraForm={(form) => {
      const taller = tallerMock.find((t) => t.idTaller === Number(form.idTaller))
      return <div><p className="font-condensed uppercase tracking-wider text-text">Registrar pago del taller</p><p className="font-body text-sm text-text-muted mt-1">Monto: {taller ? `$${taller.valor.toLocaleString("es-CO")}` : "Selecciona un taller"}</p></div>
    }}
  />
}
