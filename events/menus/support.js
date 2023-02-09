module.exports = async (/** @type {import("discord.js").Client} */ client, /** @type {import("discord.js").ButtonInteraction} */ interaction, ...args) => {
    await interaction.deferReply({ ephemeral: true });

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

            const executorInput = new TextInputBuilder()
                .setCustomId("executor")
                // The label is the prompt the user sees for this input
                .setLabel("What executor are you using?")
                .setStyle(TextInputStyle.Short)
                .setMinLength(3)
                .setMaxLength(20)
                .setRequired(true)
                .setPlaceholder("e.g. Synapse X, KRNL, etc.");

            // An action row only holds one text input,
            // so you need one action row per text input.
            const firstActionRow = new ActionRowBuilder().addComponents(reasonInput);
            const secondActionRow = new ActionRowBuilder().addComponents(executorInput);

            // Add inputs to the modal
            modal.addComponents(firstActionRow, secondActionRow);
            await interaction.showModal(modal);
            return;
        }
    }
};
