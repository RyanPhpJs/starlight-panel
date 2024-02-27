export function parse(bytes) {
    if (!+bytes) return "0 Bytes";

    const k = 1000;
    const dm = 2;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
export function parseToGb(bytes) {
    return Number(parseFloat(bytes / 1000 / 1000 / 1000).toFixed(2));
}
