/**
 * Environment configuration
 * Type-safe access to environment variables
 */

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_TIMEOUT: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_ENVIRONMENT: string;
  readonly VITE_ENABLE_DEBUG: string;
  readonly VITE_ENABLE_ANALYTICS: string;
  readonly VITE_DEFAULT_LANGUAGE: string;
  readonly VITE_AVAILABLE_LANGUAGES: string;
}

interface Config {
  api: {
    baseUrl: string;
    timeout: number;
  };
  app: {
    name: string;
    version: string;
    environment: string;
  };
  features: {
    debug: boolean;
    analytics: boolean;
  };
  i18n: {
    defaultLanguage: string;
    availableLanguages: string[];
  };
}

/**
 * Validates and returns environment configuration
 * Throws error if required variables are missing
 */
function getConfig(): Config {
  const env = import.meta.env as unknown as ImportMetaEnv;

  // Validate required variables
  if (!env.VITE_API_BASE_URL) {
    throw new Error('VITE_API_BASE_URL is required');
  }

  return {
    api: {
      baseUrl: env.VITE_API_BASE_URL,
      timeout: parseInt(env.VITE_API_TIMEOUT || '30000', 10),
    },
    app: {
      name: env.VITE_APP_NAME || 'Roster Portal',
      version: env.VITE_APP_VERSION || '1.0.0',
      environment: env.VITE_ENVIRONMENT || 'development',
    },
    features: {
      debug: env.VITE_ENABLE_DEBUG === 'true',
      analytics: env.VITE_ENABLE_ANALYTICS === 'true',
    },
    i18n: {
      defaultLanguage: env.VITE_DEFAULT_LANGUAGE || 'es',
      availableLanguages: (env.VITE_AVAILABLE_LANGUAGES || 'es,en').split(','),
    },
  };
}

export const config = getConfig();

/**
 * Helper to check if we're in development mode
 */
export const isDevelopment = config.app.environment === 'development';

/**
 * Helper to check if we're in production mode
 */
export const isProduction = config.app.environment === 'production';
