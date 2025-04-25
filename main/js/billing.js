import { getInventory } from './storage.js';
import { showToast } from './alerts.js';

export function loadBilling() {
  const inventory = getInventory();
  let cart = [];

  const renderBilling = () => {
    const cartHtml = cart.map((item, i) => `
      <div class="card">
        <strong>${item.name}</strong> x ${item.qty} - Rs.${item.price * item.qty}
        <button onclick="removeFromCart(${i})">Remove</button>
      </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    document.getElementById('billingContent').innerHTML = `
      ${cartHtml || "<p>No items in cart.</p>"}
      <h3>Total: Rs.${total.toFixed(2)}</h3>
      <button onclick="generateInvoiceImage()">Generate Invoice</button>
    `;
  };

  document.getElementById('mainContent').innerHTML = `
    <div class="card">
      <h2>Billing System</h2>

      <select id="productSelect">
        <option value="">Select Product</option>
        ${inventory.map((item, i) => `<option value="${i}">${item.name} (Rs.${item.price})</option>`).join('')}
      </select>
      <input type="number" id="productQty" placeholder="Qty" min="1" />
      <button onclick="addToCart()">Add to Cart</button>
      <div id="billingContent"></div>
    </div>
  `;

  window.addToCart = () => {
    const idx = productSelect.value;
    const qty = Number(productQty.value);
    if (idx === "" || qty <= 0) return showToast('Invalid item or quantity', 'error');
    const product = inventory[idx];
    cart.push({ ...product, qty });
    showToast('Added to cart', 'success');
    renderBilling();
  };

  window.removeFromCart = (i) => {
    cart.splice(i, 1);
    renderBilling();
  };

  window.generateInvoiceImage = () => {
    import('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js')
      .then(html2canvas => {
        // Select the container for the invoice (replace `#invoiceContainer` with your actual container)
        const invoiceContent = $('.card')[0]; 
  
        html2canvas(invoiceContent).then(canvas => {
          // Create an image URL from the canvas
          const imageUrl = canvas.toDataURL('image/png');
  
          // Create a temporary link element to trigger the download
          const link = document.createElement('a');
          link.href = imageUrl;
          link.download = 'invoice.png';  // Name of the image file to download
          link.click();  // Trigger the download
        });
      })
      .catch(error => {
        console.error('Error generating image:', error);
      });
  };
  
}


// bills
