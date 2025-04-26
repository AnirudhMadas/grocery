import { getInventory, saveInventory } from './storage.js';
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
        <button onclick="completeSale()" ${cart.length === 0 ? 'disabled' : ''}>Generate Invoice</button>
      </div>
    `;
  };

  // Main Billing UI
  document.getElementById('mainContent').innerHTML = `
    <div id="billingContainer">
      

      <div class="billingCardItem">
        <h1>Billing System</h1>
        <select id="productSelect">
          <option value="">Select Product</option>
          ${inventory.map((item, i) => `<option value="${i}" ${item.qty <= 0 ? 'disabled' : ''}>${item.name} (Rs.${item.price}) - ${item.qty} in stock</option>`).join('')}
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
    
    // Check if there's enough stock
    if (qty > product.qty) {
      return showToast(`Only ${product.qty} items available in stock`, 'error');
    }

    cart.push({ ...product, qty, inventoryIndex: idx });
    showToast('Added to cart', 'success');
    renderBilling();
  });

  // Remove item from cart
  window.removeFromCart = (index) => {
    cart.splice(index, 1);
    renderBilling();
  };

  // Complete sale and generate invoice
  window.completeSale = () => {
    if (cart.length === 0) {
      showToast('Cart is empty', 'error');
      return;
    }

    // Get fresh inventory data
    const currentInventory = getInventory();
    
    // Check stock availability again before finalizing
    let insufficientStock = false;
    
    cart.forEach(item => {
      const inventoryItem = currentInventory[item.inventoryIndex];
      if (inventoryItem.qty < item.qty) {
        showToast(`Not enough ${item.name} in stock. Available: ${inventoryItem.qty}`, 'error');
        insufficientStock = true;
      }
    });
    
    if (insufficientStock) return;
    
    // Update inventory quantities
    cart.forEach(item => {
      currentInventory[item.inventoryIndex].qty -= item.qty;
    });
    
    // Save updated inventory
    saveInventory(currentInventory);
    
    // Record the sale
    recordSale(cart);
    
    // Show success message
    showToast('Sale completed and inventory updated', 'success');
    
    // Empty cart and display completion message
    cart = [];
    document.getElementById('mainContent').innerHTML = `
      <div class="card">
        <h1>Sale completed</h1>
        <p>The inventory has been updated successfully.</p>
        <button class="btn btn-primary" id="newSaleBtn">New Sale</button>
      </div>
    `;
    
    document.getElementById('newSaleBtn').addEventListener('click', () => {
      loadBilling();
    });
  };

  // Initialize the UI
  renderBilling();
}