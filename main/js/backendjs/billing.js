window.generateInvoiceImage = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
  
    // Set the canvas size
    canvas.width = 600;
    canvas.height = 400;
  
    // Draw the background (white)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    // Set text styles
    ctx.font = '16px Arial';
    ctx.fillStyle = '#000';
  
    // Add the invoice title
    ctx.fillText("Grocery Hub Invoice", 10, 30);
  
    // Add the cart items
    cart.forEach((item, i) => {
      ctx.fillText(`${i + 1}. ${item.name} x${item.qty} - $${(item.qty * item.price).toFixed(2)}`, 10, 50 + i * 20);
    });
  
    // Convert canvas to image data (Base64)
    const imageData = canvas.toDataURL("image/png");
  
    // Send the image data to the server to be saved
    fetch('/save-bill-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageData })
    })
    .then(response => response.json())
    .then(result => {
      console.log("Bill saved:", result);
    })
    .catch(error => console.error('Error saving the bill:', error));
  };

import express from express;
import fs from fs;
import path from path;
const app = express();


app.use(express.json({ limit: '10mb' })); // Increase payload size limit if necessary

// Ensure the 'bills' folder exists
const billsFolder = path.join(__dirname, 'bills');
if (!fs.existsSync(billsFolder)) {
  fs.mkdirSync(billsFolder);
}

// Endpoint to save bill images
app.post('/save-bill-image', (req, res) => {
  const { imageData } = req.body;

  // Remove the image data prefix (e.g., "data:image/png;base64,")
  const base64Data = imageData.replace('');

  // Generate a unique filename (e.g., based on current timestamp)
  const fileName = `invoice-${Date.now()}.png`;
  const filePath = path.join(billsFolder, fileName);

  // Write the image data to a file
  fs.writeFile(filePath, base64Data, 'base64', (err) => {
    if (err) {
      return res.status(500).send({ message: 'Error saving the bill image', error: err });
    }

    res.json({ message: 'Bill saved successfully', filePath });
  });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

