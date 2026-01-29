import { setLocalStorage, getLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

function addProductToCart(product) {
  const cart = getLocalStorage("so-cart") ?? [];
  cart.push(product);
  setLocalStorage("so-cart", cart);
}
// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
function renderProductDetails(product) {
  const container = document.querySelector('.product-detail');

  const discountAmount = product.SuggestedRetailPrice - product.ListPrice;
  const discountPercent = Math.round((discountAmount / product.SuggestedRetailPrice) * 100);

  const hasDiscount = discountAmount > 0;

  container.innerHTML = `
    <h2>${product.Name}</h2>
    <img src="${product.Images.PrimaryLarge}" alt="${product.Name}" />
    <p class="price">
      Price: $${product.ListPrice.toFixed(2)}
      ${hasDiscount ? `<span class="discount">Save ${discountPercent}% ($${discountAmount.toFixed(2)})</span>` : ''}
    </p>
    <p>${product.Description}</p>
  `;
}
