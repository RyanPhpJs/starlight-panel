export function forceString(value, defaultValue = "") {
    return String(value ?? defaultValue ?? "");
}
