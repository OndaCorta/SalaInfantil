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
    id: "papelucho",
    frecuencia: "95.3",
    titulo: "Papelucho",
    autor: "Marcela Paz",
    edad: "Desde 7 años",
    resena:
      "Papelucho cuenta su vida en un diario: la escuela, los hermanos, las travesuras y esas preguntas enormes que se le ocurren de repente. Es un clásico chileno que sigue haciendo reír y que funciona muy bien para leer por capítulos, una noche a la vez.",
    audio: "",
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
];
