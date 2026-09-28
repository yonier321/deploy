import AdminCrudScreen from "./AdminCrudScreen"
import { ModuleConfig } from "../../types"
import { estadoBadge, estadosSeed, getEstadoNombre } from "./data"
import { useAdministration } from "./AdministrationContext"
const expirada = <span className="rounded-full border border-red-500/30 bg-red-500/15 px-2.5 py-0.5 font-condensed text-xs uppercase text-red-400">Expirada</span>
export default function ContenidosScreen() {
  const { data } = useAdministration()
  const config: ModuleConfig = {
    id: "adm-contenidos", title: "Gestión de Contenido", addLabel: "Publicar contenido", icon: null, data: [],
    columns: [
      { key: "titulo", label: "Título" }, { key: "idtipocontenido", label: "Tipo", render: (v) => data.tiposContenido.find((t) => t.idtipocontenido === Number(v))?.nombre ?? "—" },
      { key: "fecha_publicacion", label: "Publicación" }, { key: "idEstado", label: "Vigencia", render: (v, r) => r.fecha_expiracion && new Date(r.fecha_expiracion) < new Date() ? expirada : estadoBadge(getEstadoNombre(Number(v))) },
    ],
    fields: [
      { key: "idtipocontenido", label: "Tipo de contenido", type: "select", required: true, options: data.tiposContenido.map((t) => ({ label: t.nombre, value: String(t.idtipocontenido) })) },
      { key: "idEstado", label: "Estado", type: "select", required: true, options: estadosSeed.filter((e) => e.categoria === "contenido").map((e) => ({ label: e.nombre, value: String(e.idEstado) })) },
      { key: "titulo", label: "Título", type: "text", required: true, span: "full" }, { key: "contenido", label: "Contenido", type: "textarea", required: true, span: "full" },
      { key: "imagen_url", label: "URL de imagen", type: "text", span: "full" }, { key: "fecha_publicacion", label: "Fecha publicación", type: "datetime-local", required: true },
      { key: "fecha_expiracion", label: "Fecha expiración", type: "datetime-local" },
    ],
    detailTitle: (r) => r.titulo, detailSubtitle: () => "Contenido",
  }
  return <AdminCrudScreen table="contenidos" idKey="idContenido" config={config}
    deleteLabel={(row) => row.titulo}
    initialCreate={{ fecha_publicacion: new Date().toISOString().slice(0, 16), idEstado: 13 }}
    validate={(f) => f.fecha_expiracion && f.fecha_expiracion <= f.fecha_publicacion ? { fecha_expiracion: "La expiración debe ser posterior a la publicación" } : {}}
    beforeSave={(f) => ({ ...f, idtipocontenido: Number(f.idtipocontenido), idEstado: Number(f.idEstado), imagen_url: f.imagen_url || null, fecha_expiracion: f.fecha_expiracion || null })}
  />
}
