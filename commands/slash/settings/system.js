module.exports = {
    name: "system",
    description: "Manipulate the database on a low level.",
    permission: 2,
    execute: async (/** @type {require("discord.js").Client} */ client, /** @type {require("discord.js").CommandInteraction} */ interaction) => {
        await interaction.deferReply({ ephemeral: false });

        console.log(interaction.options.data);

        const key = interaction.options.getString("key");
        const scope = interaction.options.getString("global");
        const action = interaction.options.getString("action");
        const value = interaction.options.getString("value");

        if (action === "get") {
            if (scope == "global") {
                if (!client.settings.has("global", key)) return interaction.editReply({ content: "This key does not exist globally." });
                const value = client.settings.get("global", key);
                interaction.editReply({ content: `The value for \`${key}\` is \`${value}\` globally.` });
            } else if (scope == "guild") {
                if (!client.settings.has(interaction.guild.id, key)) return interaction.editReply({ content: "This key does not exist in the current guild." });
                const value = client.settings.get(interaction.guild.id, key);
                interaction.editReply({ content: `The value for \`${key}\` is \`${value}\` in this guild.` });
            }
        } else if (action === "set") {
            if (!value) return interaction.editReply({ content: "You must provide a value to set." });
            if (scope == "global") {
                const oldValue = client.settings.get("global", key);
                if (oldValue == value) return interaction.editReply({ content: "The value is already set to this." });
                client.settings.set("global", value, key);
                interaction.editReply({ content: `The value for \`${key}\` has been set ${oldValue ? `` : `from \`${oldValue}\``} to \`${value}\` globally.` });
            } else if (scope == "guild") {
                const oldValue = client.settings.get(interaction.guild.id, key);
                if (oldValue == value) return interaction.editReply({ content: "The value is already set to this." });
                client.settings.set(interaction.guild.id, value, key);
                interaction.editReply({
                    content: `The value for \`${key}\` has been set ${oldValue ? `` : `from \`${oldValue}\``} to \`${value}\` in this guild.`,
                });
            }
        } else if (action === "delete") {
            if (scope == "global") {
                if (!client.settings.has("global", key)) return interaction.editReply({ content: "This key does not exist globally." });
                client.settings.delete("global", key);
                interaction.editReply({ content: `The value for \`${key}\` has been deleted globally.` });
            } else if (scope == "guild") {
                if (!client.settings.has(interaction.guild.id, key)) return interaction.editReply({ content: "This key does not exist in the current guild." });
                client.settings.delete(interaction.guild.id, key);
                interaction.editReply({ content: `The value for \`${key}\` has been deleted in this guild.` });
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
            type: "String",
            name: "global",
            description: "Which databsae to modify or search.",
            required: false,
            choices: { Global: "global", Guild: "guild" },
        },
    ],
};
