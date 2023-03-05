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
        const giveawayUUID = uuidv4();

        client.settings.set(interaction.guild.id, number, `premium.giveaway.${giveawayUUID}.number`);
        client.settings.set(interaction.guild.id, type, `premium.giveaway.${giveawayUUID}.type`);

        const embed = new EmbedBuilder()
            .setTitle("Premium Giveaway")
            .setDescription(`**First ${number} people to press the button below will get Evo:tm: Beta!**`)
            .setFooter({ text: `Giveaways | Evo V4™️`, iconURL: client.user.displayAvatarURL() })
            .setTimestamp();

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`premium-giveaway-${giveawayUUID}`).setLabel("Get Premium").setStyle(ButtonStyle.Primary)
        );

        await interaction.editReply({ content: "Sent" });
        interaction.deleteReply();
        interaction.channel.send({ embeds: [embed], components: [row] });
    },
    options: [
        {
            type: "Integer",
            name: "number",
            description: "The number of people to give premium to.",
            required: true,
        },
        // {
        //     type: "String",
        //     name: "type",
        //     description: "The type of premium to give.",
        //     required: true,
        //     choices: { lifetime: "lifetime", month: "month", week: "week", day: "day", hour: "hour", beta: "beta" },
        // },
    ],
};
