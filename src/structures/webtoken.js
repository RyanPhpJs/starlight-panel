const secret = process.env.SECRET;

function create({ expiration = 60 * 60, userHash }) {
    // pass
    const token = encode();
}

function encode(tokenData) {
    // pass
}

function decode(token) {
    // pass
}

function verify(token) {
    // pass
}

module.exports = {
    create,
    decode,
    verify
};
