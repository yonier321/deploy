OBJETIVO
Crear el módulo "Usuarios y Seguridad" del panel administrativo de F&A Dance Company, dentro de la estructura ya existente en src/pages/Admin. Debe verse y comportarse como una extensión natural de lo ya construido — mismo sistema de diseño, mismos componentes base, misma paleta y tipografía. No es un rediseño: es continuar el mismo lenguaje visual.

CONTEXTO TÉCNICO OBLIGATORIO (no cambiar)
- Stack: React 19 + TypeScript + Tailwind CSS v4 (vía @tailwindcss/vite, sin config file de Tailwind).
- Alias de imports: "@/..." apunta a src/.
- Fuentes ya cargadas en index.css, usar SIEMPRE estas clases utilitarias, no declarar font-family inline:
  - font-display → Anton (headers grandes, títulos de sección, uppercase)
  - font-condensed → Barlow Condensed 700 (labels, botones, nav, uppercase, tracking-wider)
  - font-body → Inter (texto de párrafo, valores de tabla, inputs)
- Paleta (ya definida en @theme de index.css, usar los tokens, no hardcodear hex nuevos):
  - purple-900 #49225B / purple-700 #6E3482 / purple-400 #A56ABD / purple-100 #E7DBEF / purple-50 #F5EBFA
  - Fondos oscuros ya usados en el sitio: #0D0A10 (base), #120D16 (secciones alternas), #18121D (cards/hover)
- Soporte de tema claro/oscuro vía clase .dark en el root (@variant dark ya configurado) — el admin debe soportar ambos, igual que el resto del sitio (patrón ya usado: clases duplicadas dark:xxx).
- Reutilizar componentes existentes tal cual están, NO recrearlos desde cero:
  - Button (src/components/UI/Button.tsx): variantes primary/secondary/ghost/outline, tamaños sm/md/lg. Usar "outline" para acciones secundarias en tablas, "primary" para acciones de creación/guardado, "ghost" para acciones destructivas sutiles.
  - Input (src/components/UI/Input.tsx): patrón label + input + error, estilo ya definido (fondo semitransparente, borde purple-100/30, focus:border-purple-400).
  - ThemeToggle si aplica switch de tema dentro del panel.
- Convención de código: comillas dobles si el string tiene apóstrofe, exportar componentes como default export, JSX bien cerrado.

ESTRUCTURA DE ARCHIVOS A CREAR (sigue el patrón visto en pages/Admin ya existente)
src/pages/Admin/
  AdminPanel.tsx          -> ya existe, solo AGREGAR la entrada de navegación "Usuarios y Seguridad" al Sidebar, sin tocar el resto de módulos ya construidos.
  Sidebar.tsx             -> ya existe, agregar grupo de navegación "Usuarios y Seguridad" con sub-items: Personas, Acudientes, Usuarios, Roles, Permisos, Estados.
  CrudTable.tsx           -> ya existe (genérico), REUTILIZAR pasándole columnas/datos por props, no duplicar lógica de tabla.
  DetailWidget.tsx        -> ya existe (genérico), REUTILIZAR para el panel de detalle de cada entidad.
  SlideOver.tsx           -> ya existe (genérico), REUTILIZAR como drawer de creación/edición.
  types.ts                -> AGREGAR (sin borrar lo existente) las interfaces nuevas descritas abajo, con nombres de campo idénticos a la base de datos (camelCase en los PK/FK, snake_case solo donde la BD ya lo usa así — ver detalle por tabla).
  modules/
    Personas/
      PersonasScreen.tsx      -> usa CrudTable + SlideOver + DetailWidget para persona
    Acudientes/
      AcudientesScreen.tsx    -> usa CrudTable + SlideOver + DetailWidget para acudiente
    Usuarios/
      UsuariosScreen.tsx      -> usa CrudTable + SlideOver + DetailWidget para usuarios
                                  DEBE incluir, dentro del SlideOver/DetailWidget de usuario, un selector multi-check de roles (persistiendo en usuarios_roles) — NO crear pantalla propia para usuarios_roles.
    Roles/
      RolesScreen.tsx         -> usa CrudTable + SlideOver + DetailWidget para roles
                                  DEBE incluir, dentro del SlideOver/DetailWidget de rol, un selector multi-check de permisos (persistiendo en roles_permisos) — NO crear pantalla propia para roles_permisos.
    Permisos/
      PermisosScreen.tsx      -> catálogo simple (CrudTable + SlideOver), sin estado propio (permisos no tiene idEstado en la BD).
    Estados/
      EstadosScreen.tsx       -> catálogo simple (CrudTable + SlideOver), con filtro/agrupación visual por columna "categoria".

MÓDULOS Y CAMPOS EXACTOS (nombres idénticos a academia_v2.sql, no traducir ni renombrar)

1) Personas — tabla base persona
   Campos: idPersona (PK, solo lectura), nombre (texto, requerido), documento (texto, único, opcional), telefono (texto, opcional), email (texto, único, opcional), fecha_nacimiento (date, opcional), idEstado (FK a estados, select).
   Nota de negocio: persona es la tabla de identidad base — instructor, estudiante, acudiente y usuarios se extienden de aquí vía idPersona. En el DetailWidget de persona, mostrar (solo lectura, informativo) si esa persona ya tiene registro como acudiente y/o usuario, para dar contexto sin duplicar edición.

2) Acudientes — tabla acudiente
   Campos: idAcudiente (PK, solo lectura), idPersona (FK a persona — en el formulario, selector de persona existente o botón "crear nueva persona" que abre el SlideOver de Personas), idEstado (FK a estados, select).
   En el DetailWidget, mostrar el nombre/teléfono/email heredados de persona (join visual, no editable aquí).

3) Usuarios — tabla usuarios
   Campos: idUsuario (PK, solo lectura), persona_id (FK a persona, selector — respetar el nombre snake_case tal cual está en la BD, no renombrar a idPersona), username (texto, único, requerido), password_hash (en el formulario mostrar como campo "Contraseña" tipo password que al guardar se hashea — NUNCA mostrar el hash almacenado en modo lectura, mostrar "••••••••"), idEstado (FK a estados, select).
   Sección adicional dentro del SlideOver/DetailWidget: "Roles asignados" — lista de checkboxes de todos los roles (tabla roles), reflejando/editando usuarios_roles (idUsuario, idRol). Esto reemplaza la necesidad de una pantalla dedicada a usuarios_roles.

4) Roles — tabla roles
   Campos: idRol (PK, solo lectura), nombre (texto, único, requerido), idEstado (FK a estados, select).
   Sección adicional dentro del SlideOver/DetailWidget: "Permisos asignados" — lista de checkboxes de todos los permisos (tabla permisos), reflejando/editando roles_permisos (idRol, idPermiso). Esto reemplaza la necesidad de una pantalla dedicada a roles_permisos.

5) Permisos — tabla permisos
   Campos: idPermiso (PK, solo lectura), descripcion (texto, requerido). Sin idEstado (la tabla no lo tiene).

6) Estados — tabla estados
   Campos: idEstado (PK, solo lectura), nombre (texto, requerido), categoria (texto, requerido — usar como filtro/agrupador visual en la tabla, ej. agrupar por "general", "usuario", "mensualidad", "matricula", "postulacion", "noticia"), descripcion (texto, opcional).
   Advertencia funcional a mostrar en el formulario (nota, no bloqueante): "Este catálogo es usado por múltiples módulos del sistema. Editar o eliminar un estado en uso puede afectar otros registros."

REGLAS DE DISEÑO (mismo patrón visual del sitio público, adaptado a densidad de panel admin)
- Header de cada screen: label pequeño uppercase tracking-[0.2em] en purple-400 font-condensed (ej. "Seguridad"), seguido de título font-display uppercase (ej. "USUARIOS"), igual jerarquía que se usa en ValueProposition/Plans/Locations del sitio público pero a escala más compacta para uso interno.
- Tablas (CrudTable): fondo #18121D en filas con hover, encabezados font-condensed uppercase tracking-wider text-purple-400, texto de celdas font-body text-sm.
- Botón de acción principal (crear registro): Button variant="primary" size="md", esquina superior derecha del header de cada screen.
- Acciones por fila: Button variant="outline" size="sm" para "Ver/Editar", variant="ghost" para "Eliminar" (con confirmación).
- SlideOver (crear/editar): entra desde la derecha, fondo #0D0A10, borde izquierdo purple-700/20, título font-condensed uppercase, campos con el componente Input ya existente.
- Badges de estado (idEstado): pill pequeño, texto font-condensed uppercase text-xs, color de fondo según categoria/nombre del estado (ej. Activo/Activa en purple-400/20 con texto purple-400, Inactivo/Cancelada en un tono neutro apagado) — mantener dentro de la misma familia de morados, no introducir colores fuera de la paleta salvo un rojo/ámbar discreto y consistente para estados negativos (Vencida, Cancelada, Rechazado).
- Responsive: mobile-first, igual que el resto del proyecto — el Sidebar colapsa a menú inferior o hamburguesa en mobile, las tablas se convierten en cards apiladas por fila en pantallas pequeñas (mismo criterio que el resto del sitio ya usa para Locations/Instructors en mobile).

RESTRICCIONES
- No modificar nombres de columnas ni de tablas: deben coincidir 1:1 con academia_v2.sql.
- No crear pantallas CRUD independientes para usuarios_roles ni roles_permisos.
- No introducir nuevas fuentes, colores fuera de la paleta @theme, ni componentes de botón/input paralelos a los ya existentes.
- No tocar los módulos ya construidos bajo pages/Admin/modules que no sean los listados aquí.