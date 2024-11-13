require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');

const clientId = '';  // Client ID
const guildId = '';    // Server ID (if registering for a specific server)
const token = process.env.DISCORD_TOKEN;

// Collect all the command files (again)
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

// Create a new instance api based
const rest = new REST({ version: '10' }).setToken(token);

// Register commands for a guild (specific server) or globally
(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),  // Use for guild-specific commands
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();