// feedback.js

export function loadFeedback() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
      <section class="feedback-section">
        <div class="feedback-header">
          <h2>Your voice matters</h2>
          <p>We’re always looking to improve GroceryHub. Share your thoughts!</p>
        </div>
        <form id="feedbackForm" class="feedback-form">
          <div class="form-row">
            <div class="form-group">
              <label for="name">Full Name</label>
              <input type="text" id="name" name="name" placeholder="e.g. Jane Doe" required />
            </div>
            <div class="form-group">
              <label for="email">Email <span class="optional">(Optional)</span></label>
              <input type="email" id="email" name="email" placeholder="you@example.com" />
            </div>
          </div>
          <div class="form-group">
            <label for="message">Your Feedback</label>
            <textarea id="message" name="message" rows="6" placeholder="Write your thoughts here..." required></textarea>
          </div>
          <button type="submit" class="submit-btn">Submit Feedback</button>
        </form>
      </section>
    `;
  
    const feedbackForm = document.getElementById('feedbackForm');
    feedbackForm.addEventListener('submit', (e) => {
      e.preventDefault();
  
      const name = feedbackForm.name.value.trim();
      const email = feedbackForm.email.value.trim();
      const message = feedbackForm.message.value.trim();
  
      if (!message) {
        alert("Please enter your feedback before submitting.");
        return;
      }
  
      console.log("Feedback submitted:", { name, email, message });
  
      feedbackForm.reset();
  
      const toast = document.getElementById('toast');
      toast.textContent = "Thanks for your feedback!";
      toast.className = "show";
      setTimeout(() => {
        toast.className = toast.className.replace("show", "");
      }, 3000);
    });
  }
  