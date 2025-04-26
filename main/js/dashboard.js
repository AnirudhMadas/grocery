export function loadDashboard() {
    document.getElementById('mainContent').innerHTML = `
      <div class="card">
        <h2>Sales & Stock Overview</h2>
        <canvas id="salesChart" width="400" height="200"></canvas>
      </div>
    `;
  
    import('https://cdn.jsdelivr.net/npm/chart.js').then(({ default: Chart }) => {
      const ctx = document.getElementById('salesChart').getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Fruits', 'Dairy', 'Beverages'],
          datasets: [{
            label: 'Stock Levels',
            data: [12, 19, 8], // Mock data
            backgroundColor: ['#ff6384', '#36a2eb', '#ffce56']
          }]
        }
      });
    });
  }
  