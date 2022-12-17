module.exports = {
    name: "shutdown",
    description: "Shuts down the bot.",
    permission: 1,
    execute: async (
        /** @type {require("discord.js").Client} */ client,
        /** @type {require("discord.js").Interaction} */ interaction
    ) => {
        await interaction.reply({ content: "Shutting Down...", ephemeral: true });
        client.destroy();
        process.exit();
    },
};
