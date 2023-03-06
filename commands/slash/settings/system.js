module.exports = {
    name: "system",
    description: "Manipulate the database on a low level.",
    permission: 2,
    execute: async (
        /** @type {require("discord.js").Client} */ client,
        /** @type {require("discord.js").CommandInteraction} */ interaction
    ) => {
        await interaction.deferReply({ ephemeral: false });

        const key = interaction.options.getString("key");
        const scope = interaction.options.getString("scope");
        const action = interaction.options.getString("action");
        const value = interaction.options.getString("value");
        let userID = interaction.options.getUser("user");
        let guildID = interaction.options.getString("guildID");

        if (!userID) {
            userID = interaction.user.id;
        }
        if (!guildID) {
            guildID = interaction.guild.id;
        }

        if (action === "get") {
            if (scope == "global") {
                if (!client.settings.has("global", key)) return interaction.editReply({ content: "This key does not exist globally." });
                const value = client.settings.get("global", key);
                interaction.editReply({ content: `The value for \`${key}\` is \`${value}\` globally.` });
            } else if (scope == "guild") {
                if (!client.settings.has(guildID, key))
                    return interaction.editReply({ content: "This key does not exist in the current guild." });
                const value = client.settings.get(guildID, key);
                interaction.editReply({ content: `The value for \`${key}\` is \`${value}\` in this guild.` });
            } else if (scope == "user") {
                if (!client.userDB.has(userID, key)) return interaction.editReply({ content: "This key does not exist for this user." });
                const value = client.userDB.get(userID, key);
                interaction.editReply({ content: `The value for \`${key}\` is \`${value}\` for this user.` });
            }
        } else if (action === "set") {
            if (!value) return interaction.editReply({ content: "You must provide a value to set." });
            if (scope == "global") {
                const oldValue = client.settings.get("global", key);
                if (oldValue == value) return interaction.editReply({ content: "The value is already set to this." });
                client.settings.set("global", value, key);
                interaction.editReply({
                    content: `The value for \`${key}\` has been set ${oldValue ? `` : `from \`${oldValue}\``} to \`${value}\` globally.`,
                });
            } else if (scope == "guild") {
                const oldValue = client.settings.get(guildID, key);
                if (oldValue == value) return interaction.editReply({ content: "The value is already set to this." });
                client.settings.set(guildID, value, key);
                interaction.editReply({
                    content: `The value for \`${key}\` has been set ${
                        oldValue ? `` : `from \`${oldValue}\``
                    } to \`${value}\` in this guild.`,
                });
            } else if (scope == "user") {
                const oldValue = client.userDB.get(userID, key);
                if (oldValue == value) return interaction.editReply({ content: "The value is already set to this." });
                client.userDB.set(userID, value, key);
                interaction.editReply({
                    content: `The value for \`${key}\` has been set ${
                        oldValue ? `` : `from \`${oldValue}\``
                    } to \`${value}\` for this user.`,
                });
            }
        } else if (action === "delete") {
            if (scope == "global") {
                if (!client.settings.has("global", key)) return interaction.editReply({ content: "This key does not exist globally." });
                client.settings.delete("global", key);
                interaction.editReply({ content: `The value for \`${key}\` has been deleted globally.` });
            } else if (scope == "guild") {
                if (!client.settings.has(guildID, key))
                    return interaction.editReply({ content: "This key does not exist in the current guild." });
                client.settings.delete(guildID, key);
                interaction.editReply({ content: `The value for \`${key}\` has been deleted in this guild.` });
            } else if (scope == "user") {
                if (!client.userDB.has(userID, key)) return interaction.editReply({ content: "This key does not exist for this user." });
                client.userDB.delete(userID, key);
                interaction.editReply({ content: `The value for \`${key}\` has been deleted for this user.` });
            }
        }
    },
    options: [
        {
            type: "String",
            name: "action",
            description: "The action to perform on the database.",
            required: true,
            choices: { Get: "get", Set: "set", Delete: "delete" },
        },
        {
            type: "String",
            name: "scope",
            description: "Which databsae to modify or search.",
            required: true,
            choices: { Global: "global", Guild: "guild", User: "user" },
        },
        {
            type: "String",
            name: "key",
            description: "The key in the database.",
            required: true,
        },
        {
            type: "String",
            name: "value",
            description: "The value to set the key to.",
            required: false,
        },
        {
            type: "User",
            name: "user",
            description: "The user to modify or search.",
            required: false,
        },
    ],
};
