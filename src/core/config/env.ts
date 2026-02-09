const env = {
  API_URL: import.meta.env.VITE_API_URL as string,
  AUTH0_DOMAIN: import.meta.env.VITE_AUTH0_DOMAIN as string,
  AUTH0_CLIENT_ID: import.meta.env.VITE_AUTH0_CLIENT_ID as string,
  AUTH0_AUDIENCE: import.meta.env.VITE_AUTH0_AUDIENCE as string,
  AUTH0_CALLBACK_URL: import.meta.env.VITE_AUTH0_CALLBACK_URL as string,
  AUTH_BYPASS: import.meta.env.VITE_AUTH_BYPASS === 'true',
  DEFAULT_TENANT_ID: import.meta.env.VITE_DEFAULT_TENANT_ID as string | undefined,
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
} as const

export default env
