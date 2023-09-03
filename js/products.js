//  *** INICIO AGREGADO ***
//URL de la API;
PRODUCTS_URL += localStorage.getItem('catID') + '.json'; //Agrega el ID de la categoría;

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

//Función que muestra los productos;
function showData(dataArray) { 
  nombreCategoria.innerHTML = categoria.catName;
  divProductos.innerHTML = ""

  //Listado de productos
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
async function getJson() {
  try{
    const response = await fetch(PRODUCTS_URL);
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
btnFiltrar.addEventListener("click", function() {
  const min = campoMin.value;
  const max = campoMax.value;
  const filtro = categoria.products.filter((element) => element.cost > min && element.cost < max);
  categoria.products = filtro;
  showData(categoria);
})

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

//  *** FIN AGREGADO ***