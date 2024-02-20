export function DistroIcon({ icon, extraClasses = "" }) {
    return <i className={DistroIcon.Raw(icon) + " " + extraClasses} />;
}
DistroIcon.Raw = function Raw(type) {
    const icon = String(type || "")
        .toLowerCase()
        .split(" ")[0];

    switch (icon) {
        case "windows":
            return `fa-brands fa-windows`;
        case "ubuntu":
            return "fa-brands fa-ubuntu";
        case "debian":
            return "fa-brands fa-debian";
        default:
            return "fa-brands fa-linux";
    }
};
DistroIcon.Color = function Raw(type) {
    const icon = String(type || "")
        .toLowerCase()
        .split(" ")[0];

    switch (icon) {
        case "windows":
            return `windows`;
        case "ubuntu":
            return "ubuntu";
        case "debian":
            return "debian";
        default:
            return "linux";
    }
};
