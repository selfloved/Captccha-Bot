const {
  SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle,
  ModalBuilder, TextInputBuilder, TextInputStyle, PermissionsBitField, ChannelType
} = require('discord.js');
const { getSettings, updateSettings } = require('../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Setup the verification system'),

  async execute(interaction) {
    try {
      // Check if the user is the server owner
      if (interaction.guild.ownerId !== interaction.user.id) {
        const embed = new EmbedBuilder()
          .setTitle('Permission Denied')
          .setDescription('Only the server owner can run this command.')
          .setColor('#FF0000');  // Red color to indicate error

        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      // Ask for admin role setup first
      const roleEmbed = new EmbedBuilder()
        .setTitle('Role Setup')
        .setDescription('Would you like to choose an admin role or skip this step?')
        .setColor('#00FF00');  // Green color for info

      const chooseAdminButton = new ButtonBuilder()
        .setCustomId('choose_admin_role')
        .setLabel('Choose Admin Role')
        .setStyle(ButtonStyle.Primary);

      const skipAdminButton = new ButtonBuilder()
        .setCustomId('skip_admin_role')
        .setLabel('Skip Admin Role')
        .setStyle(ButtonStyle.Secondary);

      const row = new ActionRowBuilder().addComponents(chooseAdminButton, skipAdminButton);

      await interaction.reply({ embeds: [roleEmbed], components: [row], ephemeral: true });

      const filter = i => i.user.id === interaction.user.id;
      const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

      collector.on('collect', async i => {
        try {
          if (i.customId === 'choose_admin_role') {
            await showRoleModal(i, 'admin', 'id');
          } else if (i.customId === 'skip_admin_role') {
            await i.update({ content: 'Skipped admin role setup. Now let’s set up the verification role.', components: [], ephemeral: true });
            askVerificationRole(interaction);
          }
        } catch (error) {
          console.error('Error in button interaction:', error);
        }
      });

      // Function to show the role modal for either ID or name
      async function showRoleModal(interaction, roleType, modalType) {
        try {
          const modal = new ModalBuilder()
            .setCustomId(`${roleType}_${modalType}_role_modal`)
            .setTitle(`Provide ${modalType === 'id' ? 'ID' : 'Name'} for ${roleType === 'admin' ? 'Admin' : 'Verification'} Role`);

          const roleInput = new TextInputBuilder()
            .setCustomId(`${roleType}_${modalType}_role_input`)
            .setLabel(`Enter the ${modalType === 'id' ? 'ID' : 'name'} for the ${roleType === 'admin' ? 'Admin' : 'Verification'} role:`)
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

          const firstActionRow = new ActionRowBuilder().addComponents(roleInput);
          modal.addComponents(firstActionRow);

          // Show modal and wait for response
          await interaction.showModal(modal);
        } catch (error) {
          console.error('Error showing role modal:', error);
        }
      }

      // Handle modal submission for role creation or providing role ID
      interaction.client.on('interactionCreate', async modalInteraction => {
        if (!modalInteraction.isModalSubmit()) return;

        try {
          const [roleType, modalType] = modalInteraction.customId.split('_');
          const roleInputValue = modalInteraction.fields.getTextInputValue(`${roleType}_${modalType}_role_input`);

          if (modalType === 'id') {
            // Check if input is a valid role ID
            const role = modalInteraction.guild.roles.cache.find(r => r.id === roleInputValue);
            if (!role) {
              await modalInteraction.reply({
                content: 'Invalid role ID. Please try again.',
                ephemeral: true
              });
            } else {
              const settings = getSettings();
              settings.roles[`${roleType}Role`] = role.id;
              updateSettings(settings);

              await modalInteraction.reply({
                content: `Existing ${roleType === 'admin' ? 'Admin' : 'Verification'} role **${role.name}** has been selected.`,
                ephemeral: true
              });

              if (roleType === 'admin') {
                askVerificationRole(interaction);
              } else {
                askVerificationChannel(interaction, role);
              }
            }
          } else if (modalType === 'name') {
            // Create the role with the provided name
            const newRole = await modalInteraction.guild.roles.create({
              name: roleInputValue,
              color: '#00FF00',
              permissions: []
            });

            const settings = getSettings();
            settings.roles[`${roleType}Role`] = newRole.id;
            updateSettings(settings);

            await modalInteraction.reply({
              content: `New ${roleType === 'admin' ? 'Admin' : 'Verification'} role **${newRole.name}** has been created.`,
              ephemeral: true
            });

            if (roleType === 'admin') {
              askVerificationRole(interaction);
            } else {
              askVerificationChannel(interaction, newRole);
            }
          }
        } catch (error) {
          console.error('Error in modal interaction:', error);
        }
      });

      // Function to ask for verification role
      async function askVerificationRole(interaction) {
        const verificationEmbed = new EmbedBuilder()
          .setTitle('Verification Role Setup')
          .setDescription('Would you like to provide a role ID or create a new verification role?')
          .setColor('#00FF00');  // Green color for info

        const provideRoleIdButton = new ButtonBuilder()
          .setCustomId('provide_role_id')
          .setLabel('Provide Role ID')
          .setStyle(ButtonStyle.Primary);

        const createRoleButton = new ButtonBuilder()
          .setCustomId('create_role')
          .setLabel('Create New Role')
          .setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder().addComponents(provideRoleIdButton, createRoleButton);

        await interaction.editReply({ embeds: [verificationEmbed], components: [row], ephemeral: true });

        const roleCollector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        roleCollector.on('collect', async roleInteraction => {
          try {
            if (roleInteraction.customId === 'provide_role_id') {
              await showRoleModal(roleInteraction, 'verification', 'id');
            } else if (roleInteraction.customId === 'create_role') {
              await showRoleModal(roleInteraction, 'verification', 'name');
            }
          } catch (error) {
            console.error('Error collecting role interaction:', error);
          }
        });
      }

      // Function to ask for the verification channel setup
      async function askVerificationChannel(interaction, verificationRole) {
        const channelEmbed = new EmbedBuilder()
          .setTitle('Verification Channel Setup')
          .setDescription('Would you like to provide a channel ID or name, create a new channel, or skip this step?')
          .setColor('#6c19ff');  // Custom color for panel

        const provideChannelButton = new ButtonBuilder()
          .setCustomId('provide_channel')
          .setLabel('Provide Channel')
          .setStyle(ButtonStyle.Primary);

        const createChannelButton = new ButtonBuilder()
          .setCustomId('create_channel')
          .setLabel('Create New Channel')
          .setStyle(ButtonStyle.Secondary);

        const skipChannelButton = new ButtonBuilder()
          .setCustomId('skip_channel')
          .setLabel('Skip Channel Setup')
          .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder().addComponents(provideChannelButton, createChannelButton, skipChannelButton);

        await interaction.editReply({ embeds: [channelEmbed], components: [row], ephemeral: true });

        const channelCollector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        channelCollector.on('collect', async channelInteraction => {
          try {
            if (channelInteraction.customId === 'provide_channel') {
              await showRoleModal(channelInteraction, 'channel', 'id'); // Modal input for the channel ID
            } else if (channelInteraction.customId === 'create_channel') {
              const createdChannel = await interaction.guild.channels.create({
                name: 'verification',
                type: ChannelType.GuildText,
                permissionOverwrites: [
                  {
                    id: interaction.guild.roles.everyone.id,
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory],
                  },
                  {
                    id: verificationRole.id,
                    deny: [PermissionsBitField.Flags.ViewChannel]
                  }
                ]
              });

              const settings = getSettings();
              settings.verificationChannel = createdChannel.id;
              updateSettings(settings);

              await interaction.editReply({
                content: `New verification channel **${createdChannel.name}** has been created.`,
                ephemeral: true
              });

              sendCaptchaPanel(interaction, createdChannel, verificationRole);
            } else if (channelInteraction.customId === 'skip_channel') {
              await channelInteraction.update({ content: 'Skipped channel setup. Using the current channel.', components: [], ephemeral: true });
              sendCaptchaPanel(interaction, interaction.channel, verificationRole);
            }
          } catch (error) {
            console.error('Error in channel interaction:', error);
          }
        });
      }

      // Function to send the captcha panel
      async function sendCaptchaPanel(interaction, channel, verificationRole) {
        try {
          const captchaEmbed = new EmbedBuilder()
            .setTitle('Verification Required')
            .setDescription('Please click the button below to verify yourself.')
            .setColor('#6c19ff');

          const verifyButton = new ButtonBuilder()
            .setCustomId('start_verification')
            .setLabel('Verify')
            .setStyle(ButtonStyle.Primary);

          const row = new ActionRowBuilder().addComponents(verifyButton);

          await channel.send({ embeds: [captchaEmbed], components: [row] });

          // Store the verification role and verification panel channel
          const settings = getSettings();
          settings.roles.verifiedRole = verificationRole.id;
          settings.verificationChannel = channel.id;
          updateSettings(settings);
        } catch (error) {
          console.error('Error sending captcha panel:', error);
        }
      }

    } catch (error) {
      console.error('Error during setup execution:', error);
      await interaction.reply({ content: 'There was an error setting up the verification system.', ephemeral: true });
    }
  }
};
