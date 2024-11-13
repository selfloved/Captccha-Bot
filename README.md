# Toolity Captcha Bot

**Disclaimer**  
⚠️ **This project is a work-in-progress and is currently in a messy state.** Some features may not function as expected, and the codebase may lack final organization and cleanup. Use with caution, and feel free to contribute!

Welcome to **Toolity**, the all-in-one Captcha bot for Discord! Toolity is designed to add an extra layer of security to any server with ease and flexibility. Featuring multilingual support, automatic setup, logging, and more, Toolity is your go-to bot for managing server security.

---

## Features

- **Universal Compatibility**: Works on any Discord server, regardless of setup.
- **Multilingual Support**: Verification and commands are available in multiple languages.
- **Automatic Setup**: Toolity auto-configures essential settings, so you’re ready to go in no time.
- **Logging**: Provides detailed logs of bot actions and user interactions.
- **User-Friendly Commands**: Intuitive commands for a seamless experience.

---

## Project Structure

An overview of the key files and folders in this project:

- **`commands/`** - Contains the bot’s commands.
  - `config.js` - Configure bot settings for the server.
  - `serverinfo.js` - Provides information about the current server.
  - `setup.js` - Automatic setup of the bot.
  - `verify.js` - Captcha verification command.

- **`config/`** - Stores configuration files.
  - `config.json` - Main configuration file for bot settings.
  - `settings.json` - Additional settings for customization.

- **`data/`** - Stores data files.
  - `captchaStorage.json` - Storage for generated Captcha data.

- **`events/`** - Handles bot events.
  - `guildMemberAdd.js` - Triggers on new members joining.
  - `interactionCreate.js` - Manages interaction events.

- **`utils/`** - Utility functions and helpers.
  - `captchaUtils.js` - Functions for Captcha generation and validation.
  - `database.js` - Database connection and management.
  - `generateCaptcha.js` - Captcha creation logic.
  - `messages.js` - Pre-defined messages and responses.
  - `userSettings.js` - Manages user-specific settings.

- **`.env`** - Environment variables for secure information (like API keys).
- **`deploy-commands.js`** - Script to deploy bot commands to Discord.
- **`index.js`** - Main entry point for running the bot.

---

## Prerequisites

### 1. Install Dependencies

Toolity requires Node.js and npm. Ensure both are installed before proceeding.

To install all dependencies, run:

```bash
npm install
```
The main dependencies include:
**`discord.js`** - For interacting with the Discord API (^14.0.0)
**`canvass`** - Used for generating Captcha images (^2.11.2)
**`dotenvs`** - For managing environment variables securely (^10.0.0)
