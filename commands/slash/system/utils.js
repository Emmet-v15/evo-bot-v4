module.exports = {
    name: "utils",
    description: "Utility commands for the bot dev.",
    permission: 3,
    execute: async (
        /** @type {require("discord.js").Client} */ client,
        /** @type {require("discord.js").CommandInteraction} */ interaction
    ) => {
        interaction.deferReply({ ephemeral: true });

        const action = interaction.options.getString("action");

        if (action === "outputsettings") {
            const settings = client.settings.get(interaction.guild.id);
            const settingsString = JSON.stringify(settings, null, 4);
            const settingsFile = new MessageAttachment(Buffer.from(settingsString), "settings.json");
            interaction.editReply({ files: [settingsFile] });
        } else if (action === "outputuserdb") {
            const userDB = client.userDB.get(interaction.guild.id);
            const userDBString = JSON.stringify(userDB, null, 4);
            const userDBFile = new MessageAttachment(Buffer.from(userDBString), "userdb.json");
            interaction.editReply({ files: [userDBFile] });
        }

        interaction.editReply({ content: "Success!" });
    },
    options: [
        {
            type: "String",
            name: "action",
            description: "The action to perform",
            choices: { "Output Settings": "outputsettings", "Output UserDB": "outputuserdb" },
            required: true,
        },
    ],
};
