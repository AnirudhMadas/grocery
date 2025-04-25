import { getInventory, saveInventory } from './storage.js';
import { showToast } from './alerts.js';

export function loadInventory() {
  const items = getInventory();

  // HTML layout
  document.getElementById('mainContent').innerHTML = `
    <div style="display: flex; gap: 2rem; align-items: flex-start;">
      <!-- Left: Form Section -->
      <div class="card" style="flex: 0 0 300px;">
        <h2>Inventory Manager</h2>
        <form id="productForm">
          <input type="text" id="pName" placeholder="Product Name" required />
          <input type="number" id="pQty" placeholder="Quantity" required />
          <input type="number" id="pPrice" placeholder="Price" required />
          <select id="pCat" required>
            <option value="">Category</option>
            <option value="Fruits">Fruits</option>
            <option value="Dairy">Dairy</option>
            <option value="Beverages">Beverages</option>
          </select>
          <button type="submit">Add Product</button>
        </form>
      </div>

      <!-- Right: Inventory Row Display -->
      <div id="inventoryList" style="display: flex; flex-wrap: wrap; gap: 1rem;"></div>
    </div>
  `;

  // Renders all items as cards in row format
  const renderList = () => {
    const listHtml = items.map((item, index) => `
      <div class="card" style="min-width: 200px; max-width: 220px; flex: 1;">
        <h3>${item.name}</h3>
        <p>Quantity: ${item.qty}</p>
        <p>Price: $${item.price}</p>
        <p>Category: ${item.category}</p>
        <button onclick="editProduct(${index})">Edit</button>
        <button onclick="deleteProduct(${index})">Delete</button>
      </div>
    `).join('');
    document.getElementById('inventoryList').innerHTML = listHtml;
  };

  // Handle editing a product
  window.editProduct = (i) => {
    const item = items[i];
    document.getElementById('pName').value = item.name;
    document.getElementById('pQty').value = item.qty;
    document.getElementById('pPrice').value = item.price;
    document.getElementById('pCat').value = item.category;
    showToast('Product edites', 'error');
    //deleteProduct(i); // remove so it can be added again
  };

  // Handle deleting a product
  window.deleteProduct = (i) => {
    items.splice(i, 1);
    saveInventory(items);
    showToast('Product deleted', 'error');
    renderList();
  };

  // Handle form submission
  document.getElementById('productForm').addEventListener('submit', e => {
    e.preventDefault();
    const newItem = {
      name: pName.value,
      qty: Number(pQty.value),
      price: Number(pPrice.value),
      category: pCat.value
    };
    items.push(newItem);
    saveInventory(items);
    showToast('Product added', 'success');
    e.target.reset();
    renderList();
  });

  // Initial render
  renderList();
}
