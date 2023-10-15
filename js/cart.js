const cartProducts = document.getElementById('cartProducts');
let cost;

// Function to add items to the local storage list, trigger by onclick on the cart buttons
function addToCart(itemId) {
  let cartList = JSON.parse(localStorage.getItem("cartList")) || []

  if(!cartList.includes(itemId)) {
    cartList.push(itemId)
  }
  
  localStorage.setItem("cartList", JSON.stringify(cartList))
}

// Fetch to the local storage list for cart items
function fetchCart() {
  const cartList = JSON.parse(localStorage.getItem("cartList"))

  cartList.forEach(element => {
    fetch(PRODUCT_INFO_URL + element + EXT_TYPE)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response error');
      }
      return response.json();
    })
    .then (data => {
      showCart(data);
    })
    .catch(error => {
      console.error('Fetch error:', error);
      cartProducts.innerHTML = `
      <div class="bg-danger text-white text-center rounded p-4 m-4">
        <h5>Lo sentimos, ha ocurrido un error.</h5>
      </div>`
    })
  });
}

 fetchCart()
 

 function showCart(data) {
   const cartProducts = document.getElementById("cartProducts");
   const newRow = document.createElement("tr");

   cost = parseFloat(data.cost);

   newRow.innerHTML = ` 
     <th scope="row"><img src="${data.images[0]}" style="height: 60px; min-width: 60px;" class="img-thumbnail" alt="imagen del producto"></th>  
     <td class="text-dark">${data.name}</td>
     <td class="text-dark">${data.currency} ${data.cost}</td>
     <td class="text-dark"><input min="0" name="quantity" value="1" type="number" oninput="updateSubtotal(this, ${cost})" class="form-control form-control-sm""></td>
     <td class="text-dark"><span class="currency">${data.currency}</span> <span class="subtotal">${cost}</span></td>
     <td><button class="btn btn-danger" onclick="removeCartItem(this.parentNode.parentNode, '${data.id}')">Eliminar</button></td>
   `;

   cartProducts.appendChild(newRow); 
   updateTotal();
   modeList();
 }

 function removeCartItem(row, id) {
  const cartProducts = document.getElementById("cartProducts");
  cartProducts.removeChild(row);

  let cartList = JSON.parse(localStorage.getItem("cartList")) || []
  const index = cartList.indexOf(id);
  if (index !== -1) {
    cartList.splice(index, 1);
    localStorage.setItem("cartList", JSON.stringify(cartList));
  }

  updateTotal()
}

function updateSubtotal(input, cost) {
  const quantity = parseInt(input.value);
  const subtotal = quantity * cost;
  const subtotalElement = input.closest("tr").querySelector(".subtotal");
  subtotalElement.textContent = `${subtotal}`;

  updateTotal()
}
// the final price is a sum of pesos and dollars, if there are items from both, it remains to be corrected
function updateTotal() {
  subtotalList = document.getElementsByClassName("subtotal")
  let totalPreDelivery = 0


  for (let i = 0; i < subtotalList.length; i++) {
    const subtotalText = subtotalList[i].textContent;
    const subtotalValue = parseFloat(subtotalText.replace(/[^\d.-]/g, ""));
    totalPreDelivery += subtotalValue;
  }

  const selectedDelivery = document.querySelector('input[name="flexRadioDefault"]:checked');
  const percentageDelivery = parseFloat(selectedDelivery.getAttribute("data-percentage"));

   total = totalPreDelivery + (totalPreDelivery * (percentageDelivery / 100));

  const finalPriceContainer = document.getElementById("finalPrice")
  finalPriceContainer.textContent = total;
}
