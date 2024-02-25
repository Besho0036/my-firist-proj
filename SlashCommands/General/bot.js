const { MessageEmbed } = require("discord.js");
const package = require("../../package.json");

module.exports = {
  name: `bot`,
  description: 'Get information about this bot',
  type: 'CHAT_INPUT',
  botperms: ["EMBED_LINKS"],
  cooldown: 10,
  run: async (client, interaction, args) => {
    let discordJSVersion = package.dependencies["discord.js"];

    const embed = new MessageEmbed()
      .setAuthor({ name: client.user.username })
      .setImage(client.user.avatarURL())
      .addFields(
        { name: 'Servers', value: `➥ \`${client.guilds.cache.size}\``, inline: true },
        { name: 'Channels', value: `➥ \`${client.channels.cache.size}\``, inline: true },
        { name: 'Users', value: `➥ \`${client.users.cache.size}\``, inline: true },
        { name: 'Library', value: `➥ \`Discord JS ${discordJSVersion.slice(1)}\``, inline: true },
        { name: 'Node.js', value: `➥ \`${process.version}\``, inline: true },
        { name: 'Uptime', value: `➥ <t:${Math.floor((Date.now() - client.uptime)/1000)}:R>`, inline: true },
        { name: 'Ping', value: `➥ ${client.ws.ping}`, inline: true },
        { name: 'My Developer', value: `➥ 3bkreno , MaRs.#8582 (705360386777546804)`, inline: true }
      )
      .setFooter({ text: "Requested by " + interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

    interaction.reply({ embeds: [embed] }).catch(err => console.error(err));
  }
}
