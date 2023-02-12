const { EmbedBuilder } = require("discord.js");
const { ActionRowBuilder } = require("discord.js");
const { StringSelectMenuBuilder } = require("discord.js");

const supportEmbed = new EmbedBuilder()
    .setTitle("Support panel")
    .setDescription(
        `If you have a problem with the script, you can open a ticket so we can help resolve your issue.
        Press the button below to open a ticket, our support team will help resolve your issue.If you're still having issues with the script, you can open a ticket so we can help resolve your issue.`
    )
    .setColor("0099FF")
    .setTimestamp()
    .setFooter({ text: "EvoTickets | Evo v4™️ | Select an action below" });

const category = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
        .setCustomId("support-category")
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
        .setMinValues(0)
        .setMaxValues(1)
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
                await interaction.editReply({ embeds: [supportEmbed], components: [category] });
                break;
        }

        interaction.channel.send({ embeds: [supportEmbed], components: [category] });

        interaction.deleteReply();
    },
    options: [
        {
            type: "String",
            name: "type",
            description: "The embed to be sent",
            required: false,
            choices: {
                Ticket: "ticket",
            },
        },
    ],
};
