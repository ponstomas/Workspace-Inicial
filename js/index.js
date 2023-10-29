document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("autos").addEventListener("click", function() {
        localStorage.setItem("catID", 101);
        window.location = "products.html"
    });
    document.getElementById("juguetes").addEventListener("click", function() {
        localStorage.setItem("catID", 102);
        window.location = "products.html"
    });
    document.getElementById("muebles").addEventListener("click", function() {
        localStorage.setItem("catID", 103);
        window.location = "products.html"
    });
});

//Dark Mode
var headerImg = document.querySelector('.jumbotron');

var lightMode = document.getElementById('lightMode');

lightMode.addEventListener("click", ()=>{
  headerImg.style.backgroundImage = "url('img/cover_back_light.png')";
})

var darkMode = document.getElementById('darkMode');

darkMode.addEventListener("click", ()=>{
  headerImg.style.backgroundImage = "url('img/cover_back_dark.png')";
})

if (localStorage.getItem("mode") == "dark") {
    headerImg.style.backgroundImage = "url('img/cover_back_dark.png')";
}
else{
    headerImg.style.backgroundImage = "url('img/cover_back_light.png')";
}


//Responsive Jumbotron

var headerImgResponsive = document.querySelector('.jumbotron-responsive');


lightMode.addEventListener("click", ()=>{
  headerImgResponsive.style.backgroundImage = "url('img/cover_back_light_responsive.png')";    
})

darkMode.addEventListener("click", ()=>{
  headerImgResponsive.style.backgroundImage = "url('img/cover_back_dark_responsive.png')";       
})

if (localStorage.getItem("mode") == "dark") {
    headerImgResponsive.style.backgroundImage = "url('img/cover_back_dark_responsive.png')";      
}
else{
    headerImgResponsive.style.backgroundImage = "url('img/cover_back_light_responsive.png')";     
}

// Skeleton Loading

document.addEventListener("DOMContentLoaded", function() {
  var preloader = document.getElementById('preloader');
  preloader.style.opacity = '0';
  preloader.style.visibility = 'hidden';
});
