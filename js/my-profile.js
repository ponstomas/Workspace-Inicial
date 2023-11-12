const inputFirstname = document.getElementById("firstname");
const inputSecondname = document.getElementById("secondname");
const inputSurname = document.getElementById("surname");
const inputSecondsurname = document.getElementById("secondsurname");
const inputTelephone = document.getElementById("telephone");
const inputEmail = document.getElementById("email");
const form = document.getElementById("changeProfile");
const profilePic = document.getElementById("profilePic");
const picture = document.getElementById("picture");
const pictureSrc = document.getElementById("pictureSrc");

document.getElementById("user").innerHTML = localStorage.getItem("user");

let userInfo = JSON.parse(
  localStorage.getItem("userInfo-" + localStorage.getItem("user"))
);

// Guarda la información del formulario en localStorage
form.addEventListener("submit", () => {
  userInfo = {
    firstname: inputFirstname.value,
    secondname: inputSecondname.value,
    surname: inputSurname.value,
    secondsurname: inputSecondsurname.value,
    telephone: inputTelephone.value,
    email: inputEmail.value,
    picture: picture.src,
  };
  localStorage.setItem(
    "userInfo-" + localStorage.getItem("user"),
    JSON.stringify(userInfo)
  );
});

// Muestra los datos de localStorage en los input
if (localStorage.getItem("userInfo-" + localStorage.getItem("user"))) {
  inputFirstname.value = userInfo.firstname;
  inputSecondname.value = userInfo.secondname;
  inputSurname.value = userInfo.surname;
  inputSecondsurname.value = userInfo.secondsurname;
  inputTelephone.value = userInfo.telephone;
  inputEmail.value = userInfo.email;
  picture.src = userInfo.picture;
}
// Si no hay datos guardados solo muestra el email
else {
  inputEmail.value = localStorage.getItem("user");
}

// Foto de perfil
profilePic.addEventListener("change", () => {
  let file = profilePic.files[0];
  // Lee el archivo y obtiene su URL
  const fr = new FileReader();
  console.log(fr.readAsDataURL(file));

  fr.addEventListener("load", () => {
    if (localStorage.getItem("userInfo-" + localStorage.getItem("user"))) {
      userInfo.picture = fr.result;
      picture.src = userInfo.picture;
    } else {
      picture.src = fr.result;
    }
  });
});

/*
Se guarda una lista de favoritos y carrito por cada usuario, agregando el correo del login al nombre de la variable guardada
*/
