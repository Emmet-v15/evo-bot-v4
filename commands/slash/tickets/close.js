const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    name: "close",
    description: "Close the ticket.",
    permission: 1,
    execute: async (/** @type {require("discord.js").Client} */ client, /** @type {require("discord.js").CommandInteraction} */ interaction) => {
        const embed = new EmbedBuilder()
            .setTitle("Ticket Closing...")
            .setDescription(`This ticket will be closed <t:${parseInt(Date.now().toString().slice(0, -3)) + 10}:R>`)
            .setAuthor({ name: "⚠️ Request by " + interaction.user.username, iconUrl: interaction.user.avatarURL() })
            .setFooter({ text: "EvoTickets [BETA] | Project Evo V4", iconURL: client.user.avatarURL() });

        interaction.reply({
            embeds: [embed],
            components: [
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId("cancel-close-ticket").setLabel("Cancel").setStyle(ButtonStyle.Danger).setEmoji("🛑")
                ),
            ],
        });
    },
    options: [
        {
            type: "String",
            name: "options",
            description: "Example Options.",
            required: false,
        },
    ],
};
