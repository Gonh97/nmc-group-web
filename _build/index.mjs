import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Genera index.html a partir de las listas EMPRESAS y SECTORES de abajo.
// Uso:  node _build/index.mjs
const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// el simbolo del monograma se toma del asset, para no duplicar la fuente de verdad
const logo = fs.readFileSync(`${REPO}/assets/logo-nmc.svg`, 'utf8');
const VB = logo.match(/viewBox="([^"]+)"/)[1];
const PATHS = [...logo.matchAll(/<path[^>]*\/>/g)].map(m => '    ' + m[0]).join('\n');

// img: por ahora la captura del sitio. Se reemplaza por la imagen propia de cada empresa.
const EMPRESAS = [
  { id:'e01', num:'01', nombre:'Saip Service', sector:'Ingeniería y energía', dom:'saipservice.com', href:'https://www.saipservice.com/', img:'assets/prev-saip.png',
    desc:'Firma de ingeniería industrial con más de 28 años de precisión multidisciplinaria en proyectos de energía, petróleo e infraestructura en Venezuela.' },
  { id:'e02', num:'02', nombre:'Pioneer Venezuela', sector:'Ingeniería y energía', dom:'pioneervenezuela.com', href:'https://www.pioneervenezuela.com/', img:'assets/prev-pioneer.png',
    desc:'Servicios petroleros especializados en wireline, saneamiento ambiental y desarrollo de gas. Más de 30 años operando en campo para la industria venezolana.' },
  { id:'e03', num:'03', nombre:'Manfreca', sector:'Ingeniería y energía', dom:'manfreca.com', href:'https://www.manfreca.com/', img:'assets/prev-manfreca.png',
    desc:'Ingeniería y construcción integral. Más de 40 años ejecutando obras de infraestructura con autonomía total, combinando experiencia comprobada y tecnología.' },
  { id:'e04', num:'04', nombre:'GTME Service', sector:'Ingeniería y energía', dom:'gtmeservice.com', href:'https://gtmeservice.com/', img:'assets/prev-gtme.png',
    desc:'Ingeniería eléctrica e infraestructura industrial. Cuatro décadas modernizando plantas, subestaciones y sistemas de control (SCADA, PLCs y redes industriales) sin detener la producción.' },
  { id:'e05', num:'05', nombre:'Seguros Los Andes', sector:'Seguros', dom:'seguroslosandes.com', href:'https://www.seguroslosandes.com/', img:'assets/prev-losandes.png',
    desc:'Compañía aseguradora venezolana con pólizas para personas, patrimonio y vehículos.' },
  { id:'e06', num:'06', nombre:'Ibero Seguros', sector:'Seguros', dom:'iberoseguros.com', href:'https://www.iberoseguros.com/', img:'assets/prev-ibero.png',
    desc:'Aseguradora con portal de clientes en línea y cobertura integral para personas y empresas.' },
  { id:'e07', num:'07', nombre:'Grupo IDET', sector:'Salud', dom:'grupoidet.com', href:'https://grupoidet.com/', img:'assets/prev-idet.png',
    desc:'Atención médica integral con un equipo multidisciplinario y especializado al cuidado de tu salud.' },
  { id:'e08', num:'08', nombre:'Universidad Nueva Esparta', sector:'Educación', dom:'une.edu.ve', href:'https://une.edu.ve/', img:'assets/prev-une.png',
    desc:'Institución universitaria venezolana con pregrado y postgrado y formación integral por competencias.' },
  { id:'e09', num:'09', nombre:'Miami College of Design', sector:'Educación', dom:'miamicollegedesign.github.io', href:'https://miamicollegedesign.github.io/', img:'assets/prev-miamicollege.png',
    desc:'Escuela de diseño con formación creativa y proyectos de sus estudiantes.' },
  { id:'e10', num:'10', nombre:'Caribes de Anzoátegui', sector:'Deporte', dom:'caribesbbc.com', href:'https://www.caribesbbc.com/', img:'assets/prev-caribes.png',
    desc:'Club de béisbol profesional venezolano. Noticias, plantilla y calendario de la temporada.' },
];

const SECTORES = [
  { num:'01', nombre:'Ingeniería y energía',
    texto:'El núcleo del grupo. Cuatro firmas que diseñan, construyen y mantienen la infraestructura de la industria petrolera y eléctrica venezolana, con trayectorias que van de las tres a las cuatro décadas.',
    ids:['e01','e02','e03','e04'] },
  { num:'02', nombre:'Seguros',
    texto:'Dos aseguradoras con cobertura para personas, patrimonio, vehículos y empresas.',
    ids:['e05','e06'] },
  { num:'03', nombre:'Salud',
    texto:'Atención médica integral con equipo multidisciplinario.',
    ids:['e07'] },
  { num:'04', nombre:'Educación',
    texto:'Formación universitaria en Venezuela y una escuela de diseño en Miami.',
    ids:['e08','e09'] },
  { num:'05', nombre:'Deporte',
    texto:'Béisbol profesional venezolano.',
    ids:['e10'] },
];

const byId = Object.fromEntries(EMPRESAS.map(e => [e.id, e]));

// Logo y foto de ambiente de cada empresa.
//   logo  -> assets/logo-<id>.svg o .png
//   foto  -> assets/emp-<id>.jpg si ya existe la definitiva; si no, la captura vieja
//            marcada como provisional (se muestra desenfocada, como textura de fondo).
for (const e of EMPRESAS) {
  const svg = `assets/logo-${e.id}.svg`;
  e.logo = fs.existsSync(`${REPO}/${svg}`) ? svg : `assets/logo-${e.id}.png`;
  // logos con texto oscuro sobre transparente: se pasan a monocromo claro para que se lean
  e.claseLogo = ['e06'].includes(e.id) ? ' aclarar' : '';
  const propia = `assets/emp-${e.id}.jpg`;
  if (fs.existsSync(`${REPO}/${propia}`)) { e.foto = propia; e.provisional = false; }
  else { e.foto = e.img; e.provisional = true; }
}
const faltan = EMPRESAS.filter(e => e.provisional);
if (faltan.length) console.log('Sin foto propia todavia:', faltan.map(e => e.id + ' ' + e.nombre).join(', '));

const escena = (e, clase) => `<span class="${clase}${e.provisional ? ' provisional' : ''}">
            <img class="fondo" src="${e.foto}" alt="" loading="lazy">
            <span class="velo"></span>
            <span class="marca"><img class="logo-emp${e.claseLogo}" src="${e.logo}" alt="${e.nombre}" loading="lazy"></span>
          </span>`;

const tarjetas = EMPRESAS.map(e => `          <a class="card" href="#${e.id}">
            ${escena(e, 'card-img')}
            <span class="card-pie">
              <span class="n">${e.num}</span>
              <span class="t">${e.nombre}</span>
              <span class="s">${e.sector}</span>
            </span>
          </a>`).join('\n');

const sectores = SECTORES.map(s => `      <div class="sector">
        <span class="num">${s.num}</span>
        <div>
          <h3>${s.nombre}</h3>
          <p>${s.texto}</p>
          <div class="lista">
${s.ids.map(id => `            <a href="#${byId[id].id}">${byId[id].nombre}</a>`).join('\n')}
          </div>
        </div>
      </div>`).join('\n');

const fichas = EMPRESAS.map(e => `      <article class="ficha" id="${e.id}">
        <div class="ficha-txt">
          <span class="ficha-num">${e.num} · ${e.sector}</span>
          <h3>${e.nombre}</h3>
          <p>${e.desc}</p>
          <a class="ficha-link" href="${e.href}" target="_blank" rel="noopener"><span class="fl">↗</span>${e.dom}</a>
        </div>
        <a class="retrato" href="${e.href}" target="_blank" rel="noopener" aria-label="Abrir ${e.dom}">
          ${escena(e, 'escena')}
        </a>
      </article>`).join('\n\n');

const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Nicolás Mangieri</title>
<meta name="description" content="Diez empresas en ingeniería, seguros, salud, educación y deporte. Portafolio de Nicolás Mangieri.">
<link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&family=Playfair+Display:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box}
  html{scroll-behavior:smooth}
  body{margin:0;background:#0A0A0B;color:#F6F4F1;font-family:'Inter',system-ui,sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden}
  ::selection{background:#F6F4F1;color:#0A0A0B}
  a{color:inherit}
  img{display:block;max-width:100%}
  .wrap{max-width:1240px;margin:0 auto;padding-left:clamp(20px,4vw,48px);padding-right:clamp(20px,4vw,48px)}
  .mono{font-family:'IBM Plex Mono',monospace;letter-spacing:.14em;text-transform:uppercase}

  /* ---- Marca. Proporciones tomadas de logo-nmc-horizontal.svg ---- */
  .mark{display:block}
  .logo-h{display:inline-flex;align-items:center;font-size:8.5px}
  .logo-h .mark{flex:none;height:4.508em;width:auto;aspect-ratio:1301.29/711.87}
  .logo-h .bar{flex:none;width:max(1px,.025em);height:2.667em;background:currentColor;opacity:.5;margin:0 .667em 0 .738em}
  .logo-h .name{font-family:'Playfair Display',serif;font-weight:400;font-size:1em;line-height:1.25;letter-spacing:.217em;text-indent:.217em;text-transform:uppercase;white-space:nowrap}
  @media (max-width:560px){ .logo-h .bar,.logo-h .name{display:none} }
  .logo-v{--w:min(440px,72vw);display:flex;flex-direction:column;align-items:center;gap:calc(var(--w) * .105)}
  .logo-v .mark{width:var(--w);height:auto;aspect-ratio:1301.29/711.87}
  .logo-v .name{font-family:'Playfair Display',serif;font-weight:400;font-size:calc(var(--w) * .078);letter-spacing:.25em;text-indent:.25em;text-transform:uppercase;white-space:nowrap;line-height:1}

  /* ---- Nav ---- */
  header{position:sticky;top:0;z-index:50;background:rgba(10,10,11,.82);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-bottom:1px solid #1C1B19}
  header .wrap{padding-top:18px;padding-bottom:18px;display:flex;align-items:center;justify-content:space-between}
  header nav{display:flex;align-items:center;gap:clamp(14px,3vw,36px);font-size:12px}
  header nav a{text-decoration:none;color:#A9A49A;transition:color .25s}
  header nav a:hover{color:#F6F4F1}
  header nav a.btn{color:#F6F4F1;border:1px solid #2E2C28;padding:9px 16px;border-radius:100px;transition:border-color .25s,background .25s,color .25s}
  header nav a.btn:hover{border-color:#F6F4F1;background:#F6F4F1;color:#0A0A0B}
  @media (max-width:520px){ header nav a.solo-ancho{display:none} }

  /* ---- Hero ---- */
  #top{position:relative;min-height:clamp(520px,94vh,940px);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:clamp(30px,4.5vw,46px);padding:clamp(80px,12vw,150px) clamp(20px,4vw,48px);text-align:center;
    background-image:radial-gradient(62% 66% at 50% 44%,rgba(10,10,11,.86) 0%,rgba(10,10,11,.58) 58%,rgba(10,10,11,.24) 100%),linear-gradient(180deg,rgba(10,10,11,.9) 0%,rgba(10,10,11,.2) 26%,rgba(10,10,11,.72) 82%,#0A0A0B 100%),url('assets/hero.jpg');
    background-size:cover;background-position:center;background-repeat:no-repeat}
  #top .claim{margin:0;max-width:32ch;font-size:clamp(15px,1.7vw,19px);line-height:1.6;color:#A9A49A}
  #top .cue{text-decoration:none;font-size:12px;color:#7E7B73;display:inline-flex;align-items:center;gap:10px;transition:color .25s}
  #top .cue:hover{color:#F6F4F1}

  /* ---- Titulos de seccion ---- */
  .titulo{margin:0;font-family:'Playfair Display',serif;font-weight:400;font-size:clamp(36px,5.6vw,74px);line-height:1.02;letter-spacing:-.018em}
  .seccion{padding:clamp(64px,9vw,130px) 0;scroll-margin-top:86px}
  .cabecera{display:flex;align-items:baseline;justify-content:space-between;gap:24px;flex-wrap:wrap;margin-bottom:clamp(30px,4vw,52px)}
  .cabecera .conteo{font-size:12px;color:#5A5750}

  /* ---- Sectores ---- */
  .sectores{display:grid;grid-template-columns:1fr;gap:0}
  @media (min-width:960px){ .sectores{grid-template-columns:minmax(260px,.72fr) 1.28fr;column-gap:clamp(40px,6vw,110px)} .sectores > .titulo{grid-row:span 5;align-self:start;position:sticky;top:120px} }
  .sector{display:grid;grid-template-columns:auto 1fr;column-gap:clamp(20px,3vw,40px);padding:clamp(24px,3vw,34px) 0;border-top:1px solid #1C1B19}
  .sector:last-child{border-bottom:1px solid #1C1B19}
  .sector .num{font-family:'IBM Plex Mono',monospace;font-size:12px;letter-spacing:.14em;color:#5A5750;padding-top:9px}
  .sector h3{margin:0;font-family:'Playfair Display',serif;font-weight:500;font-size:clamp(20px,2.2vw,27px);letter-spacing:-.005em}
  .sector p{margin:12px 0 0;font-size:15.5px;line-height:1.65;color:#A9A49A;max-width:56ch}
  .sector .lista{display:flex;flex-wrap:wrap;gap:12px 26px;margin-top:20px}
  .sector .lista a{font-family:'IBM Plex Mono',monospace;font-size:12.5px;letter-spacing:.05em;color:#A9A49A;text-decoration:none;border-bottom:1px solid #2E2C28;padding-bottom:5px;transition:color .25s,border-color .25s}
  .sector .lista a:hover{color:#F6F4F1;border-color:#F6F4F1}

  /* ---- Carrusel de empresas ---- */
  .carrusel{position:relative}
  .pista{display:flex;gap:clamp(14px,1.6vw,22px);overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;-ms-overflow-style:none;padding-bottom:4px}
  .pista::-webkit-scrollbar{display:none}
  .card{flex:0 0 clamp(240px,30%,340px);scroll-snap-align:start;display:block;text-decoration:none;background:#111110;border:1px solid #1C1B19;transition:border-color .3s}
  .card:hover{border-color:#2E2C28}
  /* escena = foto de ambiente + velo + logo de la empresa encima */
  .card-img,.escena{display:block;position:relative;aspect-ratio:4/3;overflow:hidden;background:#0F0F0E}
  .card-img .fondo,.escena .fondo{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;filter:grayscale(1) brightness(.8) contrast(1.04);transform:scale(1.04);transition:filter .6s ease,transform 1s ease}
  .card-img.provisional .fondo,.escena.provisional .fondo{filter:grayscale(1) brightness(.66) contrast(1.06) blur(8px);transform:scale(1.14)}
  .card-img .velo,.escena .velo{position:absolute;inset:0;background:radial-gradient(74% 74% at 50% 48%,rgba(10,10,11,.28) 0%,rgba(10,10,11,.62) 100%)}
  .card-img .marca,.escena .marca{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:16% 17%}
  .card-img .marca img,.escena .marca img{width:auto;max-width:100%;max-height:100%;object-fit:contain;filter:drop-shadow(0 6px 26px rgba(0,0,0,.55));transition:filter .45s ease}
  .card-img .marca img.aclarar,.escena .marca img.aclarar{filter:grayscale(1) invert(1) drop-shadow(0 6px 26px rgba(0,0,0,.55))}
  .card:hover .marca img.aclarar,.retrato:hover .marca img.aclarar{filter:drop-shadow(0 6px 26px rgba(0,0,0,.55))}
  .card:hover .card-img .fondo,.retrato:hover .escena .fondo{filter:grayscale(0) brightness(.95) contrast(1);transform:scale(1.09)}
  .card:hover .card-img.provisional .fondo,.retrato:hover .escena.provisional .fondo{filter:grayscale(0) brightness(.85) contrast(1.02) blur(6px);transform:scale(1.16)}
  .card-pie{display:block;padding:16px 18px 18px;border-top:1px solid #1C1B19}
  .card-pie .n{display:block;font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.14em;color:#5A5750}
  .card-pie .t{display:block;margin-top:8px;font-family:'Playfair Display',serif;font-size:19px;line-height:1.2;color:#F6F4F1}
  .card-pie .s{display:block;margin-top:7px;font-size:12.5px;color:#7E7B73}
  .car-nav{display:flex;align-items:center;gap:10px;margin-top:clamp(20px,2.6vw,30px)}
  .car-btn{width:42px;height:42px;border-radius:100px;border:1px solid #2E2C28;background:transparent;color:#A9A49A;font-size:15px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:border-color .25s,color .25s,background .25s}
  .car-btn:hover{border-color:#F6F4F1;color:#0A0A0B;background:#F6F4F1}
  .car-puntos{display:flex;gap:7px;margin-left:auto}
  .punto{width:6px;height:6px;border-radius:50%;background:#2E2C28;transition:background .3s,transform .3s}
  .punto.on{background:#F6F4F1;transform:scale(1.25)}

  /* ---- Fichas ---- */
  .fichas{display:flex;flex-direction:column;gap:clamp(60px,9vw,130px)}
  .ficha{scroll-margin-top:110px;display:grid;grid-template-columns:1fr;gap:clamp(26px,4vw,46px);align-items:center}
  @media (min-width:900px){
    .ficha{grid-template-columns:1fr 1fr;gap:clamp(40px,5vw,92px)}
    .ficha:nth-child(even) .ficha-txt{order:2}
  }
  .ficha-num{font-family:'IBM Plex Mono',monospace;font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;color:#5A5750;display:block;margin-bottom:20px}
  .ficha h3{margin:0 0 18px;font-family:'Playfair Display',serif;font-weight:400;font-size:clamp(32px,4.8vw,58px);line-height:1.04;letter-spacing:-.012em}
  .ficha p{margin:0 0 30px;font-size:16.5px;line-height:1.64;color:#A9A49A;max-width:44ch}
  .ficha-link{text-decoration:none;display:inline-flex;align-items:center;gap:12px;font-family:'IBM Plex Mono',monospace;font-size:13px;letter-spacing:.06em;color:#F6F4F1;border-bottom:1px solid #2E2C28;padding-bottom:9px;transition:border-color .25s}
  .ficha-link:hover{border-color:#F6F4F1}
  .ficha-link .fl{color:#7E7B73;transition:color .25s,transform .25s}
  .ficha-link:hover .fl{color:#F6F4F1;transform:translate(2px,-2px)}
  .retrato{display:block;position:relative;overflow:hidden;background:#111110;border:1px solid #1C1B19;transition:border-color .3s}
  .retrato:hover{border-color:#2E2C28}

  /* ---- Contacto y pie ---- */
  #contacto{border-top:1px solid #1C1B19;background:#0C0C0D}
  .contacto-grid{display:grid;grid-template-columns:1fr;gap:clamp(26px,4vw,60px);align-items:baseline}
  @media (min-width:900px){ .contacto-grid{grid-template-columns:1fr 1fr} }
  .datos{display:flex;flex-direction:column;gap:14px;color:#A9A49A}
  .datos a{font-size:clamp(17px,2vw,22px);color:#F6F4F1;text-decoration:none;border-bottom:1px solid #2E2C28;padding-bottom:8px;align-self:flex-start;transition:border-color .25s}
  .datos a:hover{border-color:#F6F4F1}
  footer{border-top:1px solid #1C1B19}
  footer .wrap{padding-top:32px;padding-bottom:40px;display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap}
  footer .copy{font-family:'IBM Plex Mono',monospace;font-size:11.5px;letter-spacing:.1em;color:#5A5750}

  @media (prefers-reduced-motion:reduce){ html{scroll-behavior:auto} }
</style>
</head>
<body>

<!-- Monograma reutilizable. Hereda el color con currentColor -->
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <symbol id="mark" viewBox="${VB}">
${PATHS}
  </symbol>
</svg>

<!-- ===== NAV ===== -->
<header>
  <div class="wrap">
    <a href="#top" class="logo-h" style="text-decoration:none;color:#F6F4F1" aria-label="Nicolás Mangieri">
      <svg class="mark" aria-hidden="true"><use href="#mark"></use></svg>
      <span class="bar" aria-hidden="true"></span>
      <span class="name">Nicolás<br>Mangieri</span>
    </a>
    <nav class="mono">
      <a href="#sectores" class="solo-ancho">Sectores</a>
      <a href="#empresas">Empresas</a>
      <a href="#contacto" class="btn">Conectar</a>
    </nav>
  </div>
</header>

<!-- ===== HERO ===== -->
<section id="top">
  <div class="logo-v" style="color:#F6F4F1">
    <svg class="mark" aria-hidden="true"><use href="#mark"></use></svg>
    <span class="name">Nicolás Mangieri</span>
  </div>
  <p class="claim">Diez empresas en ingeniería, seguros, salud, educación y deporte.</p>
  <a href="#sectores" class="cue mono">Recorrer <span>↓</span></a>
</section>

<!-- ===== SECTORES ===== -->
<section id="sectores" class="seccion">
  <div class="wrap">
    <div class="sectores">
      <h2 class="titulo">Cinco<br>sectores</h2>
${sectores}
    </div>
  </div>
</section>

<!-- ===== CARRUSEL DE EMPRESAS ===== -->
<section id="empresas" class="seccion" style="padding-top:0">
  <div class="wrap">
    <div class="cabecera">
      <h2 class="titulo">Las empresas</h2>
      <span class="conteo mono">10 activas</span>
    </div>
    <div class="carrusel">
      <div class="pista" id="pista">
${tarjetas}
      </div>
      <div class="car-nav">
        <button class="car-btn" type="button" data-dir="-1" aria-label="Anterior">&#8592;</button>
        <button class="car-btn" type="button" data-dir="1" aria-label="Siguiente">&#8594;</button>
        <div class="car-puntos" id="puntos" aria-hidden="true"></div>
      </div>
    </div>
  </div>
</section>

<!-- ===== FICHAS ===== -->
<section class="seccion" style="padding-top:clamp(56px,8vw,110px)">
  <div class="wrap">
    <div class="fichas">

${fichas}

    </div>
  </div>
</section>

<!-- ===== CONTACTO ===== -->
<section id="contacto" class="seccion">
  <div class="wrap">
    <div class="contacto-grid">
      <h2 class="titulo">Enviar información</h2>
      <div class="datos">
        <a href="mailto:contacto@nmc-group.com">contacto@nmc-group.com</a>
        <span class="mono" style="font-size:12px;color:#7E7B73">Caracas · Venezuela</span>
      </div>
    </div>
  </div>
</section>

<!-- ===== PIE ===== -->
<footer>
  <div class="wrap">
    <svg class="mark" style="color:#5A5750;width:52px;height:auto;aspect-ratio:1301.29/711.87" aria-hidden="true"><use href="#mark"></use></svg>
    <span class="copy">&copy; 2026 Nicolás Mangieri</span>
  </div>
</footer>

<script>
(function(){
  var pista = document.getElementById('pista');
  if (!pista) return;
  var puntos = document.getElementById('puntos');
  var cards = [].slice.call(pista.querySelectorAll('.card'));
  var quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function paso(){
    var c = cards[0];
    if (!c) return 320;
    return c.getBoundingClientRect().width + (parseFloat(getComputedStyle(pista).columnGap) || 0);
  }
  function visibles(){ return Math.max(1, Math.round(pista.clientWidth / paso())); }
  function maxIndice(){ return Math.max(0, cards.length - visibles()); }
  function indice(){ return Math.min(Math.round(pista.scrollLeft / paso()), maxIndice()); }
  function ir(i){
    var destino = Math.min(Math.max(i, 0), maxIndice());
    pista.scrollTo({ left: destino * paso(), behavior: quieto ? 'auto' : 'smooth' });
  }

  cards.forEach(function(){
    var p = document.createElement('span');
    p.className = 'punto';
    puntos.appendChild(p);
  });
  function pintar(){
    var i = indice(), tope = maxIndice();
    [].forEach.call(puntos.children, function(p, n){
      p.classList.toggle('on', n === i);
      p.style.display = n > tope ? 'none' : '';
    });
  }
  pista.addEventListener('scroll', pintar, { passive: true });
  window.addEventListener('resize', pintar);
  pintar();

  [].forEach.call(document.querySelectorAll('.car-btn'), function(b){
    b.addEventListener('click', function(){
      ir(indice() + parseInt(b.getAttribute('data-dir'), 10));
      detener();
    });
  });

  // rotacion automatica, se detiene al interactuar
  var reloj = null;
  function arrancar(){
    if (quieto || reloj) return;
    reloj = setInterval(function(){
      var i = indice();
      ir(i >= maxIndice() ? 0 : i + 1);
    }, 4200);
  }
  function detener(){ if (reloj) { clearInterval(reloj); reloj = null; } }
  pista.addEventListener('mouseenter', detener);
  pista.addEventListener('focusin', detener);
  pista.addEventListener('touchstart', detener, { passive: true });

  // solo rota mientras la seccion esta a la vista
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function(ent){
      if (ent[0].isIntersecting) { arrancar(); } else { detener(); }
    }, { threshold: .35 }).observe(pista);
  } else {
    arrancar();
  }
})();
</script>

</body>
</html>
`;

fs.writeFileSync(`${REPO}/index.html`, html);
console.log('index.html escrito:', html.split('\n').length, 'lineas,', (html.length/1024).toFixed(1), 'KB');
