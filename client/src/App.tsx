import React from 'react';
import { goToLoginPage, fetchApi, refreshAccessToken, logout } from './helpers';

function App({ accessToken, sessionId, updateAccessToken }: { accessToken: string, sessionId: string, updateAccessToken: Function }) {
  const [apiData, setApiData] = React.useState<any>(null);

  const getApiData = async () => {
    let response = await fetchApi(accessToken);
    console.log(response);
    setApiData(response);
  }

  const refreshAccessTokenHandler = async () => {
    let response = await refreshAccessToken();
    setApiData(response);
    updateAccessToken(response.accessToken);
  }

  const logoutHandler = async () => {
    await logout();
    updateAccessToken("");
  }

  return (
    <React.Fragment>
      <div className="grid grid-cols-[60%_auto] content-center max-w-screen-2xl mx-auto py-12 px-4">

        <div className="text-center text-white">
          <h1 className="text-3xl">client app</h1>

          <button className="px-4 py-2 mt-6 text-sm bg-blue-600 rounded-lg hover:bg-blue-500 ring-1 ring-slate-200" onClick={goToLoginPage}>
            log in with auth server
          </button>
          <button className="block px-4 py-2 mx-auto mt-6 text-sm bg-purple-600 rounded-full hover:bg-purple-500 ring-1 ring-slate-200" onClick={getApiData}>
            make api request
          </button>
          <button className="block px-4 py-2 mx-auto mt-6 text-sm skew-x-3 skew-y-3 bg-green-600 rounded-sm hover:bg-green-500 ring-1 ring-slate-200" onClick={refreshAccessTokenHandler}>
            refresh access token
          </button>
          <button className="mt-6 hover:underline" onClick={logoutHandler}>
            log out
          </button>

          <div className="mt-6">
            <div className="">access token:</div>
            <div className="max-w-lg mx-auto break-all text-slate-300">{accessToken || "no token"}</div>
            <div className="mt-6 ">session id:</div>
            <div className="text-slate-300">{sessionId || "no session id"}</div>
          </div>
        </div>

        <div className="p-4 border rounded-lg bg-slate-800">
          <p>response from api:</p>
          <div className="mt-4 text-sm text-white whitespace-pre-wrap">
            {apiData ? JSON.stringify(apiData, null, 2) : "no data"}
          </div>
        </div>

      </div>
    </React.Fragment>
  );
}

export default App
