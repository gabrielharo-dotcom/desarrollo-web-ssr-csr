# Laboratorio 09 — Pokémon y clima

Proyecto independiente de Next.js con TypeScript, Tailwind CSS y Axios.

## Ejecutar

Desde `semana09/laboratorio`:

```powershell
npm install
npm run dev
```

## Rutas

- `/`: accesos a los ejercicios.
- `/pokemon-csr`: Pokémon obtenido en el navegador con `useState` y `useEffect`.
- `/pokemon-ssr`: Pokémon obtenido en el servidor antes de generar el HTML.
- `/weather`: clima de Lima con SSR y selector de ciudades con CSR.

Las capturas de Pokémon están en `capturas/`. Los ejercicios necesitan conexión a Internet para consultar PokeAPI y Open-Meteo. Este proyecto no requiere una clave de OMDb ni archivos `.env`.

## Verificar sin iniciar un servidor

```powershell
npm run build
```

## Publicar por separado

Si se importa el repositorio en Vercel para publicar este laboratorio, seleccionar **Root Directory: laboratorio**. La galería Plano se mantiene en el proyecto independiente `../tarea`.
