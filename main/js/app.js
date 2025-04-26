import { loadInventory } from './inventory.js';
import { loadBilling } from './billing.js';
<<<<<<< HEAD
import { loadReports } from './reports.js';
=======
import { loadFeedback } from './feedback.js';
 
>>>>>>> 836a7021d1eb6fa271549548f855a343c1ecd02e

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

=======
  document.getElementById('feedbackTab').addEventListener('click', loadFeedback);
  
>>>>>>> 836a7021d1eb6fa271549548f855a343c1ecd02e

  document.getElementById('homeTab').click();
});


