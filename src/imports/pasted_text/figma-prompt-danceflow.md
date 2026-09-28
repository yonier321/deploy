# Prompt para Figma — DanceFlow (Gestión Académica, Oferta, Matrícula)

## Contexto del producto
Diseña las pantallas de administración de **DanceFlow**, un sistema de gestión para una academia de danza con dos sedes. El usuario de estas pantallas es siempre el **Administrador**. Organiza la navegación en tres submenús:

- **Gestión Académica**: Instructores, Niveles, Grupos, Sedes
- **Oferta**: Estilos, Talleres
- **Matrícula**: Estudiantes

## Sistema de diseño (aplica a TODAS las pantallas por igual)
- Usa un único set de componentes reutilizables para: botón primario (acción principal, ej. "Guardar", "Crear"), botón secundario (ej. "Cancelar"), botón destructivo (ej. "Eliminar", color de alerta), botón de ícono (editar, ver detalle, cambiar estado), input de texto, select/dropdown, switch/toggle, badge de estado (Activo en verde, Inactivo en gris).
- El mismo componente de botón primario debe verse y comportarse igual en los 6 módulos — mismo color, mismo radio de esquina, mismo tamaño. No crear variantes de color distintas por módulo.
- Los badges de estado (Activo/Inactivo) usan siempre los mismos dos colores en todo el sistema.
- Cada módulo sigue el mismo patrón de pantallas: **Listar → Crear/Agregar → Editar → Ver detalle → Cambiar estado**, más Buscar y Filtrar cuando aplique (ver abajo cuál módulo tiene cada uno, según los diagramas).

## Reglas transversales de validación (aplican en todos los formularios)
1. **Ningún formulario permite guardar con campos obligatorios vacíos.** Mostrar el error inline debajo del campo, no solo un mensaje genérico arriba.
2. **Los filtros de cada listado deben ser por las llaves foráneas (FK) reales de esa tabla**, no filtros genéricos. Ver el detalle de qué filtrar en cada módulo abajo.
3. **Regla de negocio crítica — Grupos**: al asignar un instructor a un grupo, el selector de instructor solo debe mostrar instructores que trabajen en la sede del aula seleccionada para ese grupo. Si el administrador cambia el aula/sede después de elegir instructor, y el instructor ya no aplica, mostrar una advertencia y forzar a reseleccionar.
4. **Estudiante pertenece a una sola sede** — el campo de sede en el formulario de estudiante es un select de selección única, nunca multi-select.

---

## 1. Gestión Académica → Instructores

**Pantalla: Listar instructores** (CU-06-01)
Tabla con columnas: Nombre, Documento, Teléfono, Sedes asignadas (como chips), Estado. Barra superior con: botón "Agregar instructor", campo de búsqueda (por nombre/documento — CU-06 Buscar instructor), y un filtro por **Sede** (FK real de este módulo, vía instructor_Sede).

**Pantalla: Agregar / Editar instructor** (CU-06-02 / CU-06-03)
Formulario con dos secciones claramente separadas visualmente (con encabezado de sección):
- **Datos personales**: Nombre, Documento, Teléfono, Correo electrónico, Fecha de nacimiento.
- **Datos de instructor**: Descripción/especialidad (textarea), y **Sedes asignadas**.

Para "Sedes asignadas": **no uses checkboxes ni un multi-select tradicional.** Muestra una lista con una fila por cada sede activa registrada (ej. "Sede Norte", "Sede Sur"), y al final de cada fila un **switch/toggle** que el administrador activa o desactiva para habilitar/deshabilitar a ese instructor en esa sede. Al menos un switch debe quedar activado para poder guardar (validación: mínimo una sede).

Botones: "Guardar" (primario) / "Cancelar" (secundario).

**Pantalla: Ver detalle instructor** (CU-06-04)
Solo lectura: datos personales, sedes habilitadas (como badges), y una lista de los grupos que dicta actualmente (nombre del grupo, sede, horario).

**Pantalla: Cambiar estado** — modal de confirmación sobre la fila del listado, mismo patrón en todos los módulos.

---

## 2. Gestión Académica → Niveles

**Pantalla: Listar niveles** (CU-06-01)
Tabla: Nombre, Orden, Edad mínima, Edad máxima, Estado. Botón "Agregar nivel". Sin filtro por FK (nivel no tiene llaves foráneas) — solo búsqueda no aplica según el diagrama; no incluir buscador aquí.

**Pantalla: Agregar / Editar nivel** (CU-06-02 / CU-06-03)
Formulario simple: Nombre, Orden (numérico, con ayuda visual tipo "posición en la secuencia: 1 = más básico"), Edad mínima, Edad máxima. Validación inline: edad mínima debe ser menor que edad máxima; el campo Orden debe avisar si ya está en uso por otro nivel.

**Pantalla: Ver detalle nivel** (CU-06-04)
Solo lectura, mostrando además los grupos que actualmente tienen ese nivel.

**Pantalla: Cambiar estado** — mismo patrón modal.

---

## 3. Gestión Académica → Grupos

Este es el módulo con más pantallas (16 casos de uso en el diagrama). Sepáralo en dos flujos: **grupo regular** y **grupo de competencia**.

**Pantalla: Listar grupos** (CU-06-01)
Tabla: Nombre, Nivel, Estilo, Instructor, Sede, Aula, Tipo (Regular/Competencia como badge), Capacidad, Estado. Botones "Crear grupo" y "Crear grupo de competencia" lado a lado. Buscador (CU-06-06) + filtros (CU-06-07) por **Nivel, Estilo, Instructor, Sede y Tipo de grupo** (todas FK reales de esta tabla).

**Pantalla: Crear grupo** (CU-06-02)
Formulario de un solo paso, en orden: Nombre → seleccionar Nivel (CU-06-08, dropdown de niveles activos) → seleccionar Estilo (dropdown) → seleccionar Tipo de grupo (CU-06-11, dropdown Regular/Competencia) → seleccionar Aula (CU-06-12, dropdown que muestra sede y capacidad de cada aula) → Capacidad (numérico). Al seleccionar el aula, mostrar debajo un texto de solo lectura "Sede: [nombre]" (la sede se deriva del aula, no se elige aparte). Validación: capacidad no puede superar la capacidad del aula elegida.

**Pantalla: Editar grupo** (CU-06-03)
Mismo formulario prellenado, permitiendo cambiar Nivel (CU-06-09), Instructor (CU-06-10) y Convocatoria si aplica (CU-06-15). El selector de Instructor debe implementar la regla transversal #3 (solo instructores de la sede del aula).

**Pantalla: Ver detalle grupo** (CU-06-04)
Solo lectura: todos los datos del grupo + horario + lista de estudiantes matriculados actualmente.

**Pantalla: Crear grupo de competencia** (CU-06-13)
Formulario separado: Nombre, Estilo, Instructor, Aula, Capacidad, seleccionar Convocatoria (CU-06-15, dropdown de convocatorias de tipo Competencia abiertas), y un selector de **Seleccionar estudiantes** (CU-06-14) tipo lista con checkboxes, mostrando solo estudiantes aceptados en esa convocatoria.

**Pantallas: Cambiar estado, Buscar grupo, Filtrar grupo** — mismo patrón que el resto, con los filtros ya indicados arriba.

---

## 4. Gestión Académica → Sedes

**Pantalla: Listar sedes** (CU-06-01)
Tabla: Nombre, Dirección, Estado. Botón "Agregar sede". Buscador (CU-06-07). Sin filtro por FK (sede es tabla raíz, no tiene FKs propias).

**Pantalla: Agregar / Editar sede** (CU-06-02 / CU-06-03)
Formulario simple: Nombre, Dirección.

**Pantalla: Ver detalle sede** (CU-06-04)
Solo lectura, mostrando aulas, instructores habilitados y grupos asociados a esa sede.

**Pantalla: Eliminar sede** (CU-06-05)
Modal de confirmación con advertencia si la sede tiene aulas/instructores/grupos asociados (botón deshabilitado + mensaje explicando por qué no se puede eliminar).

**Pantalla: Cambiar estado** — mismo patrón modal.

---

## 5. Oferta → Estilos

**Pantalla: Listar estilos** (CU-06-01)
Tabla: Nombre, Estado. Botón "Agregar estilo". Buscador (CU-06-05). Sin filtro por FK.

**Pantalla: Agregar / Editar estilo** (CU-06-02 / CU-06-03)
Formulario de un solo campo: Nombre.

**Pantalla: Cambiar estado** — mismo patrón modal.

---

## 6. Oferta → Talleres

**Pantalla: Listar talleres**
Tabla: Descripción, Valor, Estado. Botón "Crear taller". Sin filtro por FK.

**Pantalla: Crear / Editar taller**
Formulario: Descripción, Valor (numérico, formato moneda, validación ≥ 0).

**Pantalla: Ver detalle taller**
Solo lectura: descripción, valor, y lista de estudiantes inscritos.

**Pantalla: Eliminar taller**
Modal de confirmación, bloqueado si tiene inscripciones activas.

**Pantalla: Cambiar estado** — mismo patrón modal.

---

## 7. Matrícula → Estudiantes

**Pantalla: Listar estudiantes** (CU-06-01)
Tabla: Nombre, Documento, Sede, Acudiente(s), Estado. Botón "Agregar estudiante". Buscador (CU-06 Buscar Estudiante). Filtro (CU-06 Filtrar estudiante) por **Sede** (única FK propia relevante de esta tabla).

**Pantalla: Agregar / Editar estudiante** (CU-06 Agregar/Editar estudiante)
Formulario en dos secciones:
- **Datos personales**: Nombre, Documento, Fecha de nacimiento.
- **Datos de estudiante**: Sede (select de **una sola opción**, regla transversal #4) y **Acudientes responsables** (CU-06 Seleccionar acudiente): lista repetible con buscador de persona existente por documento + campo de parentesco por cada acudiente agregado; botón "Agregar acudiente".

**Pantalla: Ver detalle** — solo lectura: datos personales, sede, acudientes, matrícula activa y estado de cuenta.

**Pantalla: Cambiar estado** — mismo patrón modal.

---

## Resumen de filtros por FK (para no perderlo de vista al construir)
| Módulo | Filtrar por |
|---|---|
| Instructores | Sede |
| Grupos | Nivel, Estilo, Instructor, Sede, Tipo de grupo |
| Estudiantes | Sede |
| Niveles, Estilos, Sedes, Talleres | Sin FK propia — no requieren filtro adicional |