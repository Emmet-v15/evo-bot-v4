// const { getEmbedIds, setEmbedIds } = require("../../commands/slash/embeds.js");

module.exports = async (/** @type {import("discord.js").Client} */ client, /** @type {import("discord.js").ButtonInteraction} */ interaction, ...args) => {
    await interaction.deferReply({ ephemeral: true });
    switch (args[0]) {
        case "confirmChanges": {
            const unconfirmedEmbedOptions = client.settings.get(interaction.guild.id, `embeds.${args[1]}.unconfirmed`);
            client.settings.set(interaction.guild.id, unconfirmedEmbedOptions, `embeds.${args[1]}`);
            client.settings.delete(interaction.guild.id, `embeds.${args[1]}.unconfirmed`);
            interaction.editReply({ content: `Embed \`${args[1]}\` has been updated.` });
            break;
        }
        case "cancelChanges": {
            client.settings.delete(interaction.guild.id, `embeds.${args[1]}.unconfirmed`);
            interaction.editReply({ content: `Aborted the update for \`${args[1]}\`.` });
            break;
        }
        case "confirmDelete": {
            // const newEmbedIds = getEmbedIds(interaction.guild.id);
            // delete newEmbedIds[args[1]];
            // setEmbedIds(interaction.guild.id, newEmbedIds);

            client.settings.delete(interaction.guild.id, `embeds.${args[1]}`);
            interaction.editReply({ content: `Embed \`${args[1]}\` has been deleted.` });
            break;
        }
        case "cancelDelete": {
            interaction.editReply({ content: `Aborted the deletion of \`${args[1]}\`.` });
            break;
        }
        case "confirmCreate": {
            // const newEmbedIds = getEmbedIds(interaction.guild.id);
            // newEmbedIds[args[1]] = args[1];
            // setEmbedIds(interaction.guild.id, newEmbedIds);
            console.log(args[1]);
            console.log(args[0]);

            console.log("confirmCreate");
            const embedOptions = client.settings.get(interaction.guild.id, `embeds.${args[1]}.unconfirmed`);
            console.log(embedOptions);
            client.settings.set(interaction.guild.id, embedOptions, `embeds.${args[1]}`);
            console.log("confirmCreate2");
            client.settings.delete(interaction.guild.id, `embeds.${args[1]}.unconfirmed`);
            console.log("confirmCreate3");
            interaction.editReply({ content: `Embed \`${args[1]}\` has been created.` });
            console.log("confirmCreate4");
            break;
        }
        case "cancelCreate": {
            client.settings.delete(interaction.guild.id, `embeds.${args[1]}.unconfirmed`);
            interaction.editReply({ content: `Aborted the creation of \`${args[1]}\`.` });
            break;
        }
    }
};
