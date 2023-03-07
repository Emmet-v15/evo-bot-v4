require("dotenv").config();

const permissions = [
    { name: "Member", check: () => true },
    {
        name: "Staff",
        check: (user, guild) => {
            ``;
            if (!guild.client.settings.has(guild.id, `permissions.${user.id}`)) return false;
            const permission = guild.client.settings.get(guild.id, `permissions.${user.id}`);
            if (permission) return permission >= 1;
            return false;
        },
    },
    {
        name: "Owner",
        check: (user, guild) => {
            return user.id == process.env.OWNER_ID || user.id == process.env.OWNER_2_ID;
        },
    },
    {
        name: "Developer",
        check: (user, guild) => {
            return user.id === process.env.DEV_ID;
        },
    },
];

module.exports = {
    chart: permissions,
    getpermissionlevel: (user, guild) => {
        var level = 0;
        for (var i = 1; i < permissions.length; i++) {
            if (permissions[i].check(user, guild) === false) {
                break;
            }
            level = i;
        }
        return level;
    },
    haspermission: (user, guild, level) => {
        return permissions[level].check(user, guild);
    },
};
