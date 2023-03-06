const { TextInputBuilder } = require("discord.js");
const { ModalBuilder } = require("discord.js");
const { ButtonBuilder } = require("discord.js");
const { ButtonStyle } = require("discord.js");
const { TextInputStyle } = require("discord.js");
const { ActionRowBuilder } = require("discord.js");
const { ChannelType } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

module.exports = async (
    /** @type {import("discord.js").Client} */ client,
    /** @type {import("discord.js").ButtonInteraction} */ interaction,
    ...args
) => {
    switch (args[0]) {
        case "category": {
            const category = interaction.values[0];

            switch (category) {
                case "bug": {
                    const bugModal = new ModalBuilder().setCustomId("tickets-create-bug").setTitle("Create a bug report");

                    const bugInfo = new TextInputBuilder()
                        .setCustomId("bug-info")
                        .setLabel("Please describe the bug in detail.")
                        .setStyle(TextInputStyle.Paragraph)
                        .setMinLength(10)
                        .setMaxLength(400)
                        .setRequired(true)
                        .setPlaceholder("e.g. I found a bug with the silent aim. The bug is ...");

                    const stepsToReproduce = new TextInputBuilder()
                        .setCustomId("bug-stepstoreproduce")
                        .setLabel("Please provide steps to reproduce the bug.")
                        .setStyle(TextInputStyle.Paragraph)
                        .setMinLength(10)
                        .setMaxLength(400)
                        .setRequired(true)
                        .setPlaceholder("e.g. 1. Turn on silent aim 2. Try to shoot 3. ... e.t.c.");

                    const bugVideo = new TextInputBuilder()
                        .setCustomId("bug-video")
                        .setLabel("Please provide a video of the bug while it is happening if applicable.")
                        .setStyle(TextInputStyle.Paragraph)
                        .setMinLength(10)
                        .setMaxLength(400)
                        .setRequired(false)
                        .setPlaceholder("e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ");

                    const firstActionRow = new ActionRowBuilder().addComponents(bugInfo);
                    const secondActionRow = new ActionRowBuilder().addComponents(bugVideo);
                    const thirdActionRow = new ActionRowBuilder().addComponents(stepsToReproduce);

                    bugModal.addComponents(firstActionRow);
                    bugModal.addComponents(secondActionRow);
                    bugModal.addComponents(thirdActionRow);
                    return await interaction.showModal(bugModal);
                }
                case "suggestion": {
                    const suggestionModal = new ModalBuilder().setCustomId("tickets-create-suggestion").setTitle("Create a suggestion");

                    const suggestionType = new TextInputBuilder()
                        .setCustomId("suggestion-type")
                        .setLabel("Please state what part/feature of Evo:tm: this suggestion is for.")
                        .setStyle(TextInputStyle.Short)
                        .setMinLength(10)
                        .setMaxLength(50)
                        .setRequired(true)
                        .setPlaceholder("e.g. GUI, Aimbot, Discord bot, etc.");

                    const suggestionInfo = new TextInputBuilder()
                        .setCustomId("suggestion-info")
                        .setLabel("Please describe what you wish to see in Evo:tm:.")
                        .setStyle(TextInputStyle.Paragraph)
                        .setMinLength(10)
                        .setMaxLength(400)
                        .setRequired(true)
                        .setPlaceholder("e.g. I would like to see a new feature (penis esp) that allows me to ...");

                    const firstActionRow = new ActionRowBuilder().addComponents(suggestionType).addComponents(suggestionInfo);

                    suggestionModal.addComponents(firstActionRow);
                    return await interaction.showModal(suggestionModal);
                }
                case "ticket": {
                    const modal = new ModalBuilder().setCustomId("tickets-create").setTitle("Create a ticket");

                    const reasonInput = new TextInputBuilder()
                        .setCustomId("reason")
                        .setLabel("Please describe your issue in detail.")
                        .setStyle(TextInputStyle.Paragraph)
                        .setMinLength(10)
                        .setMaxLength(400)
                        .setRequired(true)
                        .setPlaceholder("e.g. I need help with my account. My issue is ...");

                    const firstActionRow = new ActionRowBuilder().addComponents(reasonInput);

                    modal.addComponents(firstActionRow);
                    return await interaction.showModal(modal);
                }
            }
        }
        case "executor": {
            interaction.deferReply({ ephemeral: true });

            const executor = interaction.values[0];
            const mappings = {
                synapse: "Synapse X",
                krnl: "KRNL",
                scriptware: "Script-Ware",
                other: "Other",
            };
            const executorName = mappings[executor];

            // get reason from userDB
            const reason = client.userDB.get(interaction.user.id, "tickets.reason");
            client.userDB.delete(interaction.user.id, "tickets.reason");

            const thread = await interaction.channel.threads.create({
                name: `${interaction.user.username.slice(0, 9).toLowerCase()}-${interaction.user.discriminator}`,
                autoArchiveDuration: 24 * 60,
                type: ChannelType.PrivateThread,
                reason: "Ticket created by user",
            });
            thread.setInvitable(false);

            // check if user has premium role
            const premiumRole = interaction.guild.roles.cache.get(client.settings.get(interaction.guild.id, "premium.role"));
            const premium = interaction.member.roles.cache.has(premiumRole);

            const ticketEmbed = new EmbedBuilder()
                .setTitle(`Ticket for ${interaction.user.username}#${interaction.user.discriminator}`)
                .setThumbnail(interaction.user.avatarURL())
                .setDescription(
                    `<@${interaction.user.id}> This is your ticket, our support team with be with you shortly to help you resolve your issue.`
                )
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
                        name: "Premium Status (WIP)",
                        value: premium ? `Yes` : `No`, // `Expires <date:in X days/months>`,
                        inline: true,
                    },
                    { name: "Executor", value: executorName, inline: true },
                ])
                .setColor(interaction.member.displayHexColor)
                .setFooter({
                    text: "EvoTickets | Evo V4™️ | Press the buttons below to close / claim the ticket",
                    iconURL: client.user.avatarURL(),
                });

            const ticketButtons = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId("tickets-close").setLabel("Mark as completed").setEmoji("📨").setStyle(ButtonStyle.Danger),
                new ButtonBuilder().setCustomId("tickets-claim").setLabel("Claim this ticket").setEmoji("📨").setStyle(ButtonStyle.Success)
            );

            await thread.send({
                content: `<@&${client.settings.get(interaction.guild.id, "ticketOpen.role")}>`,
                embeds: [ticketEmbed],
                components: [ticketButtons],
            });

            const userEmbed = new EmbedBuilder()
                .setTitle("Ticket created")
                .setDescription(`Your ticket has been created! You can view it by clicking the button below.`)
                .setColor("#00ff00")
                .setTimestamp();

            const webhook = await interaction.channel.createWebhook({
                name: interaction.user.username,
                avatar: interaction.user.avatarURL(),
                reason: "Ticket created by user",
            });

            await fetch(`https://discord.com/api/webhooks/${webhook.id}/${webhook.token}?thread_id=${thread.id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: `**${reason}**` }),
            });

            interaction.channel.fetchWebhooks().then((webhooks) => {
                webhooks.forEach((webhook) => {
                    webhook.delete();
                });
            });

            thread.members.add(interaction.user.id);

            // log to the ticket log channel
            const logChannel = interaction.guild.channels.cache.find(
                (c) => c.id == client.settings.get(interaction.guild.id, "logs.channel")
            );

            // get url of thread
            const threadUrl = `https://discord.com/channels/${interaction.guild.id}/${thread.id}`;

            // create the embed
            const logEmbed = new EmbedBuilder()
                .setTitle("Ticket created")
                .setDescription(`Ticket created by <@${interaction.user.id}>`)
                .addFields([
                    { name: "Reason", value: reason, inline: true },
                    { name: "Executor", value: executor, inline: true },
                ])
                .setColor("#00ff00")
                .setTimestamp();

            // add a button to the thread
            const logButton = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setLabel("View Ticket").setStyle(ButtonStyle.Link).setURL(threadUrl)
            );

            logChannel.send({ embeds: [logEmbed], components: [logButton] });

            return interaction.editReply({ embeds: [userEmbed] });
        }
    }
};
