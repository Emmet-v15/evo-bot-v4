const slash = require("../../../systems/setup/slash");

module.exports = {
    name: "slash",
    description: "Reloads all slash commands.",
    permission: 1,
    execute: async (
        /** @type {require("discord.js").Client} */ client,
        /** @type {require("discord.js").Interaction} */ interaction
    ) => {
        await slash(client);
        interaction.editReply({ content: "Commands have been reloaded" });
    },
};
