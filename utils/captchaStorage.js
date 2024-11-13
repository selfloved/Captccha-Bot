const fs = require('fs');
const path = require('path');
const captchaFile = './data/captchaStorage.json';

// Ensure the data directory and captchaStorage.json file exist
function ensureCaptchaFileExists() {
    const dir = path.dirname(captchaFile);

    // Check if the directory exists, if not create it
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    // Check if the file exists, if not create it
    if (!fs.existsSync(captchaFile)) {
        fs.writeFileSync(captchaFile, '{}');  // Initialize with an empty object
    }
}

let captchaStorage = {};

// Load captcha data from a file on bot startup
function loadCaptchaStorage() {
    ensureCaptchaFileExists();
    const rawData = fs.readFileSync(captchaFile);
    captchaStorage = JSON.parse(rawData);
}

// Save captcha data to a file
function saveCaptchaStorage() {
    ensureCaptchaFileExists();
    fs.writeFileSync(captchaFile, JSON.stringify(captchaStorage, null, 2));
}

// Get a user captcha data
function getCaptcha(userId) {
    return captchaStorage[userId];
}

// Set captcha data for a user
function setCaptcha(userId, captchaData) {
    captchaStorage[userId] = captchaData;
    saveCaptchaStorage();
}

// Delete captcha data for a user
function deleteCaptcha(userId) {
    delete captchaStorage[userId];
    saveCaptchaStorage();
}

// Check if a users captcha is expired (based on a 2-minute expiry time)
function isCaptchaExpired(userId) {
    const captcha = getCaptcha(userId);
    if (!captcha) return true;

    const now = Date.now();
    return (now - captcha.timestamp) > 2 * 60 * 1000; // 2 minutes
}

// On bot startup, load captcha storage
loadCaptchaStorage();

module.exports = {
    getCaptcha,
    setCaptcha,
    deleteCaptcha,
    isCaptchaExpired
};
