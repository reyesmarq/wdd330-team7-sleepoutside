import { loadHeaderFooter } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const services = new ExternalServices();
const checkout = new CheckoutProcess("#order-summary", services);
checkout.init();

document.querySelector("#checkout-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  try {
    await checkout.checkout(form);
    location.assign("/checkout/success.html");
  } catch (err) {
    alert(`There was a problem processing your order: ${err.message}`);
  }
});
