import { loadInventory } from './inventory.js';
import { loadBilling } from './billing.js';
import { loadReports } from './reports.js';
import { loadFeedback } from './feedback.js';
import { loadAlerts } from './lowAlerts.js';

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('homeTab').addEventListener('click', () => {
    document.getElementById('mainContent').innerHTML = `
      <div id="toast"></div>
      <main id="mainContent">
        <section class="hero-section">
          <h1>Manage Your Grocery Store with GroceryHub</h1>
          <p class="subtitle">Streamline your operations with our all-in-one inventory management solution.</p>
          <p>GroceryHub empowers grocery store owners to efficiently manage stock, process transactions, and gain insights through powerful reporting tools, all in a user-friendly platform.</p>
        </section>
        <section class="features-section">
          <h2>Key Features</h2>
          <div class="features-list">
            <div class="feature-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              </svg>
              <h3>Inventory Management</h3>
              <p>Track and update stock levels in real-time with ease.</p>
            </div>
            <div class="feature-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
              <h3>Billing</h3>
              <p>Process transactions quickly and view billing history.</p>
            </div>
            <div class="feature-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
              </svg>
              <h3>Reports</h3>
              <p>Generate detailed sales and inventory reports for insights.</p>
            </div>
            <div class="feature-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12" y2="16"></line>
              </svg>
              <h3>Alerts</h3>
              <p>Stay informed with notifications for low stock and updates.</p>
            </div>
            <div class="feature-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              <h3>Feedback</h3>
              <p>Collect customer suggestions to improve your store.</p>
            </div>
          </div>
        </section>
        <section class="dashboard">
          <h2>Explore GroceryHub</h2>
          <div class="cards">
            <div class="card" onclick="switchTab('homeTab')">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
                stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <h3>Home</h3>
              <p>View your store's overview and key metrics.</p>
            </div>
            <div class="card" onclick="switchTab('inventoryTab')">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
                stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              </svg>
              <h3>Inventory</h3>
              <p>Manage your stock levels and product details.</p>
            </div>
            <div class="card" onclick="switchTab('billingTab')">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
                stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
              <h3>Billing</h3>
              <p>Process transactions and view billing history.</p>
            </div>
            <div class="card" onclick="switchTab('reportsTab')">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
                stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
              </svg>
              <h3>Reports</h3>
              <p>Generate and review sales and inventory reports.</p>
            </div>
            <div class="card" onclick="switchTab('alertsTab')">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
                stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12" y2="16"></line>
              </svg>
              <h3>Alerts</h3>
              <p>Stay updated with low stock and other notifications.</p>
            </div>
            <div class="card" onclick="switchTab('feedbackTab')">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
                stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              <h3>Feedback</h3>
              <p>Share your suggestions and feedback.</p>
            </div>
          </div>
        </section>
      </main>
    `;

    // Add event listeners to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      card.addEventListener('click', (e) => {
        const tabId = card.getAttribute('onclick').match(/switchTab\('(.+)'\)/)[1];
        if (tabId) {
          switchTab(tabId);
        }
      });
    });
  });

  // Add event listeners to nav items
  const navItems = document.querySelectorAll('nav ul li a');
  navItems.forEach(navItem => {
    const tabId = navItem.id;
    if (tabId && ['homeTab', 'inventoryTab', 'billingTab', 'reportsTab', 'downloadsTab', 'feedbackTab', 'alertsTab'].includes(tabId)) {
      navItem.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default anchor behavior
        switchTab(tabId);
      });
    }
  });

  document.getElementById('inventoryTab').addEventListener('click', loadInventory);
  document.getElementById('billingTab').addEventListener('click', loadBilling);
  document.getElementById('reportsTab').addEventListener('click', loadReports);
  document.getElementById('alertsTab').addEventListener('click', loadAlerts);
  document.getElementById('feedbackTab').addEventListener('click', loadFeedback);
  document.getElementById('homeTab').click();
});

// Function to handle tab switching (to be used by cards, nav, and tabs)
function switchTab(tabId) {
  const tabs = ['homeTab', 'inventoryTab', 'billingTab', 'reportsTab', 'alertsTab', 'feedbackTab'];
  tabs.forEach((id) => {
    const tab = document.getElementById(id);
    if (tab) {
      tab.classList.remove('active');
    }
  });

  const activeTab = document.getElementById(tabId);
  if (activeTab) {
    activeTab.classList.add('active');
  }

  // Trigger the appropriate load function based on tabId
  switch (tabId) {
    case 'homeTab':
      document.getElementById('homeTab').click();
      break;
    case 'inventoryTab':
      loadInventory();
      break;
    case 'billingTab':
      loadBilling();
      break;
    case 'reportsTab':
      loadReports();
      break;
    case 'alertsTab':
      loadAlerts();
      break;
    case 'feedbackTab':
      loadFeedback();
      break;
    default:
      document.getElementById('homeTab').click();
  }
}

// Expose switchTab to global scope for onclick attributes
window.switchTab = switchTab;