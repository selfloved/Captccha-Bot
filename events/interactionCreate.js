const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder } = require('discord.js');
const { generateCaptchaImage } = require('../utils/captchaUtils');
const { setCaptcha } = require('../utils/captchaStorage');

const languageOptions = {
  en: { label: 'English', flag: '🇬🇧', message: 'Please enter the captcha code below using `/verify`.' },
  de: { label: 'German', flag: '🇩🇪', message: 'Bitte geben Sie den untenstehenden Captcha-Code mit `/verify` ein.' },
  tr: { label: 'Turkish', flag: '🇹🇷', message: 'Lütfen aşağıdaki captcha kodunu `/verify` kullanarak giriniz.' },
  pt: { label: 'Portuguese', flag: '🇵🇹', message: 'Por favor, insira o código captcha abaixo usando `/verify`.' },
  fr: { label: 'French', flag: '🇫🇷', message: 'Veuillez entrer le code captcha ci-dessous en utilisant `/verify`.' },
  es: { label: 'Spanish', flag: '🇪🇸', message: 'Por favor, ingrese el código captcha a continuación usando `/verify`.' },
  ru: { label: 'Russian', flag: '🇷🇺', message: 'Пожалуйста, введите капчу ниже, используя `/verify`.' }
};

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    try {
      if (interaction.isButton()) {
        // Check if the interaction was a "Verify" button click
        if (interaction.customId === 'start_verification') {
          // Present language selection buttons
          const languageEmbed = new EmbedBuilder()
            .setTitle('Select Language for Verification')
            .setDescription('Please select your language for help understanding the verification process.')
            .setColor('#6c19ff');

          const languageButtons = new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder().setCustomId('lang_en').setLabel('English').setEmoji('🇬🇧').setStyle(ButtonStyle.Primary),
              new ButtonBuilder().setCustomId('lang_de').setLabel('German').setEmoji('🇩🇪').setStyle(ButtonStyle.Primary),
              new ButtonBuilder().setCustomId('lang_tr').setLabel('Turkish').setEmoji('🇹🇷').setStyle(ButtonStyle.Primary),
              new ButtonBuilder().setCustomId('lang_pt').setLabel('Portuguese').setEmoji('🇵🇹').setStyle(ButtonStyle.Primary)
            );

          const languageButtonsRow2 = new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder().setCustomId('lang_fr').setLabel('French').setEmoji('🇫🇷').setStyle(ButtonStyle.Primary),
              new ButtonBuilder().setCustomId('lang_es').setLabel('Spanish').setEmoji('🇪🇸').setStyle(ButtonStyle.Primary),
              new ButtonBuilder().setCustomId('lang_ru').setLabel('Russian').setEmoji('🇷🇺').setStyle(ButtonStyle.Primary)
            );

          await interaction.reply({
            embeds: [languageEmbed],
            components: [languageButtons, languageButtonsRow2],
            ephemeral: true
          });
        }

        // Handle language selection
        if (interaction.customId.startsWith('lang_')) {
          const langCode = interaction.customId.split('_')[1];
          const lang = languageOptions[langCode];

          // Generate captcha
          try {
            const captchaCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            const captchaImage = await generateCaptchaImage(captchaCode); // Ensure this returns the image buffer

            // Store captcha data
            setCaptcha(interaction.user.id, {
              captchaCode,
              langCode,
              timestamp: Date.now()
            });

            const captchaEmbed = new EmbedBuilder()
              .setTitle(`${lang.flag} ${lang.label} Verification`)
              .setDescription(lang.message)
              .setColor('#6c19ff')
              .setImage('attachment://captcha.png');

            // Update the interaction with the captcha
            const attachment = new AttachmentBuilder(captchaImage.toBuffer(), { name: 'captcha.png' });

            await interaction.update({
              embeds: [captchaEmbed],
              files: [attachment],
              components: [],
              ephemeral: true
            });
          } catch (captchaError) {
            console.error('Error generating captcha:', captchaError);
            await interaction.reply({ content: 'An error occurred while generating the captcha. Please try again.', ephemeral: true });
          }
        }
      }
    } catch (error) {
      console.error('Error handling interaction:', error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'An unexpected error occurred. Please try again later.', ephemeral: true });
      } else {
        await interaction.reply({ content: 'An unexpected error occurred. Please try again later.', ephemeral: true });
      }
    }
  }
};
