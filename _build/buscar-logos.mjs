// Busca candidatos a logo en cada web del portafolio.
// Uso:  node _build/buscar-logos.mjs
// Solo lee el HTML y lista URLs de imagen. No descarga nada.

const SITIOS = [
  ['e01','Saip Service',              'https://www.saipservice.com/'],
  ['e02','Pioneer Venezuela',         'https://www.pioneervenezuela.com/'],
  ['e03','Manfreca',                  'https://www.manfreca.com/'],
  ['e04','GTME Service',              'https://gtmeservice.com/'],
  ['e05','Seguros Los Andes',         'https://www.seguroslosandes.com/'],
  ['e06','Ibero Seguros',             'https://www.iberoseguros.com/'],
  ['e07','Grupo IDET',                'https://grupoidet.com/'],
  ['e08','Universidad Nueva Esparta', 'https://une.edu.ve/'],
  ['e09','Miami College of Design',   'https://miamicollegedesign.github.io/'],
  ['e10','Caribes de Anzoátegui',     'https://www.caribesbbc.com/'],
];

const abs = (u, base) => { try { return new URL(u, base).href; } catch { return null; } };

async function mirar([id, nombre, url]) {
  const salida = { id, nombre, url, logos: [], fotos: [], error: null };
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 20000);
    const r = await fetch(url, { signal: ctrl.signal, redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0' } });
    clearTimeout(t);
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const html = await r.text();
    const base = r.url;

    const push = (arr, u) => { const a = abs(u, base); if (a && !arr.includes(a)) arr.push(a); };

    // og:image y apple-touch-icon suelen ser el logo o la imagen principal
    for (const m of html.matchAll(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/gi)) push(salida.logos, m[1]);
    for (const m of html.matchAll(/<link[^>]+rel=["'][^"']*(?:apple-touch-icon|icon)[^"']*["'][^>]*>/gi)) {
      const href = m[0].match(/href=["']([^"']+)["']/i);
      if (href) push(salida.logos, href[1]);
    }
    // <img> que huelan a logo
    for (const m of html.matchAll(/<img[^>]+>/gi)) {
      const tag = m[0];
      const src = (tag.match(/\ssrc=["']([^"']+)["']/i) || [])[1];
      if (!src || src.startsWith('data:')) continue;
      if (/logo|isotipo|marca|brand/i.test(tag)) push(salida.logos, src);
      else push(salida.fotos, src);
    }
    // svg inline en el header, senal de que el logo es vectorial dentro del HTML
    if (/<header[\s\S]{0,4000}?<svg/i.test(html)) salida.logos.push('(svg inline en el header)');
  } catch (e) {
    salida.error = e.message;
  }
  return salida;
}

const res = await Promise.all(SITIOS.map(mirar));
for (const s of res) {
  console.log('\n=== ' + s.id + '  ' + s.nombre + (s.error ? '   [ERROR: ' + s.error + ']' : ''));
  console.log('  logos: ' + (s.logos.slice(0, 5).join('\n         ') || '(ninguno)'));
  console.log('  fotos: ' + s.fotos.length + ' encontradas' + (s.fotos.length ? '\n         ' + s.fotos.slice(0, 4).join('\n         ') : ''));
}
