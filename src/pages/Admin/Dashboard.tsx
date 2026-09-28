import { useState } from "react"

interface DashboardProps {
  onNavigate: (module: string) => void
  adminName?: string
  data?: DashboardData
}
interface DashboardData {
  estudiantesActivos: number
  estudiantesPorSede: { sede: string; total: number }[]
  ingresosMes: { label: string; total: number; numeroPagos: number }
  mensualidades: { pagadas: number; pendientes: number; vencidas: number }
  talleresActivos: number
  convocatoriasAbiertas: number
  actividadReciente: ActividadItem[]
  alertaVencida?: {
    estudiante: string
    grupo: string
    fechaLimite: string
    valor: number
  }
}
interface ActividadItem {
  icon: string
  text: string
  time: string
  amount?: string
  status: "Pagado" | "Pendiente" | "Vencido" | "Activo" | "Inactivo"
}

export const defaultDashboardData: DashboardData = {
  estudiantesActivos: 4,
  estudiantesPorSede: [
    { sede: "Bello", total: 2 },
    { sede: "Copacabana", total: 2 },
  ],
  ingresosMes: { label: "Marzo 2026", total: 510000, numeroPagos: 3 },
  mensualidades: { pagadas: 3, pendientes: 1, vencidas: 1 },
  talleresActivos: 2,
  convocatoriasAbiertas: 1,
  alertaVencida: {
    estudiante: "Julian Rojas",
    grupo: "Juvenil-Adultos Intermedio +14",
    fechaLimite: "2026-02-10",
    valor: 180000,
  },
  actividadReciente: [
    { icon: "💳", text: "Camila Rios — pago de mensualidad (Hip Hop Competencia)", time: "2026-03-07", amount: "$200.000", status: "Pagado" },
    { icon: "💳", text: "Mateo Torres — pago de mensualidad (Básico 10-13)", time: "2026-03-06", amount: "$150.000", status: "Pagado" },
    { icon: "💳", text: "Sofia Torres — pago de mensualidad (Intermedio Ninos 8-11)", time: "2026-03-05", amount: "$160.000", status: "Pagado" },
    { icon: "🎯", text: "Mateo Torres inscrito al Taller de preparación física", time: "2026-02-21", amount: "$40.000", status: "Activo" },
    { icon: "🎯", text: "Sofia Torres inscrita al Taller de maquillaje escénico", time: "2026-02-20", amount: "$50.000", status: "Activo" },
    { icon: "⚠️", text: "Julian Rojas — mensualidad de febrero vencida", time: "2026-02-10", amount: "$180.000", status: "Vencido" },
  ],
}

const statusCls: Record<string, string> = {
  Pagado: "text-emerald-400 bg-emerald-400/10",
  Pendiente: "text-amber-400 bg-amber-400/10",
  Vencido: "text-red-400 bg-red-400/10",
  Activo: "text-purple-400 bg-purple-400/10",
  Inactivo: "text-text-muted bg-surface-alt",
}

const modulos = [
  { key: "estudiantes", label: "Estudiantes", icon: "🎓" },
  { key: "grupos", label: "Grupos", icon: "🕺" },
  { key: "instructores", label: "Instructores", icon: "🧑‍🏫" },
  { key: "mensualidades", label: "Mensualidades", icon: "📅" },
  { key: "pagos", label: "Pagos", icon: "💳" },
  { key: "talleres", label: "Talleres", icon: "🎯" },
  { key: "convocatorias", label: "Convocatorias", icon: "🏆" },
  { key: "adm-contenidos", label: "Contenido", icon: "📰" },
]

const formatCOP = (value: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value)

export default function Dashboard({
  onNavigate,
  adminName = "Laura",
  data = defaultDashboardData,
}: DashboardProps) {
  const {
    estudiantesActivos,
    estudiantesPorSede,
    ingresosMes,
    mensualidades,
    talleresActivos,
    convocatoriasAbiertas,
    actividadReciente,
    alertaVencida,
  } = data

  const [periodo, setPeriodo] = useState<"semana" | "mes" | "año">("semana")
  const totalSedes = estudiantesPorSede.reduce((acc, s) => acc + s.total, 0) || 1

  // Datos con valores diferentes → alturas diferentes
  const datosBarras = periodo === "semana"
    ? [
        { etiqueta: "Lun", valor: 85000 },   // mediana
        { etiqueta: "Mar", valor: 120000 },  // la más alta
        { etiqueta: "Mié", valor: 95000 },   // mediana-alta
        { etiqueta: "Jue", valor: 110000 },  // alta
        { etiqueta: "Vie", valor: 100000 },  // media
      ]
    : periodo === "mes"
    ? [
        { etiqueta: "Ene", valor: 420000 },
        { etiqueta: "Feb", valor: 480000 },
        { etiqueta: "Mar", valor: 510000 },
      ]
    : [
        { etiqueta: "2024", valor: 4800000 },
        { etiqueta: "2025", valor: 5200000 },
        { etiqueta: "2026", valor: 5500000 },
      ]

  const maxValor = Math.max(...datosBarras.map((d) => d.valor))

  const formatoValor = (v: number) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`)

  return (
    <div className="flex flex-col gap-8">
      {/* Encabezado + Selector de Período */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl uppercase text-text leading-none">
            Bienvenida, <span className="text-purple-400">{adminName}</span>
          </h1>
          <p className="font-body text-sm text-text-muted mt-2">
            Panel de administración · F&A Dance Company
          </p>
        </div>
        <div className="flex gap-2 bg-surface border border-border rounded-full p-1">
          {(["semana", "mes", "año"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriodo(p)}
              className={`px-4 py-2 rounded-full text-sm font-condensed uppercase tracking-wider transition-all ${
                periodo === p
                  ? "bg-purple-600 text-white"
                  : "text-text-muted hover:text-text"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Alerta */}
      {alertaVencida && (
        <button
          onClick={() => onNavigate("mensualidades")}
          className="flex items-center gap-4 rounded-[16px] bg-red-400/10 border border-red-400/30 px-6 py-4 text-left hover:bg-red-400/15 transition-colors"
        >
          <span className="text-2xl">⚠️</span>
          <div className="flex-1">
            <p className="font-body text-sm text-text">
              <span className="font-600">{alertaVencida.estudiante}</span> tiene
              una mensualidad vencida de{" "}
              <span className="font-600">{formatCOP(alertaVencida.valor)}</span>{" "}
              ({alertaVencida.grupo}) — venció el {alertaVencida.fechaLimite}
            </p>
          </div>
          <span className="font-condensed text-xs uppercase tracking-wider text-red-400">
            Ver mensualidades →
          </span>
        </button>
      )}

      {/* Tarjetas de resumen */}
      <div className="grid md:grid-cols-4 gap-5">
        <div
          className="relative overflow-hidden rounded-[20px] bg-surface border border-border p-6 cursor-pointer hover:border-purple-700/50 transition-all"
          onClick={() => onNavigate("estudiantes")}
        >
          <div className="font-condensed text-xs uppercase tracking-widest text-text-muted mb-3">
            Estudiantes activos
          </div>
          <div className="font-display text-4xl text-text leading-none mb-4">
            {estudiantesActivos}
          </div>
          <div className="flex gap-2">
            {estudiantesPorSede.map((s) => (
              <div key={s.sede} className="flex-1">
                <div className="font-condensed text-[10px] uppercase text-text-muted mb-1">
                  {s.sede}
                </div>
                <div className="h-1.5 rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full bg-purple-700 rounded-full"
                    style={{ width: `${(s.total / totalSedes) * 100}%` }}
                  />
                </div>
                <div className="font-display text-lg text-purple-400 mt-1">
                  {s.total}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="relative overflow-hidden rounded-[20px] bg-surface border border-border p-6 cursor-pointer hover:border-purple-700/50 transition-all"
          onClick={() => onNavigate("pagos")}
        >
          <div className="font-condensed text-xs uppercase tracking-widest text-text-muted mb-3">
            Ingresos · {ingresosMes.label}
          </div>
          <div className="font-display text-4xl text-text leading-none mb-4">
            {formatCOP(ingresosMes.total)}
          </div>
          <div className="font-condensed text-xs uppercase tracking-wider text-text-muted">
            {ingresosMes.numeroPagos} pagos registrados
          </div>
        </div>

        <div
          className="relative overflow-hidden rounded-[20px] bg-surface border border-border p-6 cursor-pointer hover:border-purple-700/50 transition-all"
          onClick={() => onNavigate("mensualidades")}
        >
          <div className="font-condensed text-xs uppercase tracking-widest text-text-muted mb-3">
            Mensualidades
          </div>
          <div className="flex items-end gap-4">
            <div>
              <div className="font-display text-4xl text-emerald-400 leading-none">
                {mensualidades.pagadas}
              </div>
              <div className="font-condensed text-[10px] uppercase text-text-muted mt-1">
                Pagadas
              </div>
            </div>
            <div>
              <div className="font-display text-4xl text-amber-400 leading-none">
                {mensualidades.pendientes}
              </div>
              <div className="font-condensed text-[10px] uppercase text-text-muted mt-1">
                Pendientes
              </div>
            </div>
            <div>
              <div className="font-display text-4xl text-red-400 leading-none">
                {mensualidades.vencidas}
              </div>
              <div className="font-condensed text-[10px] uppercase text-text-muted mt-1">
                Vencidas
              </div>
            </div>
          </div>
        </div>

        <div
          className="relative overflow-hidden rounded-[20px] bg-surface border border-border p-6 cursor-pointer hover:border-purple-700/50 transition-all"
          onClick={() => onNavigate("talleres")}
        >
          <div className="font-condensed text-xs uppercase tracking-widest text-text-muted mb-3">
            Actividad extra
          </div>
          <div className="flex items-end gap-6">
            <div>
              <div className="font-display text-4xl text-text leading-none">
                {talleresActivos}
              </div>
              <div className="font-condensed text-[10px] uppercase text-text-muted mt-1">
                Talleres activos
              </div>
            </div>
            <div>
              <div className="font-display text-4xl text-purple-400 leading-none">
                {convocatoriasAbiertas}
              </div>
              <div className="font-condensed text-[10px] uppercase text-text-muted mt-1">
                Convocatorias abiertas
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📊 Gráfico de Barras — ALTURAS DIFERENTES según valor */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-[20px] bg-surface border border-border p-6">
          <h3 className="font-condensed text-xs uppercase tracking-wider text-purple-400 mb-6">
            Ingresos · {periodo === "semana" ? "Última semana" : periodo === "mes" ? "Por mes" : "Por año"}
          </h3>
          <div className="flex items-end justify-between gap-4 h-72 px-4">
            {datosBarras.map((dato) => {
              const alturaPorcentaje = (dato.valor / maxValor) * 100
              return (
                <div key={dato.etiqueta} className="flex flex-col items-center flex-1">
                  {/* Valor arriba */}
                  <div className="text-sm text-white font-semibold mb-2">
                    {formatoValor(dato.valor)}
                  </div>
                  {/* Barra con ALTURA DIFERENTE para cada una */}
                  <div
                    className="w-full max-w-16 bg-purple-600 rounded-t-md transition-all duration-500"
                    style={{ 
                      height: `${alturaPorcentaje}%`, 
                      minHeight: "24px" 
                    }}
                  />
                  {/* Etiqueta abajo */}
                  <div className="text-xs text-text-muted mt-3 font-condensed">
                    {dato.etiqueta}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Gráfico Circular / Dona */}
        <div className="rounded-[20px] bg-surface border border-border p-6">
          <h3 className="font-condensed text-xs uppercase tracking-wider text-purple-400 mb-6">
            Estado de mensualidades
          </h3>
          <div className="flex items-center justify-center gap-8">
            <div className="relative w-52 h-52 flex-shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#22c55e" strokeWidth="10"
                  strokeDasharray={`${(mensualidades.pagadas / 5) * 251.2} 251.2`}
                  strokeLinecap="round"
                />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#f59e0b" strokeWidth="10"
                  strokeDasharray={`${(mensualidades.pendientes / 5) * 251.2} 251.2`}
                  strokeDashoffset={`${-(mensualidades.pagadas / 5) * 251.2}`}
                  strokeLinecap="round"
                />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#ef4444" strokeWidth="10"
                  strokeDasharray={`${(mensualidades.vencidas / 5) * 251.2} 251.2`}
                  strokeDashoffset={`${-((mensualidades.pagadas + mensualidades.pendientes) / 5) * 251.2}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-28 h-28 rounded-full bg-surface flex items-center justify-center">
                  <span className="font-display text-3xl text-white font-bold">
                    {mensualidades.pagadas + mensualidades.pendientes + mensualidades.vencidas}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-sm text-text">Pagadas</span>
                <span className="font-display text-white font-bold ml-2">{mensualidades.pagadas}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-sm text-text">Pendientes</span>
                <span className="font-display text-white font-bold ml-2">{mensualidades.pendientes}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-sm text-text">Vencidas</span>
                <span className="font-display text-white font-bold ml-2">{mensualidades.vencidas}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Accesos rápidos */}
      <div>
        <h2 className="font-condensed font-700 text-base uppercase tracking-wider text-text mb-4">
          Accesos rápidos
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {modulos.map((m) => (
            <button
              key={m.key}
              onClick={() => onNavigate(m.key)}
              className="flex items-center gap-3 rounded-[16px] bg-surface border border-border px-5 py-4 text-left hover:border-purple-700/50 hover:bg-purple-400/5 transition-all"
            >
              <span className="text-xl">{m.icon}</span>
              <span className="font-condensed text-sm uppercase tracking-wider text-text">
                {m.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Actividad reciente */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-condensed font-700 text-base uppercase tracking-wider text-text">
            Actividad reciente
          </h2>
          <button
            onClick={() => onNavigate("pagos")}
            className="font-condensed text-xs uppercase tracking-wider text-purple-400 hover:text-purple-300 transition-colors"
          >
            Ver todo →
          </button>
        </div>
        <div className="rounded-[20px] bg-surface border border-border overflow-hidden">
          {actividadReciente.map((item, i) => (
            <div
              key={i}
              className={[
                "flex items-center gap-4 px-6 py-4 transition-colors hover:bg-purple-400/4",
                i < actividadReciente.length - 1 ? "border-b border-border" : "",
              ].join(" ")}
            >
              <div className="w-10 h-10 rounded-full bg-surface-alt flex items-center justify-center text-lg flex-shrink-0">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm text-text truncate">
                  {item.text}
                </p>
                <p className="font-condensed text-xs uppercase tracking-wider text-text-muted mt-0.5">
                  {item.time}
                </p>
              </div>
              {item.amount && (
                <span className="font-condensed font-600 text-sm text-text flex-shrink-0">
                  {item.amount}
                </span>
              )}
              <span
                className={`flex-shrink-0 font-condensed text-xs uppercase tracking-wider px-2.5 py-0.5 rounded-full ${statusCls[item.status] ?? "text-text-muted"}`}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}