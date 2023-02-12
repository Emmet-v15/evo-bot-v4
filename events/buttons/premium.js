module.exports = async (/** @type {import("discord.js").Client} */ client, /** @type {import("discord.js").ButtonInteraction} */ interaction, ...args) => {
    await interaction.deferReply({ ephemeral: true });

    switch (args[0]) {
        case "access": {
            interaction.guild.channels.cache.get("1074448895372951592").send(`<@${interaction.user.id}> tried to claim`);

            return;
        }
    }
};
