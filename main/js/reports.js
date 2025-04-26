let salesRecords = JSON.parse(localStorage.getItem('salesRecords')) || [];

export function loadReports() {
  document.getElementById('mainContent').innerHTML = `
    <div class="card">
      <h2>Sales Reports</h2>
      <div class="search-bar">
        <input type="text" id="reportSearchInput" placeholder="Search product name..." />
        <button class="btn btn-primary" id="exportCSVBtn">Export CSV</button>
        <button class="btn btn-secondary" id="clearReportsBtn" style="margin-left: 10px; background-color: #f44336;">Clear Reports</button>
      </div>
      <table id="salesReportTable">
        <thead>
          <tr>
            <th>Date</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Price (₹)</th>
            <th>Total (₹)</th>
          </tr>
        </thead>
        <tbody>
          ${renderReportRows(salesRecords)}
        </tbody>
      </table>
    </div>
  `;

  // Search functionality
  document.getElementById('reportSearchInput').addEventListener('input', e => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = salesRecords.filter(item =>
      item.name.toLowerCase().includes(searchTerm)
    );
    document.querySelector('#salesReportTable tbody').innerHTML = renderReportRows(filtered);
  });

  // Export CSV functionality
  document.getElementById('exportCSVBtn').addEventListener('click', () => {
    const csv = generateCSV(salesRecords);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sales-report-${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  // Clear Reports functionality
  document.getElementById('clearReportsBtn').addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all sales reports? This action cannot be undone.')) {
      salesRecords = [];
      localStorage.setItem('salesRecords', JSON.stringify(salesRecords));
      document.querySelector('#salesReportTable tbody').innerHTML = renderReportRows(salesRecords);
      showToast('Reports cleared successfully', 'success');
    }
  });
}

function renderReportRows(data) {
  if (data.length === 0) {
    return '<tr><td colspan="5" style="text-align: center;">No sales records found</td></tr>';
  }
  
  return data.map(item => `
    <tr>
      <td>${item.date}</td>
      <td>${item.name}</td>
      <td>${item.qty}</td>
      <td>${item.price.toFixed(2)}</td>
      <td>${(item.qty * item.price).toFixed(2)}</td>
    </tr>
  `).join('');
}

function generateCSV(data) {
  const headers = ['Date', 'Product', 'Qty', 'Price', 'Total'];
  const rows = data.map(item => [
    item.date,
    item.name,
    item.qty,
    item.price.toFixed(2),
    (item.qty * item.price).toFixed(2)
  ]);
  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

export function recordSale(cartItems) {
  const date = new Date().toLocaleDateString();
  const newSales = cartItems.map(item => ({
    date,
    name: item.name,
    qty: item.qty,
    price: item.price
  }));
  salesRecords.push(...newSales);
  localStorage.setItem('salesRecords', JSON.stringify(salesRecords));
}

// Import the showToast function
import { showToast } from './alerts.js';