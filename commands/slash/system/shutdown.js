module.exports = {
    name: "shutdown",
    description: "Shuts down the bot.",
    permission: 3,
    execute: async (/** @type {require("discord.js").Client} */ client, /** @type {require("discord.js").CommandInteraction} */ interaction) => {
        await interaction.reply({ content: "Shutting Down..." });
        client.destroy();
        process.exit();
    },
};
