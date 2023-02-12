const { StringSelectMenuBuilder } = require("discord.js");
const { ButtonBuilder, ActionRowBuilder, EmbedBuilder, ChannelType, ButtonStyle } = require("discord.js");

module.exports = async (/** @type {import("discord.js").Client} */ client, /** @type {import("discord.js").ModalSubmitInteraction} */ interaction, ...args) => {
    await interaction.deferReply({ ephemeral: true });

    switch (args[0]) {
        case "create": {
            const reason = interaction.fields.getTextInputValue("reason");

            const executorDropdown = new StringSelectMenuBuilder()
                .setCustomId("executor")
                // The label is the prompt the user sees for this input
                .setLabel("What executor are you using?")
                .setRequired(true)
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
                        value: "script-ware",
                        description: "Script-Ware Mac is not supported",
                        emoji: "🔥",
                    },
                    {
                        label: "Other",
                        value: "other",
                        description: "Support for other executors is not garaunteed.",
                        emoji: "🔥",
                    },
                ]);

            const executorActionRow = new ActionRowBuilder().addComponents(executorDropdown);
            // send the executor dropdown
            await interaction.editReply({
                content: "Please select your executor",
                components: [executorActionRow],
            });
        }
        default:
            interaction.editReply({ content: "[Error]: Modal not implemented." });
            break;
    }
};
