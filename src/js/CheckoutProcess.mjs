import { getLocalStorage, setLocalStorage } from "./utils.mjs";

function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    name: item.Name,
    price: item.FinalPrice,
    quantity: 1,
  }));
}

export default class CheckoutProcess {
  constructor(outputSelector, externalServices) {
    this.outputSelector = outputSelector;
    this.externalServices = externalServices;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage("so-cart") || [];
    this.calculateItemSummary();
  }

  calculateItemSummary() {
    this.itemTotal = this.list.reduce(
      (sum, item) => sum + item.FinalPrice,
      0
    );
    this.calculateOrderTotal();
    this.displayOrderTotals();
  }

  calculateOrderTotal() {
    this.tax = this.itemTotal * 0.06;
    const itemCount = this.list.length;
    this.shipping = itemCount > 0 ? 10 + (itemCount - 1) * 2 : 0;
    this.orderTotal = this.itemTotal + this.tax + this.shipping;
  }

  displayOrderTotals() {
    const output = document.querySelector(this.outputSelector);
    output.innerHTML = `
      <p class="order-summary__line">Subtotal: <span>$${this.itemTotal.toFixed(2)}</span></p>
      <p class="order-summary__line">Shipping: <span>$${this.shipping.toFixed(2)}</span></p>
      <p class="order-summary__line">Tax: <span>$${this.tax.toFixed(2)}</span></p>
      <p class="order-summary__line order-summary__total">Order Total: <span>$${this.orderTotal.toFixed(2)}</span></p>
    `;
  }

  async checkout(form) {
    const formData = new FormData(form);
    const payload = {
      orderDate: new Date().toISOString(),
      fname: formData.get("fname"),
      lname: formData.get("lname"),
      street: formData.get("street"),
      city: formData.get("city"),
      state: formData.get("state"),
      zip: formData.get("zip"),
      cardNumber: formData.get("cardNumber"),
      expiration: formData.get("expiration"),
      code: formData.get("code"),
      items: packageItems(this.list),
      orderTotal: this.orderTotal.toFixed(2),
      shipping: this.shipping.toFixed(2),
      tax: this.tax.toFixed(2),
    };

    const result = await this.externalServices.checkout(payload);
    setLocalStorage("so-cart", []);
    return result;
  }
}
