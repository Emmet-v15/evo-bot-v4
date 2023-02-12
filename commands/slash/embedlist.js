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
        let fields = [];
        for (const [id, embedOptions] of Object.entries(embeds)) {
            fields.push({ name: id, value: embedOptions.title });
        }
        // use embed.addFields() instead of embed.addField() to add multiple fields at once (more efficient
        // than adding them one by one)

        embed.addFields(fields);

        interaction.editReply({
            embeds: [embed],
        });
    },
    options: [],
};
