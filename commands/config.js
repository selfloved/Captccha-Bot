const { 
  SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, 
  ModalBuilder, TextInputBuilder, TextInputStyle 
} = require('discord.js');
const { getSettings, updateSettings } = require('../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('config')
    .setDescription('Configure the verification system, roles, and log channel'),

  async execute(interaction) {
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    const settings = getSettings();

    const embed = new EmbedBuilder()
      .setTitle('Verification System Configuration')
      .setDescription('Current Settings:')
      .addFields(
        { name: 'Admin Role', value: settings.roles.adminRole ? `<@&${settings.roles.adminRole}>` : 'Not Set', inline: true },
        { name: 'Verification Role', value: settings.roles.verificationRole ? `<@&${settings.roles.verificationRole}>` : 'Not Set', inline: true },
        { name: 'Log Channel', value: settings.logChannel ? `<#${settings.logChannel}>` : 'Not Set', inline: true }
      )
      .setColor('#6c19ff');

    const adminRoleButton = new ButtonBuilder()
      .setCustomId('config_admin_role')
      .setLabel('Set Admin Role')
      .setStyle(ButtonStyle.Primary);

    const verificationRoleButton = new ButtonBuilder()
      .setCustomId('config_verification_role')
      .setLabel('Set Verification Role')
      .setStyle(ButtonStyle.Primary);

    const logChannelButton = new ButtonBuilder()
      .setCustomId('config_log_channel')
      .setLabel('Set Log Channel')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(adminRoleButton, verificationRoleButton, logChannelButton);

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });

    const filter = i => i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

    collector.on('collect', async i => {
      if (i.customId === 'config_admin_role') {
        await showRoleModal(i, 'admin');
      } else if (i.customId === 'config_verification_role') {
        await showRoleModal(i, 'verification');
      } else if (i.customId === 'config_log_channel') {
        await showChannelModal(i, 'log_channel');
      }
    });

    async function showRoleModal(interaction, roleType) {
      const modal = new ModalBuilder()
        .setCustomId(`${roleType}_role_modal`)
        .setTitle(`Set ${roleType === 'admin' ? 'Admin' : 'Verification'} Role`);

      const roleIdInput = new TextInputBuilder()
        .setCustomId(`${roleType}_role_id`)
        .setLabel(`Enter the Role ID for the ${roleType === 'admin' ? 'Admin' : 'Verification'} role:`)
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const firstActionRow = new ActionRowBuilder().addComponents(roleIdInput);
      modal.addComponents(firstActionRow);

      await interaction.showModal(modal);
    }

    async function showChannelModal(interaction, channelType) {
      const modal = new ModalBuilder()
        .setCustomId(`${channelType}_modal`)
        .setTitle(`Set ${channelType === 'log_channel' ? 'Log' : 'Auto-Delete'} Channel`);

      const channelIdInput = new TextInputBuilder()
        .setCustomId(`${channelType}_id`)
        .setLabel(`Enter the Channel ID for the Log Channel:`)
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const firstActionRow = new ActionRowBuilder().addComponents(channelIdInput);
      modal.addComponents(firstActionRow);

      await interaction.showModal(modal);
    }

    interaction.client.on('interactionCreate', async modalInteraction => {
      if (!modalInteraction.isModalSubmit()) return;

      const roleType = modalInteraction.customId.includes('admin') ? 'admin' : 
                      modalInteraction.customId.includes('verification') ? 'verification' : null;

      if (roleType) {
        const roleId = modalInteraction.fields.getTextInputValue(`${roleType}_role_id`);
        const role = modalInteraction.guild.roles.cache.get(roleId);

        if (!role) {
          return await modalInteraction.reply({ content: 'Invalid Role ID. Please try again.', ephemeral: true });
        }

        settings.roles[`${roleType}Role`] = roleId;
        updateSettings(settings);

        await modalInteraction.reply({
          content: `${roleType === 'admin' ? 'Admin' : 'Verification'} role updated to **${role.name}**.`,
          ephemeral: true
        });
      }

      if (modalInteraction.customId === 'log_channel_modal') {
        const channelId = modalInteraction.fields.getTextInputValue(`${modalInteraction.customId.split('_modal')[0]}_id`);

        if (!/^\d{18}$/.test(channelId)) {
          return await modalInteraction.reply({ content: 'Invalid Channel ID. It must be exactly 18 digits.', ephemeral: true });
        }

        const channel = modalInteraction.guild.channels.cache.get(channelId);
        if (!channel) {
          return await modalInteraction.reply({ content: 'Channel not found. Please try again.', ephemeral: true });
        }

        settings.logChannel = channelId;
        updateSettings(settings);

        await modalInteraction.reply({
          content: `Log channel updated to **${channel.name}**.`,
          ephemeral: true
        });
      }
    });
  }
};
