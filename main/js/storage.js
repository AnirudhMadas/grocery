export function getInventory() {
    return JSON.parse(localStorage.getItem('inventory')) || [];
  }
  
  export function saveInventory(items) {
    localStorage.setItem('inventory', JSON.stringify(items));
  }
  