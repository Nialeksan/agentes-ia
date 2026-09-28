# Agentes inteligentes y sistemas web con IA

Vite + React + React Router, solo frontend. Progreso y tema en localStorage. Aprobación con 70 o más de 100.

## Probar en local
```
npm install
npm run dev      # http://localhost:5173
npm run build && npm run preview
```
## Probar
1. Contesta las 10 preguntas y pulsa Calificar; con 70+ el módulo se marca Completado en el menú.
2. Recarga la página: el progreso permanece. "Reiniciar progreso" lo borra.
3. Prueba el botón Oscuro/Claro y el menú en pantalla angosta.

## Desplegar en Vercel
- Con GitHub: sube el proyecto, en vercel.com elige Add New > Project, importa el repo (detecta Vite; build `npm run build`, salida `dist`) y Deploy.
- Con CLI: `npm i -g vercel && vercel --prod`.
`vercel.json` ya redirige todas las rutas a index.html.

## Agregar o editar contenido
Todo está en `src/data.js` (módulos, teoría y preguntas).
