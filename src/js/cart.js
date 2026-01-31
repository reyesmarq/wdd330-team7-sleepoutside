import { getLocalStorage, setLocalStorage, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  if (!cartItems || cartItems.length === 0) {
    document.querySelector(".product-list").innerHTML = "<p>Your cart is empty.</p>";
    document.querySelector("#checkout-btn").style.display = "none";
    return;
  }
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
  document.querySelector("#checkout-btn").style.display = "block";

  document.querySelectorAll(".cart-card__remove").forEach((btn) => {
    btn.addEventListener("click", removeFromCart);
  });
}

function removeFromCart(e) {
  const id = e.currentTarget.dataset.id;
  let cartItems = getLocalStorage("so-cart") || [];
  const index = cartItems.findIndex((item) => item.Id === id);
  if (index !== -1) {
    cartItems.splice(index, 1);
  }
  setLocalStorage("so-cart", cartItems);
  renderCartContents();
}

function cartItemTemplate(item) {
  const imageSrc = item.Images?.PrimaryMedium || item.Image;
  const newItem = `<li class="cart-card divider">
  <span class="cart-card__remove" data-id="${item.Id}">X</span>
  <a href="#" class="cart-card__image">
    <img
      src="${imageSrc}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

renderCartContents();
