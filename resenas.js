/* ============================================================
   RESEÑAS DE LA SALA INFANTIL
   ============================================================

   Este es el único archivo que necesitas editar para agregar,
   quitar o cambiar una reseña.

   Cada reseña es un bloque entre llaves { ... }. Copia uno de
   los ejemplos y cambia los datos:

     id:         nombre corto para el enlace (sin espacios ni tildes).
     frecuencia: número del dial. Mientras más grande, más a la derecha.
     titulo:     nombre del cuento.
     autor:      autor o autora.
     edad:       recomendación de edad (opcional).
     resena:     el texto que se lee en la ficha.
     audio:      ruta del MP3. Déjalo vacío ("") si aún no está grabado.

   Para agregar el audio:
     1. Copia el archivo MP3 en la carpeta "audios".
     2. Escribe aquí la ruta, por ejemplo: audio: "audios/mi-cuento.mp3"

   Después guarda los cambios. El sitio se actualiza solo en unos minutos.

   OJO: revisa que las frecuencias no se repitan y que el texto de cada
   reseña sea propio (no copies el texto de la contratapa del libro).
   ============================================================ */

const RESENAS = [
  {
    id: "elmer",
    frecuencia: "88.1",
    titulo: "Elmer",
    autor: "David McKee",
    edad: "Desde 4 años",
    resena:
      "Elmer no es un elefante como los demás: su piel es una manta de colores. Un día se cansa de llamar la atención y decide pintarse de gris para parecerse al resto. Lo que descubre al final nos encanta: sus amigos lo quieren tal como es, con sus chistes y sus colores. Un cuento lleno de humor para conversar sobre las diferencias y sobre lo aburrido que sería un mundo de elefantes todos iguales.",
    audio: "audios/elmer.mp3",
  },
  {
    id: "kiwala",
    frecuencia: "89.7",
    titulo: "Kiwala y la Luna",
    autor: "Ana María Pavez y Constanza Recart",
    edad: "Desde 5 años",
    resena:
      "En la cordillera, la llama Kiwala y sus amigos —el cóndor, el puma y la serpiente— miran el cielo estrellado hasta que la Luna llena empieza a desaparecer. Convencidos de que alguien la está atacando, parten a rescatarla y descubren que las apariencias engañan. Un cuento andino para asombrarse con los eclipses y conversar sobre cómo se explican los fenómenos del cielo.",
    audio: "audios/kiwala-y-la-luna.mp3",
  },
  {
    id: "luna",
    frecuencia: "91.5",
    titulo: "¿A qué sabe la Luna?",
    autor: "Michael Grejniec",
    edad: "Desde 4 años",
    resena:
      "Los animales se preguntan a qué sabrá la Luna y quieren probarla, pero está muy lejos y ninguno llega solo. Uno sobre otro, arman una torre para alcanzarla. Un cuento sobre la curiosidad y el trabajo en equipo, ideal para conversar después: ¿a qué creen que sabe la Luna? ¿Y qué sabor tendrá el Sol?",
    audio: "audios/luna.mp3",
  },
  {
    id: "beto-y-bella",
    frecuencia: "93.3",
    titulo: "Beto y Bella llegan a Chile",
    autor: "Gary Ramos M.",
    edad: "Desde 6 años",
    resena:
      "Beto y Bella son una pareja de guacamayas que vive tranquila en la selva amazónica hasta que los seres humanos empiezan a talar y quemar su hogar. Sin más remedio, emprenden un largo viaje hacia el sur de Chile, donde deberán ganarse la confianza de los animales del bosque. Una historia sobre migración, acogida y empatía, ideal para conversar sobre quienes llegan a un lugar nuevo buscando una vida mejor.",
    audio: "audios/beto-y-bella-llegan-a-chile.mp3",
  },
  {
    id: "papelucho",
    frecuencia: "95.3",
    titulo: "Papelucho",
    autor: "Marcela Paz",
    edad: "Desde 7 años",
    resena:
      "Papelucho cuenta su vida en un diario: la escuela, los hermanos, las travesuras y esas preguntas enormes que se le ocurren de repente. Es un clásico chileno que sigue haciendo reír y que funciona muy bien para leer por capítulos, una noche a la vez.",
    audio: "audios/papelucho.mp3",
  },
  {
    id: "pepito",
    frecuencia: "96.9",
    titulo: "Pepito y sus libruras",
    autor: "Pepe Pelayo",
    edad: "Desde 7 años",
    resena:
      "A Pepito le encargan una misión difícil: conseguir que su primo Patricio vuelva a leer cuentos clásicos, después de que una burla lo dejara desconfiado. Para lograrlo, Pepito inventa sus propias versiones de Caperucita Roja, El flautista de Hamelin y Blancanieves, con mucho humor y varios guiños al mundo de hoy. Un libro para reírse de los cuentos de siempre y descubrir que leer también puede ser una travesura.",
    audio: "audios/pepito-y-sus-libruras.mp3",
  },
  {
    id: "oruga",
    frecuencia: "98.7",
    titulo: "La oruga muy hambrienta",
    autor: "Eric Carle",
    edad: "Desde 3 años",
    resena:
      "Una oruga pequeñita sale del huevo con mucha hambre. Come hojas, frutas y hasta un pastel… y después de tanto comer, algo mágico ocurre. Un cuento para los más pequeños de la casa: cuenta los días de la semana, los números y, de paso, la historia de una transformación.",
    audio: "",
  },
  {
    id: "don-croqueto",
    frecuencia: "100.3",
    titulo: "Don Croqueto",
    autor: "María José Floriano",
    edad: "Desde 6 años",
    resena:
      "Don Croqueto es un payaso coqueto y pizpireto que recorre la ciudad con una calabaza en la cabeza, los bolsillos llenos de trucos y una croqueta por nariz. Su misión es seria: hacer reír a unos vecinos apurados que llevan horas sin sonreír. Un álbum escrito en rima, con humor y color, para recordar lo importantes que son las risas compartidas y mirarnos a los ojos de vez en cuando.",
    audio: "audios/don-croqueto.mp3",
  },
  {
    id: "ratita-marita",
    frecuencia: "101.9",
    titulo: "Ratita Marita",
    autor: "Ana María Güiraldes",
    edad: "Desde 4 años",
    resena:
      "Marita está invitada a la fiesta de laucha Monona y no sabe qué ponerse: le parece que no tiene nada lindo. Su abuela la tranquiliza y le recuerda que sus dientes color yeso y sus ojitos brillantes bastan para lucirse. Así, con más confianza que ropa, Marita llega a la fiesta y se lleva todas las miradas. Un cuento breve y tierno para conversar sobre la vergüenza, los apuros de último minuto y eso que nos hace lindos sin necesidad de un vestido nuevo.",
    audio: "audios/ratita-marita.mp3",
  },
  {
    id: "mampato",
    frecuencia: "103.7",
    titulo: "Las aventuras de Mampato en el Cruce de los Andes",
    autor: "Themo Lobos",
    edad: "Desde 8 años",
    resena:
      "Mampato y Ogú viajan al Chile de la Independencia y se suman al Ejército de los Andes, justo cuando la columna cruza la cordillera rumbo a Chacabuco. En medio del frío y el cansancio, Mampato pierde su cinto espacio-temporal y queda atrapado en el pasado junto a su amigo. Una aventura histórica de Themo Lobos, con batallas, amistad y un montón de detalles para descubrir en cada página.",
    audio: "audios/mampato-cruce-de-los-andes.mp3",
  },
  {
    id: "ada",
    frecuencia: "105.1",
    titulo: "Las pesadillas de Ada",
    autor: "Isabel Córdova Rosas",
    edad: "Desde 6 años",
    resena:
      "Ada es valiente de día, pero de noche los monstruos de sus pesadillas le quitan el sueño. Harta de tenerles miedo, decide enfrentarlos: los busca, los mira de cerca y hasta le planta una bofetada a un hombrecillo peludo. Un relato con humor sobre los miedos nocturnos, ideal para leer antes de dormir y conversar sobre esas cosas que se ven enormes cuando la pieza queda a oscuras.",
    audio: "audios/las-pesadillas-de-ada.mp3",
  },
];
