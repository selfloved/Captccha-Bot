const { MessageAttachment } = require('discord.js');
const { generateCaptcha } = require('../utils/generateCaptcha');
const { getSettings } = require('../utils/database');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member, client) {
    const settings = getSettings();  // Get the updated settings, including the role

    const { captchaText, captchaImage } = await generateCaptcha(settings.captchaLength);
    const attachment = new MessageAttachment(captchaImage, 'captcha.png');

    try {
      await member.send({ content: 'Please complete the captcha to verify yourself.', files: [attachment] });

      const filter = (response) => response.author.id === member.id;

      const collected = await member.user.dmChannel.awaitMessages({ filter, max: 1, time: settings.captchaTimeout * 1000, errors: ['time'] });

      if (collected.first().content.toUpperCase() === captchaText) {

        const role = member.guild.roles.cache.get(settings.roles.verifiedRole);

        if (role) {
          await member.roles.add(role);
          await member.send('You have been verified!');
        } else {
          await member.send('Verification role not found. Please contact an admin.');
        }
      } else {
        await member.send('Incorrect captcha. Please try again.');
      }
    } catch (err) {

      await member.send('You took too long to respond. Please try again.');
    }
  },
};
