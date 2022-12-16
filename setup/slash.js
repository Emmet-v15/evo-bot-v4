const { REST, Routes, SlashCommandBuilder } = require("discord.js");
const { readdirSync } = require("fs");
const register = require("../setup/register");

const { token } = require("../config.json");

const rest = new REST({ version: "10" }).setToken(token);

module.exports = async (client) => {
    const commands = [];
    const store = {};

    for (var i in require.cache) {
        delete require.cache[i];
    }

    for (const command of readdirSync("./commands/", { withFileTypes: true })) {
        if (command.isDirectory()) {
            const cmd = new SlashCommandBuilder().setName(command.name).setDescription(command.name);
            store[command.name] = {};
            for (const file of readdirSync(`./commands/${command.name}/`)) {
                if (file.endsWith(".js")) {
                    const path = `../commands/${command.name}/${file}`;
                    const module = require(path);
                    store[command.name][module.name] = module;
                    cmd.addSubcommand((subcommand) => register(subcommand, module));
                }
            }
            commands.push(cmd.toJSON());
        } else if (command.name.endsWith(".js")) {
            const path = `../commands/${command.name}`;
            const module = require(path);
            store[module.name] = module;
            commands.push(register(new SlashCommandBuilder(), module).toJSON());
        }
    }

    client.commands = store;
    await rest.put(Routes.applicationCommands(client.user.id), {
        body: commands,
    });
};
