module.exports = {
    name: "shutdown",
    description: "Shuts down the bot.",
    permission: 1,
    execute: async (client, interaction) => {
        await interaction.editReply({ content: "Shutting Down..." });
        client.destroy();
        process.exit();
    },
};
