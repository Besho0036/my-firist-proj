const { MessageEmbed } = require("discord.js");
const ms = require("ms");

module.exports = {
  name: `untimeout`,
  description: 'Remove timeout from a user',
  type: 'CHAT_INPUT',
  options: [
    {
      name: "user",
      description: "The user to untimeout",
      type: "USER",
      required: true,
    },
  ],
  userPermissions: ["MODERATE_MEMBERS"],
  botPermissions: ["MODERATE_MEMBERS"],
  run: async (client, interaction, args) => {
    try {
      const target = interaction.options.getMember("user");
      if (!target) return interaction.reply({ content: `❌ Please specify a valid user to untimeout.` });

      if (target.permissions.has("ADMINISTRATOR")) {
        return interaction.reply({ content: `❌ You can't untimeout ${target.user.tag} because they are an administrator.` });
      }

      if (!target.timeout) {
        return interaction.reply({ content: `❌ ${target.user.tag} is not timed out.` });
      }

      await target.timeout(0);
      return interaction.reply({ content: `✅ ${target.user.tag} has been untimed out.` });
    } catch (error) {
      console.error("An error occurred while untimeouting a user:", error);
      return interaction.reply({ content: `❌ An error occurred while untimeouting the user. Please try again later.` });
    }
  }
};
