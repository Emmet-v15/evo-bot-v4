const { readdirSync } = require("fs");

const choices = {};

module.exports = {
    name: "reload",
    description: "Reloads the given command.",
    permission: 1,
    execute: async (client, interaction) => {
        const target = interaction.options.getString("command");
        const path = `../${target}.js`;
        const [command, subcommand] = target.split("/");

        delete require.cache[require.resolve(path)];
        if (subcommand !== undefined) {
            client.commands[command][subcommand] = require(path);
        } else {
            client.commands[command] = require(path);
        }

        interaction.editReply({ content: `\`${target.replace("/", " ")}\` has been reloaded` });
    },
    options: [
        { type: "String", name: "command", description: "The command to reload.", required: true, choices: choices },
        {
            type: "Boolean",
            name: "slash",
            description: "Whether to reload the slash command.",
            required: false,
            default: true,
        },
    ],
};

for (const command of readdirSync("./commands/slash/", { withFileTypes: true })) {
    if (command.isDirectory()) {
        for (const file of readdirSync(`./commands/slash/${command.name}/`)) {
            if (file.endsWith(".js")) {
                const name = `${command.name} ${require(`../${command.name}/${file}`).name}`;
                choices[name] = name.replace(" ", "/");
            }
        }
    } else if (command.name.endsWith(".js")) {
        const name = require(`../${command.name}`).name;
        choices[name] = name;
    }
}
