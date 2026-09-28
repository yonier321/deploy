import AdminCrudScreen from "./AdminCrudScreen"
import { ModuleConfig } from "../../types"
const config: ModuleConfig = {
  id: "adm-metodos-pago", title: "Métodos de pago", addLabel: "Nuevo método", icon: null, data: [],
  columns: [{ key: "nombre", label: "Nombre" }],
  fields: [{ key: "nombre", label: "Nombre", type: "text", required: true, span: "full" }],
  detailTitle: (r) => r.nombre, detailSubtitle: () => "Método de pago",
}
export default function MetodosPagoScreen() {
  return <AdminCrudScreen table="metodos" idKey="idmetodo" config={config}
    validate={(f, rows, editing) => rows.some((r) => r.idmetodo !== editing?.idmetodo && r.nombre.toLowerCase() === f.nombre.trim().toLowerCase()) ? { nombre: "Ya existe un método con este nombre" } : {}}
    beforeSave={(f) => ({ nombre: f.nombre.trim() })}
  />
}
