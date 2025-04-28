import { getInventory, saveInventory } from './storage.js';
import { showToast } from './alerts.js';

export function loadAlerts() {
  const inventory = getInventory();
  
  // Get low stock and out of stock items
  const lowStockItems = inventory.filter(item => item.qty > 0 && item.qty < 5);
  const outOfStockItems = inventory.filter(item => item.qty <= 0);
  
  document.getElementById('mainContent').innerHTML = `
    <div class="card">
      <h2>Inventory Alerts</h2>
      <p>Monitor your inventory levels and reorder products from Amazon when necessary.</p>
      
      <div class="tabs">
        <div class="tab active" id="outOfStockTab">Out of Stock (${outOfStockItems.length})</div>
        <div class="tab" id="lowStockTab">Low Stock (${lowStockItems.length})</div>
      </div>
      
      <div class="tab-content active" id="outOfStockContent">
        ${renderAlertItems(outOfStockItems, 'out')}
      </div>
      
      <div class="tab-content" id="lowStockContent">
        ${renderAlertItems(lowStockItems, 'low')}
      </div>
    </div>
  `;
  
  // Tab switching logic
  document.getElementById('outOfStockTab').addEventListener('click', () => switchTab('outOfStockTab', 'outOfStockContent'));
  document.getElementById('lowStockTab').addEventListener('click', () => switchTab('lowStockTab', 'lowStockContent'));
  
  // Amazon redirect functionality
  document.querySelectorAll('.order-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const itemId = e.target.dataset.id;
      const item = inventory[itemId];
      redirectToAmazon(item);
    });
  });
}

function switchTab(tabId, contentId) {
  // Remove active class from all tabs and contents
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
  
  // Add active class to selected tab and content
  document.getElementById(tabId).classList.add('active');
  document.getElementById(contentId).classList.add('active');
}

function renderAlertItems(items, alertType) {
  if (items.length === 0) {
    return `<p>No ${alertType === 'out' ? 'out of stock' : 'low stock'} items at the moment.</p>`;
  }
  
  return `
    <div class="alert-items">
      ${items.map((item, index) => `
        <div class="card alert-item">
          <div class="alert-item-info">
            <h3>${item.name}</h3>
            <p>Category: ${item.category}</p>
            <p>Current stock: <span class="stock-level ${alertType === 'out' ? 'stock-low' : 'stock-medium'}">${item.qty} ${alertType === 'out' ? '(Out of Stock)' : '(Low Stock)'}</span></p>
            <p>Price: Rs.${item.price}</p>
          </div>
          <div class="alert-item-actions">
            <button class="btn btn-primary order-btn" data-id="${index}">Reorder</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function redirectToAmazon(item) {
  // Create search query from item name and category
  const searchQuery = encodeURIComponent(`${item.name} ${item.category}`);
  
  // Construct Bigbasket search URL
  const bigBasketUrl = `https://www.bigbasket.com/ps/?q=${searchQuery}`;

  // Show a toast notification
  showToast(`Redirecting to Amazon to purchase ${item.name}`, 'info');
  
  // Open Amazon in a new tab
  window.open(bigBasketUrl, '_blank');
}

// Add some CSS specific to the alerts page
export function addAlertStyles() {
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    .alert-items {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }
    
    .alert-item {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .alert-item-info {
      flex: 1;
    }
    
    .alert-item-actions {
      display: flex;
      justify-content: flex-end;
    }
    
    .order-btn {
      padding: 0.5rem 1rem;
      background-color: var(--primary);
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .order-btn:hover {
      background-color: var(--primary-dark);
    }
  `;
  document.head.appendChild(styleElement);
}