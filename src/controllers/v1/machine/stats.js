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
            auth: false
        },
        async (req, res) => {
            const monitor = await createMonitor();
            res.send(monitor);
        }
    );
};
