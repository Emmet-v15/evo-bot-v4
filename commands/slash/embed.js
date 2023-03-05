const { CommandInteraction, Client } = require("discord.js");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

const generateEmbed = (embedOptions, author) => {
    // check if embed options are valid
    if (!Object.values(embedOptions).filter((value) => value !== null).length) return;

    const embed = new EmbedBuilder();
    if (embedOptions.title) embed.setTitle(embedOptions.title);
    if (embedOptions.description) embed.setDescription(embedOptions.description.replace(/\\n/g, "\n"));
    if (embedOptions.color) embed.setColor(embedOptions.color);
    if (embedOptions.footer) embed.setFooter(embedOptions.footer);
    if (embedOptions.thumbnail) embed.setThumbnail(embedOptions.thumbnail);
    if (embedOptions.image) embed.setImage(embedOptions.image);
    if (embedOptions.author) embed.setFooter({ text: `by ${author.user.username}`, iconURL: author?.displayAvatarURL() });
    if (embedOptions.url) embed.setURL(embedOptions.url);
    if (embedOptions.timestamp) embed.setTimestamp(embedOptions.timestamp);
    if (embedOptions.fields) embed.addFields(embedOptions.fields.replace(/\\n/g, "\n"));

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
    execute: async (/** @type {Client} */ client, /** @type {CommandInteraction} */ interaction) => {
        await interaction.deferReply({ ephemeral: true });
        const action = interaction.options.getString("action");
        const id = interaction.options.getString("id");

        const embedOptions = {
            title: interaction.options.getString("title"),
            description: interaction.options.getString("description"),
            color: interaction.options.getString("color"),
            footer: interaction.options.getString("footer"),
            thumbnail: interaction.options.getString("thumbnail"),
            image: interaction.options.getString("image"),
            author: interaction.options.getBoolean("author"),
            url: interaction.options.getString("url"),
            timestamp: interaction.options.getString("timestamp"),
            fields: interaction.options.getString("fields"),
        };

        switch (action) {
            case "create": {
                const embed = generateEmbed(embedOptions, interaction.member);
                if (!embed) return interaction.editReply({ content: "Invalid embed options." });

                client.settings.set(interaction.guild.id, embedOptions, `embeds.${id}.unconfirmed`);
                interaction.editReply({
                    content: `Confirm creation of \`${id}\`?`,
                    embeds: [embed],
                    components: [
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder().setCustomId(`embeds-confirmCreate-${id}`).setLabel("Confirm").setStyle(ButtonStyle.Success),
                            new ButtonBuilder().setCustomId(`embeds-cancelCreate-${id}`).setLabel("Cancel").setStyle(ButtonStyle.Danger)
                        ),
                    ],
                });
                break;
            }
            case "edit": {
                const oldEmbedOptions = client.settings.get(interaction.guild.id, `embeds.${id}`);
                if (!oldEmbedOptions) return interaction.editReply({ content: `Embed \`${id}\` does not exist.` });

                if (embedOptions.title) oldEmbedOptions.title = embedOptions.title;
                if (embedOptions.description) oldEmbedOptions.description = embedOptions.description;
                if (embedOptions.color) oldEmbedOptions.color = embedOptions.color;
                if (embedOptions.footer) oldEmbedOptions.footer = embedOptions.footer;
                if (embedOptions.thumbnail) oldEmbedOptions.thumbnail = embedOptions.thumbnail;
                if (embedOptions.image) oldEmbedOptions.image = embedOptions.image;
                // if (embedOptions.author) oldEmbedOptions.author = embedOptions.author;
                if (embedOptions.url) oldEmbedOptions.url = embedOptions.url;
                if (embedOptions.timestamp) oldEmbedOptions.timestamp = embedOptions.timestamp;
                if (embedOptions.fields) oldEmbedOptions.fields = embedOptions.fields;

                const embed = generateEmbed(oldEmbedOptions, interaction.member);
                if (!embed) return interaction.editReply({ content: "Invalid embed options." });

                client.settings.set(interaction.guild.id, oldEmbedOptions, `embeds.${id}.unconfirmed`);
                interaction.editReply({
                    content: `Confirm changes of \`${id}\`?`,
                    embeds: [embed],
                    components: [
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                                .setCustomId(`embeds-confirmChanges-${id}`)
                                .setLabel("Confirm")
                                .setStyle(ButtonStyle.Success),
                            new ButtonBuilder().setCustomId(`embeds-cancelChanges-${id}`).setLabel("Cancel").setStyle(ButtonStyle.Danger)
                        ),
                    ],
                });
                break;
            }
            case "delete": {
                const embedOptions = client.settings.get(interaction.guild.id, `embeds.${id}`);
                if (!embedOptions) return interaction.editReply({ content: `Embed \`${id}\` does not exist.` });

                const embed = generateEmbed(embedOptions, interaction.member);
                if (!embed) {
                    client.settings.delete(interaction.guild.id, `embeds.${id}`);
                    return interaction.editReply({ content: `Deleted \`${id}\`` });
                }

                interaction.editReply({
                    content: `Are you sure you wish to delete \`${id}\`?`,
                    embeds: [embed],
                    components: [
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder().setCustomId(`embeds-confirmDelete-${id}`).setLabel("Confirm").setStyle(ButtonStyle.Success),
                            new ButtonBuilder().setCustomId(`embeds-cancelDelete-${id}`).setLabel("Cancel").setStyle(ButtonStyle.Danger)
                        ),
                    ],
                });
                break;
            }
            case "display": {
                const embedOptions = client.settings.get(interaction.guild.id, `embeds.${id}`);
                if (!embedOptions) return interaction.editReply({ content: `Embed \`${id}\` does not exist.` });

                const embed = generateEmbed(embedOptions, interaction.member);
                if (!embed) return interaction.editReply({ content: "Invalid embed options." });
                interaction
                    .editReply({
                        content: "Sending...",
                        ephemeral: true,
                    })
                    .then(() => interaction.channel.send({ embeds: [embed], ephemeral: false }));

                break;
            }
            case "list": {
                const embeds = client.settings.get(interaction.guild.id, "embeds");
                if (!embeds || !Object.keys(embeds).length) return interaction.editReply({ content: "No embeds found." });

                const embed = new EmbedBuilder().setTitle("Embeds").setDescription().setColor("0099FF");

                interaction.editReply({
                    embeds: [embed],
                });
                break;
            }
        }
    },
    options: [
        {
            type: "String",
            name: "action",
            description: "Create / edit an embed.",
            required: true,
            choices: { Create: "create", Edit: "edit", Delete: "delete", Display: "display" },
        },
        {
            type: "String",
            name: "id",
            description: "ID of embed.",
            required: true,
            choices: embedIds,
        },
        {
            type: "String",
            name: "title",
            description: "Title of embed.",
            required: false,
        },
        {
            type: "String",
            name: "description",
            description: "Description of embed.",
            required: false,
        },
        {
            type: "String",
            name: "color",
            description: "Color of embed.",
            required: false,
        },
        {
            type: "String",
            name: "footer",
            description: "Footer of embed.",
            required: false,
        },
        {
            type: "String",
            name: "thumbnail",
            description: "Thumbnail of embed.",
            required: false,
        },
        {
            type: "String",
            name: "image",
            description: "Image of embed.",
            required: false,
        },
        {
            type: "Boolean",
            name: "author",
            description: "Display author in embed?",
            required: false,
        },
        {
            type: "String",
            name: "url",
            description: "URL of embed.",
            required: false,
        },
        {
            type: "String",
            name: "timestamp",
            description: "Timestamp of embed.",
            required: false,
        },
        {
            type: "String",
            name: "fields",
            description: "Fields of embed. [WORK IN PROGRESS]",
            required: false,
        },
    ],
};
