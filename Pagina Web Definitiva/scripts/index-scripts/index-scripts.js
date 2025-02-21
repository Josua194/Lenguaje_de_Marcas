document.addEventListener("DOMContentLoaded", function () {
    const imagen = document.getElementById("image-index");

    // Rutas de las imágenes
    const imagen1 = "../imagenes/Profesor_Oak_LGPE.png";
    const imagen2 = "../imagenes/oak_pixel.png";

    // Fuente original y fuente alterna
    const fuenteOriginal = 'Arial, sans-serif';
    const fuenteAlternativa = "'MiFuente', sans-serif"; // Cambia 'MiFuente' por el nombre de tu fuente

    let fuenteActual = fuenteOriginal; // Al principio, la fuente es la original

    imagen.addEventListener("click", function () {
        // Cambiar entre imagen1 y imagen2
        imagen.src = (imagen.src.includes("Profesor_Oak_LGPE.png")) ? imagen2 : imagen1;

        // Alternar la fuente entre original y alternativa
        fuenteActual = (fuenteActual === fuenteOriginal) ? fuenteAlternativa : fuenteOriginal;

        // Cambiar la fuente de los elementos h2 y p
        document.querySelector("h2").style.fontFamily = fuenteActual;
        document.querySelector("p").style.fontFamily = fuenteActual;
    });
});