const zod = require("zod");
const { Config } = require("./config");

const safePromise = function (callback, self) {
    /**
     * @type {import("express").RequestHandler}
     */
    return async (req, res, next) => {
        try {
            await callback.call(self, req, res, next);
        } catch (err) {
            console.log(err);
            if (res.headersSent) {
                res.status(500).send({ message: "Um erro interno ocorreu" });
            } else {
                res.send({ message: "Um erro interno ocorreu" });
            }
        }
    };
};
module.exports.z = zod;
module.exports.zod = zod;
module.exports.Controller = class Controller {
    static zod = zod;
    /**
     *
     * @param {import("./server")} server
     */
    constructor(server) {
        this.config = new Config();
        this.server = server;
    }

    /**
     *
     * @type {import("./Controller").Controller['request']}
     */
    request({ url = "/", method = "GET", auth = false, body = {} }, callback) {
        if (method && !["GET", "POST", "PUT", "DELETE"].includes(method)) {
            throw new Error("Invalid Method in definition of route");
        }

        /**
         * @type {import("express").RequestHandler[]}
         */
        const functions_list = [];

        const routeCallback = safePromise(callback, this);

        if (!!auth) {
            // validate if authenticated
            functions_list.push((req, res, next) =>
                this.server.auth(req, res, next)
            );
        }

        if (Object.keys(body).length > 0) {
            const schema = zod.object(body);
            if (method === "GET" || method === "DELETE") {
                functions_list.push((req, res, next) => {
                    const result = schema.safeParse(req.query);
                    if (!result.success) {
                        return res.status(400).send({
                            message: result.error.errors
                                .map((e) => e.message)
                                .join("\n"),
                            errors: result.error.errors
                        });
                    }
                    req.query = result.data;
                    next();
                });
            } else {
                functions_list.push((req, res, next) => {
                    const result = schema.safeParse(req.body);
                    if (!result.success) {
                        return res.status(400).send({
                            message: result.error.errors.map((e) => e.message),
                            errors: result.error.errors
                        });
                    }
                    req.body = result.data;
                    next();
                });
            }
        }

        functions_list.push(routeCallback);

        console.log(`New Route: ${method} ${url}`);

        this.server.application[(method || "GET").toLowerCase()](
            url,
            ...functions_list
        );
        return this;
    }
};
