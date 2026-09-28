import { useState } from "react"
import logoFna from "@/imports/logo-fna.png"
import Button from "@/components/UI/Button"

interface LoginProps {
  onBack: () => void
  onLogin?: () => void
  onGoToRegister?: () => void
}

export default function Login({ onBack, onLogin, onGoToRegister }: LoginProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin?.()
  }

  const inputClass =
    "w-full bg-white/5 border border-purple-400/20 text-purple-50 placeholder:text-purple-100/30 px-4 py-3.5 font-body text-sm focus:outline-none focus:border-purple-400 transition-colors duration-200"

  return (
    <div className="min-h-screen bg-[#0D0A10] dark:bg-[#0D0A10] flex">
      {/* Left — branding panel */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] flex-shrink-0 relative overflow-hidden">
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1761882619891-6529ff92df0a?w=960&h=1200&fit=crop&auto=format"
          alt="Hip hop dancer"
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
            BAILA.
            <br />
            <span className="text-purple-400">CRECE.</span>
            <br />
            REGRESA.
          </h2>
          <p className="font-body text-purple-100/50 text-sm leading-relaxed">
            Tu cuenta F&A te da acceso a horarios, progreso, comunidad y mucho
            más.
          </p>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        {/* Mobile back */}
        <button
          onClick={onBack}
          className="lg:hidden absolute top-6 left-6 text-purple-400/60 hover:text-purple-400 font-condensed text-sm uppercase tracking-widest transition-colors cursor-pointer"
        >
          ← Volver
        </button>

        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-10">
            <img
              src={logoFna}
              alt="F&A Dance Company"
              className="h-14 w-auto object-contain"
            />
          </div>

          <h1 className="font-display text-4xl uppercase text-purple-50 text-center mb-2">
            BIENVENIDO
          </h1>
          <p className="font-body text-purple-100/50 text-sm text-center mb-10">
            Inicia sesión en tu cuenta F&A
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div>
              <label className="font-condensed text-xs uppercase tracking-wider text-purple-400 mb-1.5 block">
                Correo electrónico
              </label>
              <input
                type="email"
                className={inputClass}
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="font-condensed text-xs uppercase tracking-wider text-purple-400 mb-1.5 block">
                Contraseña
              </label>
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

            {/* Remember + forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="accent-purple-400 w-4 h-4"
                />
                <span className="font-body text-sm text-purple-100/50">
                  Recordarme
                </span>
              </label>
              <a
                href="#"
                className="font-body text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Submit */}
            <Button type="submit" size="lg" fullWidth className="mt-2">
              Iniciar sesión
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-2">
              <div className="flex-1 h-px bg-purple-400/15" />
              <span className="font-condensed text-xs uppercase tracking-wider text-purple-400/40">
                o continuar con
              </span>
              <div className="flex-1 h-px bg-purple-400/15" />
            </div>

            {/* Social logins */}
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  label: "Google",
                  icon: (
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                  ),
                },
                {
                  label: "Apple",
                  icon: (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                  ),
                },
                {
                  label: "Facebook",
                  icon: (
                    <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  ),
                },
              ].map((social) => (
                <button
                  key={social.label}
                  type="button"
                  className="flex items-center justify-center gap-2 border border-purple-400/20 py-3 text-purple-100/60 hover:border-purple-400/50 hover:text-purple-100 transition-all duration-200 cursor-pointer"
                >
                  {social.icon}
                  <span className="font-condensed text-xs uppercase tracking-wider">
                    {social.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Sign up */}
            <p className="text-center font-body text-sm text-purple-100/40 mt-2">
              ¿No tienes cuenta?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  onGoToRegister?.()
                }}
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                Regístrate
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
