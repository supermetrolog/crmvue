declare const __APP_VERSION__: string;

interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string;
    readonly VITE_VUE_APP_HOST: string;
    readonly DEV: boolean;
    readonly PROD: boolean;

    readonly VITE_VUE_APP_WHATSAPP_BOT_PHONE: string;
    readonly VITE_VUE_APP_TELEGRAM_BOT_USERNAME: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
