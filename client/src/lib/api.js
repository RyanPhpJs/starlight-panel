import axios from "axios";
import { getToken, redirectToLogin, removeToken } from "./auth";

export async function request(method, url, data) {
    const token = getToken();
    if (token) return await request.auth(method, url, token, data);
    return axios.request({
        method: method,
        url: url,
        data: data,
        validateStatus: (status) => status < 500
    });
}

request.unauth = async function request(method, url, data) {
    return axios.request({
        method: method,
        url: url,
        data: data,
        validateStatus: (status) => status < 500
    });
};

request.auth = async function (method, url, token, data) {
    return await axios.request({
        method: method,
        url: url,
        data: data,
        headers: {
            Authorization: "Bearer " + token
        },
        validateStatus: (status) => {
            if (status < 500) {
                if (status === 401) {
                    removeToken();
                    redirectToLogin();
                }
                return true;
            }
            return false;
        }
    });
};
request.get = async function (url, data = {}) {
    if (Object.keys(data).length > 0) {
        const _url = new URLSearchParams(data);
        return await request("GET", `${url}?${_url.toString()}`);
    }
    return request("GET", url);
};

export function getUser() {
    return request.get("/api/user");
}

export async function getInitialUser() {
    const token = getToken();
    if (!token) return { status: 401, data: null };
    return await getUser();
}

export async function loginUser(username, password) {
    const response = await request.unauth(
        "POST",
        "/api/login",
        new URLSearchParams({
            username,
            password
        })
    );
    if (response.status === 200 && response.data.token) {
        return { success: true, token: response.data.token };
    }
    return {
        success: false,
        message:
            response.data.message ||
            `${response.status} - ${response.statusText}`
    };
}

export async function getInfo() {
    return request.get("/api/info");
}
