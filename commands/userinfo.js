const { EmbedBuilder } = require("discord.js");

const { dateToString } = require("../functions/datetime");
const permissions = require("../setup/permissions");

module.exports = {
    name: "userinfo",
    description: "Provides information about the mentioned user, or yourself",
    execute: async(client, interaction) => {
        const member = interaction.options.getMember("mention") ?? interaction.member;
        const user = member.user;
        const level = permissions.getpermissionlevel(user, interaction.guild);
        interaction.editReply({ embeds: [new EmbedBuilder()
            .setTitle(`${user.tag}'s Information`)
            .addFields([{
                name: "Mention:",
                value: `<@${user.id}>`,
                inline: true
            }, {
                name: "Permission Level:",
                value: `${permissions.chart[level].name} [${level}]`,
                inline: true
            }, {
                name: "Avatar:",
                value: `[Click Here](${user.avatarURL({size: 2048})})`,
                inline: true
            }, {
                name: "Created At:",
                value: dateToString(user.createdAt),
                inline: true
            }, {
                name: "Joined At:",
                value: dateToString(member.joinedAt),
                inline: true
            }])
            .setColor("Random")
            .setTimestamp()
        ], ephemeral: false });
    },
    options: [
        { type: "User", name: "mention", description: "The member to provide information about" }
    ]
};