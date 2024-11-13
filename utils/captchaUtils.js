const { createCanvas } = require('canvas');

// Temporary storage for captcha data
const captchaStorage = {};

// Function to generate captcha image
function generateCaptchaImage(captchaText) {
  const canvas = createCanvas(200, 100);
  const ctx = canvas.getContext('2d');

  // Background color
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Text styling
  ctx.font = '40px sans-serif';
  ctx.fillStyle = '#000000';
  ctx.fillText(captchaText, 50, 60);

  // Add some noise (optional)
  ctx.strokeStyle = '#000000';
  for (let i = 0; i < 5; i++) {
    ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
    ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
    ctx.stroke();
  }

  return canvas;
}

module.exports = {
  captchaStorage,
  generateCaptchaImage
};