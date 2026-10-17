# Laboratorio 09 — PokeApp

Implementado hasta la primera solicitud de capturas: ejercicio 1.1 (CSR y SSR).

## Ejecutar

Desde esta carpeta:

```powershell
npm install
npm run dev
```

Si Node no está disponible en la terminal actual:

```powershell
$env:Path = "C:\Program Files\nodejs;" + $env:Path
npm.cmd run dev
```

Abrir:

- http://localhost:3000/pokemon-csr
- http://localhost:3000/pokemon-ssr

## Primera captura

Capturar el resultado de ambas páginas cuando se vea el Pokémon, su nombre y sus tipos. El Pokémon es aleatorio, por lo que puede ser distinto en cada página.

## Código

- `app/pokemon-csr/page.tsx`: usa `use client`, `useState`, `useEffect` y Axios para obtener los datos en el navegador.
- `app/pokemon-ssr/page.tsx`: componente de servidor asíncrono con Axios. `force-dynamic` evita generar esta página estáticamente durante el build.
- Se conserva el diseño y el contenido de la guía. La portada solo proporciona acceso a las dos rutas.
- No se incluyen el dashboard del clima ni la tarea de películas.

Ambas páginas necesitan conexión a Internet para consultar PokeAPI y descargar las imágenes.

## Verificación

```powershell
npx tsc --noEmit
npm run build
```
