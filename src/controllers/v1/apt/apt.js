const { Controller } = require("../../../structures/Controller");

module.exports = class Apt extends Controller {
    /**
     * Fornece informações se o servidor está ligado
     */
    list = this.request(
        {
            url: "/api/apt/list",
            method: "GET",
            auth: true,
        },
        (req, res) => {
            res.send({ username: req.config.get("PANEL_USER") });
        }
    );
};
