const { EmbedBuilder } = require("discord.js");

module.exports = async (
    /** @type {import("discord.js").Client} */ client,
    /** @type {import("discord.js").ModalSubmitInteraction} */ interaction,
    ...args
) => {
    await interaction.deferReply({ ephemeral: true });

    switch (args[0]) {
        case "close": {
            const ticket = interaction.channel;
            const closeEmbed = new EmbedBuilder()
                .setTitle("Ticket Closed")
                .setDescription(`This ticket has been closed & archived by <@${interaction.user.id}>`)
                .setColor("#00ff00")
                .setTimestamp();

            await ticket.send({ embeds: [closeEmbed] });
            interaction.deleteReply();
            if (!ticket.locked) await ticket.setLocked(true);
            if (!ticket.archived) await ticket.setArchived(true);
            return;
        }
        case "claim": {
            // check if user is allowed to claim the ticket
            if (client.settings.get(interaction.guild.id, "role.ticketClaim")?.length > 0) {
                const roleID = client.settings.get(interaction.guild.id, "role.ticketClaim");
                // get role by id
                const role = interaction.guild.roles.cache.get(roleID);
                // check if user has role
                if (!interaction.member.roles.cache.has(role))
                    return interaction.reply({ content: "You are not allowed to claim tickets.", ephemeral: true });
            }

            const ticket = interaction.channel;
            const claimEmbed = new EmbedBuilder()
                .setTitle("Ticket Claimed")
                .setDescription(`This ticket has been claimed by <@${interaction.user.id}>`)
                .setColor("#00ff00")
                .setTimestamp();

            interaction.deleteReply();
            return await ticket.send({ embeds: [claimEmbed] });
        }
        default:
            interaction.editReply({ content: "[Error]: Button not implemented." });
            break;
    }
};
