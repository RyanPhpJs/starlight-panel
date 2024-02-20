const Middleware = Symbol("MIDDLEWARE");

module.exports.createMiddleware = function createMiddleware(
    url,
    args,
    callback
) {
    return {
        [Middleware]: true,
        url: url,
        args: args,
        callback: callback
    };
};

module.exports.isMiddleware = function isMiddleware(obj) {
    return !!obj[Middleware];
};
