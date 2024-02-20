const argon = require("argon2");
(async function () {
    const res = await argon.hash(process.argv[2]);
    console.log(res);
})();
