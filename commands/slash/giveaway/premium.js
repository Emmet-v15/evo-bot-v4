const { EmbedBuilder } = require("discord.js");
const { uuidv4 } = require("../../../util/crypto");

module.exports = {
    name: "premium",
    description: "Gives premium to the first X people that press a button.",
    permission: 3,
    execute: async (
        /** @type {require("discord.js").Client} */ client,
        /** @type {require("discord.js").CommandInteraction} */ interaction
    ) => {
        interaction.deferReply();

        const number = interaction.options.getInteger("number");
        const type = interaction.options.getString("type");
        // generate a uuid for the giveaway
        const giveawayUUID = uuidv4();

        const embed = new EmbedBuilder()
            .setTitle("Premium Giveaway")
            .setDescription(`First ${number} people to press the button below will get a ${type} of free premium!`)
            .setFooter({ text: `Giveaways | Evo V4™️ | Giveaway ID: ${giveawayUUID}`, iconURL: client.user.displayAvatarURL() })
            .setTimestamp();

        const row = new MessageActionRow().addComponents(
            new MessageButton().setCustomId("premium").setLabel("Get Premium").setStyle("PRIMARY")
        );

        const msg = await interaction.editReply({ embeds: [embed], components: [row] });

        const filter = (i) => i.customId === "premium" && i.user.id !== client.user.id;
        // make an infinitely long collector

        const collector = msg.createMessageComponentCollector({ filter, time: 0 });

        interaction.editReply({ content: "Sent" });
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
            choices: { lifetime: "lifetime", month: "month", week: "week", day: "day" },
        },
    ],
};
