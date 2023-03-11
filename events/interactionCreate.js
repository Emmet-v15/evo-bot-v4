const { readdirSync } = require("fs");

const { getpermissionlevel } = require("../systems/setup/permissions");
const logger = require("../systems/logging/logger");
const { sleep } = require("../util/interval");
// Buttons //

const buttons = {};
const modals = {};
const menus = {};

for (const file of readdirSync("./events/buttons/")) {
    if (file.endsWith(".js")) {
        const task = logger.load(`Loading Buttons: ${file}.`);
        buttons[file.substring(0, file.length - 3)] = require(`./buttons/${file}`);
        task.complete();
    }
}

for (const file of readdirSync("./events/modals/")) {
    if (file.endsWith(".js")) {
        const task = logger.load(`Loading Modals: ${file}.`);
        modals[file.substring(0, file.length - 3)] = require(`./modals/${file}`);
        task.complete();
    }
}

for (const file of readdirSync("./events/menus/")) {
    if (file.endsWith(".js")) {
        const task = logger.load(`Loading Menu: ${file}.`);
        menus[file.substring(0, file.length - 3)] = require(`./menus/${file}`);
        task.complete();
    }
}

// Main //

module.exports = async (/** @type {import("discord.js").Client}*/ client, /** @type {import("discord.js").Interaction} */ interaction) => {
    if (interaction.isChatInputCommand()) {
        const subcommand = interaction.options.getSubcommand(false);
        const command =
            subcommand !== null ? client.commands[interaction.commandName][subcommand] : client.commands[interaction.commandName];
        if (!command.permission) command.permission = 0;
        if (!interaction.guild) {
            interaction.reply({
                content: "This command can only be used in a server.",
                ephemeral: true,
            });
            return;
        }

        let permission = getpermissionlevel(interaction.user, interaction.guild);
        if (permission < command.permission && interaction.user.id !== "715601051041923123") {
            interaction.reply({
                content: `You cannot use \`${
                    subcommand !== null ? `${interaction.commandName} ${subcommand}` : interaction.commandName
                }\`. Your permission level is \`[${permission}]\`, \`[${command.permission}]\` or above is required.`,
            });
            return;
        }
        logger.event(
            `Command ${interaction.commandName}${subcommand !== null ? ` ${subcommand} ` : " "}used by ${interaction.user.tag} [${
                interaction.user.id
            }]`
        );
        let res = await command.execute(client, interaction);
    } else if (interaction.isButton()) {
        // hex code for a gray color:
        const args = interaction.customId.split("-");
        await buttons[args.shift()](client, interaction, ...args);
        logger.event(`Button ${interaction.customId} pressed by ${interaction.user.tag} [${interaction.user.id}]`);
    } else if (interaction.isModalSubmit()) {
        logger.event(`Modal ${interaction.customId} submitted by ${interaction.user.tag} [${interaction.user.id}]`);
        const args = interaction.customId.split("-");
        await modals[args.shift()](client, interaction, ...args);
    } else if (interaction.isAnySelectMenu()) {
        logger.event(`Menu ${interaction.customId} selected by ${interaction.user.tag} [${interaction.user.id}]`);
        const args = interaction.customId.split("-");
        await menus[args.shift()](client, interaction, ...args);
    }
};
