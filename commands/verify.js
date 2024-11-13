const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getCaptcha, isCaptchaExpired, deleteCaptcha } = require('../utils/captchaStorage');
const { getMessage } = require('../utils/messages');
const { getUserLanguage } = require('../utils/userSettings');
const { getSettings } = require('../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('verify')
    .setDescription('Submit the captcha code to complete verification.')
    .addStringOption(option => 
      option.setName('code')
        .setDescription('The captcha code you need to enter.')
        .setRequired(true)),

  async execute(interaction) {
    const settings = getSettings();
    const logChannel = interaction.guild.channels.cache.get(settings.logChannel);
    const verifiedRoleId = settings.roles.verifiedRole;
    const userId = interaction.user.id;
    const enteredCode = interaction.options.getString('code').toUpperCase();
    const captchaData = getCaptcha(userId);
    const userLang = getUserLanguage(userId);

    const greenTick = '<:green_tick:1284997789918695494>'; // green_tick
    const redArrow = '<:red_arrow:1284997872173060118>'; // red_arrow

    // Check if the captcha has expired
    if (!captchaData || isCaptchaExpired(userId)) {
      const failEmbed = new EmbedBuilder()
        .setTitle(`${redArrow} Verification Failed`)
        .setDescription(`**User:** <@${interaction.user.id}> (ID: ${interaction.user.id})\n**Reason:** Captcha expired.`)
        .setColor('#FF0000')  // Red color for failure
        .setTimestamp();
      
      if (logChannel) await logChannel.send({ embeds: [failEmbed] });

      return interaction.reply({ content: getMessage(userLang, 'captchaExpired'), ephemeral: true });
    }

    // Check if the entered captcha is correct
    if (enteredCode === captchaData.captchaCode) {

      const verifiedRole = interaction.guild.roles.cache.get(verifiedRoleId);
      const member = interaction.guild.members.cache.get(interaction.user.id);

      if (verifiedRole && member) {
        try {
          await member.roles.add(verifiedRole);

          // Success Log
          const successEmbed = new EmbedBuilder()
            .setTitle(`${greenTick} Verification Successful`)
            .setDescription(`**User:** <@${interaction.user.id}> (ID: ${interaction.user.id})\n**Status:** Successfully completed the verification.`)
            .setColor('#2ecc71')
            .setTimestamp();

          if (logChannel) await logChannel.send({ embeds: [successEmbed] });
          
          await interaction.reply({ content: getMessage(userLang, 'verificationComplete'), ephemeral: true });

        } catch (error) {
          console.error(`Failed to assign role to user ${interaction.user.tag}:`, error);
          // Error Log
          const errorEmbed = new EmbedBuilder()
            .setTitle(`${redArrow} Role Assignment Failed`)
            .setDescription(`**User:** <@${interaction.user.id}> (ID: ${interaction.user.id})\n**Reason:** Failed to assign verified role.`)
            .setColor('#FF0000')
            .setTimestamp();

          if (logChannel) await logChannel.send({ embeds: [errorEmbed] });
        }
      } else {
        console.error('Role or member not found.');
      }


      deleteCaptcha(userId);
    } else {
      // Failed Log
      const failEmbed = new EmbedBuilder()
        .setTitle(`${redArrow} Verification Failed`)
        .setDescription(`**User:** <@${interaction.user.id}> (ID: ${interaction.user.id})\n**Reason:** Incorrect captcha entered.`)
        .setColor('#FF0000')  // Red color for failure
        .setTimestamp();

      if (logChannel) await logChannel.send({ embeds: [failEmbed] });

      await interaction.reply({ content: getMessage(userLang, 'incorrectCaptcha'), ephemeral: true });
    }
  }
};
