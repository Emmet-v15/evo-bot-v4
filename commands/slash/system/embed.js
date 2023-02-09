const { EmbedBuilder } = require("discord.js");
const { ActionRowBuilder } = require("discord.js");
const { StringSelectMenuBuilder } = require("discord.js");

const ticketEmbed = new EmbedBuilder()
    .setTitle("Support panel")
    .setDescription("Please select a category below to get started.")
    .setColor("0099FF")
    .setTimestamp()
    .setFooter({ text: "EvoV4" });

const category = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
        .setCustomId("category")
        .setPlaceholder("Select a category")
        .addOptions([
            {
                label: "General",
                description: "General support",
                value: "general",
            },
            {
                label: "Report a bug",
                description: "Report a bug",
                value: "bug",
            },
            {
                label: "Suggest a feature",
                description: "Suggest a feature",
                value: "feature",
            },
        ])
);

module.exports = {
    name: "embed",
    description: "Sends embeds used to allow easier accessibility for users, e.g. via buttons & dropdown menus.",
    permission: 3,
    execute: async (/** @type {require("discord.js").Client} */ client, /** @type {require("discord.js").CommandInteraction} */ interaction) => {
        await interaction.deferReply({ ephemeral: true });
        const command = interaction.options.getString("command");

        switch (command) {
            case "ticket":
                await interaction.editReply({ embeds: [ticketEmbed], components: [category] });
                break;
        }

        interaction.channel.send({ embeds: [ticketEmbed], components: [category] });

        interaction.deleteReply();
    },
    options: [
        {
            type: "String",
            name: "command",
            description: "The command to reload. Leave empty to reload all.",
            required: false,
            choices: {
                Ticket: "ticket",
            },
        },
    ],
};
