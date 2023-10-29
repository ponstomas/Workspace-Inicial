const cartProducts = document.getElementById('cartProducts');
const exchangeRate = 0.04;

//Adds an item to the shopping cart by storing its ID in the cart list stored in the browser's local storage.
function addToCart(itemId) {
  const cartList = JSON.parse(localStorage.getItem("cartList")) || [];
  if (!cartList.includes(itemId)) {
    cartList.push(itemId);
    localStorage.setItem("cartList", JSON.stringify(cartList));
  }
}

async function fetchCart() {
  const cartList = JSON.parse(localStorage.getItem("cartList")) || [];
  try {
    for (const element of cartList) {
      const response = await fetch(`${PRODUCT_INFO_URL}${element}${EXT_TYPE}`);
      if (!response.ok) {
        throw new Error('Error de respuesta de la red');
      }
      const data = await response.json();
      showCart(data);
    }
  } catch (error) {
    console.error('Error de fetch:', error);
    cartProducts.innerHTML = `
      <div class="bg-danger text-white text-center rounded p-4 m-4">
        <h5>Lo sentimos, ha ocurrido un error.</h5>
      </div>`;
  }
}

if(localStorage.getItem("cartList") !== null && cartProducts){
  fetchCart()
}

//Displays and updates product details, including the subtotal, in a table row, considering the currency exchange rate for UYU.
function showCart(data) {
  const cost = (data.currency === "UYU") ? parseFloat(data.cost) * exchangeRate : parseFloat(data.cost);
  const subtotal = cost.toFixed(0);
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
    <th scope="row"><img src="${data.images[0]}" style="height: 60px; min-width: 60px;" class="img-thumbnail" alt="imagen del producto"></th>
    <td>${data.name}</td>
    <td>${data.currency} ${data.cost}</td>
    <td><input min="0" name="quantity" id="qForm" value="1" type="number" oninput="updateSubtotal(this, ${cost})" class="form-control form-control-sm"></td>
    <td><span class="currency">USD</span> <span class="subtotal">${subtotal}</span></td>
    <td><button class="btn btn-danger" onclick="removeCartItem(this.parentNode.parentNode, '${data.id}')">Eliminar</button></td>
  `;
  cartProducts.appendChild(newRow);
  updateGeneralSubtotal();
  updateTotal();
  modeList();
}

//Removes a product's row from the cart, updates the cart list in local storage, and refreshes the general subtotal, delivery cost, and total.
function removeCartItem(row, id) {
  cartProducts.removeChild(row);
  const cartList = JSON.parse(localStorage.getItem("cartList")) || [];
  const index = cartList.indexOf(id);
  if (index !== -1) {
    cartList.splice(index, 1);
    localStorage.setItem("cartList", JSON.stringify(cartList));
  }
  updateGeneralSubtotal();
  updateDeliveryCost();
  updateTotal();
}

//Recalculates the subtotal, and updates the overall subtotal, delivery cost, and total.
function updateSubtotal(input, cost) {
  const quantity = parseInt(input.value);
  const subtotal = Math.round(quantity * cost);
  const subtotalElement = input.closest("tr").querySelector(".subtotal");
  subtotalElement.textContent = `${subtotal}`;
  updateGeneralSubtotal();
  updateDeliveryCost();
  updateTotal();
}

//Calculates the delivery cost basado on the general subtotal, updates the displayed delivery cost, and also triggers the update of the total.
function updateDeliveryCost() {
  const subtotalGeneral = parseFloat(document.getElementById("subtotalGen").textContent.replace(/[^\d.-]/g, "")) || 0;
  const selectedDelivery = document.querySelector('input[name="flexRadioDefault"]:checked');
  const percentageDelivery = parseFloat(selectedDelivery.getAttribute("data-percentage"));
  const deliveryCost = (subtotalGeneral * percentageDelivery) / 100;
  const deliveryCostContainer = document.getElementById("deliveryCost");
  deliveryCostContainer.textContent = `USD ${deliveryCost.toFixed(0)}`;
  updateTotal();
}


//Calculates the general subtotal by summing individual subtotals and updates the total.
function updateGeneralSubtotal() {
  const subtotalElements = document.querySelectorAll(".subtotal");
  let subtotalGeneral = 0;
  subtotalElements.forEach((element) => {
    const subtotalValue = parseFloat(element.textContent.replace(/[^\d.-]/g, "")) || 0;
    subtotalGeneral += subtotalValue;
  });
  const subtotalGeneralElement = document.getElementById("subtotalGen");
  subtotalGeneralElement.textContent = `USD ${subtotalGeneral.toFixed(0)}`;
  updateTotal();
}

//calculate the total cost by adding the general subtotal and delivery cost, and updates the displayed total.
function updateTotal() {
  const subtotalGeneral = parseFloat(document.getElementById("subtotalGen").textContent.replace(/[^\d.-]/g, "")) || 0;
  const deliveryCost = parseFloat(document.getElementById("deliveryCost").textContent.replace(/[^\d.-]/g, "")) || 0;
  const total = subtotalGeneral + deliveryCost;
  const finalPriceContainer = document.getElementById("finalPrice");
  finalPriceContainer.textContent = `USD ${total.toFixed(0)}`;
}


// ***************CODE FOR PAYMENT METHODS*********************
if(document.getElementById('transferFields')){
   document.addEventListener('DOMContentLoaded', function () {
      
        const transferFields = document.getElementById('transferFields');
        const cardFields = document.getElementById('cardFields');
        const cardContainer = document.getElementById('cardContainer');

        // expiration date format
        document.getElementById('expirationDate').addEventListener('input', function () {
            const value = this.value.replace(/\D/g, '');
            if (value.length >= 2) {
                this.value = value.slice(0, 2) + '/' + value.slice(2, 6);
            } else {
                this.value = value;
            }
        })

        function onlyNumbers(element) {
            element.addEventListener('input', function () {
                this.value = this.value.replace(/\D/g, '');
            });
        }

        onlyNumbers(document.getElementById('cvv'));
        onlyNumbers(document.getElementById('cardNumber'));
        onlyNumbers(document.getElementById('accountNumber'));
     
  const paymentMethod = document.querySelectorAll('input[name="paymentMethod"]');
let selectedPayment = null;

paymentMethod.forEach(function (radio) {
    radio.addEventListener('change', function () {
        if (radio.value === 'transfer') {
            transferFields.style.display = 'block';
            cardFields.style.display = 'none';
            cardContainer.style.display = 'none';
            selectedPayment = "transfer";
        } else if (radio.value === 'card') {
            transferFields.style.display = 'none';
            cardFields.style.display = 'block';
            cardContainer.style.display = 'block';
            selectedPayment = "card";
        } else {
            transferFields.style.display = 'none';
            cardFields.style.display = 'none';
            cardContainer.style.display = 'none';
            selectedPayment = null;
        }
        
        localStorage.setItem('metodoPago', selectedPayment);
    });
});

        function checkField(field, maxLength) {
            if (field.value.length === maxLength) {
                field.classList.add('is-valid');
            } else {
                field.classList.remove('is-valid');
            }
        }

        const formFields = document.querySelectorAll('.form-control');
        formFields.forEach(function (field) {
            field.addEventListener('input', function () {
                checkField(field, field.maxLength);
            });
        });

        document.getElementById('selectPayment').addEventListener('click', function () {
            let allFieldsValid = true;
            formFields.forEach(function (field) {
                checkField(field, field.maxLength);
                if (field.value.length < field.maxLength) {
                    allFieldsValid = false;
                    field.classList.add('is-invalid');
                }
            });

            if (allFieldsValid) {
                formFields.forEach(function (field) {
                    field.classList.remove('is-invalid');
                });
            }
        });

   
function isFieldEmpty(field) {
    return field.value.trim() === '';
}

const cardHolderNameInput = document.getElementById('cardHolderName');


 document.getElementById('cardNumber').addEventListener('input', function () {
    const value = this.value.replace(/\D/g, '');
    this.value = value.replace(/(\d{4}(?=\d))/g, '$1 ');
});
        const cardNumberInput = document.getElementById('cardNumber');
        const formattedCardNumberElement = document.getElementById('formattedCardNumber');
        const expirationDateInput = document.getElementById('expirationDate');
        const cvvInput = document.getElementById('cvv');

        const cardNumberElement = document.querySelector('.card .number');
        const cardHolderNameElement = document.querySelector('.card .name');
        const expirationDateElement = document.querySelector('.card .expiry');
        const cvvElement = document.getElementById('cvv');

        cardNumberInput.addEventListener('input', updateCardNumber);
        cardHolderNameInput.addEventListener('input', updateCardHolderName);
        expirationDateInput.addEventListener('input', updateExpirationDate);
        cvvInput.addEventListener('input', updateCvv);


document.addEventListener('DOMContentLoaded', function () {
        cardNumberInput.addEventListener('input', function () {
            const cardNumber = cardNumberInput.value;
            const formattedCardNumber = formatCardNumber(cardNumber);
            formattedCardNumberElement.textContent = formattedCardNumber;
        });
         });

        function updateCardNumber() {
            cardNumberElement.textContent = cardNumberInput.value || '#### #### #### ####';
        }

        function updateCardHolderName() {
            const cardHolderName = cardHolderNameInput.value || 'Nombre del Titular';
            cardHolderNameElement.textContent = cardHolderName.toUpperCase();
        }

        function updateExpirationDate() {
            expirationDateElement.textContent = expirationDateInput.value || 'MM/YY';
        }

        function updateCvv() {
            cvvElement.textContent = cvvInput.value || 'XXX';
        }

        updateCardNumber();
        updateCardHolderName();
        updateExpirationDate();
        updateCvv();
  

   function formatCardNumber(cardNumber) {
    return cardNumber.replace(/\D/g, '')
}

document.getElementById('cvv').addEventListener('mouseenter', function () {
  const cardbacks = document.getElementsByClassName('card-back');
  for (let i = 0; i < cardbacks.length; i++) {
      cardbacks[i].style.transition = 'transform 0.5s';
       cardbacks[i].style.transform = 'rotateY(0deg)';
  }

});

document.getElementById('cvv').addEventListener('mouseleave', function () {
  const cardbacks = document.getElementsByClassName('card-back');
  for (let i = 0; i < cardbacks.length; i++) {
        cardbacks[i].style.transition = 'transform 0.5s';
    cardbacks[i].style.transform = 'rotateY(180deg)';
  }
});

const cvvInpu = document.getElementById('cvv');
const cvvElemen = document.getElementById('cvv-preview');



cvvInput.addEventListener('input', function () {
    const cvv = cvvInpu.value || 'XXX';
    cvvElemen.textContent = cvv;
   
});


// cardnumber format
document.getElementById('cardNumber').addEventListener('input', function () {
    const value = this.value.replace(/\D/g, '');
    let formattedValue = '';
    for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) {
            formattedValue += ' ';
        }
        formattedValue += value[i];
    }
    this.value = formattedValue;
});


const selectPaymentButton = document.getElementById('selectPayment');

selectPaymentButton.addEventListener('click', function () {
  const cardNumber = cardNumberInput.value.replace(/\D/g, '');

  if (cardNumber.length === 16) {
    cardNumberInput.classList.remove('is-invalid');
    cardNumberInput.classList.add('is-valid');
  } else {
    cardNumberInput.classList.remove('is-valid');
    cardNumberInput.classList.add('is-invalid');
  }
});

//validity card num

cardNumberInput.addEventListener('input', function () {
  const cardNumber = this.value.replace(/\D/g, '');

  if (cardNumber.length === 16) {
    this.classList.remove('is-invalid');
    this.classList.add('is-valid');
  } else {
    this.classList.remove('is-valid');
    this.classList.add('is-invalid');
  }
});

//validity name

cardHolderNameInput.addEventListener('input', function () {
  if (!isFieldEmpty(cardHolderNameInput)) {
    cardHolderNameInput.classList.remove('is-invalid');
    cardHolderNameInput.classList.add('is-valid');
  } else {
    cardHolderNameInput.classList.remove('is-valid');
    cardHolderNameInput.classList.add('is-invalid');
  }
});



//validity cvv

cvvInput.addEventListener('input', function () {
  const cvv = cvvInput.value.replace(/\D/g, '');

  if (cvv.length === 3 ) {
    cvvInput.classList.remove('is-invalid');
    cvvInput.classList.add('is-valid');
  } else {
    cvvInput.classList.remove('is-valid');
    cvvInput.classList.add('is-invalid');
  }
});


const cardBack = document.querySelector(".card-back");

cvvInput.addEventListener("mouseover", () => {
  cardBack.style.display = "block";
});

cvvInput.addEventListener("mouseout", () => {
 
  cardBack.style.display = "none";
});


//validity cardnumber
cardNumberInput.addEventListener('input', function () {
  const cardNumber = cardNumberInput.value.replace(/\D/g, '');

  if (cardNumber.length === 16) {
    cardNumberInput.classList.remove('is-invalid');
    cardNumberInput.classList.add('is-valid');
  } else {
    cardNumberInput.classList.remove('is-valid');
    cardNumberInput.classList.add('is-invalid');
  }
});


//validity experation

expirationDateInput.addEventListener('input', function () {
  const expirationDate = expirationDateInput.value.replace(/\D/g, '');

  if (expirationDate.length === 6) {
    expirationDateInput.classList.remove('is-invalid');
    expirationDateInput.classList.add('is-valid');
  } else {
    expirationDateInput.classList.remove('is-valid');
    expirationDateInput.classList.add('is-invalid');
  }
});

const accountNumberInput = document.getElementById('accountNumber');

accountNumberInput.addEventListener('input', function () {
  const accountNumber = accountNumberInput.value.trim(); 

  if (accountNumber.length > 5) {
    accountNumberInput.classList.remove('is-invalid');
    accountNumberInput.classList.add('is-valid');
  } else {
    accountNumberInput.classList.remove('is-valid');
    accountNumberInput.classList.add('is-invalid');
  }
});

//  empty or full field?
function isFieldValid(field) {
    return field.value.trim() !== '' && field.classList.contains('is-valid');
}

function arePaymentFieldsValid(selectedPayment) {
    if (selectedPayment === 'transfer') {
        // Verify transfer field
        const accountNumberInput = document.getElementById('accountNumber');
        return isFieldValid(accountNumberInput);
    } else if (selectedPayment === 'card') {
          // Verify card field
        const cardNumberInput = document.getElementById('cardNumber');
        const expirationDateInput = document.getElementById('expirationDate');
        const cvvInput = document.getElementById('cvv');
        return (
            isFieldValid(cardNumberInput) &&
            
            isFieldValid(expirationDateInput) &&
            isFieldValid(cvvInput)
        );
    }
    return false; 
}

// check when we press SELECCIONAR botton 
document.getElementById('selectPayment').addEventListener('click', function () {
    const selectedPayment = localStorage.getItem('metodoPago');

    if (arePaymentFieldsValid(selectedPayment)) {
       
        const completeData = {
            selectedPayment,
        };
        localStorage.setItem('completeData', 'si');
    } else {
         localStorage.setItem('completeData', 'no');
    }
});



document.getElementById('selectPayment').addEventListener('click', function () {
        const selectedPayment = localStorage.getItem('metodoPago');

        if (arePaymentFieldsValid(selectedPayment)) {
            const completeData = {
                selectedPayment,
            };
            localStorage.setItem('completeData', 'si');

            // success message
            const successMessage = document.getElementById('successMessage');
            const successMessage2 = document.getElementById('successMessag');
            successMessage.style.display = 'block';
            successMessage2.style.display = 'block';

            setTimeout(function () {
                successMessage.style.display = 'none';
                   successMessage2.style.display = 'none';
                  }, 3000); 
        } else {
            localStorage.setItem('completeData', 'no');
        }
    });

    document.getElementById('selectPayment').addEventListener('click', function () {
        const selectedPayment = localStorage.getItem('metodoPago');

        if (arePaymentFieldsValid(selectedPayment)) {
            const completeData = {
                selectedPayment,
            };
            localStorage.setItem('completeData', 'si');

            
            // hide warning message
            const warningMessage = document.getElementById('warningMessage');
            warningMessage.style.display = 'none';
        } else {
            localStorage.setItem('completeData', 'no');
            
            // show warning message
            const warningMessage = document.getElementById('warningMessage');
            warningMessage.style.display = 'block';
        }
    });
}); }
// *************** END - CODE FOR PAYMENT METHODS*********************

const buyBtn = document.getElementById('buyBtn');


// Validation function
function shippingValidation(event) {
  const shippingData = document.getElementById("shippingData");
  const qForm = document.getElementById('qForm');
  const shippingType = document.getElementById('shippingType');
  const purchaseAlert = document.getElementById('purchaseAlert');
  const invalidMethodContainer = document.getElementById('invalidMethod');

  let payment = localStorage.getItem('completeData');
  let validPayment = false;

  if (payment == 'si') {
    validPayment = true;
    invalidMethodContainer.innerHTML = ""
  }
  else {
    invalidMethodContainer.innerHTML = `<p class="text-danger text-sm m-1">Debes seleccionar un método de pago.</p>`
  }


  // Purchase validation
  if (!shippingData.checkValidity() && !qForm.checkValidity() && !shippingType.checkValidity()) {
    event.preventDefault();
    event.stopPropagation();
  }
  shippingData.classList.add('was-validated');

  // Succesfully purchase alert
  if (shippingData.checkValidity() && qForm.checkValidity() && shippingType.checkValidity() && validPayment) {
    purchaseAlert.innerHTML = `<div class="alert alert-success alert-dismissible" role="alert">
    Compra realizada con éxito!
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`
    
  }

}

if(buyBtn){
  buyBtn.addEventListener('click', shippingValidation)
}
