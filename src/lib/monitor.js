const { platform, totalmem, freemem } = require("os");
const { os, cpu } = require("node-os-utils");
const { default: checkDisk } = require("check-disk-space");
const docker = require("../models/docker");

module.exports = async function createMonitor() {
    const p = {};
    p.platform = platform();
    p.distro = await os.oos();
    const free = freemem();
    const total = totalmem();
    p.memory = {
        total: total,
        free: free,
        used: total - free
    };
    const disk = await checkDisk("/");
    p.disk = {
        total: disk.size,
        free: disk.free,
        used: disk.size - disk.free,
        path: disk.diskPath
    };
    p.cpus = cpu.count();
    const version = await docker.version();
    p.docker = {
        apiVersion: version.ApiVersion,
        version: version.Version
    };
    p.node = {
        version: process.version,
        v8: process.versions.v8
    };
    return p;
};
