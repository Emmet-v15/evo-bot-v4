module.exports = async (
    /** @type {import("discord.js").Client} */ client,
    /** @type {import("discord.js").ButtonInteraction} */ interaction,
    ...args
) => {
    switch (args[0]) {
        case "claim": {
            await interaction.deferReply({ ephemeral: true });
        }
    }
};
