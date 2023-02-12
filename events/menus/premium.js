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
        }
    }
};
