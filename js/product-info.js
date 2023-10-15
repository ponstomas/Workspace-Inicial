document.addEventListener("DOMContentLoaded", function () {

    //Upload product info and comments
    const productInfoUrl = PRODUCT_INFO_URL + localStorage.getItem("productId") + EXT_TYPE;
    const commentsUrl = PRODUCT_INFO_COMMENTS_URL + localStorage.getItem("productId") + EXT_TYPE;

    // Check if a product is in favorites list
    function isProductInFavoritos(catId, prodId) {
        const storedFavorites = JSON.parse(localStorage.getItem("favoritos")) || [];
        return storedFavorites.some(item => item.catId === catId && item.prodId === prodId);
    }

    async function getJson() {
      try{
        const responseProducto = await fetch(productInfoUrl);
        const jsonProducto = await responseProducto.json();
        showData(jsonProducto);
        showRelatedProducts(jsonProducto);
        const responseComentario = await fetch(commentsUrl);
        const jsonComentario = await responseComentario.json();
        comJson(jsonComentario);
      }
      catch (error){
        //Error Message
        console.error('Error al solicitar la información \n', error);
        divProductInfo.innerHTML = `
          <div class="bg-danger text-white text-center rounded p-4 m-4">
            <h5>Lo sentimos, ha ocurrido un error.</h5>
          </div>`
      }
    }
    getJson();

    //Show Product Info
    const divProductInfo = document.getElementById('divProductInfo');
    const productImgs = document.getElementById('productImgs');
    const productName = document.getElementById('productName');

    function showData(data){

        productName.innerHTML = data.name
        
        divProductInfo.innerHTML = `
        <h5 class="card-title">${data.description}</h5>
              <p class="btn btn-success">${data.cost} ${data.currency}</p>
              <p class="card-text">Vendidos: ${data.soldCount}</p>
              <p class="card-text">Categoría: ${data.category}</p>
              <div class="btn-group mb-3 float-end" role="group" aria-label="Basic example">
                <button class="btn btn-primary favoriteBtn" id="addToFavorites_${data.catId}-${data.id}" onclick="toggleFavorito('${data.catId}', '${data.id}')">
                    <i class="fas fa-heart"></i> <!-- Icono de corazón -->
                </button>
                <button type="button" class="btn btn-danger border-0 cartIcon" onclick="addToCart('${data.id}')"><i class="fa fa-shopping-cart"></i></button>
              </div>
        `

        //Change the src of the carousel images
        let imgCarousel = document.querySelectorAll('.imgCarousel');
        let i = 0;
        imgCarousel.forEach((element)=> element.src = data.images[i++]);

        //Dark Mode
        modeList()
         btnFavorite(data.id)
    }

    // Shows Stars
    function estrellas(score) {
        let stars = '';
        const maxStars = 5;
        const yellowStar = '<span class="fa fa-star checked"></span>';
        const blackStar = '<span class="fa fa-star"></span>';

        for (let i = 0; i < maxStars; i++) {
            if (i < score) {
                stars += yellowStar;
            } else {
                stars += blackStar;
            }
        }
        return stars;
    }

//  Display JSON comments
const comentarios = document.getElementById("comments");

function comJson(comments) {
// Sort comments from newest to oldest
  comments.sort((a, b) => {
    const fechaA = new Date(a.dateTime);
    const fechaB = new Date(b.dateTime);

    return fechaB - fechaA;
  });
    // -------------------------------- //
  for (let comment of comments) {
    comentarios.innerHTML += `
            <div class="commentsHechos">
                <ul class='list-group'>
                    <li class="list-group-item bg-light">
                        <div>
                            <strong>${comment.user}</strong>
                            <small class='text-muted'>   - ${comment.dateTime} -   </small>
                            ${estrellas(comment.score)}
                            <br>
                            ${comment.description}
                        </div>
                    </li>
                </ul>
            </div>
        `;
  }
  // Dark Mode
  modeList();
}


    //Add comment and save it to localstorage
function agregarComentario(opinion, fechaFormateada, actualUser, puntuacion) {
    const comentarioHTML = `
      <li class="list-group-item">
        <div>
          <strong>${actualUser}</strong>
          <small class='text-muted'> &nbsp; - ${fechaFormateada} - &nbsp; </small>
          ${estrellas(puntuacion)}
          <br>
          ${opinion}
        </div>
      </li>`;
    const productId = localStorage.getItem('productId');
    localStorage.setItem(`comentario ${productId}`, comentarioHTML);
  
    const comentariosList = document.querySelector("#comments .commentsHechos ul");
    comentariosList.insertAdjacentHTML('afterbegin', comentarioHTML);
  
    // Dark Mode
    modeList();
  }

    //The comment is obtained from localstorage and displayed on the screen
    const productId = localStorage.getItem('productId')
    const comentarioCargado = localStorage.getItem(`comentario ${productId}`);
    if(comentarioCargado != undefined) {
        comentarios.innerHTML += comentarioCargado
    }

    //Get data from Form
    const commentForm = document.getElementById('commentForm');
    
    commentForm.addEventListener('submit', e => {
        e.preventDefault();

        let puntuacion = document.querySelector('input[name="estrellas"]:checked').value;
        const opinion = document.getElementById('opinion').value;
        const actualUser = localStorage.getItem('user');
        const fechaHora = new Date();
        const opciones = { timeZone: 'America/Argentina/Buenos_Aires' };
        const fechaFormateada = fechaHora.toLocaleString('es-AR', opciones);

        agregarComentario(opinion, fechaFormateada, actualUser, puntuacion);

        commentForm.reset();
    });

});

//Related Products
    function setProdId(id){
        localStorage.setItem("productId", id);
        window.location.href = "product-info.html"; 
    }

    const relProds = document.getElementById("related-products");
    function showRelatedProducts(array) {
        relProds.innerHTML = ""; 
        array.relatedProducts.forEach((element)=>
        relProds.innerHTML += ` 
            <div class="card bg-light m-3">
                <img onclick="setProdId(${element.id})" src="${element.image}" class="card-img-top cursor-active mt-2" alt="imagen del producto">
                <div class="card-body">
                <h4 class="card-title text-center pb-2">${element.name}</h4>
                </div>
            </div>
        `)
        relProds.innerHTML += `
            <div class="card bg-light m-3">
            <img id="emercadoImg" src="img/login_light.png" class="card-img-top cursor-active mt-2" alt="ver más">
            <div class="card-body">
                <h4 class="card-title text-center pb-2"><a href="products.html" class="btn btn-primary">Ver más ${array.category}</a></h4>
            </div>
            </div>`

            //Dark Mode
            const emercadoImg = document.getElementById('emercadoImg');
            if (localStorage.getItem("mode") == "dark") {
                emercadoImg.src = 'img/login_dark.png';
            }
            else{
                emercadoImg.src = 'img/login_light.png';
            }
            lightMode.addEventListener("click", ()=>{
                emercadoImg.src = 'img/login_light.png';
            })
            darkMode.addEventListener("click", ()=>{
                emercadoImg.src = 'img/login_dark.png';
            })

    } 
