# Plano — Galería de películas y series

Tarea integradora del Laboratorio 09. Aplicación Next.js con TypeScript, Tailwind CSS y OMDb, diseñada para escritorio y móvil.

**Sitio publicado:** https://plano-cinema.vercel.app

Proyecto de Vercel: `gabriel-22-projects/plano-cinema`. El despliegue se realizó desde esta carpeta con la CLI de Vercel. Para actualizarlo: `npx vercel --prod`.

## Ejecutar en tu terminal

```powershell
npm install
npm run dev
```

La portada está en http://localhost:3000. Este proyecto contiene únicamente la galería. Los ejercicios de Pokémon y clima están en `../laboratorio`.

## Configuración

Crear `.env.local` con `OMDB_API_KEY=tu_clave_de_omdb`. La clave de la guía ya está configurada localmente. Este archivo está excluido de Git; `.env.example` muestra el nombre de la variable sin revelar la clave.

La clave de la guía se comparte con otros estudiantes y su cuota puede agotarse. Para tu entrega conviene usar una clave propia de https://www.omdbapi.com/apikey.aspx.

## Requisitos de la tarea

- **Portada SSR:** `app/page.tsx` es asíncrono, espera una petición con `connection()` y obtiene una selección de 12 títulos desde OMDb antes de generar el HTML. Se presentan títulos populares seleccionados; no se afirma que sea un ranking de tendencias en tiempo real.
- **Búsqueda CSR:** `components/cinema/CinemaApp.tsx` utiliza `use client`, `useState` y `useEffect`. El navegador consulta `/api/movies` después de 450 ms sin escribir; la galería cambia sin recargar. Las consultas anteriores se cancelan al escribir nuevamente.
- **Detalle:** modal accesible mediante `<dialog>`, con sinopsis original de OMDb, reparto, dirección, género, duración, estreno, calificaciones, premios y otros datos disponibles. Para títulos buscados, el detalle se consulta al abrirlo, desde la misma página.
- **Frontend:** diseño adaptable, filtros de tipo y género para la selección inicial, paginación de la búsqueda, estados de carga y error, póster alternativo, favoritos guardados en este navegador y navegación con teclado. Escape cierra el modal y devuelve el foco.
- **Conexión OMDb:** `lib/omdb.ts` solo se ejecuta en el servidor. `/api/movies` es un intermediario que mantiene la clave fuera del navegador. La búsqueda sigue siendo CSR: el navegador solicita los resultados y actualiza la interfaz.

## Justificación de SSR y CSR

La portada usa SSR porque interesa que el visitante reciba desde el inicio el contenido de las películas en el HTML, útil también para los buscadores. Se cachean las respuestas de OMDb durante una hora para reducir el consumo de la cuota, manteniendo el renderizado de la página por petición.

La búsqueda y los detalles de los resultados usan CSR porque dependen de lo que escribe o elige la persona. Así se actualiza la vista sin recargar toda la página. Se utiliza una ruta propia para no publicar la clave de OMDb.

## Publicar en Vercel

1. Importar el repositorio y seleccionar **Root Directory: tarea**, o ejecutar `npx vercel` desde esta carpeta. Para publicar con la CLI se ejecuta desde `semana09/tarea`; la vinculación existente con Vercel se conserva.
2. Seleccionar el framework **Next.js** y Node.js 24.x.
3. Agregar la variable **OMDB_API_KEY** en Production y Preview con la clave de tu cuenta OMDb.
4. Publicar con `npx vercel --prod` o desde el panel de Vercel.
5. Comprobar portada, búsqueda, detalle y vista móvil en el dominio publicado.

Nunca subir `.env.local` al repositorio ni usar el prefijo `NEXT_PUBLIC_` para esta clave.

## Verificación local sin iniciar un servidor

```powershell
npx tsc --noEmit
npm run build
```

## Imágenes y datos

Pósteres y fichas: OMDb. Fotograma de Interstellar: TMDB. La galería presenta información de películas y series; no reproduce contenido audiovisual. Las sinopsis se muestran en el idioma original entregado por OMDb.
