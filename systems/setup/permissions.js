const permissions = [
    { name: "Member", check: () => true },
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