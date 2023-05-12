import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import AppStateWrapper from './AppStateWrapper.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppStateWrapper
      Child={
        ({ accessToken, sessionId, updateCurrentSession }: { accessToken: string, sessionId: string, updateCurrentSession: Function }) =>
          <App accessToken={accessToken} sessionId={sessionId} updateCurrentSession={updateCurrentSession} />
      }
    />
  </React.StrictMode>,
)
