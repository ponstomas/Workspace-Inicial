let user = document.getElementById("user");
let contrasena = document.getElementById("contrasena");
let loginError = document.getElementById("loginError");
let errorMessage = "";

document.addEventListener("input", () => {
  //Show that user is valid
  if (!emailValido(user.value)) {
    user.classList.add("is-invalid");
    user.classList.remove("is-valid");
  } else {
    user.classList.add("is-valid");
    user.classList.remove("is-invalid");
  }
  //Show that password is valid
  if (!contrasenaValida(contrasena.value)) {
    contrasena.classList.add("is-invalid");
    contrasena.classList.remove("is-valid");
  } else {
    contrasena.classList.add("is-valid");
    contrasena.classList.remove("is-invalid");
  }
});

//Save User
function submitForm(event) {
  event.preventDefault();

  if (user.value !== "" && contrasena.value !== "") {
    if (emailValido(user.value) && contrasenaValida(contrasena.value)) {
      localStorage.setItem("user", user.value);
      window.location.href = "index.html";
    }

    //Error Message
    else {
      errorMessage = "Datos de inicio de sesión no válidos";
    }
  } else {
    errorMessage = "<li class='small'>Usuario y contraseña requeridos</li>";
  }

  if (!emailValido(user.value)) {
    errorMessage +=
      "<li class='small'>Formato de correo electrónico incorrecto</li>";
  }

  if (contrasena.value.length < 8) {
    errorMessage +=
      "<li class='small'>La contraseña debe tener al menos 8 caracteres</li>";
  }

  if (!/[A-Za-z]/.test(contrasena.value)) {
    errorMessage += "<li class='small'>Debe incluir al menos una letra</li>";
  }

  if (!/\d/.test(contrasena.value)) {
    errorMessage += "<li class='small'>Debe incluir al menos un número</li>";
  }

  loginError.innerHTML = "<ul>" + errorMessage + "</ul>";
}

//Show Password
function mostrarPassword() {
  var show_eye = document.getElementById("show_eye");
  var hide_eye = document.getElementById("hide_eye");

  hide_eye.classList.remove("d-none");
  if (contrasena.type === "password") {
    contrasena.type = "text";
    show_eye.style.display = "none";
    hide_eye.style.display = "block";
  } else {
    contrasena.type = "password";
    show_eye.style.display = "block";
    hide_eye.style.display = "none";
  }
}

function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


function contrasenaValida(password) {
  return /\w*\d/.test(password) && password.length >= 8;
}

var lightElements = document.querySelectorAll(".bg-white");
var darkElements = document.querySelectorAll(".bg-dark");
var loginImg = document.querySelector("#loginImg");

//Dark
if (localStorage.getItem("mode") == "dark") {
  lightElements.forEach((element) => {
    element.classList.remove("bg-white", "text-dark");
    element.classList.add("bg-dark", "text-light");
  });
  //Background
  document.querySelector("body").style.backgroundColor = "#0d1117";
  //Image
  loginImg.src = "img/login_dark.png";
}

//Light
else {
  darkElements.forEach((element) => {
    element.classList.remove("bg-dark", "text-light");
    element.classList.add("bg-light", "text-dark");
  });
  //Background
  document.querySelector("body").style.backgroundColor = "#e2e2e2";
  //Image
  loginImg.src = "img/login_light.png";
}
