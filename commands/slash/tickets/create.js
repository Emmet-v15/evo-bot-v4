const { StringSelectMenuBuilder } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const { ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } = require("discord.js");

module.exports = {
    name: "create",
    description: "Create a ticket.",
    permission: 0,
    execute: async (/** @type {require("discord.js").Client} */ client, /** @type {require("discord.js").CommandInteraction} */ interaction) => {
        // Create the modal
        const modal = new ModalBuilder().setCustomId("tickets-create").setTitle("Create a ticket");

        // Add components to modal

        // Create the text input components
        const reasonInput = new TextInputBuilder()
            .setCustomId("reason")
            // The label is the prompt the user sees for this input
            .setLabel("Please describe your issue in detail.")
            .setStyle(TextInputStyle.Paragraph)
            .setMinLength(10)
            .setMaxLength(400)
            .setRequired(true)
            .setPlaceholder("e.g. I need help with my account. My issue is ...");

        const executorDropdown = new StringSelectMenuBuilder()
            .setCustomId("executor")
            .setPlaceholder("What executor are you using?")
            .addOptions([
                {
                    label: "Synapse X",
                    value: "synapse",
                    description: "Synapse X",
                    emoji: "🔥",
                },
                {
                    label: "KRNL",
                    value: "krnl",
                    description: "KRNL",
                    emoji: "🔥",
                },
                {
                    label: "Script-Ware Windows",
                    value: "scriptware",
                    description: "Script-Ware Windows",
                    emoji: "🔥",
                },
                {
                    label: "Other",
                    value: "other",
                    description: "Other",
                    emoji: "🔥",
                },
            ]);

        // An action row only holds one text input,
        // so you need one action row per text input.
        const firstActionRow = new ActionRowBuilder().addComponents(reasonInput, executorDropdown);
        // const secondActionRow = new ActionRowBuilder().addComponents();

        // Add inputs to the modal
        modal.addComponents(firstActionRow);
        await interaction.showModal(modal);
    },
};
