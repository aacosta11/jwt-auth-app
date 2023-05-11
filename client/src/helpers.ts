

function goToLoginPage() {
    let authEndpoint = import.meta.env.VITE_AUTH_ENDPOINT;

    let client_id = import.meta.env.VITE_CLIENT_ID;
    let response_type = "code";
    let redirect_uri = encodeURIComponent(window.location.origin);
    let scope = "";
    let state = "";

    let authRequest = `${authEndpoint}?client_id=${client_id}&response_type=${response_type}&redirect_uri=${redirect_uri}&scope=${scope}&state=${state}`;
    window.location.href = authRequest;
}

function fetchApi(accessToken: string) {
    let response = fetch(import.meta.env.VITE_API_ENDPOINT, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
        }
    })
        .then(res => {
            if (res.status === 401) {
                return { status: 401, message: "Unauthorized" };
            }
            if (res.status === 403) {
                return { status: 403, message: "Forbidden" };
            }
            return res.json();
        })
        .then(data => data)
        .catch(err => err)

    return response;
}

function refreshAccessToken() {
    let response = fetch(import.meta.env.VITE_TOKEN_ENDPOINT, {
        method: "GET",
        credentials: "include",
    })
        .then(res => {
            if (res.status === 401) {
                return { status: 401, message: "Unauthorized" };
            }
            if (res.status === 403) {
                return { status: 403, message: "Forbidden" };
            }
            return res.json();
        })
        .then(data => data)
        .catch(err => err)

    return response;
}

function logout() {
    let response = fetch(import.meta.env.VITE_LOGOUT_ENDPOINT, {
        method: "POST",
        credentials: "include",
    })
        .then(res => {
            if (res.status === 403) {
                return { status: 403, message: "Forbidden" };
            }
            return res.json();
        })
        .then(data => data)
        .catch(err => err)

    return response;
}

export { goToLoginPage, fetchApi, refreshAccessToken, logout }