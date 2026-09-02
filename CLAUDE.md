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
- `assets/` — `logo-nmc.svg`, `favicon.svg`, `hero.jpg`, los 10 `logo-e**.png|svg` de cada empresa
  y las 10 imágenes de banda `emp-e**.jpg` (1920 px de ancho, JPEG 78, ~170 KB cada una).
  Las 10 `prev-*.png` quedaron sin uso: eran las capturas de web, 7,9 MB en total.

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
5. Una banda `.banda` por empresa (`#e01`…`#e10`): imagen a lo ancho de toda la pantalla, velo
   direccional (profundo a la izquierda donde va el texto, abierto a la derecha donde se ve la foto)
   y el texto encima. Reemplazó a las fichas alternadas a dos columnas el 2026-09-02.

**La escena de cada empresa** (misma pieza en la tarjeta del carrusel y en la ficha): foto de
ambiente de fondo en B/N y bajada de brillo, velo radial encima, y el logo de la empresa centrado.
Es la receta de `gonza-design`. El script arma cada escena buscando por convención:
- `assets/logo-<id>.svg` o `.png` para el logo.
- `assets/emp-<id>.jpg` para la imagen. Las 10 están completas desde el 2026-09-02. Si faltara alguna,
  el script cae a la captura vieja y la marca `.provisional` (desenfocada). **Para cambiar la imagen de
  una empresa basta con reemplazar su `emp-<id>.jpg` y correr `node _build/index.mjs`.**
- Las imágenes de banda van **a color y nítidas**: en la banda el texto ocupa solo el tercio izquierdo,
  así que el velo hunde ese lado y la foto se ve limpia a la derecha. Decisión del cliente 2026-09-02.
  Manfreca y GTME usan fotos reales sacadas de sus propios repos; las otras ocho son generadas en
  registro documental a color, con el tercio izquierdo despejado pedido en el prompt.
  Chequeo útil: el brillo medio de la mitad derecha no debe bajar de ~80 sobre 255, o la banda se
  ve negra (le pasó a la primera de Caribes, que salió nocturna con 43 y hubo que rehacerla de día).
- **Todos los logos van en blanco.** Llevan la clase `blanquear` (`brightness(0) invert(1)`), que
  los deja como silueta blanca conservando forma y huecos transparentes. Decisión del cliente
  (2026-09-02): en color se perdían y el muro quedaba disparejo. Al hover vuelve el color real de la
  marca, salvo Miami College (e09) y Caribes (e10), que llevan además la clase `fijo` porque su
  archivo fuente ya es una silueta negra sobre transparente y en color no sirve sobre fondo oscuro.
  Para esos dos se cambió la fuente: `MIAMI-ICON-BLUE2.svg` y `safari-pinned-tab.svg` de sus sitios,
  ambos sin fondo sólido. `_build/_contraste.html` compara tratamientos sobre fondo de escena.

`index.html` se genera con un script de datos (lista `EMPRESAS` + `SECTORES`); si hay que tocar
textos de varias empresas conviene regenerarlo en vez de editar a mano las 10 fichas.

## Pendiente / a revisar
- `manual-marca.html` quedó desenlazado del sitio el 2026-09-02 (el cliente pidió quitar el bloque).
  El archivo sigue en el repo, con el monograma nuevo pero el texto de la marca anterior. Decidir si
  se rehace o se borra.
- **Foto del equipo de Caribes.** La banda usa una escena de béisbol generada. Se rastreó
  caribesbbc.com y sus subpáginas: solo publican banners de patrocinadores y logos, no hay roster ni
  galería. No se usaron fotos de prensa de internet por derechos. Si el cliente pasa una foto real
  del equipo, reemplaza a `assets/emp-e10.jpg`.
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
