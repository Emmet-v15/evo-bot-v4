const slash = require("../../../systems/setup/slash");

module.exports = {
    name: "slash",
    description: "Reloads all slash commands.",
    permission: 1,
    execute: async (
        /** @type {require("discord.js").Client} */ client,
        /** @type {require("discord.js").CommandInteraction} */ interaction
    ) => {
        // interaction.deferReply({ content: "All slash commands are being reloaded...", ephemeral: true });
        interaction.reply({ content: "All slash commands have been reloaded.", ephemeral: true });

        await slash(client);
    },
};
