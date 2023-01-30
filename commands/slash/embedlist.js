const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "embedlist",
    description: "Display a list of embeds.",
    permission: 1,
    execute: async (/** @type {require("discord.js").Client} */ client, /** @type {require("discord.js").CommandInteraction} */ interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const embeds = client.settings.get(interaction.guild.id, "embeds");
        if (!embeds || !Object.keys(embeds).length) return interaction.editReply({ content: "No embeds found." });

        const embed = new EmbedBuilder().setTitle("Embeds").setDescription("test").setColor("0099FF");
        for (const [id, embedOptions] of Object.entries(embeds)) {
            embed.addField(id, Object.values(embedOptions).filter((value) => value !== null).length);
        }

        interaction.editReply({
            embeds: [embed],
        });
    },
    options: [],
};
