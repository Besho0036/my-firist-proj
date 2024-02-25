console.clear();
require('events').EventEmitter.defaultMaxListeners = 100000;
const express = require("express");
const app = express();
app.listen(() => console.log(`XP Store`));
app.get("/", (req, res) => res.send(`XP Store`));
const Discord = require("discord.js");
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"] });
client.config = require("./config.js");
client.slashCommands = new Discord.Collection();
client.cooldownGames = new Discord.Collection();
const { registerFont } = require("canvas");
registerFont("fonts/Cairo-Black.ttf", { family: "XP Store" });
registerFont("fonts/Cairo-Bold.ttf", { family: "XP Store" });
registerFont("fonts/Cairo-Regular.ttf", { family: "XP Store" });
registerFont("fonts/SansSerifBldFLF.otf", { family: "XP Store" });
registerFont("fonts/Roboto-Light.ttf", { family: "XP Store" });
require("./DataBase/connect.js");
let handlerFiles = ["events", "slash"];
handlerFiles.forEach(p => {
    require(`./Handler/${p}`)(client);
});
process.on("unhandledRejection", (err) => {
    if (err.message.includes("The user aborted a request.") || err.message.includes("Unknown interaction")) return;
    console.log(err.stack);
});
process.on('warning', (warning) => {
    console.log(warning.stack);
});

client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
    client.user.setActivity("XP Store", { type: "PLAYING" });

    const guild = client.guilds.cache.get(client.config.guildID); // استبدل "guild_id" بمعرف السيرفر الخاص بك
    const memberCount = guild.memberCount;
    console.log(`Total members: ${memberCount}`);
});

client.login(client.config.token);
