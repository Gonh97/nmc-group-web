# NMC Group — Web

Ficha del proyecto para cualquier sesión de Claude abierta en esta carpeta.

## Qué es
Portafolio personal de **Nicolás Mangieri** (siglas NMC): landing de una página, tema oscuro,
que reúne las 10 empresas de su grupo con el link a la web de cada una, más contacto. Hasta el 2026-09-02 el sitio se presentaba como "Grupo NMC"; se cambió a
portafolio personal junto con el logo nuevo.

## Despliegue
- **Repo:** Gonh97/nmc-group-web
- **Dominio:** https://www.nmc-group.com (GitHub Pages, vía archivo `CNAME`)
- **Sin build / sin GitHub Actions:** cada `push` a `main` republica solo en ~1-2 min.

## Stack y archivos
- HTML/CSS/JS puro (estilos inline en el `<head>` y en los elementos). Sin frameworks.
- `index.html` — landing principal.
- `manual-marca.html` — manual de marca. Ya NO está enlazado desde el sitio.
- `assets/` — `logo-nmc.svg`, `favicon.svg`, `hero.jpg` + 10 capturas `prev-*.png` (temporales).

## Sistema de diseño (tokens)
Rediseño del 2026-09-02: registro editorial oscuro en blanco y negro, sin color de acento.
- **Fondos:** `#0A0A0B` (base) · `#111110` (superficies) · `#0C0C0D` (contacto).
- **Texto:** `#F6F4F1` (principal) · `#A9A49A` (secundario) · `#7E7B73` · `#5A5750` (apagado).
- **Sin acento de color.** El dorado `#C2A878` quedó fuera; el acento es el blanco `#F6F4F1`.
- **Bordes:** `#1C1B19` · `#211F1C` · `#2E2C28`.
- **Tipografías:**
  - `Playfair Display` manda en todo lo que es display: títulos de sección (en minúsculas, no en
    mayúsculas), nombres de empresa, nombre del logo. Es la serif del monograma, así que la página
    entera queda en el mismo registro señorial.
  - `Inter` para cuerpo y textos de apoyo. Neutra a propósito: no compite con la serif.
  - `IBM Plex Mono` para etiquetas, números y links de dominio (11-13px, mayúsculas, tracking).
  - Schibsted Grotesk quedó fuera el 2026-09-02: en ExtraBold y mayúsculas peleaba con el logo.
- **Imágenes:** todas en blanco y negro con `filter:grayscale(1)`, pasan a color al hover.
- **Layout:** contenedor máx. 1240px centrado (`.wrap`).

## Mesa de trabajo en Figma
- **Archivo réplica:** file key `4rRCRcZRwf4IaFEQeAx8Yk` — "NMC Group — Web (réplica)".
- Cuenta Figma: gonh27038088@gmail.com (team "Gonza").
- Las 9 tarjetas de empresa son instancias del componente **"Company Card"**.

## Flujo de trabajo (diseño ↔ código)
Mezcla de dos modos:
- **A (Figma):** el usuario retoca lo visual en el archivo de Figma → pide "pásalo a la web" →
  Claude lee el Figma y actualiza el código.
- **B (chat):** para cambios rápidos, el usuario los pide directo en el chat.

En ambos: Claude edita el código → `push` a `main` → se ve en www.nmc-group.com en ~1-2 min.
**No hay sync automático en tiempo real** Figma↔web; el ciclo es manual pero de minutos.

## Convenciones
- Responder y documentar en **español**.
- Mantener la web fiel al diseño de Figma (y viceversa) salvo que el usuario pida cambios.

## Estructura de `index.html` (post rediseño)
1. Nav pegajoso con el lockup horizontal.
2. Hero a sangre sobre `assets/hero.jpg` (foto B/N generada), monograma + nombre + una línea.
3. `#sectores` — título grande a la izquierda y lista numerada 01-05 con filetes a la derecha;
   cada empresa del sector es un ancla a su ficha. Es el bloque de navegación.
4. `#empresas` — carrusel horizontal de 10 tarjetas 4/3 (`.card` dentro de `.pista`), con
   scroll-snap, flechas, puntos y rotación automática cada 4,2 s. Se detiene al pasar el mouse,
   al tocar o al enfocar, y solo rota mientras la sección está a la vista.
5. Fichas grandes `.ficha` (`#e01`…`#e10`), alternadas de verdad con `nth-child(even)`. La imagen
   va limpia (`.retrato`, 4/3), sin marco de navegador: no debe leerse como captura de web.
6. Contacto: título "Enviar información" y el correo. Sin bloque de manual de marca.

`index.html` se genera con un script de datos (lista `EMPRESAS` + `SECTORES`); si hay que tocar
textos de varias empresas conviene regenerarlo en vez de editar a mano las 10 fichas.

## Pendiente / a revisar
- `manual-marca.html` quedó desenlazado del sitio el 2026-09-02 (el cliente pidió quitar el bloque).
  El archivo sigue en el repo, con el monograma nuevo pero el texto de la marca anterior. Decidir si
  se rehace o se borra.
- `assets/prev-losandes.png` es una captura fallida (77 KB contra ~1 MB del resto): sale casi en
  blanco en la grilla. Hay que recapturar seguroslosandes.com.
- **Imágenes de las empresas.** Las 10 `assets/prev-*.png` son capturas de web y el cliente pidió
  dejar de apoyarse en ellas. Hay que reemplazarlas por imagen propia de cada empresa (foto de su
  banco, logo, o imagen generada). Es lo único que falta para cerrar el rediseño.
- `logo-nmc-vertical.svg` / `.png` en la carpeta de contenido dicen "NICOLÁS MAGUELI" y usan un
  trazado viejo del monograma. Rehacerlos o descartarlos.
- La réplica de Figma (`4rRCRcZRwf4IaFEQeAx8Yk`) quedó desactualizada frente a este rediseño.

## Memoria del proyecto (wiki personal)
El estado, decisiones aprobadas y pendientes de este proyecto viven en la wiki personal:
`C:\Users\GONZA\Streaming de Google Drive\Mi unidad\Memoria Claude\Cerebro\wiki\proyectos\nmc-group.md`
Detalle técnico extendido: `C:\Users\GONZA\Streaming de Google Drive\Mi unidad\Memoria Claude\Cerebro\wiki\fuentes\nmc-group-fuente.md`

Leer esa página al empezar a trabajar acá. Al cerrar la sesión, actualizarla con lo avanzado.
Comando de referencia: "Actualiza el proyecto nmc-group en la wiki con lo de hoy."

## Si el usuario pregunta por otro proyecto o algo no relacionado a este

Este es uno de varios proyectos (de distintos clientes) trackeados centralmente en una wiki
personal. Si en esta sesión el usuario pregunta por un tema, proyecto o cliente que no es este, o
no está seguro de en qué proyecto está buscando algo, buscar primero en:
`C:\Users\GONZA\Streaming de Google Drive\Mi unidad\Memoria Claude\Cerebro\wiki\index.md`
Si no es suficiente, ampliar la búsqueda a `wiki/proyectos/*.md` y `wiki/fuentes/*.md` en esa misma
carpeta, antes de responder que no se encuentra. Proceso completo de búsqueda difusa documentado en
el `CLAUDE.md` raíz de ese vault (sección "Comandos disponibles").

## Dónde guardar el contenido generado
Además de este repo (y del OneDrive de Moca si aplica), copiar los assets puntuales que se generen (imágenes sueltas, íconos, logos) también a —
NUNCA el export completo de una página o documento:
`C:\Users\GONZA\Streaming de Google Drive\Mi unidad\Memoria Claude\Cerebro\contenido\jeme\nmc-group`
Esa carpeta es el repositorio central de respaldo del usuario — no reemplaza el repo/deploy, lo complementa.

**No exportar automáticamente la versión final** (PNG, PDF, etc.) del diseño/documento que se está
editando — el usuario prefiere exportar manualmente cuando lo necesite. Solo copiar acá los assets
puntuales que se generen durante el trabajo (imágenes sueltas, logos, etc.), no "la pieza completa"
sin que se pida.
