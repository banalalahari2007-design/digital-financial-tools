
const search = document.getElementById("search");
const cards = document.querySelectorAll(".product-card");
const filters = document.querySelectorAll(".filter");
const noResults = document.getElementById("noResults");
const cartItems = document.getElementById("cartItems");
const totalElement = document.getElementById("total");
const cartCount = document.getElementById("cartCount");
const orderForm = document.getElementById("orderForm");
const orderResult = document.getElementById("orderResult");

const cart = {};
let activeCategory = "all";

function filterProducts() {
  const query = search.value.toLowerCase().trim();
  let visibleCount = 0;

  cards.forEach(function (card) {
    const matchesName = card.dataset.name.includes(query);
    const matchesCategory =
      activeCategory === "all" ||
      card.dataset.category === activeCategory;

    const show = matchesName && matchesCategory;
    card.hidden = !show;

    if (show) visibleCount++;
  });

  noResults.hidden = visibleCount !== 0;
}

search.addEventListener("input", filterProducts);

filters.forEach(function (button) {
  button.addEventListener("click", function () {
    activeCategory = button.dataset.category;

    filters.forEach(function (filter) {
      filter.classList.toggle("active", filter === button);
    });

    filterProducts();
  });
});

document.querySelectorAll(".add").forEach(function (button) {
  button.addEventListener("click", function () {
    const name = button.dataset.name;
    const price = Number(button.dataset.price);

    if (cart[name]) {
      cart[name].quantity++;
    } else {
      cart[name] = { price: price, quantity: 1 };
    }

    renderCart();
  });
});

function renderCart() {
  cartItems.replaceChildren();

  let total = 0;
  let count = 0;

  Object.keys(cart).forEach(function (name) {
    const item = cart[name];
    const subtotal = item.price * item.quantity;

    total += subtotal;
    count += item.quantity;

    const row = document.createElement("div");
    row.className = "cart-row";

    const description = document.createElement("span");
    description.textContent =
      name + " × " + item.quantity + " — ₹" + subtotal;

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "remove";
    removeButton.textContent = "Remove";

    removeButton.addEventListener("click", function () {
      delete cart[name];
      renderCart();
    });

    row.append(description, removeButton);
    cartItems.appendChild(row);
  });

  if (count === 0) {
    cartItems.textContent =
      "Your cart is empty. Add a sweet treat!";
  }

  totalElement.textContent = "₹" + total;
  cartCount.textContent = count;
}

orderForm.addEventListener("submit", function (event) {
  event.preventDefault();

  if (Object.keys(cart).length === 0) {
    orderResult.textContent =
      "Please add at least one treat before preparing your order.";
    return;
  }

  const name = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const occasion = document.getElementById("occasion").value;
  const notes = document.getElementById("notes").value.trim();

  let summary = "SWEET BITES BAKERY - ORDER SUMMARY\n\n";
  summary += "Customer: " + name + "\n";
  summary += "Phone: " + phone + "\n";
  summary += "Occasion: " + occasion + "\n\n";
  summary += "YOUR TREATS:\n";

  Object.keys(cart).forEach(function (itemName) {
    const item = cart[itemName];

    summary += itemName + " x " + item.quantity;
    summary += " = ₹" + item.price * item.quantity + "\n";
  });

  summary += "\nTotal: " + totalElement.textContent;

  if (notes) {
    summary += "\nSpecial requests: " + notes;
  }

  orderResult.replaceChildren();

  const summaryText = document.createElement("pre");
  summaryText.style.whiteSpace = "pre-wrap";
  summaryText.style.overflowWrap = "anywhere";
  summaryText.style.fontFamily = "inherit";
  summaryText.textContent = summary;

  const copyButton = document.createElement("button");
  copyButton.type = "button";
  copyButton.className = "button full-button";
  copyButton.textContent = "Copy Order Summary";

  copyButton.addEventListener("click", async function () {
    try {
      await navigator.clipboard.writeText(summary);
      copyButton.textContent = "Copied Successfully!";
    } catch (error) {
      copyButton.textContent =
        "Select the summary above and copy it manually.";
    }
  });

  orderResult.append(summaryText, copyButton);
});