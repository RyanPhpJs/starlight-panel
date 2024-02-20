const { readFileSync } = require("fs");
const dotenv = require("dotenv");

module.exports.Config = class Config {
    /**
     * @private
     */
    _cache = {};

    /**
     * @private
     */
    _readed = false;

    read() {
        this._cache = dotenv.parse(
            readFileSync("/panel/conf/user_details.conf")
        );
        this._readed = true;
        return this._cache;
    }

    get(key) {
        if (this._readed) {
            return this._cache[key];
        }
        this.read();
        return this._cache[key];
    }
};
