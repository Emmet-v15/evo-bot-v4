const { TextInputBuilder } = require("discord.js");
const { ModalBuilder } = require("discord.js");
const { ButtonBuilder } = require("discord.js");
const { ButtonStyle } = require("discord.js");
const { TextInputStyle } = require("discord.js");
const { ActionRowBuilder } = require("discord.js");
const { ChannelType } = require("discord.js");
const { EmbedBuilder } = require("discord.js");

module.exports = async (/** @type {import("discord.js").Client} */ client, /** @type {import("discord.js").ButtonInteraction} */ interaction, ...args) => {
    switch (args[0]) {
        case "claim": {
            await interaction.deferReply({ ephemeral: true });
            interaction.guild.channels.cache.get("1074448895372951592").send(`<@${interaction.user.id}> tried to claim`);
        }
    }
};
