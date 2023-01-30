module.exports = {
    name: "error",
    description: "Throws an error to test the error handler.",
    permission: 3,
    execute: async (/** @type {require("discord.js").Client} */ client, /** @type {require("discord.js").CommandInteraction} */ interaction) => {
        let message = interaction.options.getString("message");
        if (!message) message = "This is a test error";
        interaction.editReply({ content: "Throwing error..." });
        throw new Error(message);
    },
    options: [{ type: "String", name: "message", description: "the message displayed on the stack trace.", required: false }],
};
