const permissions = [
    { name: "Member", check: () => true },
    {
        name: "Staff",
        check: (user, guild) => {
            const permission = guild.client.settings.get(guild.id, `permissions.${user.id}`);
            if (permission) return permission === 1;
            return false;
        },
    },
    {
        name: "Owner",
        check: (user, guild) => {
            return user.id === guild.ownerId;
        },
    },
    {
        name: "Developer",
        check: (user, guild) => {
            return user.id === "715601051041923123";
        },
    },
];

module.exports = {
    chart: permissions,
    getpermissionlevel: (user, guild) => {
        var level = 0;
        for (var i = 1; i < permissions.length; i++) {
            if (permissions[i].check(user, guild) === false) {
                console.log("ofof");
                break;
            }
            console.log("yayy");
            level = i;
        }
        return level;
    },
    haspermission: (user, guild, level) => {
        return permissions[level].check(user, guild);
    },
};
