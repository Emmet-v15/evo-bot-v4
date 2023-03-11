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
            // interaction.guild.channels.cache.get("1074448895372951592").send(`<@${interaction.user.id}> tried to claim`);

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
                const role = interaction.guild.roles.cache.get(client.settings.get(interaction.guild.id, `role.${type}`));
                const premiumRoleId = client.settings.get(interaction.guild.id, "role.premium");

                const embed = new EmbedBuilder()
                    .setTitle("Premium")
                    .setFooter({ text: `Giveaways | Evo V4™️`, iconURL: client.user.displayAvatarURL() })
                    .setColor(role.hexColor)
                    .setTimestamp();

                logger.event(`User ${interaction.user.tag} [${interaction.user.id}] won giveaway for ${mappings[type]}.`);

                // check if they already have the role
                if (interaction.member.roles.cache.has(role)) {
                    embed.setDescription(`You already have ${mappings[type]}!`).setFooter({
                        text: `Giveaways | Evo V4™️ - Make a general ticket if you cannot execute.`,
                        iconURL: client.user.displayAvatarURL(),
                    });
                    interaction.editReply({ embeds: [embed] });
                    return;
                }
                client.settings.set(interaction.guild.id, number - 1, `giveaway.${args[1]}.number`);
                // whitelist user
                await fetch(`https://api.luarmor.net/v3/projects/${process.env.LUARMOR_PROJECT_ID}/users`, {
                    method: "POST",
                    headers: {
                        Authorization: process.env.LUARMOR_API_KEY,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        discord_id: interaction.user.id,
                        note: "Key created by Evo V4™️ Bot",
                    }),
                }).then((res) => {
                    switch (res.status) {
                        case 200: {
                            const json = res.json();
                            client.userDB.set(interaction.user.id, json.user_key, "luarmorKey");

                            interaction.member.roles.add(role.id);
                            if (type == "beta") interaction.member.roles.add(premiumRoleId);

                            embed.setDescription(
                                `You have successfully claimed ${mappings[type]}! You were the **${convertToOrdinal(
                                    original - number + 1
                                )}** to click the button.`
                            );
                            const UID = client.settings.get(interaction.guild.id, "totalPremiumUsers") + 1;
                            client.settings.set(interaction.guild.id, UID, "totalPremiumUsers");
                            client.userDB.set(interaction.user.id, {
                                timestamp: Date.now(),
                                method: `${mappings[type]} giveaway`,
                                UID: UID,
                            });
                            break;
                        }
                        case 400: {
                            // member already whitelisted
                            interaction.member.roles.add(role.id);
                            if (type == "beta") interaction.member.roles.add(premiumRoleId);

                            embed.setDescription(`You already have ${mappings[type]}!`).setFooter({
                                text: `Giveaways | Evo V4™️ - Make a general ticket if you cannot execute.`,
                                iconURL: client.user.displayAvatarURL(),
                            });

                            break;
                        }
                        case 403: {
                            throw new Error("Invalid Luarmor API Key");
                        }
                        case 429: {
                            throw new Error("Rate Limited at Luarmor API");
                        }
                        default: {
                            throw new Error("Unknown Error at Luarmor API: ", res.status, res.statusText, res.body, res.url);
                        }
                    }
                });

                interaction.editReply({ embeds: [embed] });
            } else {
                // say what number they were with embed
                logger.event(
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
