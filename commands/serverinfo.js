const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Displays information about the server.'),

  async execute(interaction) {
    const { guild } = interaction;

    // Count roles
    const rolesCount = guild.roles.cache.size;

    // Count channels
    const textChannelsCount = guild.channels.cache.filter(c => c.type === 0).size; // Text channels
    const voiceChannelsCount = guild.channels.cache.filter(c => c.type === 2).size; // Voice channels
    const categoriesCount = guild.channels.cache.filter(c => c.type === 4).size; // Categories

    // Count bots
    const botsCount = guild.members.cache.filter(member => member.user.bot).size;

    // Server owner info
    const owner = await guild.fetchOwner();

    // Server icon
    const serverIcon = guild.iconURL({ dynamic: true, size: 1024 }) || '';

    // Creating the embed
    const embed = new EmbedBuilder()
      .setTitle(`${guild.name} Server Info`)
      .setThumbnail(serverIcon)
      .setColor('#3498db')
      .addFields(
        { name: 'Server Owner', value: `${owner.user.tag} (${owner.user.id})`, inline: true },
        { name: 'Total Members', value: `${guild.memberCount}`, inline: true },
        { name: 'Total Roles', value: `${rolesCount}`, inline: true },
        { name: 'Text Channels', value: `${textChannelsCount}`, inline: true },
        { name: 'Voice Channels', value: `${voiceChannelsCount}`, inline: true },
        { name: 'Categories', value: `${categoriesCount}`, inline: true },
        { name: 'Bots', value: `${botsCount}`, inline: true },
        { name: 'Created On', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`, inline: true }
      )
      .setFooter({ text: `Server ID: ${guild.id}` })
      .setTimestamp();

    // Reply with the embed
    await interaction.reply({ embeds: [embed], ephemeral: false });
  }
};
