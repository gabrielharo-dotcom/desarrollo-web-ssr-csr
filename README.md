# Semana 09 — Desarrollo de Aplicaciones Web Avanzado

Dos proyectos independientes de Next.js dentro de un único repositorio.

| Carpeta | Contenido |
| --- | --- |
| `laboratorio/` | Pokémon CSR y SSR, dashboard híbrido del clima y capturas del laboratorio |
| `tarea/` | Plano, galería de películas y series con OMDb |

## Sitio publicado

**Plano:** https://plano-cinema.vercel.app

## Ejecutar un proyecto

Abrir una terminal en la carpeta deseada:

```powershell
cd laboratorio
npm install
npm run dev
```

Para la galería, usar `cd tarea` en lugar de `cd laboratorio`. Cada proyecto tiene su propio `package.json`, `package-lock.json` y dependencias. La carpeta raíz es la del repositorio, no una aplicación ejecutable.

Si se ejecutan ambos al mismo tiempo, iniciar el segundo con `npm run dev -- --port 3001`.

## Configuración de la tarea

La galería utiliza `OMDB_API_KEY` en `tarea/.env.local` durante el desarrollo y como variable de entorno secreta en Vercel. La configuración local existente se conserva y no se incluye en Git. Hay una plantilla sin credenciales en `tarea/.env.example`.

## GitHub y Vercel

Subir este repositorio desde **semana09** para incluir las carpetas `laboratorio` y `tarea` juntas. Los archivos privados, las dependencias instaladas y los resultados de compilación están excluidos por `.gitignore`.

Para conectar GitHub a Plano en Vercel, seleccionar **Root Directory: tarea**. Si se publica también el laboratorio, crear otro proyecto de Vercel con **Root Directory: laboratorio**.

La vinculación local del proyecto de Plano está en `tarea/.vercel`, excluida de Git. Para actualizar su despliegue desde la terminal:

```powershell
cd tarea
npx vercel --prod
```
