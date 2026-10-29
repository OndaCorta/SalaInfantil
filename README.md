# Biblioteca en onda corta

Reseñas de cuentos contadas en voz alta desde la sala infantil de la **Biblioteca Pública del Maule**. Un sitio pequeño, sin publicidad, pensado para escuchar en familia: se elige una frecuencia en un dial de radio y se abre la reseña con su audio.

**Sitio publicado:** https://ondacorta.github.io/SalaInfantil/

---

## Cómo está armado

| Archivo | Para qué sirve |
| --- | --- |
| `index.html` | La página y sus textos fijos. |
| `resenas.js` | **Lo único que hay que editar para agregar o cambiar reseñas.** |
| `estilos.css` | Colores, tipografía y diseño. |
| `app.js` | El dial, el reproductor, el modo noche y los enlaces compartibles. |
| `audios/` | Los archivos MP3 de las reseñas. |
| `sw.js` + `manifest.webmanifest` | Permiten instalar el sitio y escucharlo sin conexión. |
| `icono-*.png`, `og.png`, `favicon.svg` | Iconos e imagen para compartir en redes. |

No hay que compilar ni instalar nada. GitHub Pages publica los archivos tal como están.

---

## Agregar una reseña

1. Copia el MP3 en la carpeta `audios/`. Usa un nombre simple, sin espacios ni tildes: `mi-cuento.mp3`.
2. Abre `resenas.js` y copia un bloque de ejemplo:

```js
{
  id: "mi-cuento",
  frecuencia: "101.3",
  titulo: "Mi cuento",
  autor: "Nombre de la autora",
  edad: "Desde 5 años",
  resena: "Una o dos ideas sobre el cuento, contadas con tus palabras.",
  audio: "audios/mi-cuento.mp3",
}
```

3. Cambia todos los datos. La `frecuencia` ordena el dial: mientras más grande, más a la derecha.
4. Si el audio todavía no está grabado, deja `audio: ""`. La ficha mostrará un aviso amable en vez del reproductor.
5. Guarda los cambios. GitHub Pages actualiza el sitio en unos minutos.

**Consejos para el texto**

- Escribe con tus palabras; no copies la contratapa del libro.
- Dos o tres frases alcanzan. Cuenta de qué trata sin contar el final.
- Puedes terminar con una pregunta para conversar en familia.
- Revisa que las frecuencias no se repitan.

**Consejos para el audio**

- Exporta en MP3 mono, 96–128 kbps. Un archivo de 5 minutos pesa alrededor de 3–5 MB.
- Normaliza el volumen y deja medio segundo de silencio al inicio y al final.
- Graba en un lugar silencioso, con el micrófono a un palmo de la boca.
- Usa solo voces y músicas propias o con permiso. **No subas audiolibros comerciales.**

---

## Datos de contacto

Los datos reales de la biblioteca ya están puestos en `index.html`:

- **Dirección:** Calle 1 Sur 1026, Talca, Región del Maule.
- **Horario:** lunes a jueves, 9:00 a 18:00; viernes, 9:00 a 17:00; sábados, 10:00 a 15:00.
- **Correo:** bibliotecapublicadelmaule@gmail.com
- **Instagram:** [@bibliotecapublicadelmaule](https://www.instagram.com/bibliotecapublicadelmaule/)

Aparecen en el bloque «Visítanos», en el botón «Escríbenos», en el aviso para navegadores sin JavaScript, en el pie de página y en los datos estructurados (`application/ld+json`) que leen los buscadores.

**Si algún dato cambia**, edita `index.html`. Busca la palabra `bibliotecapublicadelmaule` para encontrar el correo y el Instagram, o el bloque `<dl class="datos">` para la dirección y el horario. Actualiza también el `application/ld+json` del inicio del archivo y la fecha de `sitemap.xml`.

---

## Ver el sitio en tu computador

Abre una terminal en esta carpeta y ejecuta:

```bash
python -m http.server 8000
```

Luego visita <http://localhost:8000>. También puedes abrir `index.html` directamente, aunque algunas funciones (como el enlace compartible) se comportan distinto sin un servidor.

---

## Publicar en GitHub Pages

1. Sube los cambios a la rama `main`.
2. En GitHub, entra a **Settings → Pages** y elige **Deploy from a branch → main / (root)**.
3. Espera unos minutos. El sitio queda en `https://ondacorta.github.io/SalaInfantil/`.

Si el sitio se ve con una versión antigua, recarga con `Ctrl + F5`. La página siempre busca la versión nueva en la red; el service worker solo guarda copias para cuando no hay conexión.

---

## Accesibilidad y detalles pensados

- El dial funciona con teclado: flechas, `Inicio` y `Fin`.
- El reproductor tiene botón grande, barra de avance y tiempos; no depende de los controles pequeños del navegador.
- Contraste alto, foco visible, textos con tipografía legible y respeto por `prefers-reduced-motion`.
- Modo noche manual que se guarda en el navegador.
- Cada reseña tiene un enlace propio (`#elmer`, `#luna`…) para compartir por WhatsApp o correo.
- Si no hay JavaScript, se muestra un aviso con el correo de contacto.
- Instalable como aplicación y con copia sin conexión (service worker).

---

## Ideas para seguir creciendo

- Grabar las reseñas que faltan de Papelucho y La oruga muy hambrienta.
- Sumar una reseña por mes, con la voz de distintas personas del equipo.
- Agregar un código QR junto al mostrador que lleve al dial.
- Invitar a las familias a recomendar su cuento favorito y grabar esas reseñas.

---

Hecho con cariño para leer con los oídos.
