const argon = require("argon2");
const { Controller, z } = require("../../../structures/Controller");

module.exports = class Ping extends Controller {
    /**
     * Fornece informações se o servidor está ligado
     */
    ping = this.request(
        {
            url: "/api/login",
            method: "POST",
            auth: false,
            body: {
                username: z
                    .string({
                        required_error: "Username é obrigatorio",
                        invalid_type_error: "Username deve ser uma string"
                    })
                    .min(1),
                password: z
                    .string({
                        required_error: "Password é obrigatorio",
                        invalid_type_error: "Password deve ser uma string"
                    })
                    .min(1)
            }
        },
        async (req, res) => {
            const username = req.config.get("PANEL_USER");
            if (req.body.username !== username) {
                return res.api.error(404, "Usuario não encontrado");
            }
            const result = await argon.verify(
                req.config.get("PANEL_PASS"),
                req.body.password
            );
            if (!result) {
                return res.api.error(404, "Senha incorreta");
            }
            const token = await this.server.createToken(60 * 60 * 24); // 24 horas
            res.api.success({
                token: token
            });
        }
    );
};
