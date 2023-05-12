
// send user to login page (replaces current url)
export function goToAuth() {
	let authEndpoint = import.meta.env.VITE_AUTH_ENDPOINT;
	let client_id = import.meta.env.VITE_CLIENT_ID;
	let redirect_uri = encodeURIComponent(window.location.origin);
	let authRequest = `${authEndpoint}?client_id=${client_id}&redirect_uri=${redirect_uri}`;
	window.location.href = authRequest;
}

// fetch data from api endpoint
export function fetchApi(accessToken: string) {
	let response = fetch(import.meta.env.VITE_API_ENDPOINT, {
		method: "GET",
		headers: {
			"Authorization": `Bearer ${accessToken}`,
		}
	})
		.then(res => res.json())
		.catch(err => err)

	return response;
}

export function fetchPostAuth() {
	let response = fetch(import.meta.env.VITE_AUTH_ENDPOINT, {
		method: "POST",
		credentials: "include",
	})
		.then(res => res.json())
		.catch(err => err)

	return response;
}

export function getToken(callback?: Function) {
	let response = fetch(import.meta.env.VITE_TOKEN_ENDPOINT, {
		method: "GET",
		credentials: "include",
	})
		.then(res => res.json())
		.then(data => callback && callback(data.accessToken, data.sessionId))
		.catch(err => err)

	return response;
}

export function logout(callback?: Function) {
	let response = fetch(import.meta.env.VITE_LOGOUT_ENDPOINT, {
		method: "DELETE",
		credentials: "include",
	})
		.then(res => {
			if (res.ok) {
				callback && callback();
			}
			return res.json();
		})
		.catch(err => err)

	return response;
}
