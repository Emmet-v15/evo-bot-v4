const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
const { EmbedBuilder } = require("discord.js");
const { bold } = require("@discordjs/builders");

const { rbx } = require("../../config.json");

module.exports = async(client) => {
    const response = (await (await fetch(rbx.statusLink)).json()).result;
    const fields = [];
    for (var i = 0; i < response.status.length; i++) {
        const state = response.status[i];
        var field = "";
        for (var j = 0; j < state.containers.length; j++) {
            const container = state.containers[j];
            field += `${container.name}: ${bold(container.status)}\n`;
        }
        fields.push({ name: state.name, value: field.trim(), inline: true });
    }
    const embed = new EmbedBuilder()
        .setTitle("Roblox Status")
        .setDescription(`Overall Status: ${response.status_overall.status}`)
        .addFields(fields)
        .setFooter({ text: "Latest Update" })
        .setColor("Random")
        .setTimestamp()
    client.guilds.cache.forEach((guild) => {
        const channel = client.channels.cache.find(c => c.id === client.settings.get(guild.id, "roblox.status.channel"));
        if (channel) {
            channel.messages.fetch(client.settings.get(guild.id, "roblox.status.pageId")).then((message) => {
                message.edit({ embeds: [embed] });
            }).catch((err) => {
                channel.send({ embeds: [embed] }).then((msg) => {
                    client.settings.set(guild.id, msg.id, "roblox.status.pageId");
                });
            });
        }
    });
};