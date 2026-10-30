/* ============================================================
   Service worker · Biblioteca en onda corta
   ------------------------------------------------------------
   Guarda una copia del sitio para que funcione con mala señal
   o sin conexión. Las páginas se buscan primero en la red, así
   los cambios aparecen apenas se publican; los audios y los
   estilos se sirven desde la copia local cuando es posible.
   ============================================================ */

const VERSION = "onda-corta-v2";
const CACHE = VERSION + "-estatico";

const ARCHIVOS = [
  "./",
  "./index.html",
  "./estilos.css",
  "./resenas.js",
  "./app.js",
  "./manifest.webmanifest",
  "./favicon.svg",
  "./icono-192.png",
  "./icono-512.png",
];

self.addEventListener("install", function (evento) {
  evento.waitUntil(
    caches
      .open(CACHE)
      .then(function (cache) {
        return cache.addAll(ARCHIVOS);
      })
      .then(function () {
        return self.skipWaiting();
      })
  );
});

self.addEventListener("activate", function (evento) {
  evento.waitUntil(
    caches
      .keys()
      .then(function (claves) {
        return Promise.all(
          claves
            .filter(function (clave) {
              return clave !== CACHE;
            })
            .map(function (clave) {
              return caches.delete(clave);
            })
        );
      })
      .then(function () {
        return self.clients.claim();
      })
  );
});

self.addEventListener("fetch", function (evento) {
  const peticion = evento.request;
  if (peticion.method !== "GET") return;

  const url = new URL(peticion.url);

  /* Páginas: primero la red, luego la copia guardada. */
  if (peticion.mode === "navigate") {
    evento.respondWith(
      fetch(peticion)
        .then(function (respuesta) {
          const copia = respuesta.clone();
          caches.open(CACHE).then(function (cache) {
            cache.put(peticion, copia);
          });
          return respuesta;
        })
        .catch(function () {
          return caches.match(peticion).then(function (guardada) {
            return guardada || caches.match("./index.html");
          });
        })
    );
    return;
  }

  /* Audios y archivos del sitio: copia local y actualización en segundo plano. */
  if (
    url.origin === self.location.origin &&
    (url.pathname.indexOf("/audios/") !== -1 ||
      /\.(css|js|png|svg|webmanifest|woff2?)$/.test(url.pathname))
  ) {
    evento.respondWith(
      caches.match(peticion).then(function (guardada) {
        const desdeLaRed = fetch(peticion)
          .then(function (respuesta) {
            if (respuesta.ok) {
              const copia = respuesta.clone();
              caches.open(CACHE).then(function (cache) {
                cache.put(peticion, copia);
              });
            }
            return respuesta;
          })
          .catch(function () {
            return guardada;
          });
        return guardada || desdeLaRed;
      })
    );
    return;
  }

  /* Tipografías de Google: se guardan para no volver a descargarlas. */
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    evento.respondWith(
      caches.match(peticion).then(function (guardada) {
        return (
          guardada ||
          fetch(peticion).then(function (respuesta) {
            const copia = respuesta.clone();
            caches.open(CACHE).then(function (cache) {
              cache.put(peticion, copia);
            });
            return respuesta;
          })
        );
      })
    );
  }
});
