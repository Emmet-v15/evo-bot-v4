const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

const generateEmbed = (embedOptions) => {
    // check if embed options are valid
    if (!Object.values(embedOptions).filter((value) => value !== null).length) return;

    const embed = new EmbedBuilder();
    if (embedOptions.title) embed.setTitle(embedOptions.title);
    if (embedOptions.description) embed.setDescription(embedOptions.description);
    if (embedOptions.color) embed.setColor(embedOptions.color);
    if (embedOptions.footer) embed.setFooter(embedOptions.footer);
    if (embedOptions.thumbnail) embed.setThumbnail(embedOptions.thumbnail);
    if (embedOptions.image) embed.setImage(embedOptions.image);
    if (embedOptions.author) embed.setAuthor(embedOptions.author);
    if (embedOptions.url) embed.setURL(embedOptions.url);
    if (embedOptions.timestamp) embed.setTimestamp(embedOptions.timestamp);
    if (embedOptions.fields) embed.addFields(embedOptions.fields);

    return embed;
};
let embedIds = {};

module.exports = {
    getEmbedIds: () => {
        return embedIds;
    },
    setEmbedIds: (/** @type {Object} */ newEmbedIds) => {
        embedIds = newEmbedIds;
    },
    name: "embed",
    description: "Create, edit and display embeds used in the bot.",
    permission: 1,
    execute: async (/** @type {require("discord.js").Client} */ client, /** @type {require("discord.js").CommandInteraction} */ interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const embeds = client.settings.get(interaction.guild.id, "embeds");
        if (!embeds || !Object.keys(embeds).length) return interaction.editReply({ content: "No embeds found." });

        const embed = new EmbedBuilder().setTitle("Embeds").setDescription().setColor("0099FF");
        for (const [id, embedOptions] of Object.entries(embeds)) {
            embed.addField(id, Object.values(embedOptions).filter((value) => value !== null).length);
        }

        interaction.editReply({
            embeds: [embed],
        });
    },
    options: [],
};
