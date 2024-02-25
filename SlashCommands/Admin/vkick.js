const { MessageEmbed } = require("discord.js")

module.exports = {
  name: `vkick`,
  description: 'Kicks a member from a voice channel.',
  type: 'CHAT_INPUT',
  options: [
    {
      name: "user",
      description: "The user to kick from voice channel.",
      type: "USER",
      required: true,
    }
  ],
  userPermissions: ["MOVE_MEMBERS"],
  botPermissions: ["MOVE_MEMBERS"],
  run: async (client, interaction, args) => {
    try {
      await interaction.deferReply();

      const targetId = interaction.options.getUser("user").id;
      const target = interaction.guild.members.cache.get(targetId);

      if (!target.voice.channel) {
        return interaction.editReply(`**🙄 - Member is not in a voice channel!**`);
      }

      if (
        target.roles.cache.highest.position >=
        interaction.member.roles.cache.highest.position &&
        interaction.guild.owner.id !== target.id &&
        interaction.guild.owner.id !== interaction.member.id
      ) {
        return interaction.editReply({ content: `🙄 - **You can't kick ${target.user.username}.**` });
      }

      await target.voice.setChannel(null);

      return interaction.editReply({ content: `✅ **@${target.user.username} kicked from the voice channel!**` });
    } catch (error) {
      console.error(error);
      return interaction.editReply({ content: `🙄 - I couldn't kick that user. Please check my permissions.` });
    }
  }
}
