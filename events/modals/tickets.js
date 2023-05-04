const { StringSelectMenuBuilder } = require("discord.js");
const { ButtonBuilder, ActionRowBuilder, EmbedBuilder, ChannelType, ButtonStyle } = require("discord.js");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

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
            label: "Synapse X 3.0",
            value: "synapse3",
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
                    break;
                }
                case "bug": {
                    const executorRow = new ActionRowBuilder().addComponents(executorDropdown);

                    const executorEmbed = new EmbedBuilder()
                        .setTitle("Select your executor")
                        .setDescription("Please select your executor from the dropdown menu below.")
                        .setColor("BE00FC");

                    interaction.editReply({ embeds: [executorEmbed], components: [executorRow] });

                    const filter = (i) => i.customId === "support-executor" && i.user.id === interaction.user.id;
                    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

                    collector.on("collect", async (i) => {
                        interaction.deleteReply();
                        i.reply({ content: "Not yet implemented", ephemeral: true });
                    });
                    break;
                }
                case "general": {
                    const reason = interaction.fields.getTextInputValue("reason");
                    const game = interaction.fields.getTextInputValue("game");

                    const executorRow = new ActionRowBuilder().addComponents(executorDropdown);

                    const executorEmbed = new EmbedBuilder()
                        .setTitle("Select your executor")
                        .setDescription("Please select your executor from the dropdown menu below.")
                        .setColor("BE00FC");

                    interaction.editReply({ embeds: [executorEmbed], components: [executorRow] });

                    const filter = (i) => i.customId === "support-executor" && i.user.id === interaction.user.id;
                    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

                    collector.on("collect", async (i) => {
                        interaction.deleteReply();
                        i.deferReply({ ephemeral: true });
                        const executor = i.values[0];
                        const mappings = {
                            synapse3: "Synapse X 3.0",
                            synapse: "Synapse X",
                            krnl: "KRNL",
                            scriptware: "Script-Ware",
                            other: "Other",
                        };
                        const executorName = mappings[executor];

                        const thread = await i.channel.threads.create({
                            name: `${i.user.username.slice(0, 9).toLowerCase()}-${i.user.discriminator}`,
                            autoArchiveDuration: 24 * 60,
                            type: ChannelType.PrivateThread,
                            reason: "Ticket created by user",
                        });
                        thread.setInvitable(false);

                        // check if user has premium role
                        const premiumRole = i.guild.roles.cache.get(client.settings.get(i.guild.id, "role.premium"));
                        const premium = i.member.roles.cache.has(premiumRole);

                        const ticketEmbed = new EmbedBuilder()
                            .setTitle(`Ticket for ${i.user.username}#${i.user.discriminator}`)
                            .setThumbnail(i.user.avatarURL())
                            .setDescription(
                                `<@${i.user.id}> This is your ticket, our support team with be with you shortly to help you resolve your issue.`
                            )
                            .addFields([
                                {
                                    name: "Account Age",
                                    value: `Made <t:${parseInt(i.user.createdTimestamp.toString().slice(0, -3))}:R>`,
                                    inline: true,
                                },
                                {
                                    name: "Join Date",
                                    value: `Joined <t:${parseInt(i.member.joinedTimestamp.toString().slice(0, -3))}:R>`,
                                    inline: true,
                                },
                                {
                                    name: "Premium Status (WIP)",
                                    value: premium ? `Yes` : `No`, // `Expires <date:in X days/months>`,
                                    inline: true,
                                },
                                { name: "Executor", value: executorName, inline: true },
                                { name: "Game", value: game, inline: true },
                            ])
                            .setColor(i.member.displayHexColor)
                            .setFooter({
                                text: "EvoTickets | Evo V4™️ | Press the buttons below to close / claim the ticket",
                                iconURL: client.user.avatarURL(),
                            });
                        thread.members.add(i.user.id);

                        const ticketButtons = new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                                .setCustomId("tickets-close")
                                .setLabel("Mark as completed")
                                .setEmoji("📨")
                                .setStyle(ButtonStyle.Danger),
                            new ButtonBuilder()
                                .setCustomId("tickets-claim")
                                .setLabel("Claim this ticket")
                                .setEmoji("📨")
                                .setStyle(ButtonStyle.Success)
                        );
                        let content = `<@&${client.settings.get(i.guild.id, "role.support")}>`;
                        if (client.settings.has(i.guild.id, "role.trialSupport"))
                            content += ` <@&${client.settings.get(i.guild.id, "role.trialSupport")}>`;

                        await thread.send({
                            content: content,
                            embeds: [ticketEmbed],
                            components: [ticketButtons],
                        });

                        const userEmbed = new EmbedBuilder()
                            .setTitle("Ticket created")
                            .setDescription(`Your ticket has been created! You can view it by clicking the button below.`)
                            .setColor("#00ff00")
                            .setTimestamp();

                        const webhook = await i.channel.createWebhook({
                            name: i.user.username,
                            avatar: i.user.avatarURL(),
                            reason: "Ticket created by user",
                        });

                        await fetch(`https://discord.com/api/webhooks/${webhook.id}/${webhook.token}?thread_id=${thread.id}`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ content: `**${reason}**` }),
                        });

                        i.channel.fetchWebhooks().then((webhooks) => {
                            webhooks.forEach((webhook) => {
                                webhook.delete();
                            });
                        });

                        // log to the ticket log channel
                        const logChannel = i.guild.channels.cache.find(
                            (c) => c.id == client.settings.get(i.guild.id, "ticketLogs.channel")
                        );

                        // get url of thread
                        const threadUrl = `https://discord.com/channels/${i.guild.id}/${thread.id}`;

                        // create the embed
                        const logEmbed = new EmbedBuilder()
                            .setTitle("Ticket created")
                            .setDescription(`Ticket created by <@${i.user.id}>`)
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

                        return i.editReply({ embeds: [userEmbed], components: [logButton] });
                    });
                    break;
                }
            }
            break;
        }
        default:
            interaction.editReply({ content: "[Error]: Modal not implemented." });
            break;
    }
};
