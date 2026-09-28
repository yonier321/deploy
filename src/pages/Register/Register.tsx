import { useState } from "react"
import logoFna from "@/imports/logo-fna.png"
import Button from "@/components/UI/Button"

interface RegisterProps {
  onBack: () => void
  onRegister?: (data: RegisterFormData) => void
  onGoToLogin?: () => void
}

export interface RegisterFormData {
  nombre: string
  tipoDocumento: string
  documento: string
  telefono: string
  email: string
  fechaNacimiento: string
  idSede: string
  username: string
  password: string
}

// Coincide con INSERT INTO sede (nombre, direccion, idEstado) del script SQL
const SEDES = [
  { id: "1", nombre: "Bello" },
  { id: "2", nombre: "Copacabana" },
]

// La tabla persona del script SQL aún no tiene columna para esto — ver aviso en el chat
const TIPOS_DOCUMENTO = [
  { id: "CC", nombre: "Cédula de ciudadanía" },
  { id: "TI", nombre: "Tarjeta de identidad" },
  { id: "CE", nombre: "Cédula de extranjería" },
  { id: "RC", nombre: "Registro civil" },
  { id: "PP", nombre: "Pasaporte" },
]

export default function Register({
  onBack,
  onRegister,
  onGoToLogin,
}: RegisterProps) {
  const [nombre, setNombre] = useState("")
  const [tipoDocumento, setTipoDocumento] = useState("CC")
  const [documento, setDocumento] = useState("")
  const [telefono, setTelefono] = useState("")
  const [email, setEmail] = useState("")
  const [fechaNacimiento, setFechaNacimiento] = useState("")
  const [idSede, setIdSede] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Solo visual por ahora: aquí luego se conecta al backend
    // (persona -> usuarios -> usuarios_roles / estudiante o acudiente)
    onRegister?.({
      nombre,
      tipoDocumento,
      documento,
      telefono,
      email,
      fechaNacimiento,
      idSede,
      username,
      password,
    })
  }

  const inputClass =
    "w-full bg-white/5 border border-purple-400/20 text-purple-50 placeholder:text-purple-100/30 px-4 py-3.5 font-body text-sm focus:outline-none focus:border-purple-400 transition-colors duration-200"

  const labelClass =
    "font-condensed text-xs uppercase tracking-wider text-purple-400 mb-1.5 block"

  return (
    <div className="min-h-screen bg-[#0D0A10] dark:bg-[#0D0A10] flex">
      {/* Left — branding panel */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] flex-shrink-0 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1547153760-18fc86324498?w=960&h=1200&fit=crop&auto=format"
          alt="Grupo de baile Hip Hop"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#49225B]/80 via-[#0D0A10]/60 to-[#0D0A10]" />

        <div className="relative z-10 p-10">
          <button
            onClick={onBack}
            className="text-purple-400/60 hover:text-purple-400 font-condensed text-sm uppercase tracking-widest transition-colors cursor-pointer flex items-center gap-2"
          >
            ← Volver al inicio
          </button>
        </div>

        <div className="relative z-10 p-10">
          <h2 className="font-display text-6xl uppercase text-purple-50 leading-none mb-4">
            ÚNETE.
            <br />
            <span className="text-purple-400">APRENDE.</span>
            <br />
            COMPITE.
          </h2>
          <p className="font-body text-purple-100/50 text-sm leading-relaxed">
            Crea tu cuenta F&A y empieza tu proceso de matrícula, horarios y
            pagos.
          </p>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <button
          onClick={onBack}
          className="lg:hidden absolute top-6 left-6 text-purple-400/60 hover:text-purple-400 font-condensed text-sm uppercase tracking-widest transition-colors cursor-pointer"
        >
          ← Volver
        </button>

        <div className="w-full max-w-md">
          <div className="flex justify-center mb-10">
            <img
              src={logoFna}
              alt="F&A Dance Company"
              className="h-14 w-auto object-contain"
            />
          </div>

          <h1 className="font-display text-4xl uppercase text-purple-50 text-center mb-2">
            CREAR CUENTA
          </h1>
          <p className="font-body text-purple-100/50 text-sm text-center mb-10">
            Regístrate para empezar en F&A
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Nombre completo — persona.nombre */}
            <div>
              <label className={labelClass}>Nombre completo</label>
              <input
                type="text"
                className={inputClass}
                placeholder="Ej. Laura Gómez"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            {/* Tipo de documento + Documento — persona.documento */}
            <div className="grid grid-cols-[130px_1fr] gap-4">
              <div>
                <label className={labelClass}>Tipo doc.</label>
                <select
                  className={inputClass + " appearance-none cursor-pointer"}
                  value={tipoDocumento}
                  onChange={(e) => setTipoDocumento(e.target.value)}
                  required
                >
                  {TIPOS_DOCUMENTO.map((t) => (
                    <option key={t.id} value={t.id} className="bg-[#18121d]">
                      {t.id}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Número de documento</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="1001"
                  value={documento}
                  onChange={(e) => setDocumento(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Teléfono — persona.telefono */}
            <div>
              <label className={labelClass}>Teléfono</label>
              <input
                type="tel"
                className={inputClass}
                placeholder="300 111 1111"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                required
              />
            </div>

            {/* Email — persona.email */}
            <div>
              <label className={labelClass}>Correo electrónico</label>
              <input
                type="email"
                className={inputClass}
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Fecha nacimiento + Sede — persona.fecha_nacimiento / sede.idSede */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Fecha de nacimiento</label>
                <input
                  type="date"
                  className={inputClass + " [color-scheme:dark]"}
                  value={fechaNacimiento}
                  onChange={(e) => setFechaNacimiento(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Sede</label>
                <select
                  className={inputClass + " appearance-none cursor-pointer"}
                  value={idSede}
                  onChange={(e) => setIdSede(e.target.value)}
                  required
                >
                  <option value="" disabled className="bg-[#18121d]">
                    Selecciona
                  </option>
                  {SEDES.map((s) => (
                    <option key={s.id} value={s.id} className="bg-[#18121d]">
                      {s.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Username — usuarios.username */}
            <div>
              <label className={labelClass}>Usuario</label>
              <input
                type="text"
                className={inputClass}
                placeholder="lgomez"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            {/* Password — usuarios.password_hash */}
            <div>
              <label className={labelClass}>Contraseña</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  className={inputClass + " pr-12"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400/50 hover:text-purple-400 transition-colors cursor-pointer"
                  aria-label={
                    showPass ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                >
                  {showPass ? (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Confirmar contraseña — solo validación visual del formulario */}
            <div>
              <label className={labelClass}>Confirmar contraseña</label>
              <div className="relative">
                <input
                  type={showConfirmPass ? "text" : "password"}
                  className={inputClass + " pr-12"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400/50 hover:text-purple-400 transition-colors cursor-pointer"
                  aria-label={
                    showConfirmPass
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                >
                  {showConfirmPass ? (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button type="submit" size="lg" fullWidth className="mt-2">
              Crear cuenta
            </Button>

            {/* Ir a login */}
            <p className="text-center font-body text-sm text-purple-100/40 mt-2">
              ¿Ya tienes cuenta?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  onGoToLogin?.()
                }}
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                Inicia sesión
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
