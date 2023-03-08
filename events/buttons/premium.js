const { convertToOrdinal } = require("../../util/common");
const { EmbedBuilder } = require("discord.js");
const logger = require("../../systems/logging/logger");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
require("dotenv").config();

module.exports = async (
    /** @type {import("discord.js").Client} */ client,
    /** @type {import("discord.js").ButtonInteraction} */ interaction,
    ...args
) => {
    switch (args[0]) {
        case "access": {
            interaction.guild.channels.cache.get("1074448895372951592").send(`<@${interaction.user.id}> tried to claim`);

            return;
        }

        case "giveaway": {
            await interaction.deferReply({ ephemeral: true });
            const number = client.settings.get(interaction.guild.id, `giveaway.${args[1]}.number`);
            const original = client.settings.get(interaction.guild.id, `giveaway.${args[1]}.original`);
            const type = client.settings.get(interaction.guild.id, `giveaway.${args[1]}.type`);

            const mappings = {
                premium: "Evo™️ Premium",
                beta: "Evo™️ Beta",
            };

            if (number > 0) {
                const role = interaction.guild.roles.cache.get(client.settings.get(interaction.guild.id, `${type}.role`));
                const member = interaction.member;
                const premium = member.roles.cache.has(role.id);

                let embed;

                if (premium) {
                    embed = new EmbedBuilder()
                        .setTitle("Premium")
                        .setDescription(`You already have ${mappings[type]}!`)
                        .setFooter({
                            text: `Giveaways | Evo V4™️ - Make a general ticket if you cannot execute`,
                            iconURL: client.user.displayAvatarURL(),
                        })
                        .setColor(role.hexColor)
                        .setTimestamp();
                } else {
                    member.roles.add(role);
                    if (type == "beta") member.roles.add(client.settings.get(interaction.guild.id, "premium.role"));
                    logger.event(`User ${interaction.user.tag} [${interaction.user.id}] won giveaway for ${mappings[type]}.`);

                    await fetch(`https://api.luarmor.net/v3/projects/${process.env.LUARMOR_PROJECT_ID}/users`, {
                        method: "POST",
                        headers: {
                            Authorization: process.env.LUARMOR_API_KEY,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            discord_id: interaction.user.id,
                            note: "Created by Evo V4™️ Bot",
                        }),
                    }).then((res) => {
                        switch (res.status) {
                            case 200: {
                                const json = res.json();
                                client.userDB.set(interaction.user.id, json.user_key, "luarmorKey");
                                break;
                            }
                            case 400: {
                                // user already exists but they didn't have a role

                                break;
                            }
                            case 403: {
                                console.log(process.env.LUARMOR_API_KEY);
                                throw new Error("Invalid Luarmor API Key");
                            }
                            case 429: {
                                // too many requests
                                throw new Error("Rate Limited at Luarmor API");
                            }
                            default: {
                                throw new Error("Unknown Error at Luarmor API: ", res.status, res.statusText, res.body, res.url);
                            }
                        }
                    });

                    embed = new EmbedBuilder()
                        .setTitle("Premium")
                        .setDescription(
                            `You have successfully claimed ${mappings[type]}! You were the **${convertToOrdinal(
                                original - number + 1
                            )}** to click the button.`
                        )
                        .setFooter({ text: `Giveaways | Evo V4™️`, iconURL: client.user.displayAvatarURL() })
                        .setColor(role.hexColor)
                        .setTimestamp();
                    client.settings.set(interaction.guild.id, number - 1, `giveaway.${args[1]}.number`);

                    // set premium to date of expiry depending on type
                    if (type == "hour") client.userDB.set(interaction.user.id, Date.now() + 3600000, "premium");
                    else if (type === "day") client.userDB.set(interaction.user.id, Date.now() + 86400000, "premium");
                    else if (type === "week") client.userDB.set(interaction.user.id, Date.now() + 604800000, "premium");
                    else if (type === "month") client.userDB.set(interaction.user.id, Date.now() + 2592000000, "premium");
                    else if (type === "year") client.userDB.set(interaction.user.id, Date.now() + 31536000000, "premium");
                    else if (type === "lifetime") client.userDB.set(interaction.user.id, "lifetime", "premium");

                    // set premium type
                    client.userDB.set(interaction.user.id, type, "premiumType");
                    client.userDB.set(interaction.user.id, Date.now(), "premiumClaimedAtTime");
                    client.userDB.set(interaction.user.id, args[1], "premiumClaimedAtPosition");
                    client.userDB.set(interaction.user.id, interaction.guild.id, "premiumClaimedAtGuild");
                    client.userDB.set(interaction.user.id, interaction.channel.id, "premiumClaimedAtChannel");
                    client.userDB.set(interaction.user.id, interaction.message.id, "premiumClaimedAtMessage");
                    client.userDB.set(interaction.user.id, interaction.id, "premiumClaimedAtInteraction");

                    const total = client.userDB.filter((user) => user.premium).size;
                    client.userDB.set(interaction.user.id, total, "premiumClaimedAtTotal");
                }

                interaction.editReply({ embeds: [embed] });
            } else {
                // say what number they were with embed
                logger.log(
                    `User ${interaction.user.tag} [${interaction.user.id}] tried to claim giveaway for ${mappings[type]} ${convertToOrdinal(
                        original - number + 1
                    )}.`
                );
                const embed = new EmbedBuilder()
                    .setTitle("Premium")
                    .setDescription(`You were the **${convertToOrdinal(original - number + 1)}** to click the button, too late.`)
                    .setFooter({ text: `Giveaways | Evo V4™️`, iconURL: client.user.displayAvatarURL() })
                    .setColor("FF0000")
                    .setTimestamp();

                client.settings.set(interaction.guild.id, number - 1, `giveaway.${args[1]}.number`);
                interaction.editReply({ embeds: [embed] });
            }
            break;
        }
    }
};
