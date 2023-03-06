const { StringSelectMenuBuilder } = require("discord.js");
const { ButtonBuilder, ActionRowBuilder, EmbedBuilder, ChannelType, ButtonStyle } = require("discord.js");

module.exports = async (
    /** @type {import("discord.js").Client} */ client,
    /** @type {import("discord.js").ModalSubmitInteraction} */ interaction,
    ...args
) => {
    await interaction.deferReply({ ephemeral: true });

    switch (args[0]) {
        case "create": {
            switch (args[1]) {
                case "suggestion": {
                    return;
                }
                case "bug": {
                    const executorDropdown = new StringSelectMenuBuilder()
                        .setCustomId("support-executor")
                        // The label is the prompt the user sees for this input
                        .setPlaceholder("Select your executor")
                        .addOptions([
                            {
                                label: "Synapse X",
                                value: "synapse",
                                emoji: "<:syn:1082307590983270410>",
                            },
                            {
                                label: "KRNL",
                                value: "krnl",
                                emoji: "<:krnl:1082307592732283001>",
                            },
                            {
                                label: "Script-Ware Windows",
                                value: "scriptware",
                                description: "Script-Ware Mac is only supported on Pet X.",
                                emoji: "<:sw:1082307588357627904>",
                            },
                            {
                                label: "Other",
                                value: "other",
                                description: "Support for other executors is not guaranteed.",
                                emoji: "💩",
                            },
                        ]);

                    const executorRow = new ActionRowBuilder().addComponents(executorDropdown);

                    const executorEmbed = new EmbedBuilder()
                        .setTitle("Select your executor")
                        .setDescription("Please select your executor from the dropdown menu below.")
                        .setColor("BE00FC");

                    const reply = interaction.editReply({ embeds: [executorEmbed], components: [executorRow] });

                    const filter = (i) => i.customId === "support-executor" && i.user.id === interaction.user.id;
                    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

                    collector.on("collect", async (i) => {
                        interaction.deleteReply();
                    });
                    break;
                }
                case "general": {
                    const reason = interaction.fields.getTextInputValue("reason");

                    return;
                }
            }
        }
        default:
            interaction.editReply({ content: "[Error]: Modal not implemented." });
            break;
    }
};
