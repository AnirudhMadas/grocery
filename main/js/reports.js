let salesRecords = JSON.parse(localStorage.getItem('salesRecords')) || [];

export function loadReports() {
  document.getElementById('mainContent').innerHTML = `
    <div class="card">
      <h2>Sales Reports</h2>
      
      <div class="search-bar">
        <input type="text" id="reportSearchInput" placeholder="Search product name..." />
      </div>

      <div class="download-section">
        <button class="btn btn-primary" id="exportCSVBtn">Download CSV</button>
        <button class="btn btn-secondary" id="exportTXTBtn">Download TXT</button>
        <button class="btn btn-secondary" id="exportJSONBtn">Download JSON</button>
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

  document.getElementById('reportSearchInput').addEventListener('input', e => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = salesRecords.filter(item =>
      item.name.toLowerCase().includes(searchTerm)
    );
    document.querySelector('#salesReportTable tbody').innerHTML = renderReportRows(filtered);
  });

  document.getElementById('exportCSVBtn').addEventListener('click', () => {
    exportData('csv');
  });

  document.getElementById('exportTXTBtn').addEventListener('click', () => {
    exportData('txt');
  });

  document.getElementById('exportJSONBtn').addEventListener('click', () => {
    exportData('json');
  });
}

function renderReportRows(data) {
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

function exportData(type) {
  const data = salesRecords;
  if (data.length === 0) {
    alert("No sales records found!");
    return;
  }

  let content = '';
  let mimeType = '';
  let filename = `sales-report-${Date.now()}`;

  if (type === 'csv') {
    const headers = ['Date', 'Product', 'Qty', 'Price', 'Total'];
    const rows = data.map(item => [
      item.date,
      item.name,
      item.qty,
      item.price.toFixed(2),
      (item.qty * item.price).toFixed(2)
    ]);
    content = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    mimeType = 'text/csv';
    filename += '.csv';
  }
  else if (type === 'txt') {
    content = data.map(item => 
      `Date: ${item.date}, Product: ${item.name}, Qty: ${item.qty}, Price: ₹${item.price}, Total: ₹${(item.price * item.qty).toFixed(2)}`
    ).join('\n');
    mimeType = 'text/plain';
    filename += '.txt';
  }
  else if (type === 'json') {
    content = JSON.stringify(data, null, 2);
    mimeType = 'application/json';
    filename += '.json';
  }

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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
