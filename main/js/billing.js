import { getInventory } from './storage.js';
import { showToast } from './alerts.js';
import { recordSale } from './reports.js';

export function loadBilling() {
  const inventory = getInventory();
  let cart = [];

  const renderBilling = () => {
    const cartHtml = cart.map((item, i) => `
      <div class="billingCardItem card">
        <strong>${item.name}</strong>
        <span>Qty: ${item.qty} - Rs.${(item.price * item.qty).toFixed(2)}</span>
        <button onclick="removeFromCart(${i})">Remove</button>
      </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    document.getElementById('billingContent').innerHTML = `
      <div class="billingItemsGrid">
        ${cartHtml || "<p>No items in cart.</p>"}
      </div>
      <div class="billingSummary">
        <h3>Total: Rs.${total.toFixed(2)}</h3>
        <button onclick="generateInvoiceImage()">Generate Invoice</button>
      </div>
    `;
  };

  // Main Billing UI
  document.getElementById('mainContent').innerHTML = `
    <div id="billingContainer">
      <h1>Billing System</h1>

      <div class="billingCardItem">
        <select id="productSelect">
          <option value="">Select Product</option>
          ${inventory.map((item, i) => `<option value="${i}">${item.name} (Rs.${item.price})</option>`).join('')}
        </select>
        <input type="number" id="productQty" placeholder="Qty" min="1" />
        <button id="addToCartBtn">Add to Cart</button>
      </div>

      <div id="billingContent"></div>
    </div>
  `;

  // Event Handlers
  document.getElementById('addToCartBtn').addEventListener('click', () => {
    const idx = document.getElementById('productSelect').value;
    const qty = Number(document.getElementById('productQty').value);

    if (idx === "" || qty <= 0) return showToast('Invalid item or quantity', 'error');

    const product = inventory[idx];
    cart.push({ ...product, qty });
    showToast('Added to cart', 'success');
    renderBilling();
  });

  // Remove item from cart
  window.removeFromCart = (index) => {
    cart.splice(index, 1);
    renderBilling();
  };

  // Generate Invoice as Image
  window.generateInvoiceImage = () => {
    recordSale(cart);
    document.getElementById('mainContent').innerHTML = `
      <h1>Sale completed</h1>
    `;
  };

}

