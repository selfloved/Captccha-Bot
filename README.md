
Welcome to **Toolity**, the all-in-one Captcha bot for Discord! Toolity is designed to add an extra layer of security to any server with ease and flexibility. Featuring multilingual support, automatic setup, logging, and more, Toolity is your go-to bot for managing server security.

## Features
- **Universal Compatibility**: Works on any Discord server, regardless of setup.
- **Multilingual Support**: Verification and commands are available in multiple languages.
- **Automatic Setup**: Toolity auto-configures essential settings, so you’re ready to go in no time.
- **Logging**: Provides detailed logs of bot actions and user interactions.
- **User-Friendly Commands**: Intuitive commands for a seamless experience.

## Project Structure

Here's an overview of the key files and folders in this project:

- **commands/**: Contains the bot’s commands, including:
  - `config.js` - Configure bot settings for the server.
  - `serverinfo.js` - Provides information about the current server.
  - `setup.js` - Automatic setup of the bot.
  - `verify.js` - Captcha verification command.

- **config/**: Stores configuration files.
  - `config.json` - Main configuration file for bot settings.
  - `settings.json` - Additional settings for customization.

- **data/**: Stores data files.
  - `captchaStorage.json` - Storage for generated Captcha data.

- **events/**: Handles bot events.
  - `guildMemberAdd.js` - Triggers on new members joining.
  - `interactionCreate.js` - Manages interaction events.

- **utils/**: Utility functions and helpers.
  - `captchaUtils.js` - Functions for Captcha generation and validation.
  - `database.js` - Database connection and management.
  - `generateCaptcha.js` - Captcha creation logic.
  - `messages.js` - Pre-defined messages and responses.
  - `userSettings.js` - Manages user-specific settings.

- `.env` - Environment variables for secure information (like API keys).
- `deploy-commands.js` - Script to deploy bot commands to Discord.
- `index.js` - Main entry point for running the bot.

## Getting Started
1. **Invite Toolity to Your Server**: Follow the invite link to add Toolity to your server.
2. **Setup**: Use `/setup` to initialize the bot for your server.
3. **Config**: Use `/config` to view and customize configurations.

## Commands Overview
- `/config` - Configure the bot’s settings for your server.
- `/setup` - Automatically set up the bot with recommended configurations.
- `/serverinfo` - Display information about the current server.
- `/verify` - Execute Captcha verification for new users.

## Support
If you encounter any issues or need assistance, please reach out to **@selfloved (alias "de")** on Discord.

---

© Toolity - Developed by @selfloved on Discord
