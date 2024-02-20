const { Controller } = require("../../../structures/Controller");

module.exports = class Ping extends Controller {
    /**
     * Fornece informações se o servidor está ligado
     */
    ping = this.request(
        {
            url: "/api/ping",
            method: "GET",
            auth: false
        },
        (req, res) => {
            res.send({ message: "Pong!" });
        }
    );
};
