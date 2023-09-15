const decreaseButtons = document.querySelectorAll('.decrease');
const increaseButtons = document.querySelectorAll('.increase');
const addToCartButtons = document.querySelectorAll('.add-to-cart> button');
const cartButton = document.querySelector('#cart');

var totalPrice = 0;

cartButton.addEventListener('click', () => {
    showCart();
});

document.querySelector('#close-cart').addEventListener('click', closeCart);
document.querySelector('.overlay').addEventListener('click', closeCart);


decreaseButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
        const productId = event.target.parentNode.parentNode.parentNode.parentNode.id;
        changeQuantity(productId, 'decrease');
    });
});

increaseButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
        const productId = event.target.parentNode.parentNode.parentNode.parentNode.id;
        changeQuantity(productId, 'increase');
    });
});

addToCartButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
        const productId = event.target.parentNode.parentNode.parentNode.id;
        addToCart(productId);
    });
});


//increase or decrease quantity of product
function changeQuantity(id, action) {
    var quantity = document.querySelector(`#${id} .change-quantity input`).value;

    if (action == "decrease") {
        if (quantity > 0) {
            quantity--;
        }
    } else if (action == "increase") {
        quantity++;
    }

    document.querySelector(`#${id} .change-quantity input`).value = quantity;
}

//add product to cart
function addToCart(id) {
    const name = document.querySelector(`#${id} .product-desc h3`).innerText;
    const price = document.querySelector(`#${id} .product-desc p`).innerText;
    const quantity = document.querySelector(`#${id} .change-quantity input`).value;

    document.querySelector(`#${id} .change-quantity input`).value = 1;

    if (!checkCart(quantity)) {
        return;
    }

    const productData = {
        id: id,
        name: name,
        price: price,
        quantity: quantity,
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingProduct = cart.find((product) => {
        return product.id == id;
    });

    if (existingProduct) {
        existingProduct.quantity = parseInt(existingProduct.quantity) + parseInt(quantity);
    } 
    else {
        cart.push(productData);
    }
    localStorage.setItem('cart', JSON.stringify(cart));

    updateCartSize();
    notification("You added successfully in card!!");
}


function updateCartSize() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalQuantity = 0;
    let totalPrice = 0;
    cart.forEach((product) => {
        totalQuantity += parseInt(product.quantity);
        // totalPrice += (product.price * product.quantity);
    });
    document.querySelector('#cart p').innerText = totalQuantity;
    // console.log(totalPrice);
    // document.querySelector('#price h3').innerHTML = totalPrice;
}

//every product in cart added can not more than 8 
function checkCart(currentProductQuantity) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalQuantity = 0;

    cart.forEach((product) => {
        totalQuantity += parseInt(product.quantity);
    });

    if (totalQuantity + parseInt(currentProductQuantity) > 8) {
        window.alert("You are not able to add more then 8 products in you cart!!");
        return false;
    }
    return true;
}


//show cart items in a modal
function showCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const productContainer = document.querySelector('.cart-container .product-container');
    let total = 0;

    productContainer.innerHTML = '';

    cart.forEach((product) => {
        productContainer.innerHTML += `
            <div class="cart-product"">
                <h3>${product.name}</h3>
                <p>${product.quantity}</p>
                <p>${product.price}</p>
                <button class="remove-from-cart" data-productid="${product.id}" >
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;

        total += parseInt(product.price.substring(1)) * parseInt(product.quantity);
    });

    const totalContainer = document.querySelector('.cart-container .checkout h3');
    totalContainer.innerText = `Total: ₹${total}`;

    const cartContainer = document.querySelector('.cart-container');
    cartContainer.style.display = "flex";

    document.querySelector('body').style.overflow = "hidden";

    //remove button of every product in cart
    const removeButtons = document.querySelectorAll('.remove-from-cart i');
    removeButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            const productId = event.target.parentNode.dataset.productid;
            removeFromCart(productId, event.target.parentNode.parentNode);
        });
    });

    totalPrice = total;
    console.log(totalPrice);
}

function closeCart() {
    const cartContainer = document.querySelector('.cart-container');
    cartContainer.style.display = "none";
    document.querySelector('body').style.overflow = "auto";
}

//remove product from cart
function removeFromCart(id, productContainer) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const updatedCart = cart.filter((product) => {
        return product.id != id;
    });

    localStorage.setItem('cart', JSON.stringify(updatedCart));
    productContainer.remove();


    let total = 0;
    updatedCart.forEach((product) => {
        total += parseInt(product.price.substring(1)) * parseInt(product.quantity);
    });
    const totalContainer = document.querySelector('.cart-container .checkout h3');
    totalContainer.innerText = `Total: ₹${total}`;

    updateCartSize();
    notification("You are removed product from the cart!");

}

function notification(msg) {
    const notification = document.querySelector('#notify');
    notification.innerHTML = `<p>${msg}</p>`;

    notification.style.right = "0%";
    setTimeout(() => {
        notification.style.right = "-100%";
    }, 5000);
}

updateCartSize();
