const reply = require("../../functions/reply");

module.exports = async (client, interaction, ...args) => {
    const role = interaction.guild.roles.cache.find((r) => r.id == [args][0]);
    if (interaction.member.roles.cache.find((r) => r.id == role.id)) {
        interaction.member.roles.remove(role);
        interaction.editReply({ content: `<@&${role.id}> has been removed` });
    } else {
        interaction.member.roles.add(role);
        interaction.editReply({ content: `<@&${role.id}> has been added` });
    }
};
