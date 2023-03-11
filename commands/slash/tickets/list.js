const { ChannelType } = require("discord.js");

module.exports = {
    name: "list",
    description: "lists all open tickets.",
    permission: 1,
    execute: async (
        /** @type {require("discord.js").Client} */ client,
        /** @type {require("discord.js").CommandInteraction} */ interaction
    ) => {
        await interaction.deferReply({ ephemeral: true });
        let tickets = [];
        interaction.guild.channels.cache.forEach((thread) => {
            if (thread.type === ChannelType.PrivateThread) {
                if (thread.parentId === "1074426376469356724" && !thread.archived) tickets.push(thread);
            }
        });
        let ticketList = "";
        tickets.forEach((ticket) => {
            ticketList += `**${ticket.name}**\n`;
        });
        interaction.editReply(ticketList);
    },
};
