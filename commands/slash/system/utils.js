const { Attachment } = require("discord.js");
const { AttachmentBuilder } = require("discord.js");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

const util = require("util");

module.exports = {
    name: "utils",
    description: "Utility commands for the bot dev.",
    permission: 3,
    execute: async (
        /** @type {require("discord.js").Client} */ client,
        /** @type {require("discord.js").CommandInteraction} */ interaction
    ) => {
        await interaction.deferReply({ ephemeral: true });

        const action = interaction.options.getString("action");
        const file = interaction.options.get("file");

        if (action === "getSettings") {
            client.settings.fetchEverything();
            const data = client.settings.export();
            const settingsFile = new AttachmentBuilder().setName("settings.json").setFile(Buffer.from(data));
            interaction.editReply({ files: [settingsFile] });
        } else if (action === "getUserDB") {
            client.userDB.fetchEverything();
            const data = client.userDB.export();
            const userDBFile = new AttachmentBuilder().setName("userDB.json").setFile(Buffer.from(data));
            interaction.editReply({ files: [userDBFile] });
        } else if (action === "setSettings") {
            if (!file) return interaction.editReply({ content: "You must provide a file to import." });
            const settingsFile = interaction.options.get("file");
            const data = await fetch(settingsFile.attachment.url, { method: "GET" }).then((res) => res.json());
            client.settings.import(JSON.stringify(data), true, true);
            interaction.editReply({ content: "Success!" });
        } else if (action === "setUserDB") {
            if (!file) return interaction.editReply({ content: "You must provide a file to import." });
            const userDBFile = interaction.options.get("file");
            const data = await fetch(userDBFile.attachment.url, { method: "GET" }).then((res) => res.json());
            client.userDB.import(JSON.stringify(data), true, true);
            interaction.editReply({ content: "Success!" });
        }
    },
    options: [
        {
            type: "String",
            name: "action",
            description: "The action to perform",
            choices: { "Get Settings": "getSettings", "Get UserDB": "getUserDB", "Set Settings": "setSettings", "Set UserDB": "setUserDB" },
            required: true,
        },
        { type: "Attachment", name: "file", description: "The file to import" },
    ],
};
