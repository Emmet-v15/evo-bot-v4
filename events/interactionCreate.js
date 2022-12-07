const { readdirSync } = require("fs");

const { getpermissionlevel } = require("../setup/permissions");

// Buttons //

const buttons = {};

for (const file of readdirSync("./events/buttons/")) {
    if (file.endsWith(".js")) {
        buttons[file.substring(0, file.length - 3)] = require(`./buttons/${file}`);
    }
}

// Main //

module.exports = async(client, interaction) => {
    await interaction.deferReply({ ephemeral: true });
    if (interaction.isChatInputCommand()) {
        const subcommand = interaction.options.getSubcommand(false);
        const command = subcommand !== null ? client.commands[interaction.commandName][subcommand] : client.commands[interaction.commandName];
        if (command.permission) {
            if (getpermissionlevel(interaction.user, interaction.guild) < command.permission) {
                interaction.editReply({ content: `You do not have permission to use \`${subcommand !== null ? `${interaction.commandName} ${subcommand}` : interaction.commandName}\`, Permission Level \`${command.permission}\` is required` });
                return;
            }
        }
        if (await command.execute(client, interaction)) {
            interaction.editReply({ content: `\`${subcommand !== null ? `${interaction.commandName} ${subcommand}` : interaction.commandName}\` has not been added yet` });
        }
    } else if (interaction.isButton()) {
        const args = interaction.customId.split("-");
        await buttons[args.shift()](client, interaction, ...args);
    }
}