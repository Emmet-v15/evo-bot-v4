// require("dotenv").config();
// const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

// (async () => {
//     // delete
//     const key = "JCeSHJlRZarCUsXgMHnkCbGgpaZwqSGV";
//     await fetch(`https://api.luarmor.net/v3/projects/${process.env.LUARMOR_PROJECT_ID}/users?user_key=${key}`, {
//         method: "DELETE",
//         headers: {
//             Authorization: process.env.LUARMOR_API_KEY,
//         },
//     })
//         .then((res) => res.json())
//         .then(console.log);
// })();

let number = 0;
console.log(++number);
