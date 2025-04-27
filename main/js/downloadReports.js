// downloadReports.js

export function loadDownloads() {
    document.getElementById('mainContent').innerHTML = `
      <div class="card">
        <h2>Download Old Reports</h2>
        <p>Select the format you want to download the reports in:</p>
        <div class="download-buttons">
          <button class="btn" id="downloadCSV">Download CSV</button>
          <button class="btn" id="downloadTXT">Download TXT</button>
          <button class="btn" id="downloadJSON">Download JSON</button>
        </div>
      </div>
    `;
  
    document.getElementById('downloadCSV').addEventListener('click', downloadCSV);
    document.getElementById('downloadTXT').addEventListener('click', downloadTXT);
    document.getElementById('downloadJSON').addEventListener('click', downloadJSON);
  }
  
  function getSalesRecords() {
    return JSON.parse(localStorage.getItem('salesRecords')) || [];
  }
  
  function downloadCSV() {
    const data = getSalesRecords();
    if (data.length === 0) return alert("No sales records found!");
  
    const headers = ['Date', 'Product', 'Qty', 'Price', 'Total'];
    const rows = data.map(item => [
      item.date,
      item.name,
      item.qty,
      item.price,
      (item.qty * item.price).toFixed(2)
    ]);
  
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadFile(csvContent, 'sales-report.csv', 'text/csv');
  }
  
  function downloadTXT() {
    const data = getSalesRecords();
    if (data.length === 0) return alert("No sales records found!");
  
    const txtContent = data.map(item => 
      `Date: ${item.date}, Product: ${item.name}, Qty: ${item.qty}, Price: ₹${item.price}, Total: ₹${(item.price * item.qty).toFixed(2)}`
    ).join('\n');
  
    downloadFile(txtContent, 'sales-report.txt', 'text/plain');
  }
  
  function downloadJSON() {
    const data = getSalesRecords();
    if (data.length === 0) return alert("No sales records found!");
  
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, 'sales-report.json', 'application/json');
  }
  
  function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  