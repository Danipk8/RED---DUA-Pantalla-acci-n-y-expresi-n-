
let respuestaGuardada = "";

let tipoRespuesta = "";

//CONTROLA GRABACION
let mediaRecorder;
//Guarda pedacitos del audio mientras grabas.
//Luego se unen.
let audioChunks = [];

//Es la dirección temporal del audio para reproducirlo.
let audioURL = "";





// MOSTRAR / OCULTAR
function mostrarSeccion(id) {

    const secciones =
        document.querySelectorAll(".response-section");

    secciones.forEach(seccion => {

        if (seccion.id === id) {

            if (seccion.classList.contains("hidden")) {
                seccion.classList.remove("hidden");
            } else {
                seccion.classList.add("hidden");
            }

        } else {
            seccion.classList.add("hidden");
        }

    });
}





// GUARDAR TEXTO
function guardarTexto() {

    tipoRespuesta = "escrita";

    respuestaGuardada =
        document.getElementById("respuestaTexto").value;

    if (respuestaGuardada.trim() === "") {
        alert("Escribe una respuesta primero");
        return;
    }

    descargarEvidencia();
    alert("Respuesta descargada");
}





// GUARDAR SELECCIÓN
function guardarSeleccion() {

    tipoRespuesta = "seleccion";

    let seleccionadas = [];

    document.querySelectorAll('#seleccionar input:checked')
        .forEach(opcion => {
            seleccionadas.push(opcion.value);
        });

//validacion
    if (seleccionadas.length === 0) {
        alert("Selecciona al menos una opción");
        return;
    }

    respuestaGuardada = seleccionadas.join("\n");

    descargarEvidencia();
    alert("Selección descargada");
}



// funcion Descargar evidencia
// DESCARGAR TXT
function descargarEvidencia() {

    let nombreArchivo = "";
    let tituloContenido = "";

    if (tipoRespuesta === "escrita") {
        nombreArchivo = "respuesta_escrita_dua.txt";
        tituloContenido = "RESPUESTA ESCRITA";
    }

    if (tipoRespuesta === "seleccion") {
        nombreArchivo = "seleccion_dua.txt";
        tituloContenido = "RESPUESTA POR SELECCIÓN";
    }

    if (tipoRespuesta === "audio") {
        nombreArchivo = "audio_dua.txt";
        tituloContenido = "RESPUESTA EN AUDIO";
    }

    const contenido = `
EXPRESIÓN DE APRENDIZAJE - DUA

Tipo:
${tituloContenido}

Respuesta:
${respuestaGuardada}
    `;

    const blob = new Blob([contenido], {
        type: "text/plain"
    });

    const enlace = document.createElement("a");

    enlace.href = URL.createObjectURL(blob);
    enlace.download = nombreArchivo;
    enlace.click();
}





// funcion Abrir formulario
function subirFormulario() {

    const formulario =
        document.getElementById("formularioEmbed");

    formulario.classList.toggle("hidden");
}


//AUDIO:

//Configuración de botones
//Pide acceso al micrófono.
const startBtn = document.getElementById("startBtn");
//Empieza a grabar.
const stopBtn = document.getElementById("stopBtn");
const repeatBtn = document.getElementById("repeatBtn");
const audioPlayback = document.getElementById("audioPlayback");


//Función iniciar grabación

startBtn.addEventListener("click", async () => {

    tipoRespuesta = "audio";

    const stream =
        await navigator.mediaDevices.getUserMedia({
            audio: true
        });

    mediaRecorder = new MediaRecorder(stream);

    audioChunks = [];

    mediaRecorder.start();

    startBtn.disabled = true;
    stopBtn.disabled = false;

    mediaRecorder.addEventListener("dataavailable", event => {
        audioChunks.push(event.data);
    });
});


//Función detener grabación
stopBtn.addEventListener("click", () => {

    mediaRecorder.stop();

    startBtn.disabled = false;
    stopBtn.disabled = true;

    mediaRecorder.addEventListener("stop", () => {

        const audioBlob = new Blob(audioChunks, {
            type: "audio/webm"
        });

        audioURL = URL.createObjectURL(audioBlob);

        audioPlayback.src = audioURL;

        respuestaGuardada = "Respuesta registrada en audio.";

        descargarAudio(audioBlob);

        alert("Audio descargado");
    });
});

// REPETIR audio
repeatBtn.addEventListener("click", () => {

    audioChunks = [];
    audioPlayback.src = "";
    respuestaGuardada = "";

    alert("Puedes grabar nuevamente");
});



//Funcion descargar audio
function descargarAudio(audioBlob) {

    const enlace = document.createElement("a");

    enlace.href = URL.createObjectURL(audioBlob);
    enlace.download = "audio_dua.webm";

    enlace.click();
}