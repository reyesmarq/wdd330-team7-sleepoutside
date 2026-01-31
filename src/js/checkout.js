import { loadHeaderFooter, alertMessage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const services = new ExternalServices();
const checkout = new CheckoutProcess("#order-summary", services);
checkout.init();

document.querySelector("#checkout-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  if (form.checkValidity()) {
    try {
      await checkout.checkout(form);
      location.assign("/checkout/success.html");
    } catch (err) {
      if (err.name === "servicesError") {
        const message = err.message;
        if (typeof message === "object") {
          Object.keys(message).forEach((key) => {
            alertMessage(message[key]);
          });
        } else {
          alertMessage(message);
        }
      } else {
        alertMessage(`There was a problem processing your order: ${err.message}`);
      }
    }
  } else {
    form.reportValidity();
  }
});
