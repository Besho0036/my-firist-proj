const Discord = require("discord.js")
let words = require("../../json/games/plural.json")
const Canvas = require("canvas")
const Module = require("../../DataBase/models/guild.js")
let Functions = require("../../Functions/utils.js")
module.exports = {
  name:`plural`,
  description: 'Guess the word plural.',
  type: 'CHAT_INPUT',
  botperms:["ATTACH_FILES"],
  cooldownGames:true,
  run:async(client, interaction,args,guildData) => {
    let cooldown = client.cooldownGames.get(interaction.commandName)
    let word = words[Math.floor(Math.random() * words.length)];
    let question = "ما هو جمع الكلمة التاليه"
    let canvas = await Functions.createFunCanvas(word.singular,question,"١٥")
    let attachment = new Discord.MessageAttachment(canvas, 'plural.png');
    let filter = response => word.plural === response.content.toLowerCase()
       interaction.reply({files:[attachment]}).then(() => {
         cooldown.set(interaction.channel.id,true);
         let time = Date.now() + 15000;
	interaction.channel.awaitMessages({filter,  max: 1, time: 15000, errors: ['time'] }).then(async(collected) =>{
    time = (time - Date.now()) /1000;
    let author = collected.first().author
    interaction.followUp({content:`> **مبروك! الفائز هو ${author} ، قام بتفكيك الجملة قبل انتهاء الوقت بـ ${time.toFixed(2)} ثانية!**`})
    let points = guildData.funPoints;
    let data = points.find(c => c.userID === author.id)
    if(!data){
      let obj = {
        userID:author.id,
        points:1,
      }
      points.push(obj)
      guildData.save()
    }else {
      data.points +=1
      points[points.indexOf(data)] = data
      await Module.findOneAndUpdate({guildID:interaction.guild.id},{funPoints:points})
    }
   cooldown.delete(interaction.channel.id);
  }).catch(collected => {
        interaction.followUp({content:`> **انتهى الوقت ، لم يفز أحد..**`});
 cooldown.delete(interaction.channel.id);
      });
    })
  }
}
