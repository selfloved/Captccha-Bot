// not that type of database

const fs = require('fs');
const path = './config/settings.json';

function getSettings() {
  if (!fs.existsSync(path)) {
    return { autoDeleteChannel: null };  // Default settings
  }
  const data = fs.readFileSync(path);
  return JSON.parse(data);
}

function updateSettings(settings) {
  fs.writeFileSync(path, JSON.stringify(settings, null, 2));
}

module.exports = { getSettings, updateSettings };