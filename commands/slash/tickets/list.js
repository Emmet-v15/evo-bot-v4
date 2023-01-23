const { ChannelType } = require("discord.js");

module.exports = {
    name: "list",
    description: "lists all open tickets.",
    permission: 1,
    execute: async (
        /** @type {require("discord.js").Client} */ client,
        /** @type {require("discord.js").CommandInteraction} */ interaction
    ) => {
        interaction.deferReply({ ephemeral: true });
        let tickets = [];
        interaction.guild.channels.cache.forEach((channel) => {
            if (channel.type === ChannelType.GUILD_TEXT) {
                tickets.push(channel);
            }
        });
        let ticketList = "";
        tickets.forEach((ticket) => {
            ticketList += `**${ticket.name}**\n`;
        });
        interaction.reply(ticketList);
    },
};
