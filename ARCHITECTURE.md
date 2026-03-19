Quiero que generes una aplicación web usando Next.js o React + Tailwind CSS, conectada a Supabase, con una arquitectura limpia, componentes reutilizables y una interfaz minimalista. La app debe integrarse con una base de datos YA EXISTENTE en Supabase, por lo que no debes inventar una arquitectura distinta ni rehacer el modelo de datos si no es estrictamente necesario. Debes asumir que el proyecto ya tiene autenticación con Supabase Auth y dos tablas principales en el esquema `public`: `profiles` y `flowers`.

La app representa una experiencia sencilla: un usuario se registra o inicia sesión, entra en su dashboard privado y puede ver su flor única. Si todavía no existe una flor para ese usuario, la app debe permitir crearla una sola vez. Si ya existe, debe mostrarse siempre la misma flor y no debe haber opción de regenerarla.

Quiero que construyas el frontend, la lógica de autenticación, la lectura y escritura de datos en Supabase y el render visual de la flor. La UI debe ser extremadamente limpia, centrada, con mucho espacio en blanco, aspecto premium, responsive y muy fácil de usar.

========================
MODELO DE DATOS EXISTENTE
========================

Debes trabajar sobre este modelo de datos:

1) Tabla `public.profiles`

Esta tabla extiende la información del usuario autenticado de Supabase Auth.

Columnas:
- `id`: uuid, primary key.
  - Este campo corresponde al `auth.users.id`.
  - Debe existir relación 1:1 entre `profiles.id` y `auth.users.id`.
  - Se usa como identificador principal del perfil.
- `username`: text, nullable.
  - Nombre visible opcional del usuario.
  - Puede ser null si el usuario no lo ha configurado.
- `created_at`: timestamptz, con default `now()`.
  - Fecha de creación del perfil.

Comportamiento esperado:
- Cuando un usuario se registra, puede existir o crearse su fila en `profiles`.
- La app debe poder leer el perfil del usuario autenticado para mostrar un saludo.
- Si `username` no existe, usar un saludo genérico o derivado del email.

2) Tabla `public.flowers`

Esta tabla almacena la flor única del usuario.

Columnas:
- `id`: uuid, primary key, normalmente con default `gen_random_uuid()`.
  - Identificador único interno de la flor.
- `user_id`: uuid, not null, unique.
  - Foreign key hacia `auth.users.id`.
  - Es la clave lógica más importante.
  - Debe ser UNIQUE porque cada usuario solo puede tener una flor.
- `seed`: text, not null.
  - Semilla usada para generar la flor de forma determinista.
  - Permite reconstruir la flor si es necesario.
- `petal_count`: integer, not null.
  - Número de pétalos.
- `petal_color`: text, not null.
  - Color principal de los pétalos, por ejemplo en hex.
- `center_color`: text, not null.
  - Color del centro de la flor.
- `stem_height`: integer, not null.
  - Altura del tallo.
- `leaf_count`: integer, not null.
  - Número de hojas.
- `petal_shape`: text, not null.
  - Forma de pétalo, por ejemplo `round`, `pointed`, `oval`.
- `size_scale`: numeric, not null.
  - Escala visual general de la flor.
- `rotation`: integer, not null.
  - Rotación base de la flor.
- `background_tone`: text, nullable.
  - Tono de fondo sugerido para la vista de la flor.
- `svg_data`: text, nullable.
  - Si existe, contiene el SVG serializado completo de la flor.
  - Si este campo tiene valor, puede priorizarse sobre la generación manual en frontend.
- `created_at`: timestamptz, default `now()`.
  - Fecha de creación de la flor.

Relación entre tablas:
- `profiles.id` → `auth.users.id`
- `flowers.user_id` → `auth.users.id`
- Relación lógica:
  - un usuario tiene un perfil
  - un usuario puede tener una sola flor
  - una flor pertenece a un único usuario

Restricciones importantes:
- `flowers.user_id` es único
- la app no debe permitir crear una segunda flor si ya existe una fila para ese usuario
- si ya existe una flor, solo debe leerse y mostrarse

Políticas esperadas:
- La app debe asumir que Supabase usa Row Level Security y que cada usuario solo puede leer e insertar su propio perfil y su propia flor.
- No debes programar nada que dependa de leer flores de otros usuarios.

========================
COMPORTAMIENTO FUNCIONAL
========================

La app debe tener este flujo exacto:

1. Landing page
- Pantalla inicial muy simple.
- Título principal centrado.
- Subtítulo corto explicando que cada usuario puede tener una flor digital única.
- Dos botones principales:
  - “Registrarse”
  - “Iniciar sesión”
- Diseño minimalista, elegante y emocional.

2. Registro
- Formulario con email y password.
- Usar Supabase Auth.
- Tras registro correcto, redirigir a la zona privada o iniciar flujo de sesión según la estrategia elegida.
- Si es necesario crear fila en `profiles`, hacerlo después del alta del usuario autenticado.

3. Login
- Formulario con email y password.
- Usar Supabase Auth sign in.
- Manejar loading, errores de credenciales y estados de sesión de forma clara.

4. Dashboard privado
- Solo accesible con sesión activa.
- Consultar el usuario autenticado con Supabase.
- Consultar `profiles` para obtener datos de perfil.
- Consultar `flowers` filtrando por `user_id = auth.user.id`.
- Si no existe fila en `flowers`:
  - mostrar un bloque centrado
  - mostrar un texto explicando que todavía no tiene flor
  - mostrar un botón principal: “Generar mi flor”
- Si existe fila en `flowers`:
  - ocultar por completo la opción de regeneración
  - mostrar un título tipo “Esta es tu flor única”
  - renderizar la flor usando `svg_data` si existe
  - si `svg_data` es null, construir la flor visualmente desde los atributos (`petal_count`, `petal_color`, `center_color`, `stem_height`, `leaf_count`, `petal_shape`, `size_scale`, `rotation`, `background_tone`)
- Incluir botón de logout discreto pero visible.

5. Generación de flor
- Solo puede ejecutarse si el usuario autenticado no tiene fila previa en `flowers`.
- La lógica debe:
  - comprobar si ya existe una flor
  - si no existe, generar atributos únicos
  - insertar una única fila en `flowers`
  - refrescar la vista
- Debe haber protección doble:
  - protección en frontend: no mostrar botón si ya existe
  - protección a nivel de datos: respetar que `user_id` es unique y capturar error si se intenta duplicar

========================
LÓGICA DE DATOS
========================

Debes implementar una capa de acceso a datos clara, por ejemplo con funciones o servicios como:

- `getCurrentUser()`
- `getProfile(userId)`
- `getFlowerByUserId(userId)`
- `createFlowerForUser(userId)`
- `signUp(email, password)`
- `signIn(email, password)`
- `signOut()`

La consulta de flor debe ser equivalente a:
- leer una fila de `flowers` donde `user_id` sea el usuario autenticado
- devolver `null` si no existe

La creación de la flor debe insertar exactamente estos campos:
- `user_id`
- `seed`
- `petal_count`
- `petal_color`
- `center_color`
- `stem_height`
- `leaf_count`
- `petal_shape`
- `size_scale`
- `rotation`
- opcionalmente `background_tone`
- opcionalmente `svg_data`

El generador de flor debe ser determinista o semialeatorio, pero el resultado final debe persistirse en base de datos. Una vez guardada, la misma flor debe mostrarse siempre.

========================
RENDER DE LA FLOR
========================

Quiero un componente visual tipo `FlowerRenderer` con esta lógica:

- Input: objeto `flower`
- Si `flower.svg_data` existe y contiene SVG válido:
  - renderizar ese SVG de forma segura en una tarjeta bonita
- Si no existe `svg_data`:
  - generar la flor como SVG dinámico en frontend usando:
    - `petal_count`
    - `petal_color`
    - `center_color`
    - `stem_height`
    - `leaf_count`
    - `petal_shape`
    - `size_scale`
    - `rotation`
    - `background_tone`
- El resultado visual debe ser elegante y minimalista, no infantil ni recargado
- La flor debe verse bien en móvil y desktop

========================
INTERFAZ Y DISEÑO
========================

Quiero una interfaz con estas reglas:

- Estética minimalista y premium
- Fondo claro, crema o blanco roto
- Tipografía moderna sans-serif
- Mucho padding y aire entre elementos
- Composición centrada
- Tarjetas con bordes redondeados
- Sombras suaves
- Botones grandes, limpios y elegantes
- Responsive mobile-first
- Nada de sidebars complejas ni dashboards cargados
- Una sola columna principal
- Estados vacíos bien diseñados
- Estados de loading suaves
- Errores simples y legibles

Pantallas requeridas:
- `/` landing
- `/register`
- `/login`
- `/dashboard`

Componentes sugeridos:
- `AuthForm`
- `PageContainer`
- `CenteredCard`
- `FlowerRenderer`
- `GenerateFlowerButton`
- `ProtectedRoute` o lógica equivalente
- `Navbar` o header muy simple

========================
ESTRUCTURA TÉCNICA
========================

Quiero una estructura clara del proyecto, por ejemplo:

- `lib/supabaseClient`
- `lib/auth`
- `lib/flowers`
- `components/auth/...`
- `components/flower/...`
- `components/ui/...`
- `pages/...` o `app/...` según el stack elegido

Debes dejar preparado:
- uso de variables de entorno para Supabase URL y Anon Key
- gestión de sesión
- protección de rutas privadas
- manejo de errores de red o de constraints
- código limpio y comentado en puntos clave

========================
REGLAS IMPORTANTES
========================

- No rehagas la base de datos desde cero.
- No propongas tablas nuevas salvo que sea imprescindible.
- Trabaja sobre `profiles` y `flowers` como modelo principal.
- Respeta que `flowers.user_id` representa una relación de una flor por usuario.
- El flujo principal es:
  - autenticar
  - leer perfil
  - leer flor
  - mostrar flor existente o permitir crearla
  - persistir y volver a leer
- Si los nombres de columnas difieren ligeramente, estructura el código de forma que sea fácil adaptar el mapeo.
- Prioriza claridad, sencillez y buena arquitectura.
- El resultado debe quedar listo para conectarse a Supabase real sin reescribir toda la app.

Quiero que generes el código completo de esta app con esa lógica exacta, incluyendo integración con Supabase, vistas, servicios, renderizado de flor y control de sesión.