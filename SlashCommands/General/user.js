const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const moment = require("moment");

module.exports = {
  name: `user`,
  description: 'Shows information, such as ID and join date, about yourself or a user.',
  type: 'CHAT_INPUT',
  options: [
    {
      name: "user",
      description: "Target to see his avatar!",
      type: "USER",
      required: false,
    }
  ],
  cooldown: 5,
  botperms: ["EMBED_LINKS"],
  run: async (client, interaction, args) => {
    // Getting the user to display information about
    const user = interaction.options.getMember("user") || interaction.member;

    // Collecting user badges
    let badges = user.user.flags.toArray().join(", ") || "null";

    // Counting user invites
    var userInvites = (await interaction.guild.invites.fetch()).filter(invite => invite.inviter.id === user.id).map(c => c.uses).reduce((prev, curr) => prev + curr, 0);
    var useAmount = userInvites;

    // Determining user device status
    let d = user.presence?.clientStatus || {};
    let device = Object.entries(d).map(value => value[0])?.join(",") || "offline";

    // Creating the embed for basic user information
    let embed = new MessageEmbed()
      .addFields(
        { name: `Name`, value: user.user.username, inline: true },
        { name: `Tag`, value: user.user.tag, inline: true },
        { name: `UserId`, value: user.user.id, inline: true },
        { name: `Joined Discord At`, value: `**\`${moment(user.user.createdTimestamp).format('DD/MM/YYYY h:mm')}\`\n${moment(user.user.createdTimestamp).fromNow()}**`, inline: true },
        { name: `Status`, value: user.presence?.status || "offline", inline: true },
        { name: `Device`, value: device, inline: true }, // Changed to always show the device status
        { name: `Badges`, value: badges, inline: true }
      );

    // Creating the "More Info" button
    const button = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setLabel('More Info')
          .setStyle('PRIMARY')
          .setCustomId('moreInfo-' + interaction.user.id)
      );

    // Collecting user permissions
    let perms = user.permissions.toArray().join(", ");
    if (perms.includes("ADMINISTRATOR")) perms = "ADMINISTRATOR";

    // Creating the embed for extended user information
    let embed1 = new MessageEmbed()
      .addFields(
        { name: `Joined Server At`, value: `**\`\`${moment(user.joinedAt).format('DD/MM/YYYY h:mm')}\`\`\n${moment(user.joinedTimestamp).fromNow()}**`, inline: true },
        { name: `Nickname`, value: user.nickname || "none", inline: true },
        { name: `Invites`, value: userInvites.toString(), inline: true },
        { name: `Roles`, value: user.roles.cache.map(c => c).join(", "), inline: true },
        { name: `Permissions`, value: perms, inline: true }
      );

    // Creating the collector to handle the button interaction
    const filter = (interaction1) => interaction1.isButton() && interaction1.user.id === interaction.user.id && interaction1.message.interaction.id === interaction.id;
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      max: 1,
      time: 60000
    });

    // Handling button click event
    collector.on('collect', async (collected) => {
      await collected.deferUpdate().catch(er => 0);
      let customId = collected.customId;
      collected.message.components[0].components[0].disabled = true;
      collected.message.components[0].components[0].label = 'Ended';
      await collected.message.edit({ embeds: [embed1], components: collected.message.components });
    });

    // Replying to the interaction with the embed and button
    interaction.reply({ embeds: [embed], components: [button] });
  }
}
