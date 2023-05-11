import React from 'react';

export default function AppStateWrapper({ Child }: { Child: Function }) {
	const [state, setState] = React.useState({
		isLoading: true,
		accessToken: "",
		sessionId: "",
	});

	const updateAccessToken = (accessToken: string) => {
		let sessionId = document.cookie.split("session_id=")[1].split(";")[0];
		setState({ ...state, accessToken, sessionId });
	}

	React.useEffect(() => {
		let stateCpy = { ...state };

		if (window.location.search.includes("code=")) {
			let code = window.location.search.split("code=")[1].split("&")[0];
			stateCpy.accessToken = code;
		}

		if (document.cookie.includes("session_id=")) {
			let sessionId = document.cookie.split("session_id=")[1].split(";")[0];
			stateCpy.sessionId = sessionId;
		}

		setTimeout(() => {
			window.history.replaceState({}, document.title, "/");
			setState({ ...stateCpy, isLoading: false });
		}, 1000)
	}, [])

	return state.isLoading ?
		<div>loading...</div>
		:
		Child({ accessToken: state.accessToken, sessionId: state.sessionId, updateAccessToken })
}