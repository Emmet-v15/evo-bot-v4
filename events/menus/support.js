const { TextInputBuilder } = require("discord.js");
const { ModalBuilder } = require("discord.js");
const { TextInputStyle } = require("discord.js");
const { ActionRowBuilder } = require("discord.js");

module.exports = async (/** @type {import("discord.js").Client} */ client, /** @type {import("discord.js").ButtonInteraction} */ interaction, ...args) => {
    switch (args[0]) {
        case "category": {
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

            // An action row only holds one text input,
            // so you need one action row per text input.
            const firstActionRow = new ActionRowBuilder().addComponents(reasonInput);

            // Add inputs to the modal
            modal.addComponents(firstActionRow);
            return await interaction.showModal(modal);
        }
    }
};
