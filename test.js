require("dotenv").config();
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

(async () => {
    // remove user key from authorized users list
    const key = "HhbgiFXsZwWLywZPHscDTrlxQuSFrJNT"; // This is not a secret, it's simply the user's id.
    await fetch(`https://api.luarmor.net/v3/projects/${process.env.LUARMOR_PROJECT_ID}/users?user_key=${key}`, {
        method: "DELETE",
        headers: {
            Authorization: process.env.LUARMOR_API_KEY, // this is the actual authorization.
        },
    })
        .then((res) => res.json())
        .then(console.log);
})();
