const Queue = require("better-queue");
const { readFileSync, existsSync, writeFileSync } = require("fs");
const { decode, encode } = require("@msgpack/msgpack");

class Database {
    constructor(path) {
        this.path = path;
        this._db = {};
        this.queue = new Queue(
            function (input, cb) {
                writeFileSync(path, encode(input));
                cb(null, true);
            },
            {
                concurrent: 1
            }
        );
        this.load();
    }

    get(index) {
        return this._db[index];
    }

    has(index) {
        return this._db[index] !== undefined;
    }

    set(index, value) {
        this._db[index] = value;
        return this.save();
    }

    delete(index) {
        delete this._db[index];
        return this.save();
    }

    load() {
        if (!existsSync(this.path)) {
            return;
        }
        const jsonData = readFileSync(this.path);
        this._db = decode(jsonData);
    }

    save() {
        return new Promise((resolve, reject) => {
            this.queue.push(this._db, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }
}

const dbList = {};

/**
 *
 * @param {*} path
 * @returns {Database}
 */
module.exports = function createDB(path) {
    if (dbList[path]) return dbList[path];
    dbList[path] = new Database(path);
    return dbList[path];
};
