const userPreferences = {};

// Function to get the user's preferred language, or fallback to English
function getUserLanguage(userId) {
  return userPreferences[userId]?.language || 'en';  // 'en' as default language
}

// Function to set the user's preferred language
function setUserLanguage(userId, languageCode) {
  if (!userPreferences[userId]) {
    userPreferences[userId] = {};
  }
  userPreferences[userId].language = languageCode;
}

module.exports = {
  getUserLanguage,
  setUserLanguage
};