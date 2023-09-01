//  *** INICIO AGREGADO ***


//URL de la API;
let DATA_URL = "https://japceibal.github.io/emercado-api/cats_products/";
DATA_URL += localStorage.catID + '.json'; //Le agrega la ID de la categoría para tomar los productos de ese json. La ID la toma de categories.js línea 40;

var categoria = [];
const divProductos = document.getElementById('divProductos');
const subtitProductos = document.getElementById('subtitProductos');
const campoMin = document.getElementById("rangeFilterCountMin2");
const campoMax = document.getElementById("rangeFilterCountMax2");
const btnFiltrar = document.getElementById("rangeFilterCount2");
const btnLimpiar = document.getElementById("clearRangeFilter2");
const btnPrecioAsc = document.getElementById("sortAsc2");
const btnPrecioDesc = document.getElementById("sortDesc2");
const btnRelevancia = document.getElementById("sortByCount2");
const campoBusqueda = document.getElementById("buscador")


//Función que muestra los productos;
function showData(dataArray) { 
  divProductos.innerHTML = ""

  //El for recorre todos los productos
  dataArray.products.forEach((prod)=>{
    divProductos.innerHTML +=
      `<div class="list-group-item list-group-item-action cursor-active">
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
}

//Petición a la URL
async function getJson () {
  const response = await fetch(DATA_URL);
  const json = await response.json();
  categoria = json;
  categoriaOriginal = JSON.parse(JSON.stringify(categoria)) // Crea una copia completa del json en categoria
  subtitProductos.innerHTML = categoria.catName; //Esto es un detalle, agrega el nombre de la categoría al subtítulo;
  showData(categoria);
}
getJson();

campoBusqueda.addEventListener("input", ()=>{
  categoria = JSON.parse(JSON.stringify(categoriaOriginal));
  let busqueda = document.getElementById('buscador').value.toLowerCase();
  let filtrado = categoria.products.filter((prb) => prb.name.toLowerCase().includes(busqueda) || prb.description.toLowerCase().includes(busqueda))
  categoria.products = filtrado
  showData(categoria)
})
btnFiltrar.addEventListener("click", function() {
  const min = campoMin.value;
  const max = campoMax.value;
  const filtro = categoria.products.filter((element) => element.cost > min && element.cost < max);
  categoria.products = filtro;
  showData(categoria);
})

btnLimpiar.addEventListener("click", function() { 
  campoMin.value = null;
  campoMax.value = null;
  campoBusqueda.value = null
  categoria = JSON.parse(JSON.stringify(categoriaOriginal)); // Guarda en categoria una copia de categoriaOriginal, asi quedan ambas en su estado original.
  showData(categoria);
}) 

btnPrecioAsc.addEventListener("click", function(){
  const productosOrdenados = categoria.products.sort((a, b) => a.cost - b.cost); 
  categoria.products = productosOrdenados;
  showData(categoria);
})

btnPrecioDesc.addEventListener("click", function() {
  const productosOrdenados = categoria.products.sort((a, b) => b.cost - a.cost); 
  categoria.products = productosOrdenados;
  showData(categoria);
})

btnRelevancia.addEventListener("click", function() {
  const productosOrdenados = categoria.products.sort((a, b) => b.soldCount - a.soldCount); 
  categoria.products = productosOrdenados;
  showData(categoria);
})

/*
1- Recibe la ID de la categoría en la que hacemos click en categories.html (declarada en categories.js) y toma la información de ID.json, 101.json en el caso de Autos, por ejemplo.
2- Crea un div con cada producto de la categoría y su información.
3- Detalle: en el subtítulo muestra "Verás aquí todos los productos de la categoría x" tomando del json el nombre de la categoría.
*/

//  *** FIN AGREGADO ***