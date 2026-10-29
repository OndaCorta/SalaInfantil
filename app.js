/* ============================================================
   Biblioteca en onda corta · lógica del dial
   ------------------------------------------------------------
   No hace falta editar este archivo: las reseñas viven en
   resenas.js. Aquí solo está la radio.
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Datos ---------- */

  var lista =
    typeof RESENAS !== "undefined" && Array.isArray(RESENAS) ? RESENAS.slice() : [];

  lista.sort(function (a, b) {
    return parseFloat(a.frecuencia) - parseFloat(b.frecuencia);
  });

  lista.forEach(function (resena, i) {
    resena.titulo = resena.titulo || "Reseña sin título";
    resena.autor = resena.autor || "Autor o autora";
    resena.resena = resena.resena || "";
    resena.frecuencia = resena.frecuencia || String(88.1 + i);
    resena.audio = resena.audio || "";
    if (!resena.id) resena.id = crearId(resena.titulo);
  });

  /* ---------- Referencias ---------- */

  var consola = document.getElementById("consola");
  var escala = document.getElementById("escala");
  var aguja = document.getElementById("aguja");
  var estaciones = document.getElementById("estaciones");
  var textoFrecuencia = document.getElementById("frecuencia");
  var textoSintonizado = document.getElementById("sintonizado");
  var contador = document.getElementById("contador");
  var estadoTexto = document.getElementById("estado-texto");
  var ficha = document.getElementById("ficha");
  var anuncio = document.getElementById("anuncio");
  var botonTema = document.getElementById("boton-tema");
  var metaTema = document.getElementById("meta-tema");

  var botones = [];
  var indiceActual = 0;
  var audioActual = null;
  var turno = 0;
  var temporizadorAviso = 0;

  var movimientoReducido = window.matchMedia("(prefers-reduced-motion: reduce)");

  var ICONO_PLAY =
    '<svg class="icono-play" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.2v13.6a1 1 0 0 0 1.53.85l10.5-6.8a1 1 0 0 0 0-1.7L9.53 4.35A1 1 0 0 0 8 5.2Z"/></svg>';
  var ICONO_PAUSA =
    '<svg class="icono-pausa" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="4.5" width="4" height="15" rx="1.2"/><rect x="14" y="4.5" width="4" height="15" rx="1.2"/></svg>';
  var ICONO_DADO =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="3.2"/><circle cx="9" cy="9" r="1.15" fill="currentColor" stroke="none"/><circle cx="15" cy="9" r="1.15" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.15" fill="currentColor" stroke="none"/><circle cx="9" cy="15" r="1.15" fill="currentColor" stroke="none"/><circle cx="15" cy="15" r="1.15" fill="currentColor" stroke="none"/></svg>';
  var ICONO_COMPARTIR =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="19" r="2.6"/><path d="m8.4 10.7 7.2-4.2M8.4 13.3l7.2 4.2"/></svg>';

  /* ---------- Utilidades ---------- */

  function crear(etiqueta, clase, texto) {
    var nodo = document.createElement(etiqueta);
    if (clase) nodo.className = clase;
    if (texto !== undefined && texto !== null) nodo.textContent = texto;
    return nodo;
  }

  function crearId(texto) {
    return (
      texto
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "resena"
    );
  }

  function formatearTiempo(segundos) {
    if (!isFinite(segundos) || segundos < 0) return "0:00";
    var total = Math.floor(segundos);
    var minutos = Math.floor(total / 60);
    var resto = total % 60;
    return minutos + ":" + (resto < 10 ? "0" : "") + resto;
  }

  function estado(texto) {
    estadoTexto.textContent = texto;
  }

  function anunciar(texto) {
    anuncio.textContent = texto;
  }

  function indiceDe(clave) {
    var limpia = decodeURIComponent(clave).replace(/^#/, "").toLowerCase();
    for (var i = 0; i < lista.length; i++) {
      if (lista[i].id === limpia || lista[i].frecuencia === limpia) return i;
    }
    return -1;
  }

  function detenerAudio() {
    if (!audioActual) return;
    try {
      audioActual.pause();
    } catch (error) {}
    audioActual.removeAttribute("src");
    try {
      audioActual.load();
    } catch (error) {}
    audioActual = null;
  }

  function actualizarHash(id) {
    if (!/^https?:$/.test(window.location.protocol)) return;
    if (window.location.hash === "#" + id) return;
    try {
      window.history.replaceState(null, "", "#" + id);
    } catch (error) {}
  }

  function moverAguja(i, centrar) {
    var boton = botones[i];
    if (!boton) return;

    var centro = boton.offsetLeft + boton.offsetWidth / 2;
    aguja.style.left = centro + "px";

    if (!centrar) return;
    var dial = escala.parentElement;
    var sobra = dial.scrollWidth - dial.clientWidth;
    if (sobra <= 1) return;

    var destino = Math.max(0, Math.min(sobra, centro - dial.clientWidth / 2));
    if (dial.scrollTo) {
      dial.scrollTo({
        left: destino,
        behavior: movimientoReducido.matches ? "auto" : "smooth",
      });
    } else {
      dial.scrollLeft = destino;
    }
  }

  /* ---------- Pintar el dial ---------- */

  function crearBotonEstacion(resena, i) {
    var boton = document.createElement("button");
    boton.type = "button";
    boton.className = "estacion";
    boton.setAttribute("role", "radio");
    boton.setAttribute("aria-checked", i === 0 ? "true" : "false");
    boton.setAttribute(
      "aria-label",
      resena.frecuencia +
        " FM: " +
        resena.titulo +
        (resena.audio ? "" : " (audio en camino)")
    );
    boton.tabIndex = i === 0 ? 0 : -1;
    boton.dataset.indice = String(i);
    boton.appendChild(crear("span", "estacion-etiqueta", resena.frecuencia));
    boton.addEventListener("click", function () {
      elegir(i);
    });
    return boton;
  }

  function pintarFicha(resena) {
    turno += 1;
    var miTurno = turno;

    detenerAudio();
    window.clearTimeout(temporizadorAviso);
    temporizadorAviso = 0;

    if (consola) consola.classList.remove("sonando");
    estado(resena.audio ? "Listo para escuchar" : "Audio en camino");

    ficha.innerHTML = "";

    ficha.appendChild(crear("p", "ficha-senal", resena.frecuencia + " FM · Reseña"));

    var titulo = crear("h2", "", resena.titulo);
    titulo.id = "ficha-titulo";
    ficha.appendChild(titulo);

    var autor = crear("p", "ficha-autor");
    autor.appendChild(document.createTextNode("de "));
    autor.appendChild(crear("span", "", resena.autor));
    ficha.appendChild(autor);

    var etiquetas = crear("ul", "etiquetas");
    if (resena.edad) etiquetas.appendChild(crear("li", "", resena.edad));

    var etiquetaDuracion = crear("li", "");
    etiquetaDuracion.hidden = true;
    etiquetas.appendChild(etiquetaDuracion);

    if (!resena.audio) {
      etiquetas.appendChild(crear("li", "etiqueta-aviso", "Audio en camino"));
    }
    ficha.appendChild(etiquetas);

    ficha.appendChild(crear("p", "ficha-texto", resena.resena));

    var avisoAccion = crear("p", "aviso-accion", "");
    avisoAccion.setAttribute("role", "status");
    avisoAccion.setAttribute("aria-live", "polite");

    if (resena.audio) {
      var reproductor = crear("div", "reproductor");

      var botonPlay = crear("button", "boton-play");
      botonPlay.type = "button";
      botonPlay.innerHTML = ICONO_PLAY + ICONO_PAUSA;
      botonPlay.setAttribute("aria-label", "Reproducir la reseña de " + resena.titulo);

      var barra = crear("div", "barra");
      var rango = document.createElement("input");
      rango.type = "range";
      rango.min = "0";
      rango.max = "100";
      rango.step = "0.1";
      rango.value = "0";
      rango.disabled = true;
      rango.setAttribute("aria-label", "Avance de la reseña");
      rango.setAttribute("aria-valuetext", "0:00");
      rango.style.setProperty("--avance", "0%");

      var tiempos = crear("div", "tiempos");
      var tiempoActual = crear("span", "", "0:00");
      var tiempoTotal = crear("span", "", "0:00");
      tiempos.appendChild(tiempoActual);
      tiempos.appendChild(tiempoTotal);

      barra.appendChild(rango);
      barra.appendChild(tiempos);

      var audio = document.createElement("audio");
      audio.src = resena.audio;
      audio.preload = "metadata";
      audio.setAttribute("playsinline", "");
      audio.setAttribute("aria-hidden", "true");
      audio.hidden = true;

      reproductor.appendChild(botonPlay);
      reproductor.appendChild(barra);
      reproductor.appendChild(audio);
      ficha.appendChild(reproductor);
      audioActual = audio;

      var marcarAvance = function (porcentaje) {
        rango.value = String(porcentaje);
        rango.style.setProperty("--avance", porcentaje + "%");
      };

      var mostrarError = function () {
        if (miTurno !== turno) return;
        botonPlay.disabled = true;
        rango.disabled = true;
        estado("No pudimos cargar el audio");
        if (consola) consola.classList.remove("sonando");
        if (reproductor.querySelector(".nota-error")) return;

        var nota = crear(
          "p",
          "nota-error",
          "No pudimos cargar este audio. Revisa tu conexión e inténtalo otra vez."
        );
        var reintentar = crear("button", "", "Reintentar");
        reintentar.type = "button";
        reintentar.addEventListener("click", function () {
          nota.remove();
          botonPlay.disabled = false;
          rango.disabled = false;
          estado("Cargando audio…");
          audio.load();
          var intento = audio.play();
          if (intento && typeof intento.catch === "function") {
            intento.catch(mostrarError);
          }
        });
        nota.appendChild(reintentar);
        reproductor.appendChild(nota);
      };

      botonPlay.addEventListener("click", function () {
        if (miTurno !== turno) return;
        if (audio.paused) {
          var intento = audio.play();
          if (intento && typeof intento.catch === "function") {
            intento.catch(mostrarError);
          }
        } else {
          audio.pause();
        }
      });

      rango.addEventListener("input", function () {
        if (!isFinite(audio.duration) || audio.duration <= 0) return;
        var porcentaje = Number(rango.value);
        audio.currentTime = (porcentaje / 100) * audio.duration;
        marcarAvance(porcentaje);
        tiempoActual.textContent = formatearTiempo(audio.currentTime);
        rango.setAttribute(
          "aria-valuetext",
          formatearTiempo(audio.currentTime) + " de " + formatearTiempo(audio.duration)
        );
      });

      rango.addEventListener("change", function () {
        if (!isFinite(audio.duration) || audio.duration <= 0) return;
        rango.setAttribute(
          "aria-valuetext",
          formatearTiempo(audio.currentTime) + " de " + formatearTiempo(audio.duration)
        );
      });

      audio.addEventListener("loadedmetadata", function () {
        if (miTurno !== turno) return;
        var duracion = audio.duration;
        if (!isFinite(duracion) || duracion <= 0) return;
        tiempoTotal.textContent = formatearTiempo(duracion);
        etiquetaDuracion.textContent = formatearTiempo(duracion);
        etiquetaDuracion.hidden = false;
        rango.disabled = false;
        rango.setAttribute("aria-valuetext", "0:00 de " + formatearTiempo(duracion));
      });

      audio.addEventListener("timeupdate", function () {
        if (miTurno !== turno || !isFinite(audio.duration) || audio.duration <= 0) return;
        var porcentaje = Math.min(100, (audio.currentTime / audio.duration) * 100);
        marcarAvance(porcentaje);
        tiempoActual.textContent = formatearTiempo(audio.currentTime);
      });

      audio.addEventListener("play", function () {
        if (miTurno !== turno) return;
        botonPlay.classList.add("reproduciendo");
        botonPlay.setAttribute("aria-label", "Pausar la reseña de " + resena.titulo);
        if (consola) consola.classList.add("sonando");
        estado("Sonando ahora");
      });

      audio.addEventListener("pause", function () {
        if (miTurno !== turno) return;
        botonPlay.classList.remove("reproduciendo");
        botonPlay.setAttribute("aria-label", "Reproducir la reseña de " + resena.titulo);
        if (consola) consola.classList.remove("sonando");
        if (!audio.ended) estado("En pausa");
      });

      audio.addEventListener("ended", function () {
        if (miTurno !== turno) return;
        botonPlay.classList.remove("reproduciendo");
        botonPlay.setAttribute(
          "aria-label",
          "Volver a escuchar la reseña de " + resena.titulo
        );
        if (consola) consola.classList.remove("sonando");
        estado("Terminó la reseña. ¿Otro cuento?");
        marcarAvance(100);
        tiempoActual.textContent = formatearTiempo(audio.duration);
        rango.setAttribute(
          "aria-valuetext",
          formatearTiempo(audio.duration) + " de " + formatearTiempo(audio.duration)
        );
      });

      audio.addEventListener("waiting", function () {
        if (miTurno !== turno) return;
        botonPlay.setAttribute("aria-busy", "true");
        estado("Cargando audio…");
      });

      audio.addEventListener("playing", function () {
        if (miTurno !== turno) return;
        botonPlay.removeAttribute("aria-busy");
        estado("Sonando ahora");
      });

      audio.addEventListener("canplay", function () {
        if (miTurno !== turno) return;
        botonPlay.removeAttribute("aria-busy");
      });

      audio.addEventListener("error", mostrarError);
    } else {
      var aviso = crear("div", "aviso-audio");
      var icono = crear("span", "aviso-icono", "🎙️");
      icono.setAttribute("aria-hidden", "true");
      var textoAviso = crear("p", "");
      textoAviso.appendChild(crear("strong", "", "Estamos grabando esta reseña."));
      textoAviso.appendChild(
        document.createTextNode(
          " Mientras tanto, puedes pedir el libro en la sala infantil."
        )
      );
      aviso.appendChild(icono);
      aviso.appendChild(textoAviso);
      ficha.appendChild(aviso);
    }

    var acciones = crear("div", "acciones");

    var botonSorpresa = crear("button", "boton");
    botonSorpresa.type = "button";
    botonSorpresa.innerHTML = ICONO_DADO + "<span>Sorpréndeme</span>";
    botonSorpresa.addEventListener("click", function () {
      if (lista.length < 2) return;
      var nuevo;
      do {
        nuevo = Math.floor(Math.random() * lista.length);
      } while (nuevo === indiceActual);
      elegir(nuevo);
    });

    var botonCompartir = crear("button", "boton");
    botonCompartir.type = "button";
    botonCompartir.innerHTML = ICONO_COMPARTIR + "<span>Compartir reseña</span>";
    botonCompartir.addEventListener("click", function () {
      compartir(resena, botonCompartir, avisoAccion);
    });

    acciones.appendChild(botonSorpresa);
    acciones.appendChild(botonCompartir);
    acciones.appendChild(avisoAccion);
    ficha.appendChild(acciones);
  }

  /* ---------- Elegir una estación ---------- */

  function elegir(i, opciones) {
    if (!lista.length) return;
    opciones = opciones || {};
    if (i < 0 || i >= lista.length) i = 0;

    indiceActual = i;
    var resena = lista[i];

    botones.forEach(function (boton, j) {
      var activo = j === i;
      boton.setAttribute("aria-checked", activo ? "true" : "false");
      boton.tabIndex = activo ? 0 : -1;
    });

    textoFrecuencia.textContent = resena.frecuencia;
    textoSintonizado.textContent = resena.titulo;
    contador.textContent = i + 1 + " / " + lista.length;

    pintarFicha(resena);
    moverAguja(i, true);

    if (!opciones.sinHash) actualizarHash(resena.id);

    if (opciones.anunciar !== false) {
      anunciar(
        "Frecuencia " +
          resena.frecuencia +
          " FM: " +
          resena.titulo +
          ", de " +
          resena.autor +
          "." +
          (resena.audio ? "" : " Audio en camino.")
      );
    }
  }

  /* ---------- Compartir ---------- */

  function copiarAlPortapapeles(texto) {
    var campo = document.createElement("textarea");
    campo.value = texto;
    campo.setAttribute("readonly", "");
    campo.style.position = "fixed";
    campo.style.top = "-1000px";
    campo.style.opacity = "0";
    document.body.appendChild(campo);
    campo.select();
    try {
      document.execCommand("copy");
    } catch (error) {}
    document.body.removeChild(campo);
  }

  function compartir(resena, boton, avisoAccion) {
    var enlace = window.location.href.split("#")[0] + "#" + resena.id;
    var datos = {
      title: resena.titulo + " · Biblioteca en onda corta",
      text:
        "Una reseña para escuchar en familia: " +
        resena.titulo +
        ", de " +
        resena.autor +
        ".",
      url: enlace,
    };

    var confirmarCopia = function () {
      var etiqueta = boton.querySelector("span");
      if (etiqueta) etiqueta.textContent = "¡Enlace copiado!";
      avisoAccion.textContent = "Enlace copiado. Ya puedes compartirlo.";
      window.clearTimeout(temporizadorAviso);
      temporizadorAviso = window.setTimeout(function () {
        if (etiqueta) etiqueta.textContent = "Compartir reseña";
        avisoAccion.textContent = "";
      }, 3500);
    };

    if (navigator.share) {
      navigator.share(datos).catch(function (error) {
        if (error && error.name === "AbortError") return;
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(enlace).then(confirmarCopia, function () {
            copiarAlPortapapeles(enlace);
            confirmarCopia();
          });
        } else {
          copiarAlPortapapeles(enlace);
          confirmarCopia();
        }
      });
      return;
    }

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(enlace).then(confirmarCopia, function () {
        copiarAlPortapapeles(enlace);
        confirmarCopia();
      });
    } else {
      copiarAlPortapapeles(enlace);
      confirmarCopia();
    }
  }

  /* ---------- Tema ---------- */

  function leerTemaGuardado() {
    try {
      return localStorage.getItem("tema");
    } catch (error) {
      return null;
    }
  }

  function aplicarTema(oscuro) {
    document.documentElement.setAttribute("data-tema", oscuro ? "oscuro" : "claro");
    botonTema.setAttribute("aria-pressed", oscuro ? "true" : "false");
    if (metaTema) metaTema.setAttribute("content", oscuro ? "#0d1a17" : "#f7f1e5");
  }

  function iniciarTema() {
    if (!botonTema) return;
    var oscuro = document.documentElement.getAttribute("data-tema") === "oscuro";
    aplicarTema(oscuro);

    botonTema.addEventListener("click", function () {
      oscuro = !oscuro;
      aplicarTema(oscuro);
      try {
        localStorage.setItem("tema", oscuro ? "oscuro" : "claro");
      } catch (error) {}
    });

    var consulta = window.matchMedia("(prefers-color-scheme: dark)");
    var alCambiarSistema = function (evento) {
      if (leerTemaGuardado()) return;
      oscuro = evento.matches;
      aplicarTema(oscuro);
    };
    if (consulta.addEventListener) consulta.addEventListener("change", alCambiarSistema);
    else if (consulta.addListener) consulta.addListener(alCambiarSistema);
  }

  /* ---------- Inicio ---------- */

  function mostrarSinResenas() {
    if (consola) consola.hidden = true;
    ficha.innerHTML = "";
    ficha.appendChild(crear("p", "ficha-senal", "Sintonizador"));
    var titulo = crear("h2", "", "Todavía no hay reseñas");
    titulo.id = "ficha-titulo";
    ficha.appendChild(titulo);
    ficha.appendChild(
      crear(
        "p",
        "ficha-texto",
        "Estamos preparando las primeras grabaciones. Vuelve pronto o pide un cuento en la sala infantil."
      )
    );
  }

  function iniciar() {
    iniciarTema();

    if (!lista.length) {
      mostrarSinResenas();
      return;
    }

    escala.style.setProperty("--n", String(lista.length));

    lista.forEach(function (resena, i) {
      var boton = crearBotonEstacion(resena, i);
      estaciones.appendChild(boton);
      botones.push(boton);
    });

    estaciones.addEventListener("keydown", function (evento) {
      var tecla = evento.key;
      var destino = null;

      if (tecla === "ArrowRight" || tecla === "ArrowDown") {
        destino = (indiceActual + 1) % lista.length;
      } else if (tecla === "ArrowLeft" || tecla === "ArrowUp") {
        destino = (indiceActual - 1 + lista.length) % lista.length;
      } else if (tecla === "Home") {
        destino = 0;
      } else if (tecla === "End") {
        destino = lista.length - 1;
      }

      if (destino === null) return;
      evento.preventDefault();
      elegir(destino);
      botones[destino].focus();
    });

    var inicial = 0;
    if (window.location.hash) {
      var encontrado = indiceDe(window.location.hash);
      if (encontrado >= 0) inicial = encontrado;
    }

    elegir(inicial, { sinHash: true, anunciar: false });

    window.addEventListener("hashchange", function () {
      var encontrado = indiceDe(window.location.hash);
      if (encontrado >= 0 && encontrado !== indiceActual) {
        elegir(encontrado, { sinHash: true });
      }
    });

    window.addEventListener("resize", function () {
      moverAguja(indiceActual, false);
    });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        moverAguja(indiceActual, false);
      });
    }

    if ("serviceWorker" in navigator && window.location.protocol === "https:") {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("sw.js").catch(function () {});
      });
    }
  }

  iniciar();
})();
