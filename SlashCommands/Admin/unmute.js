const { MessageEmbed } = require("discord.js")
const ms = require ("ms")
const Module = require("../../DataBase/models/guild.js")

module.exports = {
  name:`unmute`,
  description: 'Unmutes a member.',
  type: 'CHAT_INPUT',
  options:[
    {
      name:"user",
      description: "The user to unmute.",
      type:"USER",
      required:true,
    }
  ],
  userPermissions: ["MUTE_MEMBERS"],
  botPermissions:["MANAGE_ROLES"],
  run:async(client, interaction,args,guildData) => {
    let target = interaction.options.getMember("user");
    
    // التأكد من وجود العضو المستهدف
    if (!target) {
      return interaction.reply({content:`🙄 - **Couldn't find the specified user.**`}); 
    }
    
    // الحصول على دور المكتوم
    let role = interaction.guild.roles.cache.find(ro => ro.name == 'Muted');
    
    // التحقق من وجود الدور المكتوم
    if (!role) {
      return interaction.reply({content:`🙄 - **Can't find the muted role.**`}); 
    }

    // التحقق مما إذا كان العضو مكتومًا بالفعل
    if (!target.roles.cache.has(role.id)) {
      return interaction.reply({content:`${target.user.username} isn't muted`}); 
    }

    // التحقق من صلاحيات البوت لإزالة الدور
    if(interaction.guild.members.me.roles.highest.position <= role.position) {
      return interaction.reply({content:`🙄 - Please check my permissions and role position.`}); 
    }
    
    let obj = guildData.muted.find(c=> c.userID === target.id)
    target.roles.remove(role?.id).catch(err => 0)
    
    if(obj){
      guildData.muted.splice(
      guildData.muted.indexOf(obj),1)
      guildData.save()
    }

    return interaction.reply(`✅ ${target.user.username} unmuted!`)
  }
}
