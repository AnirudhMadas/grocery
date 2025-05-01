import { getInventory, saveInventory } from './storage.js';
import { showToast } from './alerts.js';

export function loadInventory() {
  const items = getInventory();
  
  // Get all unique categories from inventory
  const categories = [...new Set(items.map(item => item.category))].filter(Boolean);
  // Add "All" category at the beginning
  categories.unshift('All');

  // HTML layout with categories filter
  document.getElementById('mainContent').innerHTML = `
    <div class="inventory-container">
      <!-- Left: Form and Filters Section -->
      <div class="sidebar">
        <div class="card">
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
              <option value="Bakery">Bakery</option>
              <option value="Snacks">Snacks</option>
              <option value="Household">Household</option>
              <option value="Personal Care">Personal Care</option>
            </select>
            <input type="text" id="pImage" placeholder="Image URL" />
            <p class="form-hint">Leave blank to use default image</p>
            <button type="submit">Add Product</button>
          </form>
        </div>
        
        <div class="card filter-section">
          <h3>Filters</h3>
          <div class="category-filters">
            <h4>Categories</h4>
            <div id="categoryFilters">
              ${categories.map(cat => 
                `<div class="filter-option">
                  <input type="radio" id="cat_${cat}" name="category" value="${cat}" ${cat === 'All' ? 'checked' : ''}>
                  <label for="cat_${cat}">${cat}</label>
                </div>`
              ).join('')}
            </div>
          </div>
          
          <div class="stock-filters">
            <h4>Stock Level</h4>
            <div class="filter-option">
              <input type="checkbox" id="filter_instock" name="stock_filter" value="instock" checked>
              <label for="filter_instock">In Stock</label>
            </div>
            <div class="filter-option">
              <input type="checkbox" id="filter_lowstock" name="stock_filter" value="lowstock" checked>
              <label for="filter_lowstock">Low Stock</label>
            </div>
            <div class="filter-option">
              <input type="checkbox" id="filter_outofstock" name="stock_filter" value="outofstock" checked>
              <label for="filter_outofstock">Out of Stock</label>
            </div>
          </div>
          
          <div class="sort-options">
            <h4>Sort By</h4>
            <select id="sortOrder">
              <option value="name_asc">Name (A-Z)</option>
              <option value="name_desc">Name (Z-A)</option>
              <option value="price_asc">Price (Low to High)</option>
              <option value="price_desc">Price (High to Low)</option>
              <option value="qty_asc">Stock (Low to High)</option>
              <option value="qty_desc">Stock (High to Low)</option>
            </select>
          </div>
          
          <div class="search-box">
            <h4>Search</h4>
            <input type="text" id="inventorySearch" placeholder="Search products...">
          </div>
        </div>
      </div>

      <!-- Right: Inventory Display -->
      <div class="main-content">
        <div class="filter-summary">
          <h2>Products <span id="productCount"></span></h2>
          <button id="clearFilters" class="small-btn">Clear Filters</button>
        </div>
        <div id="inventoryList" class="inventory-grid"></div>
      </div>
    </div>
  `;

  // Function to apply all filters and render
  const applyFiltersAndRender = () => {
    // Get filter values
    const selectedCategory = document.querySelector('input[name="category"]:checked').value;
    const showInStock = document.getElementById('filter_instock').checked;
    const showLowStock = document.getElementById('filter_lowstock').checked;
    const showOutOfStock = document.getElementById('filter_outofstock').checked;
    const sortBy = document.getElementById('sortOrder').value;
    const searchQuery = document.getElementById('inventorySearch').value.toLowerCase();
    
    // Filter items
    let filteredItems = [...items];
    
    // Apply category filter
    if (selectedCategory !== 'All') {
      filteredItems = filteredItems.filter(item => item.category === selectedCategory);
    }
    
    // Apply stock filters
    filteredItems = filteredItems.filter(item => {
      if (item.qty <= 0 && showOutOfStock) return true;
      if (item.qty > 0 && item.qty < 10 && showLowStock) return true;
      if (item.qty >= 10 && showInStock) return true;
      return false;
    });
    
    // Apply search filter
    if (searchQuery) {
      filteredItems = filteredItems.filter(item => 
        item.name.toLowerCase().includes(searchQuery) || 
        item.category.toLowerCase().includes(searchQuery)
      );
    }
    
    // Apply sorting
    const [sortField, sortDirection] = sortBy.split('_');
    filteredItems.sort((a, b) => {
      let comparison = 0;
      
      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else {
        comparison = a[sortField] - b[sortField];
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    // Update product count
    document.getElementById('productCount').textContent = `(${filteredItems.length})`;
    
    // Render filtered list
    renderInventoryList(filteredItems);
  };

  // Renders the inventory items list
  const renderInventoryList = (itemsToRender) => {
    const listHtml = itemsToRender.map((item, index) => {
      // Get original index in the full items array
      const originalIndex = items.findIndex(i => 
        i.name === item.name && 
        i.price === item.price && 
        i.category === item.category
      );
      
      // Determine stock level class
      let stockLevelClass = '';
      let stockStatus = '';
      
      if (item.qty <= 0) {
        stockLevelClass = 'stock-low';
        stockStatus = 'Out of Stock';
      } else if (item.qty < 10) {
        stockLevelClass = 'stock-medium';
        stockStatus = 'Low Stock';
      } else {
        stockLevelClass = 'stock-good';
        stockStatus = 'In Stock';
      }
      
      // Use the product image or a placeholder
      const imageUrl = item.imageUrl || 'https://via.placeholder.com/100';
      
      return `
        <div class="card inventoryCard" data-category="${item.category}">
          <div class="card-header">
            <span class="category-tag">${item.category}</span>
            <span class="stock-level ${stockLevelClass}">${stockStatus}</span>
          </div>
          <img src="${imageUrl}" alt="${item.name}" class="product-image">
          <div class="product-details">
            <h3>${item.name}</h3>
            <p class="product-quantity">Quantity: ${item.qty}</p>
            <p class="product-price">Rs.${item.price.toFixed(2)}</p>
          </div>
          <div class="card-actions">
            <button onclick="editProduct(${originalIndex})">Edit</button>
            <button onclick="deleteProduct(${originalIndex})" class="delete-btn">Delete</button>
          </div>
        </div>
      `;
    }).join('');
    
    document.getElementById('inventoryList').innerHTML = listHtml || '<p class="empty-message">No products match your filters.</p>';
  };

  // Handle editing a product
  window.editProduct = (i) => {
    const item = items[i];
    document.getElementById('pName').value = item.name;
    document.getElementById('pQty').value = item.qty;
    document.getElementById('pPrice').value = item.price;
    document.getElementById('pCat').value = item.category;
    document.getElementById('pImage').value = item.imageUrl || '';
    
    // Change form behavior to update instead of add
    const form = document.getElementById('productForm');
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Update Product';
    
    // Store the index being edited
    form.dataset.editIndex = i;
    
    // Scroll to form
    form.scrollIntoView({ behavior: 'smooth' });
    
    showToast('Edit mode: Update product details', 'info');
  };

  // Handle deleting a product
  window.deleteProduct = (i) => {
    if (confirm('Are you sure you want to delete this product?')) {
      items.splice(i, 1);
      saveInventory(items);
      showToast('Product deleted', 'error');
      
      // Refresh category filters in case we deleted the last item in a category
      refreshCategoryFilters();
      
      // Re-apply filters and render
      applyFiltersAndRender();
    }
  };

  // Refresh category filters based on current inventory
  const refreshCategoryFilters = () => {
    const currentCategories = [...new Set(items.map(item => item.category))].filter(Boolean);
    currentCategories.unshift('All');
    
    const filterContainer = document.getElementById('categoryFilters');
    const currentSelected = document.querySelector('input[name="category"]:checked')?.value || 'All';
    
    filterContainer.innerHTML = currentCategories.map(cat => 
      `<div class="filter-option">
        <input type="radio" id="cat_${cat}" name="category" value="${cat}" ${cat === currentSelected ? 'checked' : ''}>
        <label for="cat_${cat}">${cat}</label>
      </div>`
    ).join('');
    
    // Re-add event listeners
    document.querySelectorAll('input[name="category"]').forEach(radio => {
      radio.addEventListener('change', applyFiltersAndRender);
    });
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
      category: pCat.value,
      imageUrl: pImage.value || '' // Store image URL
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
    
    // Refresh category filters in case we added a new category
    refreshCategoryFilters();
    
    // Re-apply filters and render
    applyFiltersAndRender();
  });

  // Set up filter event listeners
  document.getElementById('sortOrder').addEventListener('change', applyFiltersAndRender);
  document.getElementById('inventorySearch').addEventListener('input', applyFiltersAndRender);
  document.getElementById('filter_instock').addEventListener('change', applyFiltersAndRender);
  document.getElementById('filter_lowstock').addEventListener('change', applyFiltersAndRender);
  document.getElementById('filter_outofstock').addEventListener('change', applyFiltersAndRender);
  document.querySelectorAll('input[name="category"]').forEach(radio => {
    radio.addEventListener('change', applyFiltersAndRender);
  });

  // Clear filters button
  document.getElementById('clearFilters').addEventListener('click', () => {
    document.getElementById('filter_instock').checked = true;
    document.getElementById('filter_lowstock').checked = true;
    document.getElementById('filter_outofstock').checked = true;
    document.getElementById('inventorySearch').value = '';
    document.getElementById('sortOrder').value = 'name_asc';
    document.querySelector('#cat_All').checked = true;
    applyFiltersAndRender();
  });

  // Initial render with filters applied
  applyFiltersAndRender();

  // Add CSS for the new layout
  const style = document.createElement('style');
  style.textContent = `
    .inventory-container {
      display: flex;
      gap: 2rem;
    }
    .sidebar {
      flex: 0 0 300px;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .main-content {
      flex: 1;
    }
    .inventory-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 1rem;
    }
    .filter-section {
      padding: 1rem;
    }
    .filter-section h3, .filter-section h4 {
      margin-top: 0;
      margin-bottom: 0.5rem;
    }
    .filter-option {
      margin-bottom: 0.5rem;
    }
    .sort-options, .search-box, .category-filters, .stock-filters {
      margin-bottom: 1.5rem;
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }
    .category-tag {
      background: #eee;
      padding: 0.2rem 0.5rem;
      border-radius: 3px;
      font-size: 0.8rem;
    }
    .product-image {
      width: 100%;
      height: 150px;
      object-fit: cover;
      border-radius: 4px;
      margin-bottom: 0.8rem;
    }
    .product-details {
      margin-bottom: 1rem;
    }
    .card-actions {
      display: flex;
      justify-content: space-between;
    }
    .delete-btn {
      background-color: #ffecec;
      color: #d32f2f;
    }
    .filter-summary {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .small-btn {
      padding: 0.3rem 0.7rem;
    }
    .empty-message {
      grid-column: 1 / -1;
      text-align: center;
      padding: 2rem;
      background: #f9f9f9;
      border-radius: 4px;
    }
  `;
  document.head.appendChild(style);
}