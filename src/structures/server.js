const express = require("express");
const selfsigned = require("selfsigned");
const nanoid = require("nanoid");
const {
    writeFileSync,
    existsSync,
    readFileSync,
    readdirSync,
    mkdirSync,
} = require("fs");
const { createServer } = require("https");
const { join } = require("path");
const { PrismaClient } = require("@prisma/client");
const { Config } = require("./config");
const SSE = require("./SSE");
const { isMiddleware } = require("./createMiddleware");
const { createProxyServer } = require("http-proxy");

module.exports = class Server {
    constructor() {
        this.application = express();

        this.proxy = createProxyServer({
            ws: false,
            ignorePath: true,
        });
        this.server = createServer(this.getCertificate(), this.application);
        this.db = new PrismaClient();
    }

    getCertificate() {
        if (
            !existsSync("ssl/certificate.crt") ||
            !existsSync("ssl/private.key")
        ) {
            this.createCertificate();
        }
        return {
            key: readFileSync("ssl/private.key", "utf-8"),
            cert: readFileSync("ssl/certificate.crt", "utf-8"),
        };
    }

    /**
     * Cria um certificado auto-assinado para utilizar na conexão
     */
    createCertificate() {
        const certificate = selfsigned.generate(
            [
                {
                    name: "commonName",
                    value: "localhost",
                },
            ],
            { days: 365 * 10 - 1 }
        );
        if (!existsSync("ssl")) mkdirSync("ssl");
        writeFileSync("ssl/certificate.crt", certificate.cert);
        writeFileSync("ssl/private.key", certificate.private);
    }

    updateCertificate(certificate) {
        writeFileSync("ssl/certificate.crt", certificate.cert);
        writeFileSync("ssl/private.key", certificate.private);
        this.server.addContext("*", this.getCertificate());
    }

    basic() {
        this.application.use(
            express.json({
                limit: "5mb",
                type: (req) => {
                    if (req.headers["content-type"]) {
                        const p = req.headers["content-type"].split(";");
                        if (p[0] === "application/json") return true;
                    }
                    return false;
                },
            }),
            express.urlencoded({
                limit: "5mb",
                extended: true,
                type: (req) => {
                    if (req.headers["content-type"]) {
                        const p = req.headers["content-type"].split(";");
                        if (p[0] === "application/x-www-form-urlencoded")
                            return true;
                    }
                    return false;
                },
            })
        );

        this.application.use((req, res, next) => {
            req.config = new Config();
            res.api = {
                success(status, data) {
                    if (typeof data === "undefined" || data === null) {
                        res.status(200).send(status);
                    } else {
                        res.status(status).send(data);
                    }
                    return res.api;
                },
                error(status, message) {
                    res.status(status).send({ message: message });
                },
            };
            res.sse = new SSE(res);
            next();
        });
    }

    middlewares(path = "") {
        for (const controller of readdirSync(join("src/middlewares", path), {
            withFileTypes: true,
        })) {
            if (controller.isFile()) {
                const c = require("../middlewares/" +
                    path +
                    "/" +
                    controller.name);
                if (typeof c === "object") {
                    for (const value of Object.values(Object.assign({}, c))) {
                        if (isMiddleware(value)) {
                            console.log("New Middleware", value.url);
                            this.application.use(value.url, value.callback);
                        }
                    }
                }
            } else if (controller.isDirectory()) {
                this.middlewares(join(path, controller.name));
            }
        }
    }

    routes(path = "") {
        for (const controller of readdirSync(join("src/controllers", path), {
            withFileTypes: true,
        })) {
            if (controller.isFile()) {
                const c = require("../controllers/" +
                    path +
                    "/" +
                    controller.name);
                new c(this);
            } else if (controller.isDirectory()) {
                this.routes(join(path, controller.name));
            }
        }
    }

    static() {
        this.application.use(express.static("build"));
        this.application.use("/public", express.static("public"));
    }

    async createToken(expiration = 60 * 60) {
        const token = nanoid.nanoid(32);
        const d = new Date(Date.now() + expiration * 1000);
        await this.db.webTokens.create({
            data: {
                expiration: d,
                token: token,
            },
        });
        return token;
    }

    /**
     * @type {import("express").RequestHandler}
     */
    async auth(req, res, next) {
        const authotization = req.headers.authorization;
        if (!authotization) {
            return res
                .status(401)
                .send({ message: "Não Autorizado", errors: [] });
        }
        const [typeToken, ...token] = authotization.split(" ");
        if (typeToken !== "Bearer") {
            return res.status(401).send({
                message:
                    'Não Autorizado (Tipo de token invalído, é aceitado apenas "Bearer")',
            });
        }
        if (token.length !== 1) {
            return res.status(401).send({
                message: "Não Autorizado (Tamanho do token invalído)",
            });
        }
        if (token[0].length !== 32)
            return res.status(401).send({
                message: "Não Autorizado (Tamanho do token invalído)",
            });
        const result = await this.db.webTokens.findFirst({
            where: {
                token: token[0],
            },
        });
        if (!result) {
            return res
                .status(401)
                .send({ message: "Não Autorizado (Token desconhecido)" });
        }
        if (result.expiration < new Date()) {
            await this.db.webTokens.delete({ where: { id: result.id } });
            return res
                .status(401)
                .send({ message: "Não Autorizado (Token expirado)" });
        }
        req.authenticated = true;
        next();
    }

    listen() {
        this.application.use("/api", (req, res) => {
            res.status(404)
                .set("x-is-404", "1")
                .send({ message: "Path not found" });
        });
        this.application.use((req, res, next) => {
            res.sendFile("index.html", {
                root: join(__dirname, "../../build"),
            });
        });
        return new Promise((resolve) => {
            this.server.listen(2096, function () {
                console.log("Server Running");
                resolve();
            });
        });
    }
};
