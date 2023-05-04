const { TextInputBuilder } = require("discord.js");
const { ModalBuilder } = require("discord.js");
const { StringSelectMenuBuilder } = require("discord.js");
const { TextInputStyle } = require("discord.js");
const { ActionRowBuilder } = require("discord.js");
const { EmbedBuilder } = require("discord.js");

const supportComponents = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
        .setCustomId("support-category")
        .setPlaceholder("Select a category")
        .addOptions([
            {
                label: "General",
                value: "general",
            },
            {
                label: "Report a bug",
                value: "bug",
            },
            {
                label: "Make a suggestion",
                value: "suggestion",
            },
        ])
        .setMinValues(0)
        .setMaxValues(1)
);

module.exports = async (
    /** @type {import("discord.js").Client} */ client,
    /** @type {import("discord.js").ButtonInteraction} */ interaction,
    ...args
) => {
    switch (args[0]) {
        case "ticket": {
            const modal = new ModalBuilder().setCustomId("tickets-create-general").setTitle("Create a ticket");

            const reasonInput = new TextInputBuilder()
                .setCustomId("reason")
                .setLabel("Please describe your issue in detail.")
                .setStyle(TextInputStyle.Paragraph)
                .setMinLength(10)
                .setMaxLength(400)
                .setRequired(true)
                .setPlaceholder("e.g. I need help with my account. My issue is ...");

            const gameInput = new TextInputBuilder()
                .setCustomId("game")
                .setLabel("What game(s) does this apply to?")
                .setStyle(TextInputStyle.Short)
                .setMinLength(2)
                .setMaxLength(40)
                .setRequired(true)
                .setPlaceholder("e.g. None, PET X.");

            const firstActionRow = new ActionRowBuilder().addComponents(reasonInput);
            const secondActionRow = new ActionRowBuilder().addComponents(gameInput);

            modal.addComponents(firstActionRow, secondActionRow);
            return await interaction.showModal(modal);

            // switch (category) {
            //     case "bug": {
            //         await interaction.deferReply({ ephemeral: true });
            //         // interaction.editReply({ content: "Not yet implemented.", ephemeral: true });
            //         // break;

            //         const bugModal = new ModalBuilder().setCustomId("tickets-create-bug").setTitle("Create a bug report");

            //         const bugLocation = new TextInputBuilder()
            //             .setCustomId("bug-location")
            //             .setLabel("Please provide the location of the bug.")
            //             .setStyle(TextInputStyle.Short)
            //             .setMinLength(3)
            //             .setMaxLength(50)
            //             .setRequired(true)
            //             .setPlaceholder("e.g. Phantom forces, Discord bot etc.");

            //         const bugInfo = new TextInputBuilder()
            //             .setCustomId("bug-info")
            //             .setLabel("Please describe the bug in detail.")
            //             .setStyle(TextInputStyle.Paragraph)
            //             .setMinLength(10)
            //             .setMaxLength(400)
            //             .setRequired(true)
            //             .setPlaceholder("e.g. I found a bug with the silent aim. The bug is ...");

            //         const stepsToReproduce = new TextInputBuilder()
            //             .setCustomId("bug-stepstoreproduce")
            //             .setLabel("Please provide steps to reproduce the bug.")
            //             .setStyle(TextInputStyle.Paragraph)
            //             .setMinLength(10)
            //             .setMaxLength(400)
            //             .setRequired(true)
            //             .setPlaceholder("e.g. 1. Turn on silent aim 2. Try to shoot 3. ... e.t.c.");

            //         const bugVideo = new TextInputBuilder()
            //             .setCustomId("bug-video")
            //             .setLabel("Please provide a video of the bug occuring.")
            //             .setStyle(TextInputStyle.Paragraph)
            //             .setMinLength(10)
            //             .setMaxLength(400)
            //             .setRequired(false)
            //             .setPlaceholder("e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ");

            //         const firstActionRow = new ActionRowBuilder().addComponents(bugLocation);
            //         const secondActionRow = new ActionRowBuilder().addComponents(bugInfo);
            //         const thirdActionRow = new ActionRowBuilder().addComponents(stepsToReproduce);
            //         const fourthActionRow = new ActionRowBuilder().addComponents(bugVideo);

            //         bugModal.addComponents(firstActionRow);
            //         bugModal.addComponents(secondActionRow);
            //         bugModal.addComponents(thirdActionRow);
            //         bugModal.addComponents(fourthActionRow);
            //         return await interaction.showModal(bugModal);
            //     }
            //     case "suggestion": {
            //         await interaction.deferReply({ ephemeral: true });
            //         // interaction.editReply({ content: "Not yet implemented, use General tickets.", ephemeral: true });
            //         // break;

            //         const suggestionModal = new ModalBuilder().setCustomId("tickets-create-suggestion").setTitle("Create a suggestion");

            //         const suggestionType = new TextInputBuilder()
            //             .setCustomId("suggestion-type")
            //             .setLabel("State a name for this suggestion.")
            //             .setStyle(TextInputStyle.Short)
            //             .setMinLength(3)
            //             .setMaxLength(25)
            //             .setRequired(true)
            //             .setPlaceholder("e.g. Aimbot, Discord bot, etc.");

            //         const suggestionInfo = new TextInputBuilder()
            //             .setCustomId("suggestion-info")
            //             .setLabel("Please describe your suggestion.")
            //             .setStyle(TextInputStyle.Paragraph)
            //             .setMinLength(10)
            //             .setMaxLength(400)
            //             .setRequired(true)
            //             .setPlaceholder("e.g. I suggest adding a new feature (penis esp) that does ...");

            //         const firstActionRow = new ActionRowBuilder().addComponents(suggestionType);
            //         const secondActionRow = new ActionRowBuilder().addComponents(suggestionInfo);

            //         suggestionModal.addComponents(firstActionRow);
            //         suggestionModal.addComponents(secondActionRow);

            //         return await interaction.showModal(suggestionModal);
            //     }
            //     case "general": {
            //         const modal = new ModalBuilder().setCustomId("tickets-create-general").setTitle("Create a ticket");

            //         const reasonInput = new TextInputBuilder()
            //             .setCustomId("reason")
            //             .setLabel("Please describe your issue in detail.")
            //             .setStyle(TextInputStyle.Paragraph)
            //             .setMinLength(10)
            //             .setMaxLength(400)
            //             .setRequired(true)
            //             .setPlaceholder("e.g. I need help with my account. My issue is ...");

            //         const firstActionRow = new ActionRowBuilder().addComponents(reasonInput);

            //         modal.addComponents(firstActionRow);
            //         return await interaction.showModal(modal);
            //     }
            // }
            // break;
        }
    }
};
