import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  const isDiscounted = product.FinalPrice < product.SuggestedRetailPrice;
  const discountPercent = isDiscounted
    ? Math.round((1 - product.FinalPrice / product.SuggestedRetailPrice) * 100)
    : 0;

  const discountBadge = isDiscounted
    ? `<span class="discount-badge">-${discountPercent}%</span>`
    : "";

  const originalPrice = isDiscounted
    ? `<span class="original-price">$${product.SuggestedRetailPrice.toFixed(2)}</span>`
    : "";

  return `<li class="product-card${isDiscounted ? " product-card--discounted" : ""}">
    ${discountBadge}
    <a href="/product_pages/?product=${product.Id}">
      <img
        src="${product.Images.PrimaryMedium}"
        alt="${product.Name}"
      />
      <h3 class="card__brand">${product.Brand.Name}</h3>
      <h2 class="card__name">${product.NameWithoutBrand}</h2>
      <p class="product-card__price">
        ${originalPrice}
        <span class="${isDiscounted ? "sale-price" : ""}">$${product.FinalPrice.toFixed(2)}</span>
      </p>
    </a>
  </li>`;
}

function capitalizeCategory(category) {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    const list = await this.dataSource.getData(this.category);
    this.renderList(list);
    this.updateTitle();
  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list, "afterbegin", true);
  }

  updateTitle() {
    const titleElement = document.querySelector(".products h2");
    if (titleElement) {
      titleElement.textContent = `Top Products: ${capitalizeCategory(this.category)}`;
    }
  }
}
