module.exports = {
    name: "prune",
    description: "Command to Bulk delete messages.",
    permission: 1,
    execute: async (/** @type {require("discord.js").Client} */ client, /** @type {require("discord.js").CommandInteraction} */ interaction) => {
        await interaction.deferReply({ ephemeral: true });
        const amount = interaction.options.getInteger("amount");

        if (amount < 1 || amount > 100) {
            return interaction.editReply({ content: "You need to input a number between 1 and 100." });
        }

        await interaction.channel.bulkDelete(amount, true).catch((err) => {
            console.error(err);
            return interaction.editReply({ content: "There was an error trying to prune messages in this channel!" });
        });

        interaction.editReply({ content: `Pruned ${amount} messages.` });
    },
    options: [
        {
            type: "Integer",
            name: "amount",
            description: "Amount of messages to delete.",
            required: true,
        },
    ],
};
