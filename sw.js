const VERSAO = "smartmarket-v2";

const ARQUIVOS = [
  "./",
  "./index.html",
  "./lista.html",
  "./boas-vindas.html",
  "./offline/manifest.webmanifest",
  "./css/style.css",
  "./css/mapa.css",
  "./css/lista.css",
  "./css/boas-vindas.css",
  "./js/contraste.js",
  "./js/data.js",
  "./js/comum.js",
  "./js/mapa.js",
  "./js/lista.js",
  "./js/boas-vindas.js",
  "./img/logo-smartmarket.webp",
  "./offline/icone-192.png",
  "./offline/icone-512.png"
];

const ESPERA_MS = 3000;

self.addEventListener("install", evento => {
  evento.waitUntil(
    caches.open(VERSAO)
      .then(cache => cache.addAll(ARQUIVOS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", evento => {
  evento.waitUntil(
    caches.keys()
      .then(nomes => Promise.all(nomes.filter(n => n !== VERSAO).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", evento => {
  const pedido = evento.request;
  if (pedido.method !== "GET") return;

  const url = new URL(pedido.url);

  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    evento.respondWith(primeiroCopia(pedido));
    return;
  }

  if (url.origin === self.location.origin) {
    evento.respondWith(primeiroInternet(pedido));
  }
});

async function primeiroInternet(pedido) {
  const cache = await caches.open(VERSAO);
  try {
    const resposta = await comTempoLimite(fetch(pedido), ESPERA_MS);
    if (resposta.ok) cache.put(pedido, resposta.clone());
    return resposta;
  } catch {
    const copia = await cache.match(pedido, { ignoreSearch: true });
    if (copia) return copia;
    if (pedido.mode === "navigate") return cache.match("./index.html");
    return Response.error();
  }
}

async function primeiroCopia(pedido) {
  const cache = await caches.open(VERSAO);
  const copia = await cache.match(pedido);
  if (copia) return copia;
  try {
    const resposta = await fetch(pedido);
    if (resposta.ok || resposta.type === "opaque") cache.put(pedido, resposta.clone());
    return resposta;
  } catch {
    return Response.error();
  }
}

function comTempoLimite(promessa, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("tempo esgotado")), ms);
    promessa.then(r => { clearTimeout(timer); resolve(r); }, e => { clearTimeout(timer); reject(e); });
  });
}

