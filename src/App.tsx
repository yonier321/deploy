import { useState } from "react"
import Navbar from "@/components/Navbar/Navbar"
import Hero from "@/components/Hero/Hero"
import ValueProposition from "@/components/ValueProposition/ValueProposition"
import Instructors from "@/components/Instructors/Instructors"
import DanceWellness from "@/components/DanceWellness/DanceWellness"
import Plans from "@/components/Plans/Plans"
import Locations from "@/components/Locations/Locations"
import RentalForm from "@/components/RentalForm/RentalForm"
import Footer from "@/components/Footer/Footer"
import Login from "@/pages/Login/Login"
import Register from "@/pages/Register/Register"
import AdminPanel from "@/pages/Admin/AdminPanel"
import Button from "@/components/UI/Button"

type Page = "home" | "login" | "register" | "admin"

export default function App() {
  const [isDark, setIsDark] = useState(true)
  const [page, setPage] = useState<Page>("home")

  const rootClass = ["font-body min-h-full bg-page", isDark ? "dark" : ""].join(
    " ",
  )

  if (page === "login") {
    return (
      <div className={rootClass}>
        <Login
          onBack={() => setPage("home")}
          onLogin={() => setPage("admin")}
          onGoToRegister={() => setPage("register")}
        />
      </div>
    )
  }

  if (page === "register") {
    return (
      <div className={rootClass}>
        <Register
          onBack={() => setPage("home")}
          onGoToLogin={() => setPage("login")}
          onRegister={(data) => {
            // Aquí luego se conecta al backend (persona -> usuarios -> usuarios_roles).
            // Por ahora, solo visual: mandamos al usuario a iniciar sesión.
            console.log("Registro (visual, sin backend aún):", data)
            setPage("login")
          }}
        />
      </div>
    )
  }

  if (page === "admin") {
    return (
      <div className={[rootClass, "dark"].join(" ")}>
        <AdminPanel onExit={() => setPage("home")} />
      </div>
    )
  }

  return (
    <div className={rootClass}>
      <Navbar
        isDark={isDark}
        onToggleTheme={() => setIsDark((d) => !d)}
        onLoginClick={() => setPage("login")}
      />
      <main>
        <Hero />
        <ValueProposition />
        <Instructors />
        <DanceWellness />
        <Plans />
        <Locations />
        <RentalForm />
      </main>
      <Footer />

      {/* Floating CTA — always visible on mobile */}
      <div className="fixed bottom-6 right-6 z-40 lg:hidden">
        <Button
          size="md"
          onClick={() => setPage("register")}
          className="shadow-2xl shadow-purple-700/40"
        >
          Regístrate
        </Button>
      </div>
    </div>
  )
}
