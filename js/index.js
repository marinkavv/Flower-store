let cartIcon = document.querySelector(".cart-icon a");
let cart = document.querySelector(".basketCart");
let closeCart = document.querySelector("#cartClose");
const productContainer = document.getElementById("product-container");

document.addEventListener("DOMContentLoaded", ready);

function ready() {
  document.querySelectorAll(".buy-button").forEach((button) => {
    button.addEventListener("click", addCartClicked);
  });

  document.querySelectorAll(".cart-btn").forEach((button) => {
    button.addEventListener("click", () => {
      cart.classList.add("active");
    });
  });

  loadCartItems();

  cartIcon.addEventListener("click", () => {
    cart.classList.toggle("active");
  });

  closeCart.addEventListener("click", () => {
    cart.classList.remove("active");
  });
}

function addCartClicked(event) {
  const productCard = event.target.closest(".product-card");

  const title =
    productCard.querySelector(".product-name span:nth-child(1)").innerText +
    " " +
    productCard.querySelector(".product-name span:nth-child(2)").innerText;
  const price = productCard.querySelector(".price").innerText;
  const productImg = productCard.querySelector(".product-image").src;

  addProductToCart(title, price, productImg);
  updateCartState();
}

function addProductToCart(title, price, productImg) {
  const cartItems = document.querySelector(".cartContent");
  const cartItemsNames = Array.from(
    cartItems.querySelectorAll(".cart-product-title")
  );

  if (
    cartItemsNames.some(
      (item) => item.innerText.toLowerCase() === title.toLowerCase()
    )
  ) {
    alert("Цей товар вже є в кошику");
    return;
  }

  const cartShopBox = document.createElement("div");
  cartShopBox.classList.add("cart-box");

  cartShopBox.innerHTML = `
    <img src="${productImg}" alt="" class="cart-img" />
    <div class="detail-box">
      <div class="cart-product-title">${title}</div>
      <div class="cart-price">${price}</div>
      <input type="number" value="1" class="cart-quantity" />
    </div>
    <i class="bx bx-trash-alt cart-remove"></i>
  `;

  cartItems.append(cartShopBox);

  cartShopBox
    .querySelector(".cart-remove")
    .addEventListener("click", (event) => {
      removeCartItem(event);
      updateCartState();
    });

  cartShopBox
    .querySelector(".cart-quantity")
    .addEventListener("change", (event) => {
      quantityChanged(event);
      updateCartState();
    });
}

function removeCartItem(event) {
  event.target.parentElement.remove();
}

function quantityChanged(event) {
  const input = event.target;
  if (isNaN(input.value) || input.value <= 0) input.value = 1;
}

function updatetotal() {
  const cartBoxes = document.querySelectorAll(".cart-box");
  const total = Array.from(cartBoxes).reduce((sum, cartBox) => {
    const price = parseFloat(
      cartBox.querySelector(".cart-price").innerText.replace("грн", "")
    );
    const quantity = parseInt(cartBox.querySelector(".cart-quantity").value);
    return sum + price * quantity;
  }, 0);

  document.querySelector(".totalPrice").innerText = "₴" + total.toFixed(2);
  localStorage.setItem("cartTotal", total);
}

function saveCartItems() {
  const cartBoxes = document.querySelectorAll(".cart-box");
  const cartItems = Array.from(cartBoxes).map((cartBox) => ({
    title: cartBox.querySelector(".cart-product-title").innerText,
    price: cartBox.querySelector(".cart-price").innerText,
    quantity: cartBox.querySelector(".cart-quantity").value,
    productImg: cartBox.querySelector(".cart-img").src,
  }));

  localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

function loadCartItems() {
  const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");

  cartItems.forEach((item) => {
    addProductToCart(item.title, item.price, item.productImg);

    const cartBoxes = document.querySelectorAll(".cart-box");
    const cartBox = cartBoxes[cartBoxes.length - 1];
    cartBox.querySelector(".cart-quantity").value = item.quantity;
  });

  const cartTotal = localStorage.getItem("cartTotal");
  if (cartTotal)
    document.querySelector(".totalPrice").innerText = "₴" + cartTotal;
}

function updateCartState() {
  updatetotal();
  saveCartItems();
}

function loadProducts(products) {
  productContainer.innerHTML = "";
  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");

    productCard.innerHTML = `
      <img
        src="${product.image}"
        alt="${product.alt}"
        class="product-image"
      />
      <div class="product-name">
        <span>${product.name}:</span>
        <span>${product.description}</span>
      </div>
      <p class="price">${product.price} грн</p>
      <button class="buy-button">В кошик</button>
    `;

    productContainer.appendChild(productCard);
  });
}

loadProducts(products);
