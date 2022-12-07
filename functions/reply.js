const { writeFileSync, unlinkSync } = require("fs");

module.exports = {
    attachStringThenReply: async(interaction, message, attachments) => {
        var files;
        var names;
        if (attachments) {
            files = [];
            names = [];
            for (var i = 0; i < attachments.length; i++) {
                const attachment = attachments[i];
                const name = `./temp/${Date.now()}.${attachment.ext}`;
                writeFileSync(name, attachment.content);
                files.push({
                    name: `${attachment.name}.${attachment.ext}`,
                    attachment: name
                })
                names.push(name);
            }
        }
        await interaction.editReply({ content: message, files: files });
        if (names) {
            for (var i = 0; i < names.length; i++) {
                unlinkSync(names[i]);
            }
        }
    }
};