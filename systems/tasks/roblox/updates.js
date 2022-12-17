require("dotenv").config();
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
const { EmbedBuilder } = require("discord.js");

const instantInterval = require("../../../functions/interval");

const handleUpdate = (client, version, category) => {
    const embed = new EmbedBuilder()
        .setTitle("Update Detected")
        .addFields([
            {
                name: "Version:",
                value: version,
                inline: true,
            },
            {
                name: "Download:",
                value: `[Click Here](https://setup.rbxcdn.com/${version}-RobloxApp.zip)`,
                inline: true,
            },
        ])
        .setColor("Random")
        .setTimestamp();
    client.guilds.cache.forEach((guild) => {
        if (client.settings.get(guild.id, `roblox.${category}.latestVersion`) !== version) {
            client.settings.set(guild.id, version, `roblox.${category}.latestVersion`);
            const channel = client.channels.cache.find(
                (c) => c.id === client.settings.get(guild.id, `roblox.${category}.channel`)
            );
            if (channel) {
                channel.send({ embeds: [embed] });
            }
        }
    });
};

module.exports = async (client) => {
    instantInterval(
        async () => {
            const data = await (await fetch(process.env.UPDATE_LINK)).json();
            if (data.clientVersionUpload) {
                handleUpdate(client, data.clientVersionUpload, "updates");
            }
            const lines = (await (await fetch(process.env.PUSH_LOG_LINK)).text()).split("\n");
            for (var i = lines.length - 1; i > 0; i--) {
                const [edit, platform, version] = lines[i].split(" ");
                if (platform === "WindowsPlayer") {
                    handleUpdate(client, version, "predictions");
                    break;
                }
            }
        },
        1000 * 60,
        client
    );
};
