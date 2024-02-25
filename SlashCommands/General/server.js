const { MessageEmbed } = require("discord.js");
const moment = require("moment");

module.exports = {
  name: 'server',
  description: 'Shows information about the server.',
  type: 'CHAT_INPUT',
  botperms: ["EMBED_LINKS"],
  cooldown: 35,
  run: async (client, interaction, args) => {
    try {
      let members = interaction.guild.memberCount;
      let server = interaction.guild;
      var onlineCount = interaction.guild.members.cache.filter(m => m.presence?.status === 'online' || m.presence?.status === 'dnd' || m.presence?.status === 'idle').size;
      var premiumSubscriptionCount = interaction.guild.premiumSubscriptionCount;

      let textChannels = interaction.guild.channels.cache.filter(r => r.type === "GUILD_TEXT").size;
      let voiceChannels = interaction.guild.channels.cache.filter(r => r.type === "GUILD_VOICE").size;
      let allChannels = voiceChannels + textChannels;

      const verificationLevels = ['NONE', 'LOW', 'MEDIUM', 'HIGH', 'HIGHEST'];
      const verificationLevel = interaction.guild.verificationLevel;

      const roles = interaction.guild.roles.cache.size;

      var embed = new MessageEmbed()

        .setAuthor({ name: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
        .setColor("BLACK")
        .addFields(
          { name: "**🆔 Server ID:**", value: `${interaction.guild.id}`, inline: true },
          { name: "**📆 Created On**", value: `${moment(server.createdTimestamp).format('DD/MM/YYYY h:mm')}\n${moment(server.createdTimestamp).fromNow()}`, inline: true },
          { name: "**👑 Owned by**", value: `<@!${interaction.guild.ownerId}>`, inline: true },
          { name: `**👥  Members (${members})**`, value: `**${onlineCount}** Online\n**${premiumSubscriptionCount}** Boosts ✨`, inline: true },
          { name: `**💬 Channels (${allChannels})**`, value: `**${textChannels}** Text | **${voiceChannels}** Voice`, inline: true },
          { name: `**🌍 Others**`, value: `**Verification Level:** ${verificationLevels[verificationLevel]}`, inline: true },
          { name: `**🔐 Roles (${roles})**`, value: `To see a list with all roles use **/roles**`, inline: true }
        );

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error sending server info:', error);
      interaction.reply({ content: 'An error occurred while fetching server information.', ephemeral: true });
    }
  }
}
