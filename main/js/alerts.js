export function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  toast.innerHTML = `<div class="toast ${type}">${message}</div>`;
  toast.style.display = 'block';
  setTimeout(() => { toast.style.display = 'none'; }, 3000);
}