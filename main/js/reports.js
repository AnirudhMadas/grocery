// Sales Record Management Module
const STORAGE_KEY = 'salesRecords';

// Data handling functions
export function getSalesRecords() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (error) {
    console.error('Error loading sales records:', error);
    showToast('Error loading sales data. Using empty records.', 'error');
    return [];
  }
}

export function saveSalesRecords(records) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    return true;
  } catch (error) {
    console.error('Error saving sales records:', error);
    showToast('Failed to save sales data', 'error');
    return false;
  }
}

export function recordSale(cartItems) {
  if (!cartItems || !cartItems.length) return false;
  
  const salesRecords = getSalesRecords();
  const date = new Date().toLocaleDateString();
  
  const newSales = cartItems.map(item => ({
    id: generateId(),
    date,
    timestamp: Date.now(),
    name: item.name,
    qty: item.qty,
    price: item.price
  }));
  
  salesRecords.push(...newSales);
  return saveSalesRecords(salesRecords);
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function getMonthYear(dateString) {
  const date = new Date(dateString);
  return `${date.toLocaleString('default', { month: 'short' })}-${date.getFullYear()}`;
}

// UI functions
export function loadReports() {
  const salesRecords = getSalesRecords();
  
  document.getElementById('mainContent').innerHTML = `
    <div class="card">
      <h2>Sales Reports</h2>
      
      <div class="filter-controls">
        <div class="search-bar">
          <input type="text" id="reportSearchInput" placeholder="Search product name..." />
        </div>
        
        <div class="date-filters">
          <input type="date" id="startDateFilter" placeholder="Start Date">
          <input type="date" id="endDateFilter" placeholder="End Date">
          <button class="btn btn-small" id="applyFiltersBtn">Apply Filters</button>
          <button class="btn btn-small" id="resetFiltersBtn">Reset</button>
        </div>
      </div>

      <div class="download-section">
        <button class="btn btn-primary" id="exportCSVBtn">
          <i class="fas fa-file-csv"></i> Download CSV
        </button>
        <button class="btn btn-secondary" id="exportTXTBtn">
          <i class="fas fa-file-alt"></i> Download TXT
        </button>
        <button class="btn btn-secondary" id="exportJSONBtn">
          <i class="fas fa-file-code"></i> Download JSON
        </button>
        <button class="btn btn-danger" id="clearReportsBtn">
          <i class="fas fa-trash"></i> Clear Reports
        </button>
      </div>

      <div class="table-container">
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
        <div id="noRecordsMessage" style="display: ${salesRecords.length ? 'none' : 'block'}" class="empty-state">
          No sales records to display
        </div>
      </div>
      
      <div class="reports-summary">
        <div class="summary-card">
          <h4>Total Revenue</h4>
          <p class="summary-value">₹${calculateTotalRevenue(salesRecords).toFixed(2)}</p>
        </div>
        <div class="summary-card">
          <h4>Total Products Sold</h4>
          <p class="summary-value">${calculateTotalQuantity(salesRecords)}</p>
        </div>
        <div class="summary-card">
          <h4>Unique Products</h4>
          <p class="summary-value">${countUniqueProducts(salesRecords)}</p>
        </div>
      </div>

      <div class="graph-section">
        <h3>Sales Overview</h3>
        <div class="chart-container">
          <canvas id="monthlySalesChart"></canvas>
        </div>
        <div class="chart-container">
          <canvas id="topProductsChart"></canvas>
        </div>
      </div>
    </div>
  `;

  initializeReportsEventListeners();
  
  if (salesRecords.length) {
    drawMonthlySalesChart(salesRecords);
    drawTopProductsChart(salesRecords);
  }
}

function initializeReportsEventListeners() {
  // Search and filter functionality
  document.getElementById('reportSearchInput').addEventListener('input', filterReports);
  document.getElementById('applyFiltersBtn').addEventListener('click', filterReports);
  document.getElementById('resetFiltersBtn').addEventListener('click', resetFilters);
  
  // Export buttons
  document.getElementById('exportCSVBtn').addEventListener('click', () => exportData('csv'));
  document.getElementById('exportTXTBtn').addEventListener('click', () => exportData('txt'));
  document.getElementById('exportJSONBtn').addEventListener('click', () => exportData('json'));
  
  // Clear reports button
  document.getElementById('clearReportsBtn').addEventListener('click', clearAllReports);
}

function filterReports() {
  const salesRecords = getSalesRecords();
  const searchTerm = document.getElementById('reportSearchInput').value.toLowerCase();
  const startDate = document.getElementById('startDateFilter').value;
  const endDate = document.getElementById('endDateFilter').value;
  
  let filtered = salesRecords;
  
  // Apply search filter
  if (searchTerm) {
    filtered = filtered.filter(item => 
      item.name.toLowerCase().includes(searchTerm)
    );
  }
  
  // Apply date filters
  if (startDate) {
    const start = new Date(startDate);
    filtered = filtered.filter(item => new Date(item.date) >= start);
  }
  
  if (endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Set to end of day
    filtered = filtered.filter(item => new Date(item.date) <= end);
  }
  
  // Update table and charts
  document.querySelector('#salesReportTable tbody').innerHTML = renderReportRows(filtered);
  document.getElementById('noRecordsMessage').style.display = filtered.length ? 'none' : 'block';
  
  // Update charts with filtered data
  if (filtered.length) {
    drawMonthlySalesChart(filtered);
    drawTopProductsChart(filtered);
  }
}

function resetFilters() {
  document.getElementById('reportSearchInput').value = '';
  document.getElementById('startDateFilter').value = '';
  document.getElementById('endDateFilter').value = '';
  
  const salesRecords = getSalesRecords();
  document.querySelector('#salesReportTable tbody').innerHTML = renderReportRows(salesRecords);
  document.getElementById('noRecordsMessage').style.display = salesRecords.length ? 'none' : 'block';
  
  if (salesRecords.length) {
    drawMonthlySalesChart(salesRecords);
    drawTopProductsChart(salesRecords);
  }
}

function clearAllReports() {
  if (!confirm('Are you sure you want to clear all sales reports? This action cannot be undone.')) {
    return;
  }
  
  if (saveSalesRecords([])) {
    document.querySelector('#salesReportTable tbody').innerHTML = '';
    document.getElementById('noRecordsMessage').style.display = 'block';
    
    // Clear charts
    const chartsToDestroy = ['monthlySalesChart', 'topProductsChart'];
    chartsToDestroy.forEach(chartId => {
      const chartElement = document.getElementById(chartId);
      if (chartElement && chartElement.chart) {
        chartElement.chart.destroy();
      }
    });
    
    // Update summary cards
    document.querySelectorAll('.summary-value').forEach(el => {
      el.textContent = el.textContent.includes('₹') ? '₹0.00' : '0';
    });
    
    showToast('Reports cleared successfully', 'success');
  }
}

// Reporting functions
function calculateTotalRevenue(records) {
  return records.reduce((sum, item) => sum + (item.price * item.qty), 0);
}

function calculateTotalQuantity(records) {
  return records.reduce((sum, item) => sum + item.qty, 0);
}

function countUniqueProducts(records) {
  return new Set(records.map(item => item.name)).size;
}

function renderReportRows(data) {
  if (!data.length) return '';

  // Group by date
  const grouped = {};
  data.forEach(item => {
    if (!grouped[item.date]) grouped[item.date] = [];
    grouped[item.date].push(item);
  });

  let rows = '';
  const dates = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a)); // Sort by date descending

  dates.forEach(date => {
    const items = grouped[date];
    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

    // Add a separator row for the date
    rows += `
      <tr class="date-header">
        <td colspan="5">${formatDate(date)}</td>
      </tr>
    `;

    // Add all products under this date
    items.sort((a, b) => a.name.localeCompare(b.name)); // Sort products alphabetically
    rows += items.map(item => `
      <tr class="product-row">
        <td>${formatTime(item.timestamp) || item.date}</td>
        <td>${escapeHtml(item.name)}</td>
        <td>${item.qty}</td>
        <td>₹${parseFloat(item.price).toFixed(2)}</td>
        <td>₹${(item.qty * item.price).toFixed(2)}</td>
      </tr>
    `).join('');

    // Add total row
    rows += `
      <tr class="total-row">
        <td>${formatDate(date)}</td>
        <td>TOTAL SALES</td>
        <td>-</td>
        <td>-</td>
        <td>₹${total.toFixed(2)}</td>
      </tr>
    `;
  });

  return rows;
}

function formatDate(dateString) {
  const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function formatTime(timestamp) {
  if (!timestamp) return '';
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Chart functions
function drawMonthlySalesChart(data) {
  if (!data.length) return;

  const monthlyTotals = {};
  const monthlyCounts = {};

  data.forEach(item => {
    const monthYear = getMonthYear(item.date);
    if (!monthlyTotals[monthYear]) {
      monthlyTotals[monthYear] = 0;
      monthlyCounts[monthYear] = 0;
    }
    monthlyTotals[monthYear] += item.price * item.qty;
    monthlyCounts[monthYear] += item.qty;
  });

  // Sort months chronologically
  const months = Object.keys(monthlyTotals).sort((a, b) => {
    const [monthA, yearA] = a.split('-');
    const [monthB, yearB] = b.split('-');
    return new Date(`${monthA} 1, ${yearA}`) - new Date(`${monthB} 1, ${yearB}`);
  });

  const ctx = document.getElementById('monthlySalesChart').getContext('2d');
  
  // Destroy previous chart if it exists
  if (ctx.canvas.chart) {
    ctx.canvas.chart.destroy();
  }
  
  ctx.canvas.chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: months,
      datasets: [
        {
          label: 'Revenue (₹)',
          data: months.map(month => monthlyTotals[month]),
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          yAxisID: 'y'
        },
        {
          label: 'Units Sold',
          data: months.map(month => monthlyCounts[month]),
          backgroundColor: 'rgba(255, 99, 132, 0.7)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
          type: 'line',
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Revenue (₹)'
          },
          position: 'left'
        },
        y1: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Units Sold'
          },
          position: 'right',
          grid: {
            drawOnChartArea: false
          }
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'Monthly Sales Overview'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.dataset.label || '';
              const value = context.raw || 0;
              return label === 'Revenue (₹)' ? `${label}: ₹${value.toFixed(2)}` : `${label}: ${value}`;
            }
          }
        }
      }
    }
  });
}

function drawTopProductsChart(data) {
  if (!data.length) return;

  // Aggregate product sales
  const productSales = {};
  
  data.forEach(item => {
    if (!productSales[item.name]) {
      productSales[item.name] = {
        totalRevenue: 0,
        totalQuantity: 0
      };
    }
    productSales[item.name].totalRevenue += item.price * item.qty;
    productSales[item.name].totalQuantity += item.qty;
  });
  
  // Sort products by revenue and get top 5
  const topProducts = Object.keys(productSales)
    .sort((a, b) => productSales[b].totalRevenue - productSales[a].totalRevenue)
    .slice(0, 5);
  
  const ctx = document.getElementById('topProductsChart').getContext('2d');
  
  // Destroy previous chart if it exists
  if (ctx.canvas.chart) {
    ctx.canvas.chart.destroy();
  }
  
  const backgroundColors = [
    'rgba(255, 99, 132, 0.7)',
    'rgba(54, 162, 235, 0.7)',
    'rgba(255, 206, 86, 0.7)',
    'rgba(75, 192, 192, 0.7)',
    'rgba(153, 102, 255, 0.7)'
  ];
  
  ctx.canvas.chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: topProducts,
      datasets: [{
        label: 'Revenue Share',
        data: topProducts.map(product => productSales[product].totalRevenue),
        backgroundColor: backgroundColors,
        borderColor: backgroundColors.map(color => color.replace('0.7', '1')),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Top 5 Products by Revenue'
        },
        legend: {
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.raw || 0;
              const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
              const percentage = Math.round((value / total) * 100);
              return `${label}: ₹${value.toFixed(2)} (${percentage}%)`;
            }
          }
        }
      }
    }
  });
}

// Export functions
function exportData(type) {
  const salesRecords = getSalesRecords();
  if (salesRecords.length === 0) {
    showToast("No sales records to export!", "warning");
    return;
  }

  try {
    let content = '';
    let mimeType = '';
    let filename = `sales-report-${new Date().toISOString().slice(0, 10)}`;

    // Group by date
    const grouped = {};
    salesRecords.forEach(item => {
      if (!grouped[item.date]) grouped[item.date] = [];
      grouped[item.date].push(item);
    });

    if (type === 'csv') {
      content = generateCSV(grouped);
      mimeType = 'text/csv';
      filename += '.csv';
    }
    else if (type === 'txt') {
      content = generateTXT(grouped);
      mimeType = 'text/plain';
      filename += '.txt';
    }
    else if (type === 'json') {
      content = generateJSON(grouped);
      mimeType = 'application/json';
      filename += '.json';
    }

    downloadFile(content, filename, mimeType);
    showToast(`${type.toUpperCase()} export successful!`, 'success');
  } catch (error) {
    console.error('Error exporting data:', error);
    showToast('Failed to export data', 'error');
  }
}

function generateCSV(grouped) {
  const headers = ['Date', 'Time', 'Product', 'Quantity', 'Unit Price (₹)', 'Total (₹)'];
  let rows = [headers.join(',')];

  Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a)).forEach(date => {
    const items = grouped[date];
    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

    items.forEach(item => {
      rows.push([
        item.date,
        formatTime(item.timestamp) || 'N/A',
        escapeCsvField(item.name),
        item.qty,
        item.price.toFixed(2),
        (item.qty * item.price).toFixed(2)
      ].join(','));
    });

    rows.push([date, '', 'DAILY TOTAL', '', '', total.toFixed(2)].join(','));
  });

  return rows.join('\n');
}

function escapeCsvField(field) {
  // If the field contains commas, quotes, or newlines, enclose it in quotes
  if (/[",\n\r]/.test(field)) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

function generateTXT(grouped) {
  let rows = ['SALES REPORT', '============', ''];

  Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a)).forEach(date => {
    const items = grouped[date];
    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

    rows.push(`=== ${formatDate(date)} ===`);
    
    items.forEach(item => {
      rows.push(`- ${item.name}`);
      rows.push(`  Quantity: ${item.qty}, Unit Price: ₹${item.price.toFixed(2)}, Total: ₹${(item.qty * item.price).toFixed(2)}`);
    });
    
    rows.push(`DAILY TOTAL: ₹${total.toFixed(2)}`);
    rows.push('');
  });

  const grandTotal = Object.values(grouped).flat()
    .reduce((sum, item) => sum + item.price * item.qty, 0);
  
  rows.push('=================');
  rows.push(`GRAND TOTAL: ₹${grandTotal.toFixed(2)}`);
  rows.push('=================');

  return rows.join('\n');
}

function generateJSON(grouped) {
  const report = {
    generatedAt: new Date().toISOString(),
    summary: {
      totalRevenue: 0,
      totalItems: 0,
      uniqueProducts: 0
    },
    dailySales: []
  };

  const allItems = Object.values(grouped).flat();
  report.summary.totalRevenue = allItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  report.summary.totalItems = allItems.reduce((sum, item) => sum + item.qty, 0);
  report.summary.uniqueProducts = new Set(allItems.map(item => item.name)).size;

  Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a)).forEach(date => {
    const items = grouped[date];
    const dailyTotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);

    report.dailySales.push({
      date,
      totalSales: dailyTotal,
      items: items.map(item => ({
        product: item.name,
        quantity: item.qty,
        unitPrice: item.price,
        totalPrice: item.qty * item.price,
        timestamp: item.timestamp || null
      }))
    });
  });

  return JSON.stringify(report, null, 2);
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}

import { showToast } from './alerts.js';