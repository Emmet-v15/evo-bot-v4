module.exports = {
    name: "error",
    description: "Throws an error to test the error handler.",
    permission: 2,
    execute: async (client, interaction) => {
        let message = interaction.options.getString("message");
        if (!message) message = "This is a test error";
        interaction.editReply({ content: "Throwing error..." });
        throw new Error(message);
    },
    options: [
        { type: "String", name: "message", description: "the message displayed on the stack trace.", required: false },
    ],
};

// regex to check for string that don't start with a capital letter or do not end with .
const regex = /(?<!\.)\b[a-z]/g;
