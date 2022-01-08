/* -Variedad de constantes para el proyecto- */
const alert = document.querySelector('.alert');
const form = document.querySelector('.grocery-form');
const grocery = document.getElementById('grocery');
const submitBtn = document.querySelector('.submit-btn')
const container = document.querySelector('.grocery-container')
const list = document.querySelector('.grocery-list')
const clearBtn = document.querySelector('.clear-btn')

/* Esto es para el boton de "editar" */
let editElement;
let editFlag = false;
let editID= "";
/* EVENT LISTENERS*/
//ingresar articulo
form.addEventListener('submit',addItem)
//borrar articulos
clearBtn.addEventListener('click',clearItems)

//Esto hara que cuando recargues la pagina y tenias objetos en la lista, no desaparezcan
window.addEventListener("DOMContentLoaded", setupItems);

/* FUNCIONES */
function addItem(e){
    e.preventDefault();
    const value = grocery.value;
    const id = new Date().getTime().toString();
    if(value !=='' && editFlag === false){
        createListItem(id,value)
        displayAlert("Articulo ingresado a la lista", 'success');
        container.classList.add("show-container");
        //añadir a LocalStorage
        addToLocalStorage(id,value);
        //Regresar a Default
        setBackToDefault()
    }
    else if(value !== '' || editFlag === true){
        editElement.innerHTML = value;
        displayAlert("valor cambiado", "success");
        //editar local storage
        editLocalStorage(editID,value);
        setBackToDefault();
    }
    else{
        displayAlert("Por favor ingrese un articulo", "danger"); /* El "danger" es para que el texto aparezca con ese fondo rojo */
    }
}
/* Display de alerta */
function displayAlert(text,action){
    alert.textContent = text;  /* Si le da al boton agregar aqui no se ingresa nada ya que no hay nada que ingresar */
    alert.classList.add(`alert-${action}`);
    /* Eliminaremos la alerta despues de un tiempo */
    setTimeout(function(){
        alert.textContent = '';  
    alert.classList.remove(`alert-${action}`);
    },1000)
}
//Borrar articulos
function clearItems() {
    const items = document.querySelectorAll(".grocery-item");
    if (items.length > 0) {
    items.forEach(function (item) {
        list.removeChild(item);
        });
    }
    //Eliminamos el "borrar articulos" despues de eliminar los articulos
    container.classList.remove("show-container");
    displayAlert("empty list", "danger");
    setBackToDefault();
    localStorage.removeItem('list');
    } 

//funcion borrar articulo individual
function deleteItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    list.removeChild(element);
    if (list.children.length === 0) {
        container.classList.remove("show-container");
      }
      displayAlert("Articulo eliminado", "danger");
      setBackToDefault();
      //Eliminamos de "LOCALSTORAGE" ya que ya no estara el valor en la lista
      removeFromLocalStorage(id);
}
//funcion editar articulo individual
function editItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    // editar articulo
    editElement = e.currentTarget.parentElement.previousElementSibling;

    grocery.value = editElement.innerHTML
    editFlag = true;
    editID = element.dataset.id;
    submitBtn.textContent = "editar";
}
//Regresar a Default
function setBackToDefault(){
    grocery.value = "";
    editFlag = false;
    editID = "";
    submitBtn.textContent = "submit";
}


//LOCAL STORAGE //
function addToLocalStorage(id,value){
    const grocery = {id, value};
    let items = getLocalStorage();
    console.log(items);
    items.push(grocery);
    localStorage.setItem("list",JSON.stringify(items));
    /* console.log("añadido a localStorage"); */
}
function removeFromLocalStorage(id){
    let items = getLocalStorage();

    items = items.filter(function(item){
        if(item.id !==id){
            return item;
        }
    });
    localStorage.setItem("list",JSON.stringify(items));
}
function editLocalStorage(id,value){
    let items = getLocalStorage();
    items = items.map(function(item){
        if(item.id === id){
            item.value = value;
        }
        return item;
    });
    localStorage.setItem("list",JSON.stringify(items));
}
function getLocalStorage(){
    return localStorage.getItem("list")
    ?JSON.parse(localStorage.getItem("list"))
    : [];
}

function setupItems(){
    let items = getLocalStorage();
    if(items.lenght > 0){
    items.forEach(function(){
        createListItem(item.id,item.value)
    })
    container.classList.add('show-container')
    }
}

function createListItem(id,value){
    /* Lo que hacemos aqui es que si hay algo para ingresar se agregue a la lista */
    const element = document.createElement('article');
    /* Añadir clase */
    element.classList.add('grocery-item');
    const attr = document.createAttribute('data-id');
    attr.value = id;
    element.setAttributeNode(attr);
    element.innerHTML = `<p class="title">${value}</p>
    <div class="btn-container">
        <button  type="button" class="edit-btn">
            <i class="fas fa-edit"></i>
        </button>
        <button  type="button" class="delete-btn">
            <i class="fas fa-trash"></i>
        </button>
    </div>`;
    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);
    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem);
    //append child
    list.appendChild(element);
}
