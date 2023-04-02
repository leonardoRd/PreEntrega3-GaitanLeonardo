// Variables para Usuario
let usuario, usuarioIngresado;
let btnInicioSesion, btnCerrarSesion, btnLimpiarStorage;
let mensajeUsuario;
let insertarNombreUsuario;
let btnIngresar;
let controlUsuario = false;

// Variables para Persona
let formularioPersona, tituloFormularioPersona,contenedorPersonasMostrar;
let id, nombre, apellido, edad, pais, ciudad, direccion;
// Variables para almacenar los valores obtenidos del formulario persona
let varId, varNombre, varApellido, varEdad, varPais, varCiudad, varDireccion;
let personas = [];

// Clase Persona
class Persona{
    constructor(id,nombre,apellido,edad,pais,ciudad,direccion){
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.edad = edad;
        this.pais = pais;
        this.ciudad = ciudad;
        this.direccion = direccion;
    }
}

// Funciones para capturar elementos y eventos
function inicicializarElementos() {
    usuarioIngresado = document.getElementById("nombreUsuario");    

    btnInicioSesion = document.getElementById("formularioInicioSesion");    
    mensajeUsuario = document.getElementById("mensajeUsuario");
    insertarNombreUsuario = document.getElementById("InsertarNombreUsuario");
    btnCerrarSesion = document.getElementById("cerrarSesion");
    btnLimpiarStorage = document.getElementById("limpiarStorage");    

    // Datos personas
    formularioPersona = document.getElementById("formularioPersona");
    tituloFormularioPersona = document.getElementById("tituloFormularioPersona");    
    contenedorPersonasMostrar = document.getElementById("contenedorPersonasMostrar");
    id = document.getElementById("id");
    nombre = document.getElementById("nombre");
    apellido = document.getElementById("apellido");
    edad = document.getElementById("edad");
    pais = document.getElementById("pais");
    ciudad = document.getElementById("ciudad");
    direccion = document.getElementById("direccion");

}

function inicializarEventos() {
    btnInicioSesion.onsubmit = (event) => cargarUsuario(event);
    btnCerrarSesion.onclick = fCerrarSesion;
    btnLimpiarStorage.onclick = borrarStorage;
    formularioPersona.onsubmit = (event) => cargarPersona(event);
}

// Funciones para el manejo de personas
function cargarPersona(event) {    
    event.preventDefault();
    if (usuario) {
        obtenerDatosUsuario();

        const existe = personas.some((persona) => persona.id === varId);
        if (existe) {
            mostrarSwal("error","Oops...","El Id ya existe");
        }else{
            let personaACargar = new Persona(varId,varNombre,varApellido,varEdad,varPais,varCiudad,varDireccion);
            personas.push(personaACargar);
            formularioPersona.reset();
            mostrarSwal("success","Yeaah...","Persona agregada exitosamente!");            
            cargarPersonaAlStorage();
            mostrarPersonas();
        }
    }else mostrarSwal("error","Oops...","No has iniciado sesión!")        
}

function mostrarPersonas() {
    contenedorPersonasMostrar.innerHTML = "";
    personas.forEach(elem => {
        let columna = document.createElement("div");
        columna.className = "col-md-6";
        columna.id = `columna-${elem.id}`;
        columna.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <p class="card-text">Nombre:<b>${elem.nombre}</b></p>
                    <p class="card-text">Apellido:<b>${elem.apellido}</b></p>
                    <p class="card-text">Edad:<b>${elem.edad}</b></p>
                    <p class="card-text">Pais:<b>${elem.pais}</b></p>
                    <p class="card-text">Ciudad:<b>${elem.ciudad}</b></p>
                    <p class="card-text">Dirección:<b>${elem.direccion}</b></p>
                    <div class="card-footer text-center">
                        <button class="btn btn-danger" id="botonEliminar-${elem.id}">Eliminar</button>
                    </div>
                </div>
            </div>`
        contenedorPersonasMostrar.append(columna);
        let botonEliminar = document.getElementById(`botonEliminar-${elem.id}`);
        botonEliminar.onclick = () => eliminarPersona(elem.id);
    });
}

function eliminarPersona(personaId) {
    Swal.fire({
        title: 'Está seguro?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Borrar ahora!'
      }).then((result) => {
            if (result.isConfirmed) {
                borrarPersonaConfirmado(personaId);                
            }
        })
}

function borrarPersonaConfirmado(personaId) {
    let personaBorrar = document.getElementById(`columna-${personaId}`);
    let indexPersona = personas.findIndex((persona) => persona.id === personaId);

    personas.splice(indexPersona,1);
    mostrarSwal("success","Yeaah...","Persona eliminada correctamente!");
    personaBorrar.remove();
    cargarPersonaAlStorage();
}

function cargarPersonaAlStorage() {
    let personasJSON = JSON.stringify(personas);
    localStorage.setItem("personas", personasJSON);
}

function obtenerDatosUsuario() {
    varId = parseFloat(id.value);
    varNombre = nombre.value;
    varApellido = apellido.value;
    varPais = pais.value;
    varCiudad = ciudad.value;
    varEdad = parseFloat(edad.value);
    varDireccion = direccion.value;
}

function obtenerPersonasStorage() {    
    if (usuario){
        let personasJSON = localStorage.getItem("personas");
        if (personasJSON) {
            personas = JSON.parse(personasJSON);
            mostrarPersonas();
        }
    }    
}
// Funciones para el manejo del usuario
function cargarUsuario(event) {
    event.preventDefault();
    if (controlUsuario) {
        // Hay error entonces informo
        mostrarSwal("error","Ooops...","Ya hay una sesión abierta!")
    }else{
        usuario = usuarioIngresado.value;
        btnInicioSesion.reset();
        agregarUsuarioStorage();
        mostrarMensajeUsuario();        
        insertarNombreUsuario.hidden = false;    
        formularioPersona.hidden = false;
        tituloFormularioPersona.hidden = false;        
        btnCerrarSesion.hidden = false;
        contenedorPersonasMostrar.hidden = false;
        obtenerPersonasStorage();
        mostrarSwal("success",`Bienvenido ${usuario}`,"Inicio Sesión Exitoso!");
    }    
    controlUsuario = true;    
}

function fCerrarSesion() {
    usuario = "";
    mensajeUsuario.innerHTML = "Bienvenido:";    
    insertarNombreUsuario.hidden = true;
    formularioPersona.hidden = true;
    tituloFormularioPersona.hidden = true;    
    btnCerrarSesion.hidden = true;
    contenedorPersonasMostrar.hidden = true;
    controlUsuario = false;
}

function mostrarMensajeUsuario() {
    mensajeUsuario.innerHTML += ` ${usuario}`;
}

function agregarUsuarioStorage() {
    localStorage.setItem("Usuario", usuario);
}

// Funcion para mostrar mensajes
function mostrarSwal(tipo,titulo,texto) {
    Swal.fire({
        icon: tipo,
        title: titulo,
        text: texto,        
        timer: 2000,
    })
}

// Funcion para borrar el storage completo
function borrarStorage() {    
    localStorage.clear();
    personas = "";
    contenedorPersonasMostrar.innerHTML = "";    
    fCerrarSesion();    
    mostrarSwal("success","Gracias...", "Local Storage Borrado");    
}

function main() {
    inicicializarElementos();
    inicializarEventos();    
}

main();