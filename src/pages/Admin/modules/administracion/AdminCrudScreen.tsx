import { ReactNode, useMemo, useState } from "react"
import CrudTable from "../../CrudTable"
import DetailWidget from "../../DetailWidget"
import SlideOver from "../../SlideOver"
import { ModuleConfig } from "../../types"
import { AdministrationData, useAdministration } from "./AdministrationContext"

interface Props {
  table: keyof AdministrationData
  idKey: string
  config: ModuleConfig
  initialCreate?: Record<string, any>
  validate?: (form: Record<string, any>, rows: any[], editing: any | null) => Record<string, string>
  beforeSave?: (form: Record<string, any>, editing: any | null) => Record<string, any> | null
  afterSave?: (saved: Record<string, any>, editing: any | null) => void
  extraForm?: (form: Record<string, any>, setForm: React.Dispatch<React.SetStateAction<Record<string, any>>>) => ReactNode
  extraDetail?: (row: any) => ReactNode
  transformRows?: (rows: any[]) => any[]
  childrenBefore?: ReactNode
  deleteLabel?: (row: any) => string
}

export default function AdminCrudScreen({
  table, idKey, config, initialCreate, validate, beforeSave, afterSave, extraForm,
  extraDetail, transformRows, childrenBefore, deleteLabel,
}: Props) {
  const { data, setTable } = useAdministration()
  const rows = data[table]
  const displayRows = useMemo(() => transformRows?.(rows) ?? rows, [rows, transformRows])
  const [panel, setPanel] = useState<{ open: boolean; mode: "create" | "edit"; row: any | null }>({ open: false, mode: "create", row: null })
  const [detail, setDetail] = useState<any | null>(null)
  const [pendingDelete, setPendingDelete] = useState<any | null>(null)

  const save = (form: Record<string, any>) => {
    const normalized = beforeSave?.(form, panel.row) ?? form
    if (!normalized) return
    let saved = normalized
    setTable(table, (current) => {
      if (panel.mode === "create") {
        const id = Math.max(0, ...current.map((r) => Number(r[idKey]) || 0)) + 1
        saved = { ...normalized, [idKey]: id }
        return [...current, saved]
      }
      saved = { ...panel.row, ...normalized }
      return current.map((r) => r[idKey] === panel.row[idKey] ? saved : r)
    })
    afterSave?.(saved, panel.row)
    setPanel((p) => ({ ...p, open: false }))
  }

  const remove = (row: any) => {
    // ✅ Siempre mostramos el diálogo bonito, NUNCA el alert del navegador
    setDetail(null)
    setPendingDelete(row)
  }

  const confirmDelete = () => {
    if (!pendingDelete) return
    setTable(table, (current) => current.filter((r) => r[idKey] !== pendingDelete[idKey]))
    setPendingDelete(null)
  }

  return (
    <>
      <div className="mb-1">
        <span className="font-condensed text-xs uppercase tracking-[0.2em] text-purple-400">Administración y Operación</span>
      </div>
      {childrenBefore}
      <CrudTable
        config={config}
        data={displayRows}
        onAdd={() => setPanel({ open: true, mode: "create", row: initialCreate ?? null })}
        onEdit={(row) => { setDetail(null); setPanel({ open: true, mode: "edit", row }) }}
        onView={setDetail}
        onDelete={remove}
      />
      <SlideOver
        open={panel.open}
        mode={panel.mode}
        config={config}
        initialData={panel.row}
        validate={(form) => validate?.(form, rows, panel.mode === "edit" ? panel.row : null) ?? {}}
        onSave={save}
        onClose={() => setPanel((p) => ({ ...p, open: false }))}
        extraContent={extraForm}
      />
      <DetailWidget
        open={Boolean(detail)}
        config={config}
        row={detail}
        onEdit={() => { setPanel({ open: true, mode: "edit", row: detail }); setDetail(null) }}
        onDelete={() => remove(detail)}
        onClose={() => setDetail(null)}
        extraContent={detail ? extraDetail?.(detail) : null}
      />

      {/* ✅ Diálogo de confirmación bonito */}
      {pendingDelete && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(event) => event.target === event.currentTarget && setPendingDelete(null)}
        >
          <div className="w-full max-w-lg overflow-hidden rounded-[24px] border border-border bg-surface shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div>
                <p className="font-condensed text-[11px] font-semibold uppercase tracking-[0.2em] text-purple-400">Administración y Operación</p>
                <h2 className="mt-1 font-display text-2xl uppercase text-text">Confirmar eliminación</h2>
              </div>
              <button
                type="button"
                aria-label="Cerrar"
                onClick={() => setPendingDelete(null)}
                className="grid h-8 w-8 place-items-center rounded-lg text-text-muted transition hover:bg-purple-400/10 hover:text-purple-400"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <p className="font-body text-sm leading-6 text-text-soft">
                {deleteLabel
                  ? `¿Seguro que quieres eliminar “${deleteLabel(pendingDelete)}”?`
                  : "¿Seguro que quieres eliminar este registro?"}
                <br />
                Esta acción no se puede deshacer.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setPendingDelete(null)}
                  className="rounded-full border border-border px-5 py-2.5 font-condensed text-sm font-semibold uppercase tracking-wider text-text-soft"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="rounded-full bg-red-600 px-5 py-2.5 font-condensed text-sm font-semibold uppercase tracking-wider text-white"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}