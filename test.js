require("dotenv").config();
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

(async () => {
    // delete
    const key = "EUFEbGLriYiNkJglwiXSUhBYrngLyDfe";
    await fetch(`https://api.luarmor.net/v3/projects/${process.env.LUARMOR_PROJECT_ID}/users?user_key=${key}`, {
        method: "DELETE",
        headers: {
            Authorization: process.env.LUARMOR_API_KEY,
        },
    })
        .then((res) => res.json())
        .then(console.log);

    await fetch(`https://api.luarmor.net/v3/projects/${process.env.LUARMOR_PROJECT_ID}/users`, {
        method: "POST",
        headers: {
            Authorization: process.env.LUARMOR_API_KEY,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            discord_id: interaction.user.id,
            note: "Created by Evo V4™️ Bot",
        }),
    }).then((res) => {
        switch (res.status) {
            case 200: {
                const json = res.json();
                client.userDB.set(interaction.user.id, json.user_key, "luarmorKey");
                break;
            }
            case 400: {
                // user already exists
                break;
            }
            case 403: {
                throw new Error("Invalid Luarmor API Key");
            }
            case 429: {
                // too many requests
                throw new Error("Rate Limited at Luarmor API");
            }
            default: {
                throw new Error("Unknown Error at Luarmor API: ", res.status, res.statusText, res.body, res.url);
            }
        }
    });
})();
