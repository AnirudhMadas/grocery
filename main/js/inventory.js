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
    const listHtml = items.map((item, index) => {
      // Determine stock level class
      let stockLevelClass = '';
      let stockStatus = '';
      
      if (item.qty <= 0) {
        stockLevelClass = 'stock-low';
        stockStatus = 'Out of Stock';
      } else if (item.qty < 5) {
        stockLevelClass = 'stock-medium';
        stockStatus = 'Low Stock';
      } else {
        stockLevelClass = 'stock-good';
        stockStatus = 'In Stock';
      }
      
      return `
        <div class="card inventoryCard" style="min-width: 200px; max-width: 220px; flex: 1;">
          <h3>${item.name}</h3>
          <p>Quantity: <span class="stock-level ${stockLevelClass}">${item.qty} (${stockStatus})</span></p>
          <p>Price: Rs.${item.price}</p>
          <p>Category: ${item.category}</p>
          <div class="btns">
            <button onclick="editProduct(${index})">Edit</button>
            <button onclick="deleteProduct(${index})">Delete</button>
          </div>
        </div>
      `;
    }).join('');
    
    document.getElementById('inventoryList').innerHTML = listHtml || '<p>No inventory items found.</p>';
  };

  // Handle editing a product
  window.editProduct = (i) => {
    const item = items[i];
    document.getElementById('pName').value = item.name;
    document.getElementById('pQty').value = item.qty;
    document.getElementById('pPrice').value = item.price;
    document.getElementById('pCat').value = item.category;
    
    // Change form behavior to update instead of add
    const form = document.getElementById('productForm');
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Update Product';
    
    // Store the index being edited
    form.dataset.editIndex = i;
    
    showToast('Edit mode: Update product details', 'info');
  };

  // Handle deleting a product
  window.deleteProduct = (i) => {
    if (confirm('Are you sure you want to delete this product?')) {
      items.splice(i, 1);
      saveInventory(items);
      showToast('Product deleted', 'error');
      renderList();
    }
  };

  // Handle form submission
  document.getElementById('productForm').addEventListener('submit', e => {
    e.preventDefault();
    
    const form = e.target;
    const editIndex = form.dataset.editIndex;
    
    const itemData = {
      name: pName.value,
      qty: Number(pQty.value),
      price: Number(pPrice.value),
      category: pCat.value
    };
    
    if (editIndex !== undefined) {
      // Update existing product
      items[editIndex] = itemData;
      delete form.dataset.editIndex;
      form.querySelector('button[type="submit"]').textContent = 'Add Product';
      showToast('Product updated', 'success');
    } else {
      // Add new product
      items.push(itemData);
      showToast('Product added', 'success');
    }
    
    saveInventory(items);
    e.target.reset();
    renderList();
  });

  // Initial render
  renderList();
}