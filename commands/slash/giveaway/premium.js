const { EmbedBuilder } = require("discord.js");

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

        const embed = new EmbedBuilder()
            .setTitle("Premium Giveaway")
            .setDescription(`First ${number} people to press the button below will get a ${type} of free premium!`)
            .setFooter(`Requested by ${interaction.user.tag} | Evo V4 Giveaways`, interaction.user.avatarURL())
            .setTimestamp();

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
