const { ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } = require("discord.js");
const { ChannelType, ThreadChannel } = require("discord.js");

module.exports = {
    name: "create",
    description: "Create a ticket.",
    permission: 1,
    execute: async (
        /** @type {require("discord.js").Client} */ client,
        /** @type {require("discord.js").Interaction} */ interaction
    ) => {
        // Create the modal
        const modal = new ModalBuilder().setCustomId("myModal").setTitle("My Modal");

        // Add components to modal

        // Create the text input components
        const favoriteColorInput = new TextInputBuilder()
            .setCustomId("favoriteColorInput")
            // The label is the prompt the user sees for this input
            .setLabel("What's your favorite color?")
            // Short means only a single line of text
            .setStyle(TextInputStyle.Short);

        const hobbiesInput = new TextInputBuilder()
            .setCustomId("hobbiesInput")
            .setLabel("What's some of your favorite hobbies?")
            // Paragraph means multiple lines of text.
            .setStyle(TextInputStyle.Paragraph);

        // An action row only holds one text input,
        // so you need one action row per text input.
        const firstActionRow = new ActionRowBuilder().addComponents(favoriteColorInput);
        const secondActionRow = new ActionRowBuilder().addComponents(hobbiesInput);

        // Add inputs to the modal
        modal.addComponents(firstActionRow, secondActionRow);

        await interaction.showModal(modal);

        /** @type {ThreadChannel} */
        const thread = await interaction.channel.threads.create({
            name: `${interaction.user.username.slice(0, 9).toLowerCase()}-${interaction.user.discriminator}`,
            autoArchiveDuration: 24 * 60,
            type: ChannelType.PrivateThread,
            reason: "This is a test thread",
        });

        thread.members.add(interaction.user.id);

        // interaction.editReply({ content: "Created Thread" });
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
