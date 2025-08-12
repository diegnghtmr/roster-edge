/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_APP_DESCRIPTION: string;
  readonly VITE_ENV: 'development' | 'staging' | 'production';
  readonly VITE_API_TIMEOUT: string;
  readonly VITE_ENABLE_ANALYTICS: string;
  readonly VITE_ENABLE_DEBUG_LOGS: string;
  readonly VITE_ENABLE_ERROR_REPORTING: string;
  readonly VITE_SESSION_TIMEOUT: string;
  readonly VITE_REFRESH_TOKEN_INTERVAL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
