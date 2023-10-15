//API URL;
const productInfoUrl = PRODUCTS_URL + localStorage.getItem("catID") + EXT_TYPE;

var category = [];
let originalCategory = [];
let favoritos = [];
const divProductos = document.getElementById('divProductos');
const CategoryName = document.getElementById('nombreCategoria');
const campoMin = document.getElementById("rangeFilterCountMin2");
const campoMax = document.getElementById("rangeFilterCountMax2");
const btnFiltrar = document.getElementById("rangeFilterCount2");
const btnLimpiar = document.getElementById("clearRangeFilter2");
const btnPrecioAsc = document.getElementById("sortAsc2");
const btnPrecioDesc = document.getElementById("sortDesc2");
const btnRelevancia = document.getElementById("sortByCount2");
const campoBusqueda = document.getElementById("buscador");

//Function that stores the product id and redirects to product-info.html
function redirectProduct(prodId){
  localStorage.setItem("productId", prodId);
  window.location.href = "product-info.html";
};

//Show Data

function showData(dataArray) {
  if (CategoryName) {
    CategoryName.innerHTML = category.catName + ` <img src="img/cat${localStorage.getItem("catID")}_1.png" class="catIcon p-2 pt-1">`;
  }

  if (divProductos) {
    divProductos.innerHTML = "";

    if (dataArray.products && dataArray.products.length > 0) {
      dataArray.products.forEach((prod) => {
        const isFavorito = isProductInFavoritos(prod.catId, prod.id);
        const favoritoClass = isFavorito ? "favorito" : "";

        divProductos.innerHTML +=
          `<div class="card bg-light m-3">
          <img onclick="redirectProduct('${prod.id}')" src="${prod.image}" class="card-img-top cursor-active" alt="imagen del producto">
          <div class="card-body">
            <h4 class="card-title text-center pb-2">${prod.name}</h4>
              <button type="button" class="btn btn-success">${prod.cost} ${prod.currency}</button>
            <div class="card-text">
              <p>${prod.description}</p>
              <small class="text-muted">${prod.soldCount} vendidos</small>
              <div class="btn-group mb-3 float-end" role="group" aria-label="Basic example">
                <button class="btn btn-primary favoriteBtn" id="addToFavorites_${prod.catId}-${prod.id}" onclick="toggleFavorito('${prod.catId}', '${prod.id}')">
                  <i class="fas fa-heart ${favoritoClass}"></i> <!-- Icono de corazón -->
                </button>
                <button type="button" class="btn text-white border-0 cartIcon" onclick="addToCart('${prod.id}')"><i class="fa fa-shopping-cart"></i></button>
              </div>
            </div>
          </div>
        </div>`;

         btnFavorite(prod.id)
         btnCart(prod.id)
      });
    } else {
      divProductos.innerHTML += `
        <div class="text-center text-muted">
          <h4>No se encuentran productos</h4>
        </div>`;
    }
  }
  //Modo oscuro
  modeList();
}

// Function to check if a product is in the favorites list
function isProductInFavoritos(catId, prodId) {
  const storedFavorites = JSON.parse(localStorage.getItem("favoritos")) || [];
  return storedFavorites.some(item => item.catId === catId && item.prodId === prodId);
}

//URL Request
async function getJson() {
  try{
    const response = await fetch(productInfoUrl);
    const json = await response.json();
    category = json;
    showData(category);
    originalCategory = JSON.parse(JSON.stringify(category)); // Create copy of json in category
  }
  catch (error){
    console.error('Error al solicitar los productos \n', error);
    divProductos.innerHTML = `
      <div class="bg-danger text-white text-center rounded p-4 m-4">
        <h5>Lo sentimos, ha ocurrido un error.</h5>
      </div>`
  }
}
getJson();

//Search
//Function is executed when using the input
if (campoBusqueda) { 
campoBusqueda.addEventListener("input", ()=>{
  category = JSON.parse(JSON.stringify(originalCategory));
  const busqueda = campoBusqueda.value.toLowerCase(); //Valor del input en minúsculas
  const filtrado = category.products.filter((element) => element.name.toLowerCase().includes(busqueda) || element.description.toLowerCase().includes(busqueda));
  //Filtro: si el valor del buscador está incluido en el nombre o descripción del producto
  category.products = filtrado
  showData(category)
})
}

//Price Range
if (btnFiltrar) {
btnFiltrar.addEventListener("click", function(){
  const min = parseInt(campoMin.value, 10); 
  const max = parseInt(campoMax.value, 10); 
  const productosOriginales = originalCategory.products;
  const productosFiltrados = [];
  
  for (const producto of productosOriginales) {
    if (min <= max && producto.cost >= min && producto.cost <= max) {
      productosFiltrados.push(producto);
    }
  } 
  
  category.products = productosFiltrados;
  showData(category);
});
}

//Remove
if (btnLimpiar) { 
btnLimpiar.addEventListener("click", function() { 
  campoMin.value = null;
  campoMax.value = null;
  campoBusqueda.value = null
  category = JSON.parse(JSON.stringify(originalCategory)); // Save a copy of categoryOriginal in category, so both remain in their original state.
  showData(category);
}) 
}

//Ascending price
if (btnPrecioAsc) { 
btnPrecioAsc.addEventListener("click", function(){
  const productosOrdenados = category.products.sort((a, b) => a.cost - b.cost); 
  category.products = productosOrdenados;
  showData(category);
})
}

//Descending price
if (btnPrecioDesc) { 
btnPrecioDesc.addEventListener("click", function() {
  const productosOrdenados = category.products.sort((a, b) => b.cost - a.cost); 
  category.products = productosOrdenados;
  showData(category);
})
}
//Relevance
if (btnRelevancia) { 
btnRelevancia.addEventListener("click", function() {
  const productosOrdenados = category.products.sort((a, b) => b.soldCount - a.soldCount); 
  category.products = productosOrdenados;
  showData(category);
})
}

//  Voice Search
const voiceSearchButton = document.getElementById('voiceSearch');
voiceSearchButton.addEventListener('click', startVoiceSearch);

// Defines the startVoiceSearch function to start voice search
function startVoiceSearch() {
  console.log('Iniciando búsqueda por voz...');
  const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
  recognition.lang = 'es-ES'; //  el idioma de reconocimiento

  // Start Voice Search
  recognition.start();

  // Event that starts when a result is obtained
  recognition.onresult = function(event) {
    const voiceResult = event.results[0][0].transcript;
    // Establece el valor del campo de búsqueda con el resultado de voz
    campoBusqueda.value = voiceResult;
    // Ejecuta la búsqueda
    executeSearch(voiceResult);
  };

  // Event that starts when speech recognition stops
  recognition.onend = function() {
    recognition.stop();
  };
}

// Defines the executeSearch function that performs the search based on the provided text
function executeSearch(query) {
 
  // Filter and display search results based on voice query
  category = JSON.parse(JSON.stringify(originalCategory));
  const busqueda = query.toLowerCase();
  const filtrado = category.products.filter(
    (element) =>
      element.name.toLowerCase().includes(busqueda) ||
      element.description.toLowerCase().includes(busqueda)
  );
  category.products = filtrado;
  showData(category);
}

