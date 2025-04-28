import { getInventory, saveInventory } from './storage.js';
import { showToast } from './alerts.js';
import { recordSale } from './reports.js';

export function loadBilling() {
  const inventory = getInventory();
  let cart = [];

  const renderBilling = () => {
    const cartHtml = cart.map((item, i) => `
      <div class="billing-card-item">
        <div class="item-details">
          <img src="https://via.placeholder.com/50" alt="${item.name}" class="item-image" />
          <div>
            <strong>${item.name}</strong>
            <p>Qty: ${item.qty} - Rs.${(item.price * item.qty).toFixed(2)}</p>
          </div>
        </div>
        <button class="remove-btn" onclick="removeFromCart(${i})">Remove</button>
      </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    document.getElementById('billingContent').innerHTML = `
      <div class="billing-items-grid">
        ${cartHtml || "<p class='empty-cart'>No items in cart.</p>"}
      </div>
      <div class="billing-summary">
        <h3>Total: Rs.<span>${total.toFixed(2)}</span></h3>
        <button class="generate-invoice-btn" ${cart.length === 0 ? 'disabled' : ''} onclick="completeSale()">Generate Invoice</button>
      </div>
    `;
  };

  // Main Billing UI
  document.getElementById('mainContent').innerHTML = `
    <section class="billing-section">
      <div class="billing-card">
        <h2 class="billing-title">Billing System</h2>
        <div class="billing-inputs">
          <div class="form-group">
            <div class="form-group">
              <label for="productSearch">Search Product</label>
              <input type="text" id="productSearch" name="productSearch" placeholder="Search for a product..." autocomplete="off" />
              <div id="searchResults" class="search-results"></div>
            </div>
          </div>
          <div class="form-group">
            <label for="productQty">Qty</label>
            <input type="number" id="productQty" name="productQty" placeholder="Qty" min="1" value="1" />
          </div>
          <button class="add-to-cart-btn" id="addToCartBtn">Add to Cart</button>
        </div>
        <div id="billingContent" class="billing-content"></div>
      </div>
    </section>
  `;

  // Event Handlers
  let selectedProductIndex = null;

  const searchInput = document.getElementById('productSearch');
  const searchResults = document.getElementById('searchResults');

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    searchResults.innerHTML = '';

    if (query.length === 0) {
      selectedProductIndex = null;
      return;
    }

    const matches = inventory
      .map((item, index) => ({ ...item, index }))
      .filter(item => item.name.toLowerCase().includes(query) && item.qty > 0);

    matches.forEach(item => {
      const div = document.createElement('div');
      div.className = 'search-result-item';
      div.textContent = `${item.name} (Rs.${item.price}) - ${item.qty} in stock`;
      div.addEventListener('click', () => {
        searchInput.value = item.name;
        selectedProductIndex = item.index;
        searchResults.innerHTML = '';
      });
      searchResults.appendChild(div);
    });
  });

  document.getElementById('addToCartBtn').addEventListener('click', () => {
    const qty = Number(document.getElementById('productQty').value);

    if (selectedProductIndex === null || qty <= 0) {
      return showToast('Please select a valid product and quantity', 'error');
    }

    const product = inventory[selectedProductIndex];

    if (qty > product.qty) {
      return showToast(`Only ${product.qty} items available in stock`, 'error');
    }

    cart.push({ ...product, qty, inventoryIndex: selectedProductIndex });
    showToast('Added to cart', 'success');
    searchInput.value = '';
    selectedProductIndex = null;
    renderBilling();
  });

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