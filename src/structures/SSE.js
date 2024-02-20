const EventEmitter = require("events");

module.exports = class SSE extends EventEmitter {
    constructor(res) {
        super();
        /**
         * @private
         * @type {import("express").Response}
         */
        this._res = res;
        /**
         * @private
         */
        this._inited = false;

        /**
         * @private
         */
        this._ended = false;
    }

    init() {
        this._res.setHeader("Cache-Control", "no-cache");
        this._res.setHeader("Content-Type", "text/event-stream");
        this._res.setHeader("Access-Control-Allow-Origin", "*");
        this._res.setHeader("Connection", "keep-alive");
        this._inited = true;
        this._res.flushHeaders();

        this._res.on("close", () => {
            this._ended = true;
            this._res.end();
            this.emit("close");
        });
        return this;
    }

    write(eventName, eventData = null) {
        res.write(
            `event: ${eventName}\ndata: ${JSON.stringify(eventData)}\n\n`
        );
        return this;
    }

    send(eventData) {
        res.write(`data: ${JSON.stringify(eventData)}\n\n`);
        return this;
    }

    close() {
        this._ended = true;
        this._res.end();
        this.emit("close");
    }
};
