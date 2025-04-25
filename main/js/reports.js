
export  function loadReports() {
    document.getElementById('mainContent').innerHTML = `
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
        </select>
        <button type="submit">Add Product</button>
      </form>
      <div id="inventoryList"></div>
    </div>
  `;
    
}