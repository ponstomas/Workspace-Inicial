//URL de la API;
const productInfoUrl = PRODUCTS_URL + localStorage.getItem("catID") + EXT_TYPE;

var categoria = [];
const divProductos = document.getElementById('divProductos');
const nombreCategoria = document.getElementById('nombreCategoria');
const campoMin = document.getElementById("rangeFilterCountMin2");
const campoMax = document.getElementById("rangeFilterCountMax2");
const btnFiltrar = document.getElementById("rangeFilterCount2");
const btnLimpiar = document.getElementById("clearRangeFilter2");
const btnPrecioAsc = document.getElementById("sortAsc2");
const btnPrecioDesc = document.getElementById("sortDesc2");
const btnRelevancia = document.getElementById("sortByCount2");
const campoBusqueda = document.getElementById("buscador")

//Funcion que almacena el id del producto y redirecciona a product-info.html
function redirectProduct(prodId){
  localStorage.setItem("productId", prodId);
  window.location.href = "product-info.html";
};

//Función que muestra los productos;
function showData(dataArray) { 
  nombreCategoria.innerHTML = categoria.catName + ` <img src="img/cat${localStorage.getItem("catID")}_1.png" class="catIcon p-2 pt-1">`;
  divProductos.innerHTML = ""

  //Listado de productos
  dataArray.products.forEach((prod)=>{
    divProductos.innerHTML +=
      `<div class="list-group-item list-group-item-action cursor-active bg-light"
        onclick="redirectProduct('${prod.id}')"
      >
        <div class="row">
          <div class="col-3">
            <img src="${prod.image}" class="img-thumbnail">
          </div>
          <div class="col">
            <div class="d-flex w-100 justify-content-between">
                <h4 class="mb-1">${prod.name}</h4>
                <small class="text-muted">${prod.soldCount} vendidos</small>
            </div>
            <h5 class="mb-1">${prod.cost} ${prod.currency}</h5>
            <p class="mb-1">${prod.description}</p>
          </div>
        </div>
      </div>
      `
  })
  //Mensaje si no se encuentran productos
    if (dataArray.products.length === 0) {
    divProductos.innerHTML +=
      `<div class="text-center text-muted">
      <h4>No se encuentran productos</h4></div>`
  }

  //Modo oscuro
    modeListado()
}

//Petición a la URL
async function getJson() {
  try{
    const response = await fetch(productInfoUrl);
    const json = await response.json();
    categoria = json;
    showData(categoria);
    categoriaOriginal = JSON.parse(JSON.stringify(categoria)); // Crea una copia completa del json en categoria
  }
  catch (error){
    //Mensaje de error
    console.error('Error al solicitar los productos \n', error);
    divProductos.innerHTML = `
      <div class="bg-danger text-white text-center rounded p-4 m-4">
        <h5>Lo sentimos, ha ocurrido un error.</h5>
      </div>`
  }
}
getJson();

//Buscador
//La función se ejecuta al utilizar el input
campoBusqueda.addEventListener("input", ()=>{
  categoria = JSON.parse(JSON.stringify(categoriaOriginal));
  const busqueda = campoBusqueda.value.toLowerCase(); //Valor del input en minúsculas
  const filtrado = categoria.products.filter((element) => element.name.toLowerCase().includes(busqueda) || element.description.toLowerCase().includes(busqueda));
  //Filtro: si el valor del buscador está incluido en el nombre o descripción del producto
  categoria.products = filtrado
  showData(categoria)
})

//Rango de precio
btnFiltrar.addEventListener("click", function(){
  const min = parseInt(campoMin.value, 10); 
  const max = parseInt(campoMax.value, 10); 
  const productosOriginales = categoriaOriginal.products;
  const productosFiltrados = [];
  
  for (const producto of productosOriginales) {
    if (min <= max && producto.cost >= min && producto.cost <= max) {
      productosFiltrados.push(producto);
    }
  } 
  
  categoria.products = productosFiltrados;
  showData(categoria);
});



//Limpiar
btnLimpiar.addEventListener("click", function() { 
  campoMin.value = null;
  campoMax.value = null;
  campoBusqueda.value = null
  categoria = JSON.parse(JSON.stringify(categoriaOriginal)); // Guarda en categoria una copia de categoriaOriginal, asi quedan ambas en su estado original.
  showData(categoria);
}) 

//Precio ascendente
btnPrecioAsc.addEventListener("click", function(){
  const productosOrdenados = categoria.products.sort((a, b) => a.cost - b.cost); 
  categoria.products = productosOrdenados;
  showData(categoria);
})

//Precio descendente
btnPrecioDesc.addEventListener("click", function() {
  const productosOrdenados = categoria.products.sort((a, b) => b.cost - a.cost); 
  categoria.products = productosOrdenados;
  showData(categoria);
})

//Relevancia
btnRelevancia.addEventListener("click", function() {
  const productosOrdenados = categoria.products.sort((a, b) => b.soldCount - a.soldCount); 
  categoria.products = productosOrdenados;
  showData(categoria);
})

//  BUSQUEDA POR VOZ
const voiceSearchButton = document.getElementById('voiceSearch');
voiceSearchButton.addEventListener('click', startVoiceSearch);

// Define la función startVoiceSearch para iniciar la búsqueda por voz
function startVoiceSearch() {
  console.log('Iniciando búsqueda por voz...');
  const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
  recognition.lang = 'es-ES'; //  el idioma de reconocimiento

  // Inicia el reconocimiento de voz
  recognition.start();

  // Evento que se dispara cuando se obtiene un resultado
  recognition.onresult = function(event) {
    const voiceResult = event.results[0][0].transcript;
    // Establece el valor del campo de búsqueda con el resultado de voz
    campoBusqueda.value = voiceResult;
    // Ejecuta la búsqueda
    executeSearch(voiceResult);
  };

  // Evento que se dispara cuando se detiene el reconocimiento de voz
  recognition.onend = function() {
    recognition.stop();
  };
}

// Define la función executeSearch que realiza la búsqueda basada en el texto proporcionado
function executeSearch(query) {
 
  // Filtra y muestra los resultados de búsqueda según la consulta de voz
  categoria = JSON.parse(JSON.stringify(categoriaOriginal));
  const busqueda = query.toLowerCase();
  const filtrado = categoria.products.filter(
    (element) =>
      element.name.toLowerCase().includes(busqueda) ||
      element.description.toLowerCase().includes(busqueda)
  );
  categoria.products = filtrado;
  showData(categoria);
}

