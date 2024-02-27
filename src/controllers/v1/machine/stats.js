const { Controller } = require("../../../structures/Controller");
const createMonitor = require("../../../lib/monitor");

const memory = [];

module.exports = class Stats extends Controller {
    /**
     * Fornece informações se o servidor está ligado
     */
    info = this.request(
        {
            url: "/api/info",
            method: "GET",
            auth: true,
        },
        async (req, res) => {
            const monitor = await createMonitor();
            res.send(monitor);
        }
    );

    ramStream = this.request(
        {
            url: "/api/info/memory/stream",
            method: "GET",
            auth: false,
        },
        (req, res, next) => {
            this.server.proxy.web(req, res, {
                target: "http://localhost:9090/api/monitor/memory/stream",
            });
        }
    );
};
