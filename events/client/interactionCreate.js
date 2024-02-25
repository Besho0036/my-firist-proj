const Discord = require('discord.js');
const guildModel = require('../../DataBase/models/guild.js');

const cooldowns = new Discord.Collection();
const cooldownGames = new Discord.Collection();

module.exports = {
  name: 'interactionCreate',
  run: async (interaction, client) => {
    try {
      const globalBot = client.config.globalBot;
      const ID = client.config.guildID;

      if (interaction.user.bot || (!globalBot && interaction.guild.id !== ID)) return;

      if (interaction.isCommand()) {
        const cmd = client.slashCommands.get(interaction.commandName);
        if (!cmd || !interaction.channel) return;

        const args = interaction.options.data.map((option) => option.value);
        await interaction.guild.members.fetch(interaction.user.id);

        if (cmd.cooldown && cmd.cooldown !== 0) {
          const now = Date.now();
          const timestamps = cooldowns.get(cmd.name) || new Discord.Collection();

          if (timestamps.has(interaction.user.id)) {
            const expirationTime = timestamps.get(interaction.user.id) + cmd.cooldown * 1000;

            if (now < expirationTime) {
              const timeLeft = (expirationTime - now) / 1000;
              return interaction.reply({
                content: `**${interaction.user.username}**, Cool down (**${Math.floor(
                  timeLeft
                )} seconds** left)`,
                ephemeral: true,
              });
            }
          }

          timestamps.set(interaction.user.id, now);
          cooldowns.set(cmd.name, timestamps);

          setTimeout(() => timestamps.delete(interaction.user.id), cmd.cooldown * 1000);
        }

        if (cmd.cooldownGames) {
          if (cooldownGames.has(interaction.channel.id)) {
            return interaction.reply({ content: '**عذرًا ، هناك جولة بالفعل!**' });
          } else {
            cooldownGames.set(interaction.channel.id, true);
            setTimeout(() => cooldownGames.delete(interaction.channel.id), cmd.cooldownGames * 1000);
          }
        }

        let guildData = await guildModel.findOne({ guildID: interaction.guild.id });
        if (!guildData) {
          guildData = await new guildModel({ guildID: interaction.guild.id }).save();
        }

        if (cmd.onlyAdmins && !guildData.active.admins.includes(interaction.member.id) && !interaction.member.permissions.has('ADMINISTRATOR')) {
          return interaction.reply({ content: 'ليس لديك صلاحية لاستخدام هذا الأمر', ephemeral: true });
        }

        if (cmd.onlyShip && interaction.user.id !== interaction.guild.ownerId) {
          return interaction.reply({ content: 'لا يمكنك استخدام هذا الأمر', ephemeral: true });
        }

        if (cmd.userPermissions && !interaction.member.permissions.has(cmd.userPermissions)) {
          return interaction.reply({ content: `ليس لديك الصلاحيات اللازمة\n الصلاحيات المطلوبة: \`[${cmd.userPermissions}]\`` });
        }

        const botPerms = interaction.channel.permissionsFor(client.user);
        if (
          cmd.botPermissions &&
          (!botPerms || !botPerms.has(cmd.botPermissions) || !interaction.guild.members.me.permissions.has(cmd.botPermissions))
        ) {
          return interaction.reply({ content: `أحتاج إلى بعض الصلاحيات\n الصلاحيات المطلوبة: \`[${cmd.botPermissions}]\`` });
        }

        cmd.run(client, interaction, args, guildData);
      }
    } catch (error) {
      console.error('حدث خطأ:', error);
      // يمكنك معالجة الخطأ هنا، على سبيل المثال:
      // interaction.reply({ content: 'حدث خطأ أثناء معالجة الأمر الخاص بك.', ephemeral: true });
    }
  },
};
