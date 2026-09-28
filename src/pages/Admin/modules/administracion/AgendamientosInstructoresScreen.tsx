import AdminCrudScreen from "./AdminCrudScreen"
import { estiloMock, grupoMock, instructorMock, nivelMock, sedeMock } from "./data"
import { ModuleConfig } from "../../types"
import { useAdministration } from "./AdministrationContext"

const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
const grupoLabel = (id: number) => {
  const g = grupoMock.find((x) => x.idGrupo === Number(id))
  const sede = sedeMock.find((s) => s.idSede === g?.idSede)?.nombre
  const instructor = instructorMock.find((i) => i.idInstructor === g?.idInstructor)?.nombre
  return g ? `${g.nombre} · ${instructor} (${sede} / Aula ${g.idAula})` : "—"
}
const config: ModuleConfig = {
  id: "adm-agendamientos-instructores", title: "Agendamiento de Instructores", addLabel: "Crear agendamiento", icon: null, data: [],
  columns: [
    { key: "idGrupo", label: "Instructor", render: (v) => instructorMock.find((i) => i.idInstructor === grupoMock.find((g) => g.idGrupo === Number(v))?.idInstructor)?.nombre ?? "—" },
    { key: "idGrupo", label: "Grupo", render: (v) => grupoMock.find((g) => g.idGrupo === Number(v))?.nombre ?? "—" },
    { key: "idGrupo", label: "Nivel", render: (v) => nivelMock.find((n) => n.idNivel === grupoMock.find((g) => g.idGrupo === Number(v))?.idNivel)?.nombre ?? "—" },
    { key: "idGrupo", label: "Estilo", render: (v) => estiloMock.find((e) => e.idEstilo === grupoMock.find((g) => g.idGrupo === Number(v))?.idEstilo)?.nombre ?? "—" },
    { key: "idGrupo", label: "Sede / aula", render: (v) => { const g = grupoMock.find((x) => x.idGrupo === Number(v)); return `${sedeMock.find((s) => s.idSede === g?.idSede)?.nombre ?? "—"} · Aula ${g?.idAula ?? "—"}` } },
    { key: "dia_semana", label: "Día" },
    { key: "hora_inicio", label: "Inicio" }, { key: "hora_fin", label: "Fin" },
  ],
  fields: [
    { key: "idGrupo", label: "Grupo", type: "select", required: true, span: "full", options: grupoMock.map((g) => ({ label: grupoLabel(g.idGrupo), value: String(g.idGrupo) })) },
    { key: "dia_semana", label: "Día de la semana", type: "select", required: true, options: dias.map((d) => ({ label: d, value: d })) },
    { key: "hora_inicio", label: "Hora inicio", type: "time", required: true }, { key: "hora_fin", label: "Hora fin", type: "time", required: true },
  ],
  detailTitle: (r) => `${r.dia_semana} · ${r.hora_inicio}–${r.hora_fin}`, detailSubtitle: (r) => grupoLabel(r.idGrupo),
}

export default function AgendamientosInstructoresScreen() {
  const { data } = useAdministration()
  return <AdminCrudScreen table="agendamientosInstructores" idKey="idAgendamiento" config={config}
    deleteLabel={(row) => `${grupoMock.find((g) => g.idGrupo === Number(row.idGrupo))?.nombre ?? "Agendamiento"} · ${row.dia_semana} ${row.hora_inicio}–${row.hora_fin}`}
    beforeSave={(f) => ({ ...f, idGrupo: Number(f.idGrupo) })}
    validate={(f, rows, editing) => {
      const errors: Record<string, string> = {}
      if (f.hora_fin <= f.hora_inicio) errors.hora_fin = "La hora final debe ser posterior a la hora inicial"
      const group = grupoMock.find((g) => g.idGrupo === Number(f.idGrupo))
      const aula = data.aulas.find((a) => a.idAula === group?.idAula)
      const instructor = instructorMock.find((i) => i.idInstructor === group?.idInstructor)
      const nivel = nivelMock.find((n) => n.idNivel === group?.idNivel)
      const estilo = estiloMock.find((e) => e.idEstilo === group?.idEstilo)
      const sede = sedeMock.find((s) => s.idSede === group?.idSede)
      if (!group || group.idEstado !== 1) errors.idGrupo = "El grupo seleccionado no existe o no está activo"
      else if (!aula || aula.idSede !== group.idSede) errors.idGrupo = "El aula del grupo no pertenece a la sede correspondiente"
      else if (aula.idEstado !== 1 || instructor?.idEstado !== 1 || nivel?.idEstado !== 1 || estilo?.idEstado !== 1 || sede?.idEstado !== 1) errors.idGrupo = "Todos los registros relacionados deben estar activos"
      else if (!instructor.sedes.includes(group.idSede)) errors.idGrupo = "El instructor no está habilitado en la sede del grupo"
      const conflicts = rows.filter((item) => item.idAgendamiento !== editing?.idAgendamiento && item.dia_semana === f.dia_semana && f.hora_inicio < item.hora_fin && f.hora_fin > item.hora_inicio)
      if (conflicts.some((item) => Number(item.idGrupo) === Number(f.idGrupo))) errors.hora_inicio = "El grupo ya tiene otro agendamiento en esta franja"
      else if (conflicts.some((item) => grupoMock.find((g) => g.idGrupo === Number(item.idGrupo))?.idAula === group?.idAula)) errors.hora_inicio = "El aula ya está ocupada en esta franja"
      else if (conflicts.some((item) => grupoMock.find((g) => g.idGrupo === Number(item.idGrupo))?.idInstructor === group?.idInstructor)) errors.hora_inicio = "El instructor ya tiene otro agendamiento en esta franja"
      return errors
    }}
    extraForm={(form) => {
      const g = grupoMock.find((x) => x.idGrupo === Number(form.idGrupo))
      return g ? <div className="rounded-xl border border-border bg-surface-alt p-3 font-body text-sm text-text-muted">
        <p>Instructor: {instructorMock.find((i) => i.idInstructor === g.idInstructor)?.nombre}</p>
        <p>Grupo: {g.nombre} · Nivel: {nivelMock.find((n) => n.idNivel === g.idNivel)?.nombre} · Estilo: {estiloMock.find((e) => e.idEstilo === g.idEstilo)?.nombre}</p>
        <p>Aula: Aula {g.idAula} · Sede: {sedeMock.find((s) => s.idSede === g.idSede)?.nombre}</p>
      </div> : null
    }}
  />
}
