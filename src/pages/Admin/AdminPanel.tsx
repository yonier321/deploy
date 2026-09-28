import { useState, useCallback } from "react"
import Sidebar from "./Sidebar"
import Dashboard from "./Dashboard"
import CrudTable from "./CrudTable"
import SlideOver from "./SlideOver"
import DetailWidget from "./DetailWidget"
import { allModules } from "./modules/config"
import { SlideOverState, DetailState } from "./types"
import PersonasScreen from "./modules/Personas/PersonasScreen"
import AcudientesScreen from "./modules/Acudientes/AcudientesScreen"
import UsuariosScreen from "./modules/Usuarios/UsuariosScreen"
import RolesPermisosScreen from "./modules/RolesPermisos/RolesPermisosScreen"
import EstadosScreen from "./modules/Estados/EstadosScreen"
import DanceFlowScreen from "./modules/DanceFlow/DanceFlowScreen"
import { AdministrationProvider } from "./modules/administracion/AdministrationContext"
import AulasScreen from "./modules/administracion/AulasScreen"
import AgendamientosInstructoresScreen from "./modules/administracion/AgendamientosInstructoresScreen"
import MatriculasScreen from "./modules/administracion/MatriculasScreen"
import TalleresInscripcionScreen from "./modules/administracion/TalleresInscripcionScreen"
import MensualidadesScreen from "./modules/administracion/MensualidadesScreen"
import PagosScreen from "./modules/administracion/PagosScreen"
import MetodosPagoScreen from "./modules/administracion/MetodosPagoScreen"
import ConvocatoriasScreen from "./modules/administracion/ConvocatoriasScreen"
import PostulacionesScreen from "./modules/administracion/PostulacionesScreen"
import ContenidosScreen from "./modules/administracion/ContenidosScreen"

const SEGURIDAD_SCREENS: Record<string, React.ReactElement> = {
  "seg-personas": <PersonasScreen />,
  "seg-acudientes": <AcudientesScreen />,
  "seg-usuarios": <UsuariosScreen />,
  "seg-roles-permisos": <RolesPermisosScreen />,
  "seg-estados": <EstadosScreen />,
}

const ADMINISTRACION_SCREENS: Record<string, React.ReactElement> = {
  "adm-aulas": <AulasScreen />,
  "adm-agendamientos-instructores": <AgendamientosInstructoresScreen />,
  "adm-matriculas": <MatriculasScreen />,
  "adm-inscripciones-taller": <TalleresInscripcionScreen />,
  "adm-mensualidades": <MensualidadesScreen />,
  "adm-pagos": <PagosScreen />,
  "adm-metodos-pago": <MetodosPagoScreen />,
  "adm-convocatorias": <ConvocatoriasScreen />,
  "adm-postulaciones": <PostulacionesScreen />,
  "adm-contenidos": <ContenidosScreen />,
}

const DANCEFLOW_MODULES = new Set([
  "instructores",
  "niveles",
  "grupos",
  "sedes",
  "estilos",
  "talleres",
  "estudiantes",
])

interface AdminPanelProps {
  onExit: () => void
}

export default function AdminPanel({ onExit }: AdminPanelProps) {
  const [activeModule, setActiveModule] = useState("dashboard")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Per-module data (mutable local state seeded from config)
  const [moduleData, setModuleData] = useState<Record<string, any[]>>(() =>
    Object.fromEntries(
      Object.entries(allModules).map(([k, v]) => [k, [...v.data]]),
    ),
  )

  const [slideOver, setSlideOver] = useState<SlideOverState>({
    open: false,
    mode: "create",
    row: null,
  })
  const [detail, setDetail] = useState<DetailState>({ open: false, row: null })

  const activeConfig = allModules[activeModule]
  const currentData = moduleData[activeModule] ?? []

  const handleAdd = useCallback(() => {
    setSlideOver({ open: true, mode: "create", row: null })
  }, [])

  const handleEdit = useCallback((row: any) => {
    setDetail({ open: false, row: null })
    setSlideOver({ open: true, mode: "edit", row })
  }, [])

  const handleView = useCallback((row: any) => {
    setDetail({ open: true, row })
  }, [])

  const handleDelete = useCallback(
    (row: any) => {
      setDetail({ open: false, row: null })
      setModuleData((prev) => ({
        ...prev,
        [activeModule]: (prev[activeModule] ?? []).filter(
          (r) => r.id !== row.id,
        ),
      }))
    },
    [activeModule],
  )

  const handleSave = useCallback(
    (data: any) => {
      setModuleData((prev) => {
        const existing = prev[activeModule] ?? []
        if (slideOver.mode === "create") {
          const newId = Math.max(0, ...existing.map((r: any) => r.id ?? 0)) + 1
          return {
            ...prev,
            [activeModule]: [...existing, { ...data, id: newId }],
          }
        } else {
          return {
            ...prev,
            [activeModule]: existing.map((r: any) =>
              r.id === data.id ? { ...r, ...data } : r,
            ),
          }
        }
      })
      setSlideOver({ open: false, mode: "create", row: null })
    },
    [activeModule, slideOver.mode],
  )

  const handleModuleChange = useCallback((id: string) => {
    setActiveModule(id)
    setDetail({ open: false, row: null })
    setSlideOver({ open: false, mode: "create", row: null })
  }, [])

  return (
    <AdministrationProvider>
    <div className="flex h-full overflow-hidden bg-surface-alt">
      {/* Sidebar */}
      <Sidebar
        activeModule={activeModule}
        onModuleChange={handleModuleChange}
        onExit={onExit}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
      />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {activeModule === "dashboard" ? (
            <Dashboard onNavigate={handleModuleChange} />
          ) : DANCEFLOW_MODULES.has(activeModule) ? (
            <DanceFlowScreen
              key={activeModule}
              moduleId={
                activeModule as "instructores" | "niveles" | "grupos" | "sedes" | "estilos" | "talleres" | "estudiantes"
              }
            />
          ) : ADMINISTRACION_SCREENS[activeModule] ? (
            ADMINISTRACION_SCREENS[activeModule]
          ) : SEGURIDAD_SCREENS[activeModule] ? (
            SEGURIDAD_SCREENS[activeModule]
          ) : activeConfig ? (
            <CrudTable
              config={activeConfig}
              data={currentData}
              onAdd={handleAdd}
              onEdit={handleEdit}
              onView={handleView}
              onDelete={handleDelete}
            />
          ) : (
            <div className="flex items-center justify-center h-64 text-text-muted font-body">
              Módulo no encontrado
            </div>
          )}
        </div>
      </main>

      {/* SlideOver */}
      {activeConfig && (
        <SlideOver
          open={slideOver.open}
          mode={slideOver.mode}
          config={activeConfig}
          initialData={slideOver.row}
          onSave={handleSave}
          onClose={() => setSlideOver((s) => ({ ...s, open: false }))}
        />
      )}

      {/* DetailWidget */}
      {activeConfig && (
        <DetailWidget
          open={detail.open}
          config={activeConfig}
          row={detail.row}
          onEdit={() => handleEdit(detail.row)}
          onDelete={() => handleDelete(detail.row)}
          onClose={() => setDetail({ open: false, row: null })}
        />
      )}
    </div>
    </AdministrationProvider>
  )
}
