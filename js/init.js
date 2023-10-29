const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

let showSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "none";
}

//Save the user in localStorage and show it in the menu
document.addEventListener("DOMContentLoaded", function () {
  var user = localStorage.getItem("user");
  if (user === null) {
    window.location.href = "login.html";
  } else {
    document.getElementById("emailButton").innerHTML = localStorage.getItem("user");
  }
});

//Delete user from localStorage
const logoutSession = document.getElementById('logoutSession');
logoutSession.addEventListener("click", () => {
  localStorage.removeItem("user");
})


let getJSONData = function (url) {
  let result = {};
  showSpinner();
  return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    })
    .then(function (response) {
      result.status = 'ok';
      result.data = response;
      hideSpinner();
      return result;
    })
    .catch(function (error) {
      result.status = 'error';
      result.data = error;
      hideSpinner();
      return result;
    });
}

//Dark Mode

//Light Button
var lightMode = document.getElementById('lightMode');

lightMode.addEventListener("click", () => {
  localStorage.setItem("mode", "light");
  changeMode()
})

//Dark Button
var darkMode = document.getElementById('darkMode');

darkMode.addEventListener("click", () => {
  localStorage.setItem("mode", "dark");
  changeMode()
})

function changeMode() {
  //Elements
  var lightElementsBg = document.querySelectorAll(".bg-white, .bg-light, .btn-light");
  var darkElementsBg = document.querySelectorAll(".bg-dark, .btn-dark");
  var lightElementsText = document.querySelectorAll(".text-dark");
  var darkElementsText = document.querySelectorAll(".text-light, .text-white");
  var navElement = document.getElementById("mainNav");            
  var navLinks = navElement.querySelectorAll("a");                
  var dropdownMenu = document.querySelectorAll(".dropdown-menu"); 
  let btnPrimary = document.querySelectorAll('.btn-primary');
  let btnDanger = document.querySelectorAll('.btn-danger');

  //Dark
  if (localStorage.getItem("mode") == "dark") {
    lightElementsBg.forEach((element) => {
      element.classList.remove('bg-light', 'bg-white', 'btn-light');
      element.classList.add('bg-dark', 'text-light');
    });
    lightElementsText.forEach((element) => {
      element.classList.remove('text-dark');
      element.classList.add('text-white');
    });
    navElement.style.filter = "saturate(.8)"
    dropdownMenu.forEach(menu => { 
        menu.classList.add('dropdown-menu-dark');
        menu.style.backgroundColor = "#ef8c2b";
    });
    document.getElementById('emailButton').style.color = "#161616";  
/**/navLinks.forEach(link => { 
      link.style.color = "#161616";
    });
    btnPrimary.forEach((element)=>{
      element.style.filter = "saturate(.7)"
    })
    btnDanger.forEach((element)=>{
      element.style.filter = "saturate(.7)"
    })
    //Background
    document.querySelector('body').style.backgroundColor = "#0d1117";
    //Color Button
    lightMode.classList.remove('btn-primary');
    lightMode.classList.add('text-warning');
    darkMode.classList.add('btn-primary');
    darkMode.classList.remove('text-warning');
  }

  //Light
  else {
    darkElementsBg.forEach((element) => {
      element.classList.remove('bg-dark', 'btn-dark');
      element.classList.add('bg-light', 'text-dark');   
    });
    darkElementsText.forEach((element) => {
      element.classList.remove('text-white', 'text-light');
      element.classList.add('text-dark');
    });
    navElement.style.filter = "saturate(1)"
    dropdownMenu.forEach(menu => {  
        menu.classList.remove('dropdown-menu-dark');
        menu.style.backgroundColor = "#ef8c2b";
    });
    document.getElementById('emailButton').style.color = "#282828";
    navLinks.forEach(link => {  
      link.style.color = "#282828";
    });
    //Background
    document.querySelector('body').style.backgroundColor = "#e2e2e2";
    //Color botón
    lightMode.classList.add('btn-primary');
    darkMode.classList.remove('btn-primary');
    darkMode.classList.add('text-warning');
    lightMode.classList.remove('text-warning');
    btnPrimary.forEach((element)=>{
      element.style.filter = "saturate(1)"
    })
    btnDanger.forEach((element)=>{
      element.style.filter = "saturate(1)"
    })
  }
}

changeMode()

function modeList() {
  let categoryItem = document.querySelectorAll('.list-group-item, .card');
  if (localStorage.getItem("mode") == "dark") {
    categoryItem.forEach((element) => {
      element.classList.add('bg-dark', 'text-white');
      element.classList.remove('bg-light', 'text-dark')
    })
  }
  else {
    categoryItem.forEach((element) => {
      element.classList.remove('bg-dark', 'text-white');
      element.classList.add('bg-light', 'text-dark')
    })
  }
}

//Favorites Button
function btnFavorite(prodId) {
  const favoriteElement = localStorage.getItem('favoritos')
  if (favoriteElement) {
    const heartIcon = document.querySelectorAll('.favoriteBtn');
    heartIcon.forEach((element) => {
      element.addEventListener('click', () => {
        element.classList.toggle('text-danger')
      })
      if (favoriteElement.includes(prodId)) {
        element.classList.add('text-danger')
      }
    })
  }
}
//Chart Button
function btnCart(prodId) {
  const cartElement = localStorage.getItem('cartList')
  if (cartElement) {
    const cartIcon = document.querySelectorAll('.cartIcon');
    cartIcon.forEach((element) => {
      element.addEventListener('click', () => {
        element.classList.add('text-danger');
        element.classList.remove('text-white');
      })
      if (cartElement.includes(prodId)) {
        element.classList.add('text-danger');
        element.classList.remove('text-white');
      }
    })
  }
}