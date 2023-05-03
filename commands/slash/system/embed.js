const { EmbedBuilder } = require("discord.js");
const { ButtonBuilder } = require("discord.js");
const { ButtonStyle } = require("discord.js");
const { ActionRowBuilder } = require("discord.js");
const { StringSelectMenuBuilder } = require("discord.js");

const supportEmbed = new EmbedBuilder()
    .setTitle("Support panel")
    .setDescription(
        `If you have a problem with the script, you can open a ticket so we can help resolve your issue. Use the button below to create a ticket and our team will be with you shortly.
        
        For suggestions and/or bug, you can create a thread in <#1097281850503876678> or <#1097281898125987930> where other community members and staff can help you.`
    )
    .setColor("0099FF")
    .setTimestamp()
    .setFooter({ text: "EvoTickets | Evo v4™️ | Select an action below" });

const supportComponents = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("support-ticket").setLabel("Open a ticket").setStyle(ButtonStyle.Primary).setEmoji("🎫")
);

const donatorEmbed = new EmbedBuilder()
    .setTitle("Premium Access")
    .setDescription(
        `If you have bought Premium, click the button below and the bot will guide you through the process of gaining access to the Premium script`
    )
    .setColor("BE00FC");

const donatorComponents = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("premium-access").setLabel("Get Premium Access").setStyle(ButtonStyle.Success).setEmoji("🎁")
);

module.exports = {
    name: "embed",
    description: "Sends embeds used to allow easier accessibility for users, e.g. via buttons & dropdown menus.",
    permission: 2,
    execute: async (
        /** @type {require("discord.js").Client} */ client,
        /** @type {require("discord.js").CommandInteraction} */ interaction
    ) => {
        await interaction.deferReply({ ephemeral: true });
        const command = interaction.options.getString("type");

        switch (command) {
            case "ticket": {
                interaction.deleteReply();
                interaction.channel.send({ embeds: [supportEmbed], components: [supportComponents] });
                break;
            }
            case "premium": {
                interaction.deleteReply();
                interaction.channel.send({ embeds: [donatorEmbed], components: [donatorComponents] });
                break;
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
