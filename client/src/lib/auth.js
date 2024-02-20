export function getToken() {
    return localStorage.getItem("starlight_token") || null;
}

export function setToken(token) {
    localStorage.setItem("starlight_token", token);
    return token;
}

export function removeToken() {
    localStorage.removeItem("starlight_token");
    return true;
}

export function redirectToLogin() {
    localStorage.setItem(
        "starlight_redirect_to",
        location.pathname + location.search
    );
    location.replace("/login");
}

export function redirectFromLogin() {
    const url = localStorage.getItem("starlight_redirect_to") || "/";
    if (!url.startsWith("/")) return location.replace("/");
    location.replace(url);
}
