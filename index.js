// Load variables .env
require('dotenv').config();  
const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const fs = require('fs');

// Load config ini
const config = require('./config/config.json');  

// Index
const token = process.env.DISCORD_TOKEN || config.token;
const clientId = '';  // Client ID
const guildId = '';    // Server ID (if registering for a specific server)

// Warning - Exit if no token
if (!token) {
    console.error('Error: No token provided. Please add your token in .env');
    process.exit(1);
}

// Initialize
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.DirectMessages]
});

client.commands = new Collection();

// Load all commands from the commands folder
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if (command.data && typeof command.data.name === 'string') {
    client.commands.set(command.data.name, command);
  } else {
    console.warn(`Skipping command ${file} is missing a valid "data" property.`);
  }
}

// Register slash commands automatically
(async () => {
  try {
    const rest = new REST({ version: '10' }).setToken(token);

    // Collect the command data for registration
    const commands = [...client.commands.values()].map(command => command.data.toJSON());

    console.log('Started refreshing application (/) commands.');

    // Guild-specific registration
    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),  
      { body: commands }
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error('Error while registering commands:', error);
  }
})();

// Event handling
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  const eventName = file.split('.')[0];

  // Ensure the event has an `execute` function before registering
  if (typeof event.execute !== 'function') {
    console.warn(`Skipping event ${file} is missing an "execute" function.`);
    continue;
  }

  if (event.once) {
    client.once(eventName, (...args) => event.execute(...args, client));
  } else {
    client.on(eventName, (...args) => event.execute(...args, client));
  }
}

// Event handler for slash commands
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

client.login(token);