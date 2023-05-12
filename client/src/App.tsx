import React from 'react';
import { logout, goToAuth, fetchApi, getToken } from './helpers';

function App({ accessToken, sessionId, updateCurrentSession }: { accessToken: string, sessionId: string, updateCurrentSession: Function }) {
  const [apiData, setApiData] = React.useState<any>(null);

  const getApi = async () => {
    const data = await fetchApi(accessToken);
    setApiData(data);
  }

  const goToAuthPage = () => {
    goToAuth();
  }

  const logoutAuth = async () => {
    const data = await logout(updateCurrentSession);
    setApiData(data);
  }

  const refreshAccessToken = async () => {
    const data = await getToken(updateCurrentSession);
    setApiData(data);
  }

  return (
    <React.Fragment>
      <div className="grid grid-cols-[60%_auto] content-center max-w-5xl mx-auto py-12 px-4">
        <div className="px-4 text-left text-white">
          <h1 className="text-3xl">client app</h1>
          <div className="grid grid-flow-col mt-6 w-fit gap-x-2">
            {[
              { text: "GET /api", onClick: getApi },
              { text: "go to /auth", onClick: goToAuthPage },
              { text: 'DELETE /auth/logout', onClick: logoutAuth },
              { text: 'GET /auth/refresh', onClick: refreshAccessToken },
            ].map(({ text, onClick }, i) => (
              <button key={i} className=" px-2 py-1.5 text-sm border rounded-md w-fit hover:bg-slate-950/30" onClick={onClick}>{text}</button>
            ))}
          </div>
          <div>
            <div className="mt-6">access token&#58;</div>
            <div className="max-w-lg break-all text-slate-300">{accessToken || "no token"}</div>
            <div className="mt-6 ">session id&#58;</div>
            <div className="text-slate-300">{sessionId || "no session id"}</div>
          </div>
        </div>
        <div className="p-4 overflow-hidden border rounded-lg bg-slate-800">
          <p>response from api&#58;</p>
          <pre className="mt-4 text-sm text-white">
            {apiData ? <FormatJSON data={apiData} /> : "no data"}
          </pre>
        </div>
      </div>
    </React.Fragment>
  );
}

export default App

function FormatJSON({ data }: { data: any }): JSX.Element {

  const DATA: string[][] = Object.entries(data);

  // return (
  //   <pre>
  //     {JSON.stringify(data)}
  //   </pre>
  // )

  return (
    <div>
      <span className="block">&#123;</span>
      <div className="pl-2">
        {DATA.map(([key, value], i) => (
          <div key={i} className="truncate overflow-ellipsis whitespace-nowrap">
            <span>&#34;{key}&#34;&#58; </span>
            <span title={value}>&#34;{value}&#34;</span>
          </div>
        ))}
      </div>
      <span className="block">&#125;</span>
    </div>
  )
}