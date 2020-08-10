//Variables
const carrito = document.getElementById('carrito');
const cursos = document.getElementById('lista-cursos');
const listaCursos = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');

//Listeners
cargarEventListeners();
function cargarEventListeners(){
    //cuando se apreta agregar carrito se llama esto
    cursos.addEventListener('click', comprarCurso);

    //cuando se elimina un curso del carrito se llama 
    carrito.addEventListener('click', eliminarCurso);

    //vacia el carrito (con local storage incluido)
    vaciarCarritoBtn.addEventListener('click', vaciarCarrito);

    //cuando se carga el documento, mostrar el local storage
    document.addEventListener('DOMContentLoaded', leerLocalStorage);
}

//Functions

function comprarCurso(e){
    e.preventDefault();
    //Delegation para agregar carrito
    if(e.target.classList.contains('agregar-carrito')){
        const curso = e.target.parentElement.parentElement;
        
        //enviamos el curso seleccionado para tomar sus datos
        leerDatosCurso(curso);
    }
}

//lee los datos del curso
function leerDatosCurso(curso){
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span').textContent, 
        id: curso.querySelector('a').getAttribute('data-id')
    }

    insertarCarrito(infoCurso);
}

//muestra el curso seleccionado en el carrito (hay que armar todo el objeto en html)
function insertarCarrito(curso){
    const row = document.createElement('tr');
    row.innerHTML = `
    <td> 
        <img src ="${curso.imagen}" width = 100>
    </td>
    <td> 
        ${curso.titulo}
    </td>
    <td> 
        <${curso.precio}
    </td>
    <td> 
        <a href="#" class="borrar-curso" data-id="${curso.id}">X<a/>
    </td>
    `;
    listaCursos.appendChild(row);

    //local storage 
    guardarCursoLocalStorage(curso);
}

function eliminarCurso(e){
    e.preventDefault();
    
    let curso, 
    cursoId;
    if(e.target.classList.contains('borrar-curso')){
        e.target.parentElement.parentElement.remove();
        curso = e.target.parentElement.parentElement;
        cursoId = curso.querySelector('a').getAttribute('data-id');
    }
    eliminarCursoLocalStorage(cursoId);
}

function vaciarCarrito(){
    //metodo lento
    //listaCursos.innerHTML = '';

    //metodo rapido (recomendado)
    while(listaCursos.firstChild){
        listaCursos.removeChild(listaCursos.firstChild);
    }

    //vaciar Local Storage
    vaciarLocalStorage();

    return false;
}

function guardarCursoLocalStorage(curso){
    let cursos;

    cursos = obtenerCursosLocalStorage();
    cursos.push(curso);

    localStorage.setItem('cursos', JSON.stringify(cursos) );
}

//verifica si hay algo en el local storage. Si hay algo, retorna un array formateado, sino retorna un array vacio.
function obtenerCursosLocalStorage(){
    let cursosLS;

    //checkea si hay algo en el LS
    if(localStorage.getItem('cursos') === null){
        cursosLS = [];
    }else {
        cursosLS = JSON.parse(localStorage.getItem('cursos'));
    }
    return cursosLS;
}


function leerLocalStorage(){
    let cursosLS;

    cursosLS = obtenerCursosLocalStorage();

    cursosLS.forEach(function(curso){
    //construir el template
    const row = document.createElement('tr');
    row.innerHTML = `
    <td> 
        <img src ="${curso.imagen}" width = 100>
    </td>
    <td> 
        ${curso.titulo}
    </td>
    <td> 
        <${curso.precio}
    </td>
    <td> 
        <a href="#" class="borrar-curso" data-id="${curso.id}">X<a/>
    </td>
    `;
    listaCursos.appendChild(row);
    });
}

function eliminarCursoLocalStorage(cursoId){
    let cursosLS; 

    cursosLS = obtenerCursosLocalStorage();
 //segundo argumento del foreach es el index
    cursosLS.forEach(function(cursoLS, index){
        if(cursoLS.id === cursoId){
            cursosLS.splice(index, 1);
        }
    });
    //añade el array actual a storage
    localStorage.setItem('cursos', JSON.stringify(cursosLS));
}

function vaciarLocalStorage(){
    localStorage.clear();
}