declare const __APP_VERSION__: string;

interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string;
    readonly DEV: boolean;
    readonly PROD: boolean;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
