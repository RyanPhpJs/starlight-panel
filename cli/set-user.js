const fs = require("fs");
const argon = require("argon2");
const e = JSON.stringify;

module.exports = async function load(username, password) {
    // Verifica se username e password foram fornecidos
    if (!username || !password) {
        throw new Error("Username and password are required.");
    }

    try {
        // Gera a hash Argon2 da senha
        const hashedPassword = await argon.hash(password);

        // Salva o username e a hash da senha no arquivo user_details.conf
        const userDetails = [
            `PANEL_USER=${e(username)}`,
            `PANEL_PASS=${e(hashedPassword)}`,
        ].join("\n");
        fs.writeFileSync("/server/conf/user_details.conf", userDetails);

        console.log("User details saved successfully.");
    } catch (error) {
        console.error("Error saving user details:", error);
        throw new Error("Failed to save user details.");
    }
};
