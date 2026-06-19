/** Build-time environment configuration exposing the API base URL and convenience production/development flags. */
export const environment = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL,
  isProduction: process.env.NEXT_PUBLIC_APP_ENV === 'production',
  isDevelopment: process.env.NEXT_PUBLIC_APP_ENV === 'development',
}
