/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_ENDPOINT: string;
    readonly VITE_AUTH_ENDPOINT: string;
    readonly VITE_TOKEN_ENDPOINT: string;
    readonly VITE_LOGOUT_ENDPOINT: string;

    readonly VITE_CLIENT_ID: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}