import { qs, loadJSON } from "./utils.mjs";

async function loadTents() {
  // Load all tents from JSON
  const tents = await loadJSON("/json/tents.json");

  // Only show tents that have detail pages
  const allowed = ["880RR", "985RF", "985PR", "344YJ"]; // ← replace with your real IDs

  const filtered = tents.filter(tent => allowed.includes(tent.Id));

  // Render into the UL
  const list = qs(".product-list");

  list.innerHTML = filtered
    .map(
      tent => `
      <li class="product-card">
        <a href="product_pages/?product=${tent.Id}">
          <img src="${tent.Image}" alt="${tent.Name}">
          <h3 class="card__brand">${tent.Brand}</h3>
          <h2 class="card__name">${tent.Name}</h2>
          <p class="product-card__price">$${tent.FinalPrice}</p>
        </a>
      </li>
    `
    )
    .join("");
}

loadTents();

// Dynamic Header + Footer Injection

function loadHeaderFooter() {
  const header = `
    <header class="divider">
      <div class="logo">
        <img src="/images/noun_Tent_2517.svg" alt="tent logo" />
        <a href="/index.html">Sleep<span class="highlight">Outside</span></a>
      </div>
      <div class="cart">
        <a href="/cart/index.html">
          <img src="/images/noun_Backpack_65884.svg" alt="cart icon" />
        </a>
      </div>
    </header>
  `;

  const footer = `
    <footer>
      &copy;2025 ⛺ SleepOutside ⛺ WDD 330 Team Project
    </footer>
  `;

  document.body.insertAdjacentHTML("afterbegin", header);
  document.body.insertAdjacentHTML("beforeend", footer);
}

// run automatically on every page that includes main.js
loadHeaderFooter();

