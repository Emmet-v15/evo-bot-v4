const { TextInputBuilder } = require("discord.js");
const { ModalBuilder } = require("discord.js");
const { TextInputStyle } = require("discord.js");
const { ActionRowBuilder } = require("discord.js");
const { ChannelType } = require("discord.js");
const { EmbedBuilder } = require("discord.js");

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
        case "executor": {
            /** @type {import("discord.js").ThreadChannel} */

            const executor = interaction.values[0];

            const thread = await interaction.channel.threads.create({
                name: `${interaction.user.username.slice(0, 9).toLowerCase()}-${interaction.user.discriminator}`,
                autoArchiveDuration: 24 * 60,
                type: ChannelType.PrivateThread,
                reason: "Ticket created by user",
            });
            thread.setInvitable(false);

            const ticketEmbed = new EmbedBuilder()
                .setTitle(`Ticket for ${interaction.user.username}#${interaction.user.discriminator}`)
                .setThumbnail(interaction.user.avatarURL())
                .setDescription(`<@${interaction.user.id}> This is your ticket, our support team with be with you shortly to help you resolve your issue.`)
                .addFields([
                    {
                        name: "Account Age",
                        value: `Made <t:${parseInt(interaction.user.createdTimestamp.toString().slice(0, -3))}:R>`,
                        inline: true,
                    },
                    {
                        name: "Join Date",
                        value: `Joined <t:${parseInt(interaction.member.joinedTimestamp.toString().slice(0, -3))}:R>`,
                        inline: true,
                    },
                    {
                        name: "Premium Status",
                        value: `Expires <date:in X days/months>`,
                        inline: true,
                    },
                    { name: "Executor", value: executor, inline: true },

                    {
                        name: "HWID",
                        value: "Hwid?",
                        inline: true,
                    },
                    { name: "Reason", value: `**${reason}**`, inline: true },
                ])
                .setColor(interaction.member.displayHexColor)
                .setFooter({
                    text: "EvoTickets [BETA] | Project Evo V4 | Press the buttons below to close / claim the ticket",
                    iconURL: client.user.avatarURL(),
                });

            const ticketButtons = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId("tickets-close").setLabel("Mark as completed").setEmoji("📨").setStyle(ButtonStyle.Danger),
                new ButtonBuilder().setCustomId("tickets-claim").setLabel("Claim this ticket").setEmoji("📨").setStyle(ButtonStyle.Success)
            );

            await thread.send({
                embeds: [ticketEmbed],
                components: [ticketButtons],
            });

            const userEmbed = new EmbedBuilder()
                .setTitle("Ticket created")
                .setDescription(`Your ticket has been created! You can view it here: <#${thread.id}>`)
                .setColor("#00ff00")
                .setTimestamp();

            thread.members.add(interaction.user.id);

            // log to the ticket log channel
            const logChannel = interaction.guild.channels.cache.find((c) => c.id == client.settings.get(interaction.guild.id, "logs.channel"));
            const logEmbed = new EmbedBuilder()
                .setTitle("Ticket created")
                .setDescription(`Ticket created by <@${interaction.user.id}>`)
                .addFields([
                    { name: "Reason", value: reason, inline: true },
                    { name: "Executor", value: executor, inline: true },
                    { name: "Ticket", value: `<#${thread.id}>`, inline: true },
                ])
                .setColor("#00ff00")
                .setTimestamp();

            logChannel.send({ embeds: [logEmbed] });

            return interaction.editReply({ embeds: [userEmbed] });
        }
    }
};
