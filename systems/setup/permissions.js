require("dotenv").config();

const permissions = [
    { name: "Member", check: () => true },
    {
        name: "Staff",
        check: (user, guild) => {
            const permission = guild.client.settings.get(guild.id, `permissions.${user.id}`);
            const member = guild.members.cache.get(user.id);
            if (permission >= 1 && member.roles.cache.find((r) => r.name.toLowerCase() === "staff")) return true;
            return false;
        },
    },
    {
        name: "Admin",
        check: (user, guild) => {
            const permission = guild.client.settings.get(guild.id, `permissions.${user.id}`);
            console.log(permission);
            if (permission >= 2) return true;
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
