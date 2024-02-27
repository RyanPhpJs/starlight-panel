#!/usr/bin node
process.chdir(__dirname);
const command = process.argv[2] || "help";
const args = process.argv.slice(3);
const fs = require("fs");

if (fs.existsSync("cli/" + command + ".js")) {
    require("./cli/" + command)(...args);
} else {
    console.log("Command not found");
}
