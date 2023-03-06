const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "embedlist",
    description: "Display a list of embeds.",
    permission: 1,
    execute: async (
        /** @type {require("discord.js").Client} */ client,
        /** @type {require("discord.js").CommandInteraction} */ interaction
    ) => {
        await interaction.deferReply({ ephemeral: true });

        const embeds = client.settings.get(interaction.guild.id, "embeds");
        if (!embeds || !Object.keys(embeds).length) return interaction.editReply({ content: "No embeds found." });

        const embed = new EmbedBuilder()
            .setTitle("Embeds")
            .setDescription("Below are a list of embeds that are available on this server alongside their description")
            .setColor("0099FF");
        let fields = [];

        for (const [id, embedOptions] of Object.entries(embeds)) {
            if (!embedOptions) continue;
            fields.push({
                name: id,
                value: embedOptions.description
                    ? embedOptions.description.length > 256
                        ? embedOptions.description.substring(0, 253) + "..."
                        : embedOptions.description
                    : "No description",
            });
        }

        embed.addFields(fields);

        interaction.editReply({
            embeds: [embed],
        });
    },
    options: [],
};
