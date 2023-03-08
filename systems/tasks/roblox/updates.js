require("dotenv").config();
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const logger = require("../../logging/logger");
const { red, greenBright } = require("colorette");
const { instantInterval } = require("../../../util/interval");

const currentUpdateEmbed = (version, guild) => {
    const embed = new EmbedBuilder()
        .setTitle(`Roblox has Updated to ${version}`)
        .setColor("ED4245")
        .setTimestamp()
        .setFooter({ text: "EvoV4" });
    const oldUpdate = guild.client.settings.get(guild.id, "updates.oldVersion");
    if (oldUpdate) {
        embed.setDescription(`From update ${oldUpdate}`);
    }
    return embed;
};

const futureUpdateEmbed = (version) => {
    return new EmbedBuilder()
        .setTitle(`Roblox will update to ${version}`)
        .setDescription(
            `Expect this update <t:${Math.round(new Date().getTime() / 1000) + 172800}:R> or earlier\n
        Click the button below to download the update.`
        )
        .setColor("0099FF")
        .setTimestamp()
        .setFooter({ text: "EvoV4" });
};

const generateButton = (version) => {
    return new ActionRowBuilder().addComponents(
        new ButtonBuilder().setURL(`http://setup.roblox.com/${version}-RobloxApp.zip`).setLabel("Download").setStyle(ButtonStyle.Link)
    );
};

const handleUpdate = (client, version, category) => {
    let messageContent = {};
    if (category === "updates") {
        messageContent = {
            components: [generateButton(version)],
        };
    } else if (category === "predictions") {
        messageContent = {
            embeds: [futureUpdateEmbed(version)],
            components: [generateButton(version)],
        };
    }

    client.guilds.cache.forEach((guild) => {
        let oldUpdate = client.settings.get(guild.id, `${category}.latestVersion`);
        if (oldUpdate !== version) {
            const channel = client.channels.cache.find((c) => c.id === client.settings.get(guild.id, `${category}.channel`));
            if (channel) {
                let roleId = client.settings.get(guild.id, `role.${category}`);
                if (roleId) messageContent.content = `<@&${roleId}>`;
                if (category === "updates") {
                    messageContent.embeds = [currentUpdateEmbed(version, guild)];
                    logger.warn(
                        `Roblox has updated to ${red(version)}${oldUpdate ? " from " + red(oldUpdate) : ""} [${greenBright(
                            `http://setup.roblox.com/${version}-RobloxApp.zip`
                        )}]`
                    );
                } else if (category === "predictions") {
                    logger.warn(
                        `Roblox will update to ${red(version)}${oldUpdate ? " from " + red(oldUpdate) : ""} [${greenBright(
                            `http://setup.roblox.com/${version}-RobloxApp.zip`
                        )}]`
                    );
                }
                channel.send(messageContent);
            }
            client.settings.set(guild.id, version, `${category}.oldVersion`);
            client.settings.set(guild.id, version, `${category}.latestVersion`);
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
