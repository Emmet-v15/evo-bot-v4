const { EmbedBuilder } = require("discord.js");
const { ButtonBuilder } = require("discord.js");
const { ButtonStyle } = require("discord.js");
const { ActionRowBuilder } = require("discord.js");
const { StringSelectMenuBuilder } = require("discord.js");

const supportEmbed = new EmbedBuilder()
    .setTitle("Support panel")
    .setDescription(
        `If you have a problem with the script, you can open a ticket so we can help resolve your issue. **Use the dropdown below to open a support ticket**, and our team will shortly be with you.
        
        If you have a question, you can create a thread in <#1031233062706622544> where other community members can help you.`
    )
    .setColor("0099FF")
    .setTimestamp()
    .setFooter({ text: "EvoTickets | Evo v4™️ | Select an action below" });

const supportComponents = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
        .setCustomId("support-category")
        .setPlaceholder("Select a category")
        .addOptions([
            {
                label: "General",
                value: "general",
            },
            {
                label: "Report a bug",
                value: "bug",
            },
            {
                label: "Suggest a feature",
                value: "feature",
            },
        ])
        .setMinValues(0)
        .setMaxValues(1)
);

const donatorEmbed = new EmbedBuilder()
    .setTitle("Premium Access")
    .setDescription(`If you have bought Premium, click the button below and the bot will guide you through the process of gaining access to the Premium script`)
    .setColor("BE00FC");

const donatorComponents = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("premium-access").setLabel("Get Premium Access").setStyle(ButtonStyle.Success).setEmoji("🎁")
);

module.exports = {
    name: "embed",
    description: "Sends embeds used to allow easier accessibility for users, e.g. via buttons & dropdown menus.",
    permission: 3,
    execute: async (/** @type {require("discord.js").Client} */ client, /** @type {require("discord.js").CommandInteraction} */ interaction) => {
        await interaction.deferReply({ ephemeral: true });
        const command = interaction.options.getString("type");

        switch (command) {
            case "ticket":
                interaction.deleteReply();
                interaction.channel.send({ embeds: [supportEmbed], components: [supportComponents] });
            case "premium": {
                interaction.deleteReply();
                interaction.channel.send({ embeds: [donatorEmbed], components: [donatorComponents] });
                return;
            }
        }
    },
    options: [
        {
            type: "String",
            name: "type",
            description: "The embed to be sent",
            required: false,
            choices: {
                Ticket: "ticket",
                Premium: "premium",
            },
        },
    ],
};
