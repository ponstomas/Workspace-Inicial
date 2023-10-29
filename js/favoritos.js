if(!localStorage.getItem("favoritos")){
  localStorage.setItem("favoritos", null)
}

const divFavoritos = document.getElementById('divFavoritos');

// Function to add or remove a product from favorites
function toggleFavorito(catId, prodId) {
  const storedCatId = parseInt(localStorage.getItem("catID"), 10);
  const storedProdId = parseInt(prodId, 10);
  const button = document.getElementById(`addToFavorites_${catId}-${prodId}`);

  if (!button) {
    return;
  }

  const heartIcon = button.querySelector("i.fa-heart");
  const storedFavorites = JSON.parse(localStorage.getItem("favoritos")) || [];

  const index = storedFavorites.findIndex(item => item.catId === storedCatId && item.prodId === storedProdId);

  if (index === -1) {
    storedFavorites.push({ catId: storedCatId, prodId: storedProdId });
  } else {
    storedFavorites.splice(index, 1);
  }

  localStorage.setItem("favoritos", JSON.stringify(storedFavorites));
}

function removeFromFavoritos(catId, prodId) {
  const storedCatId = parseInt(localStorage.getItem("catID"), 10);
  const storedProdId = parseInt(prodId, 10);
  const button = document.getElementById(`removeFromFavorites_${catId}-${prodId}`);

  if (!button) {
    return;
  }

  const storedFavorites = JSON.parse(localStorage.getItem("favoritos")) || [];

  const index = storedFavorites.findIndex(item => item.catId === storedCatId && item.prodId === storedProdId);

  if (index !== -1) {

    // Remove the product from the favorites list
    storedFavorites.splice(index, 1);
    localStorage.setItem("favoritos", JSON.stringify(storedFavorites));

    loadFavorites();
  }
}

// Load favorite products from the api
async function loadFavorites() {
  const storedFavorites = JSON.parse(localStorage.getItem("favoritos")) || [];

  if (storedFavorites.length === 0) {
    showFavorites([]);
    return;
  }

  const promises = storedFavorites.map(async (favorito) => {
    const catId = favorito.catId;
    const prodId = favorito.prodId;
    const categoryUrl = `https://japceibal.github.io/emercado-api/cats_products/${catId}.json`;

    try {
      const categoryResponse = await fetch(categoryUrl);
      const categoryData = await categoryResponse.json();
      const favoriteProduct = categoryData.products.find((prod) => prod.id === parseInt(prodId)); // Convert prodId to number

      if (favoriteProduct) {
        return favoriteProduct;
      } else {
        console.log(`No se encontró el producto favorito con id ${prodId} en la categoría con catId ${catId}.`);
      }
    } catch (error) {
      console.error(`Error al cargar la categoría con catId ${catId}: ${error}`);
    }
  });

  Promise.all(promises)
    .then(favoriteProducts => {
      favoriteProducts = favoriteProducts.filter(product => product);
      showFavorites(favoriteProducts);
    })
    .catch(error => {
      console.error('Error al cargar productos favoritos:', error);
    });
}

function showFavorites(favoriteProducts) { // Show favorites 
  if (divFavoritos) {
    divFavoritos.innerHTML = "";

    if (favoriteProducts.length > 0) {
      favoriteProducts.forEach((prod) => {
        divFavoritos.innerHTML +=
          `<div class="card bg-light m-3">
          <img onclick="redirectProduct('${prod.id}')" src="${prod.image}" class="card-img-top cursor-active" alt="imagen del producto">
          <div class="card-body">
            <h4 class="card-title text-center pb-2">${prod.name}</h4>
              <button type="button" class="btn btn-success">${prod.cost} ${prod.currency}</button>
            <div class="card-text">
              <p>${prod.description}</p>
              <small class="text-muted">${prod.soldCount} vendidos</small>
                <button class="btn btn-danger float-end" id="removeFromFavorites_${prod.catId}-${prod.id}" onclick="removeFromFavoritos('${prod.catId}', '${prod.id}')">
                    Eliminar
                </button>
            </div>
          </div>
        </div>`;
      });
    } else {
      divFavoritos.innerHTML += `
      <hr>
      <div class="text-center text-muted">
      <h4>No tienes productos favoritos.</h4>
      <p>¿Quieres agregar productos favoritos? <a href="categories.html">Explora productos</a></p>
    </div>`;
    }
  }
  modeList();
}


loadFavorites();
