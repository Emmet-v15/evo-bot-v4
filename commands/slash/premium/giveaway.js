const { ButtonBuilder } = require("discord.js");
const { ActionRowBuilder } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const { ButtonStyle } = require("discord.js");
const { uuidv4 } = require("../../../util/crypto");

module.exports = {
    name: "giveaway",
    description: "Gives premium to the first X people that press a button.",
    permission: 2,
    execute: async (
        /** @type {require("discord.js").Client} */ client,
        /** @type {require("discord.js").CommandInteraction} */ interaction
    ) => {
        await interaction.deferReply({ ephemeral: true });

        const number = interaction.options.getInteger("number");
        const type = interaction.options.getString("type");

        const mappings = {
            premium: "Evo™️ Premium",
            beta: "Evo™️ Beta",
        };

        const role = client.settings.get(interaction.guild.id, `role.${type}`);
        if (!role) return interaction.editReply({ content: `The role for ${type} is not configured.` });

        const giveawayUUID = uuidv4();

        client.settings.set(interaction.guild.id, number, `giveaway.${giveawayUUID}.number`);
        client.settings.set(interaction.guild.id, number, `giveaway.${giveawayUUID}.original`);
        client.settings.set(interaction.guild.id, type, `giveaway.${giveawayUUID}.type`);

        const embed = new EmbedBuilder()
            .setTitle(`${mappings[type]} Giveaway`)
            .setDescription(`**First ${number} people to press the button below will get ${mappings[type]}!**`)
            .setFooter({ text: `Giveaways | Evo V4™️`, iconURL: client.user.displayAvatarURL() })
            .setTimestamp();

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`premium-giveaway-${giveawayUUID}`)
                .setLabel(`Get ${mappings[type]}`)
                .setStyle(ButtonStyle.Primary)
        );

        await interaction.editReply({ content: `Giveaway created with ID \`${giveawayUUID}\` for ${mappings[type]}` });
        interaction.channel.send({ embeds: [embed], components: [row] });
    },
    options: [
        {
            type: "Integer",
            name: "number",
            description: "The number of people to give premium to.",
            required: true,
        },
        {
            type: "String",
            name: "type",
            description: "The type of premium to give.",
            required: true,
            choices: { premium: "premium", beta: "beta" },
        },
        // {
        //     type: "String",
        //     name: "duration",
        //     description: "The duration of the premium. (default lifetime)",
        //     required: false,
        //     choices: { lifetime: "lifetime", month: "month", week: "week", day: "day", hour: "hour" },
        // },
    ],
};
