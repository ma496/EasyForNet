export const environment = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL,
  hubsUrl: process.env.NEXT_PUBLIC_HUBS_URL,
  isProduction: process.env.NEXT_PUBLIC_APP_ENV === 'production',
  isDevelopment: process.env.NEXT_PUBLIC_APP_ENV === 'development',
}
