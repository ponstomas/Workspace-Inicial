const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

//Guarda el usuario en localStorage y lo muestra en el menú
document.addEventListener("DOMContentLoaded", function(){
  var usuario = localStorage.getItem("usuario");
  if (usuario === null){
      window.location.href="login.html";
  } else {
      document.getElementById("emailButton").innerHTML = localStorage.getItem("usuario");
  }
});

//Borra el usuario del localStorage
const cerrarSesion = document.getElementById('cerrarSesion');
cerrarSesion.addEventListener("click", ()=>{
  localStorage.removeItem("usuario");
})


let getJSONData = function(url){
    let result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}

/*  Modo oscuro  */

//Botón light
var lightMode = document.getElementById('lightMode');

lightMode.addEventListener("click", ()=>{
  localStorage.setItem("mode", "light");
  changeMode()
})

//Botón dark
var darkMode = document.getElementById('darkMode');

darkMode.addEventListener("click", ()=>{
  localStorage.setItem("mode", "dark");
  changeMode()
})

function changeMode() {
  //Elementos
  var lightElementsBg = document.querySelectorAll(".bg-white, .bg-light, .btn-light");
  var darkElementsBg = document.querySelectorAll(".bg-dark, .btn-dark");
  var lightElementsText = document.querySelectorAll(".text-dark");
  var darkElementsText = document.querySelectorAll(".text-light, .text-white");

  //Dark
  if (localStorage.getItem("mode") == "dark") {
  lightElementsBg.forEach((element)=>{
    element.classList.remove('bg-light', 'bg-white', 'btn-light');
    element.classList.add('bg-dark', 'text-light');
  })
  lightElementsText.forEach((element)=>{
    element.classList.remove('text-dark');
    element.classList.add('text-white');
  })
  //Background
  document.querySelector('body').style.backgroundColor = "#0d1117";
  //Color botón
  lightMode.classList.remove('btn-primary');
  darkMode.classList.add('btn-primary');
  }

  //Light
  else {
  darkElementsBg.forEach((element)=>{
    element.classList.remove('bg-dark', 'btn-dark');
    element.classList.add('bg-light', 'text-dark');
  })
  darkElementsText.forEach((element)=>{
    element.classList.remove('text-white', 'text-light');
    element.classList.add('text-dark');
  })
  //Background
  document.querySelector('body').style.backgroundColor = "#e2e2e2";
  //Color botón
  lightMode.classList.add('btn-primary');
  darkMode.classList.remove('btn-primary');
  }
}

changeMode()

function modeListado() {
    let categoryItem = document.querySelectorAll('.list-group-item');
    if (localStorage.getItem("mode") == "dark"){
        categoryItem.forEach((element)=>{
            element.classList.add('bg-dark', 'text-white');
            element.classList.remove('bg-light', 'text-dark')
        })
    }
    else{
        categoryItem.forEach((element)=>{
            element.classList.remove('bg-dark', 'text-white');
            element.classList.add('bg-light', 'text-dark')
        })
    }
}