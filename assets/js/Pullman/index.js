function initModulo(){
    if (window.ModuloInitialized) return;
    window.ModuloInitialized = true;

    console.log("modulo caja activo");

    let prueba = document.getElementById("printPrueba");
    if (prueba) {
        prueba.addEventListener("click", () => {
            console.log("¡Botón de prueba presionado!");
            alert("Esto es una prueba de impresión");
        });
    }
}

