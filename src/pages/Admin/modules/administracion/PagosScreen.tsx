import AdminCrudScreen from "./AdminCrudScreen"
import { ModuleConfig } from "../../types"
import { acudientesSeed, esMayorDeEdad, nombreAcudiente, nombreEstudiante, personaEstudiante } from "./data"
import { useAdministration } from "./AdministrationContext"

export default function PagosScreen() {
  const { data, setTable } = useAdministration()
  const config: ModuleConfig = {
    id: "adm-pagos", title: "Pagos", addLabel: "Registrar pago", icon: null, data: [],
    columns: [
      { key: "monto", label: "Monto", render: (v) => `$${Number(v).toLocaleString("es-CO")}` }, { key: "fecha_pago", label: "Fecha" },
      { key: "idMetodo", label: "Método", render: (v) => data.metodos.find((m) => m.idmetodo === Number(v))?.nombre ?? "—" },
      { key: "idPago", label: "Pagador", render: (_, r) => r.idEstudiante ? nombreEstudiante(r.idEstudiante) : nombreAcudiente(r.idAcudiente) },
    ],
    fields: [
      { key: "tipoPago", label: "Qué se paga", type: "select", required: true, span: "full", options: [{ label: "Mensualidad", value: "mensualidad" }, { label: "Matrícula", value: "matricula" }] },
      { key: "idMensualidad", label: "Mensualidad", type: "select", options: data.mensualidades.map((m) => ({ label: `#${m.idMensualidad} · ${nombreEstudiante(data.matriculas.find((x) => x.idMatricula === m.idMatricula)?.idEstudiante)}`, value: String(m.idMensualidad) })) },
      { key: "idMatricula", label: "Matrícula", type: "select", options: data.matriculas.map((m) => ({ label: nombreEstudiante(m.idEstudiante), value: String(m.idMatricula) })) },
      { key: "monto", label: "Monto", type: "number", required: true }, { key: "fecha_pago", label: "Fecha pago", type: "date", required: true },
      { key: "idMetodo", label: "Método de pago", type: "select", required: true, options: data.metodos.map((m) => ({ label: m.nombre, value: String(m.idmetodo) })) },
      { key: "quienPaga", label: "¿Quién paga?", type: "select", required: true, options: [{ label: "Acudiente", value: "acudiente" }, { label: "El propio estudiante", value: "estudiante" }] },
      { key: "idAcudiente", label: "Acudiente", type: "select", options: acudientesSeed.map((a) => ({ label: nombreAcudiente(a.idAcudiente), value: String(a.idAcudiente) })) },
    ],
    detailTitle: (r) => `Pago #${r.idPago}`, detailSubtitle: (r) => `$${Number(r.monto).toLocaleString("es-CO")}`,
  }
  const targetStudent = (f: any) => {
    const matricula = f.tipoPago === "mensualidad"
      ? data.matriculas.find((m) => m.idMatricula === data.mensualidades.find((x) => x.idMensualidad === Number(f.idMensualidad))?.idMatricula)
      : data.matriculas.find((m) => m.idMatricula === Number(f.idMatricula))
    return matricula?.idEstudiante
  }
  return <AdminCrudScreen table="pagos" idKey="idPago" config={config}
    initialCreate={{ fecha_pago: new Date().toISOString().slice(0, 10) }}
    validate={(f) => {
      const errors: Record<string, string> = {}
      if (f.tipoPago === "mensualidad" && !f.idMensualidad) errors.idMensualidad = "Selecciona la mensualidad"
      if (f.tipoPago === "matricula" && !f.idMatricula) errors.idMatricula = "Selecciona la matrícula"
      const student = targetStudent(f)
      const person = personaEstudiante(student)
      if (f.quienPaga === "estudiante" && (!person || !esMayorDeEdad(person.fecha_nacimiento))) errors.quienPaga = "Solo mayores de edad pueden pagar directamente — lo gestiona su acudiente"
      if (f.quienPaga === "acudiente" && !f.idAcudiente) errors.idAcudiente = "Selecciona un acudiente"
      if (f.quienPaga !== "acudiente" && f.quienPaga !== "estudiante") errors.quienPaga = "Debe existir exactamente un pagador"
      return errors
    }}
    beforeSave={(f) => {
      const idEstudiante = targetStudent(f)
      return { monto: Number(f.monto), fecha_pago: f.fecha_pago, idMetodo: Number(f.idMetodo), idMensualidad: f.tipoPago === "mensualidad" ? Number(f.idMensualidad) : null, idMatricula: f.tipoPago === "matricula" ? Number(f.idMatricula) : null, idAcudiente: f.quienPaga === "acudiente" ? Number(f.idAcudiente) : null, idEstudiante: f.quienPaga === "estudiante" ? idEstudiante : null }
    }}
    afterSave={(saved) => {
      if (saved.idMensualidad) setTable("mensualidades", (rows) => rows.map((m) => m.idMensualidad === saved.idMensualidad ? { ...m, idEstado: 4, fecha_pago: saved.fecha_pago } : m))
    }}
    extraForm={(form) => {
      const id = targetStudent(form)
      const person = personaEstudiante(id)
      return person && !esMayorDeEdad(person.fecha_nacimiento) ? <p className="font-body text-xs text-amber-400">Solo mayores de edad pueden pagar directamente — lo gestiona su acudiente.</p> : null
    }}
  />
}
