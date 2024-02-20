const Dockerode = require("dockerode");

module.exports = new Dockerode("/var/run/docker.sock");
