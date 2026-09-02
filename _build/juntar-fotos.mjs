// Junta candidatas a foto de ambiente de cada empresa en carpetas separadas,
// para que la seleccion se haga borrando archivos en el explorador.
// Uso:  node _build/juntar-fotos.mjs
import fs from 'node:fs';
import path from 'node:path';

const DEST = 'C:/Users/GONZA/Streaming de Google Drive/Mi unidad/Memoria Claude/Cerebro/contenido/jeme/nmc-group/fotos';
const GITHUB = 'C:/Users/GONZA/OneDrive/Escritorio/Github';

// las cuatro webs propias: las fotos salen del repo local
const LOCALES = {
  '01-saip':     `${GITHUB}/Saip/src/imports`,
  '02-pioneer':  `${GITHUB}/Pioneer/src/imports`,
  '03-manfreca': `${GITHUB}/Manfreca/src/assets`,
  '04-gtme':     `${GITHUB}/GTME/src/imports`,
};

// las otras seis: se leen de su web
const WEBS = {
  '05-seguros-los-andes': 'https://www.seguroslosandes.com/',
  '06-ibero-seguros':     'https://www.iberoseguros.com/',
  '07-grupo-idet':        'https://grupoidet.com/',
  '08-une':               'https://une.edu.ve/',
  '09-miami-college':     'https://miamicollegedesign.github.io/',
  '10-caribes':           'https://www.caribesbbc.com/',
};

const esFoto = n => /\.(jpe?g|png|webp)$/i.test(n) && !/logo|icon|favicon|sprite|spinner|rif|social|svgrepo|clipart/i.test(n);

function dimsPNG(b){ return b.length > 24 && b.toString('ascii',12,16) === 'IHDR' ? [b.readUInt32BE(16), b.readUInt32BE(20)] : null; }

async function local(nombre, dir){
  const out = path.join(DEST, nombre);
  fs.mkdirSync(out, { recursive: true });
  let n = 0;
  for (const f of fs.readdirSync(dir)) {
    if (!esFoto(f)) continue;
    const b = fs.readFileSync(path.join(dir, f));
    if (b.length < 60000) continue;              // descarta iconos y recortes chicos
    const d = dimsPNG(b);
    if (d && d[0] < 700) continue;
    fs.writeFileSync(path.join(out, String(++n).padStart(2,'0') + path.extname(f)), b);
  }
  return `${nombre}: ${n} desde el repo local`;
}

async function web(nombre, url){
  const out = path.join(DEST, nombre);
  fs.mkdirSync(out, { recursive: true });
  let n = 0;
  try {
    const r = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' } });
    const html = await r.text();
    const urls = [...new Set([...html.matchAll(/<img[^>]+\ssrc=["']([^"']+)["']/gi)]
      .map(m => { try { return new URL(m[1], r.url).href; } catch { return null; } })
      .filter(u => u && esFoto(u.split('?')[0])))];
    for (const u of urls.slice(0, 14)) {
      try {
        const rr = await fetch(u, { headers: { 'user-agent': 'Mozilla/5.0' } });
        if (!rr.ok) continue;
        const b = Buffer.from(await rr.arrayBuffer());
        if (b.length < 40000) continue;
        const ext = (u.split('?')[0].match(/\.(jpe?g|png|webp)$/i) || ['.jpg'])[0];
        fs.writeFileSync(path.join(out, String(++n).padStart(2,'0') + ext), b);
      } catch {}
    }
  } catch (e) { return `${nombre}: ERROR ${e.message}`; }
  return `${nombre}: ${n} desde la web`;
}

const res = [];
for (const [k, v] of Object.entries(LOCALES)) res.push(await local(k, v));
for (const [k, v] of Object.entries(WEBS))    res.push(await web(k, v));
res.forEach(r => console.log(r));
console.log('\nCarpeta: ' + DEST);
