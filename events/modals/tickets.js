const { StringSelectMenuBuilder } = require("discord.js");
const { ButtonBuilder, ActionRowBuilder, EmbedBuilder, ChannelType, ButtonStyle } = require("discord.js");

module.exports = async (/** @type {import("discord.js").Client} */ client, /** @type {import("discord.js").ModalSubmitInteraction} */ interaction, ...args) => {
    await interaction.deferReply({ ephemeral: true });

    switch (args[0]) {
        case "create": {
            const reason = interaction.fields.getTextInputValue("reason");
            client.userDB.set(interaction.user.id, reason, "tickets.reason");

            const executorDropdown = new StringSelectMenuBuilder()
                .setCustomId("support-executor")
                // The label is the prompt the user sees for this input
                .setPlaceholder("Select your executor")
                .addOptions([
                    {
                        label: "Synapse X",
                        value: "synapse",
                        emoji: "🔥",
                    },
                    {
                        label: "KRNL",
                        value: "krnl",
                        emoji: "🔥",
                    },
                    {
                        label: "Script-Ware Windows",
                        value: "scriptware",
                        description: "Script-Ware Mac is not supported",
                        emoji: "🔥",
                    },
                    {
                        label: "Other",
                        value: "other",
                        description: "Support for other executors is not guaranteed.",
                        emoji: "🔥",
                    },
                ]);

            const executorActionRow = new ActionRowBuilder().addComponents(executorDropdown);
            // send the executor dropdown
            return await interaction
                .editReply({
                    content: `<@${interaction.user.id}> Please select your executor`,
                    components: [executorActionRow],
                })
                .then(() => {
                    setTimeout(() => {
                        interaction.deleteReply();
                    }, 1000 * 30 * 5);
                });
        }
        default:
            interaction.editReply({ content: "[Error]: Modal not implemented." });
            break;
    }
};
