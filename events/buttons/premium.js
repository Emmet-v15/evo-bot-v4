const { convertToOrdinal } = require("../../util/common");
const { EmbedBuilder } = require("discord.js");

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
            // sub 1 from number
            const number = client.settings.get(interaction.guild.id, `premium.giveaway.${args[1]}.number`);
            const type = client.settings.get(interaction.guild.id, `premium.giveaway.${args[1]}.type`);
            if (number <= 10) {
                // const type = client.settings.get(interaction.guild.id, `premium.giveaway.${args[1]}.type`);

                const role = interaction.guild.roles.cache.get(client.settings.get(interaction.guild.id, "premium.role"));
                const member = interaction.member;
                const premium = member.roles.cache.has(role);

                let embed;
                if (premium) {
                    embed = new EmbedBuilder().setTitle("Premium").setDescription(`You already have premium!`);
                } else {
                    member.roles.add(role);
                    embed = new EmbedBuilder()
                        .setTitle("Premium")
                        .setDescription(
                            `You have successfully claimed premium! You were the ${convertToOrdinal(args[1])} to click the button.`
                        );
                }
                client.settings.set(interaction.guild.id, number - 1, `premium.giveaway.${args[1]}.number`);

                client.userDB.set(interaction.user.id, true, "premium");
                // set premium type
                client.userDB.set(interaction.user.id, type, "premiumType");
                client.userDB.set(interaction.user.id, Date.now(), "premiumClaimedAtTime");
                client.userDB.set(interaction.user.id, args[1], "premiumClaimedAtPosition");
                client.userDB.set(interaction.user.id, interaction.guild.id, "premiumClaimedAtGuild");
                client.userDB.set(interaction.user.id, interaction.channel.id, "premiumClaimedAtChannel");
                client.userDB.set(interaction.user.id, interaction.message.id, "premiumClaimedAtMessage");
                client.userDB.set(interaction.user.id, interaction.id, "premiumClaimedAtInteraction");

                const total = client.userDB.filter((user) => user.premium).size;
                console.log(total);
                client.userDB.set(interaction.user.id, total, "premiumClaimedAtTotal");
                interaction.editReply({ embeds: [embed] });
            } else {
                interaction.editReply({ content: `Too late.` });
            }
            break;
        }
        case "register": {
            await interaction.deferReply({ ephemeral: true });

            // check if giveaway number is valid

            const number = client.settings.get(interaction.guild.id, `premium.giveaway.${args[1]}.number`);
            if (number <= 10) {
                const type = client.settings.get(interaction.guild.id, `premium.giveaway.${args[1]}.type`);
                const role = interaction.guild.roles.cache.get(client.settings.get(interaction.guild.id, "premium.role"));
            } else {
                interaction.editReply({ content: `Too late.` });
            }

            const member = interaction.member;
            const premiumRole = interaction.guild.roles.cache.get(client.settings.get(interaction.guild.id, "premium.role"));
            const premium = member.roles.cache.has(premiumRole);

            let embed;
            if (premium) {
                embed = new EmbedBuilder().setTitle("Premium").setDescription(`You already have premium!`);
            } else {
                member.roles.add(premiumRole);
                embed = new EmbedBuilder()
                    .setTitle("Premium")
                    .setDescription(
                        `You have successfully claimed premium! You were the ${convertToOrdinal(args[1])} to click the button.`
                    );
            }
            client.userDB.set(interaction.user.id, true, "premium");
            client.userDB.set(interaction.user.id, Date.now(), "premiumClaimedAtTime");
            client.userDB.set(interaction.user.id, args[1], "premiumClaimedAtPosition");
            client.userDB.set(interaction.user.id, interaction.guild.id, "premiumClaimedAtGuild");
            client.userDB.set(interaction.user.id, interaction.channel.id, "premiumClaimedAtChannel");
            client.userDB.set(interaction.user.id, interaction.message.id, "premiumClaimedAtMessage");
            client.userDB.set(interaction.user.id, interaction.id, "premiumClaimedAtInteraction");

            const total = client.userDB.filter((user) => user.premium).size;
            console.log(total);
            client.userDB.set(interaction.user.id, total, "premiumClaimedAtTotal");

            interaction.editReply({ embeds: [embed] });
        }
    }
};
