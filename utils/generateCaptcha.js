const Canvas = require('canvas');
const fs = require('fs');

async function generateCaptcha(length) {
  const captchaText = Math.random().toString(36).substring(2, 2 + length).toUpperCase();
  
  // Create a canvas
  const canvas = Canvas.createCanvas(200, 100);
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Text
  ctx.font = '40px sans-serif';
  ctx.fillStyle = '#000000';
  ctx.fillText(captchaText, 50, 60);
  
  // Noise lines
  ctx.strokeStyle = '#000000';
  for (let i = 0; i < 3; i++) {
    ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
    ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
    ctx.stroke();
  }
  
  const buffer = canvas.toBuffer();
  return { captchaText, captchaImage: buffer };
}

module.exports = { generateCaptcha };