const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

const reply = require("../../functions/reply");

module.exports = {
    name: "send",
    description: "Sends a reaction embed to the specified channel, or the current one",
    permission: 1,
    execute: async (client, interaction) => {
        const channel = interaction.options.getChannel("channel") ?? interaction.channel;
        if (channel.permissionsFor(client.user).has("SEND_MESSAGES")) {
            const roles = client.settings.get(interaction.guild.id, "roles");
            const components = [];
            for (var i = 0; i < roles.length; i++) {
                if (i % 5 === 0) {
                    components.push(new ActionRowBuilder());
                }
                const id = roles[i];
                components[components.length - 1].addComponents(
                    new ButtonBuilder()
                        .setCustomId("roles-" + id)
                        .setLabel(interaction.guild.roles.cache.find((r) => r.id === id).name)
                        .setStyle(ButtonStyle.Primary)
                );
            }
            channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Reaction Roles")
                        .setDescription("Click any button below to give/remove a role")
                        .setColor("Random")
                        .setTimestamp(),
                ],
                components: components,
            });
            interaction.editReply({ content: `The reaction embed has been sent to <#${channel.id}>` });
        } else {
            interaction.editReply({ content: "I don't have permission to talk in that channel" });
        }
    },
    options: [{ type: "Channel", name: "channel", description: "The channel to send the embed to" }],
};
