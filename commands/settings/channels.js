const reply = require("../../functions/reply");

module.exports = {
    name: "channels",
    description: "Gets the current log channel, or sets it if one is specified",
    permission: 1,
    execute: async (client, interaction) => {
        const cat = interaction.options.getString("category");
        const channel = interaction.options.getChannel("channel");
        if (channel) {
            const id = channel.id;
            client.settings.set(interaction.guild.id, id, `${cat}.channel`);
            interaction.editReply({ content: `The ${cat} channel has been set to <#${id}>` });
        } else {
            interaction.editReply({
                content: `The ${cat} channel is currently <#${client.settings.get(
                    interaction.guild.id,
                    `${cat}.channel`
                )}>`,
            });
        }
    },
    options: [
        {
            type: "String",
            name: "category",
            description: "The specified category",
            required: true,
            choices: { logs: "logs" },
        },
        { type: "Channel", name: "channel", description: "The channel to send logs to" },
    ],
};
