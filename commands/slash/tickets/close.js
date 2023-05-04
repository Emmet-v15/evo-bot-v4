const { EmbedBuilder } = require("discord.js");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    name: "close",
    description: "Close the ticket.",
    permission: 1,
    execute: async (
        /** @type {require("discord.js").Client} */ client,
        /** @type {require("discord.js").CommandInteraction} */ interaction
    ) => {
        const ticket = interaction.channel;

        const closeEmbed = new EmbedBuilder()
            .setTitle("Ticket Closed")
            .setDescription(`This ticket has been closed & archived by <@${interaction.user.id}>`)
            .setColor("#00ff00")
            .setTimestamp();

        await interaction.reply({ embeds: [closeEmbed] });
        if (!ticket.locked) await ticket.setLocked(true);
        if (!ticket.archived) await ticket.setArchived(true);
    },
    options: [],
};
