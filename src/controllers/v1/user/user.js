const { Controller } = require("../../../structures/Controller");

module.exports = class Ping extends Controller {
    /**
     * Fornece informações se o servidor está ligado
     */
    identify = this.request(
        {
            url: "/api/user",
            method: "GET",
            auth: true
        },
        (req, res) => {
            res.send({ username: req.config.get("PANEL_USER") });
        }
    );
};
