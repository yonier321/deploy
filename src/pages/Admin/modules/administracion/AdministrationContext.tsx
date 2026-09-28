import { createContext, ReactNode, useContext, useState } from "react"
import {
  agendamientosInstructoresSeed, aulasSeed, contenidosSeed, convocatoriasSeed, inscripcionesTallerSeed, matriculasSeed,
  mensualidadesSeed, metodosPagoSeed, pagosSeed, postulacionesSeed,
  tiposContenidoSeed, tiposConvocatoriaSeed,
} from "./data"

export interface AdministrationData {
  aulas: any[]; agendamientosInstructores: any[]; matriculas: any[]; inscripciones: any[]; mensualidades: any[]
  pagos: any[]; metodos: any[]; convocatorias: any[]; tiposConvocatoria: any[]
  postulaciones: any[]; contenidos: any[]; tiposContenido: any[]
}

interface AdministrationContextValue {
  data: AdministrationData
  setTable: (key: keyof AdministrationData, value: any[] | ((rows: any[]) => any[])) => void
}

const AdministrationContext = createContext<AdministrationContextValue | null>(null)

export function AdministrationProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AdministrationData>({
    aulas: [...aulasSeed], agendamientosInstructores: [...agendamientosInstructoresSeed], matriculas: [...matriculasSeed],
    inscripciones: [...inscripcionesTallerSeed], mensualidades: [...mensualidadesSeed],
    pagos: [...pagosSeed], metodos: [...metodosPagoSeed], convocatorias: [...convocatoriasSeed],
    tiposConvocatoria: [...tiposConvocatoriaSeed], postulaciones: [...postulacionesSeed],
    contenidos: [...contenidosSeed], tiposContenido: [...tiposContenidoSeed],
  })
  const setTable = (key: keyof AdministrationData, value: any[] | ((rows: any[]) => any[])) =>
    setData((prev) => ({ ...prev, [key]: typeof value === "function" ? value(prev[key]) : value }))
  return <AdministrationContext.Provider value={{ data, setTable }}>{children}</AdministrationContext.Provider>
}

export function useAdministration() {
  const value = useContext(AdministrationContext)
  if (!value) throw new Error("useAdministration debe usarse dentro de AdministrationProvider")
  return value
}
