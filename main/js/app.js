import { loadInventory } from './inventory.js';
import { loadBilling } from './billing.js';
import { loadReports } from './reports.js';
import { loadFeedback } from './feedback.js';
import { loadAlerts, addAlertStyles } from './lowAlerts.js';

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('homeTab').addEventListener('click', () => {
    document.getElementById('mainContent').innerHTML = `
      <div class="card">
        <h1>GroceryHub</h1>
        <p>Welcome back! Here's your store overview for today.</p>
      </div>
    `;
  });

  document.getElementById('inventoryTab').addEventListener('click', loadInventory);
  document.getElementById('billingTab').addEventListener('click', loadBilling);
  document.getElementById('reportsTab').addEventListener('click', loadReports);
  document.getElementById('feedbackTab').addEventListener('click', loadFeedback);
  document.getElementById('alertsTab').addEventListener('click', loadAlerts);
  
  document.getElementById('homeTab').click();
});


