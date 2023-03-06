const { EmbedBuilder } = require("discord.js");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    name: "close",
    description: "Close the ticket.",
    permission: 1,
    execute: async (
        /** @type {require("discord.js").Client} */ client,
        /** @type {require("discord.js").CommandInteraction} */ interaction
    ) => {
        const embed = new EmbedBuilder()
            .setTitle("Ticket Closing...")
            .setDescription(`This ticket will be closed <t:${Math.floor(Date.now() / 1000) + 10}:R>`)
            .setAuthor({ name: "⚠️ Request by " + interaction.user.username, iconUrl: interaction.user.avatarURL() })
            .setFooter({ text: "EvoTickets [BETA] | Project Evo V4", iconURL: client.user.avatarURL() });

        interaction.reply({
            embeds: [embed],
            components: [
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId("cancel-close-ticket").setLabel("Cancel").setStyle(ButtonStyle.Danger).setEmoji("🛑")
                ),
            ],
        });

        const filter = (i) => i.customId === "cancel-close-ticket" && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 10000 });

        collector.on("collect", async (i) => {
            if (i.customId === "cancel-close-ticket") {
                await i.deferUpdate();
                collector.stop();
                interaction.deleteReply();
            }
        });

        collector.on("end", async (collected) => {
            if (collected.size === 0) {
                interaction.channel.delete();
            }
        });
    },
    options: [
        {
            type: "String",
            name: "options",
            description: "Example Options.",
            required: false,
        },
    ],
};
