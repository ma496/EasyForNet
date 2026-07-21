import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import type { SerializedError } from '@reduxjs/toolkit'

export type ApiError = FetchBaseQueryError | SerializedError | { messages: string[] } | undefined | null

/**
 * Represents a single validation error returned by the backend API.
 * `name` is the property name (e.g. "EmailNormalized"),
 * `code` is the error code (e.g. "duplicate_email"),
 * `reason` is the fallback message.
 */
export interface ValidationError {
  name: string
  code: string | number
  reason: string
}

/** Type guard that narrows an unknown value to FetchBaseQueryError. */
function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === 'object' && error !== null && 'status' in error
}

/** Type guard that narrows an unknown value to an object with a string `message` property. */
function isErrorWithMessage(error: unknown): error is { message: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string'
  )
}

/**
 * Extracts the error message string from a FetchBaseQueryError or SerializedError.
 * Returns `null` if the error shape is unknown.
 */
function getErrorMessage(error: unknown): string | null {
  if (isFetchBaseQueryError(error)) {
    if (error.status === 'FETCH_ERROR') {
      return error.error
    }
    if (error.status === 'PARSING_ERROR') {
      return error.error
    }
    if (error.status === 'CUSTOM_ERROR') {
      return error.error
    }
    // Numeric status — data may have a message
    const data = error.data
    if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>
      if (typeof obj.message === 'string') return obj.message
      if (typeof obj.title === 'string') return obj.title
    }
    return null
  }
  if (isErrorWithMessage(error)) {
    return error.message
  }
  if (error && typeof error === 'object') {
    const obj = error as Record<string, unknown>
    if (typeof obj.message === 'string') return obj.message
    if (typeof obj.error === 'string') return obj.error
  }
  return null
}

/**
 * Maps a backend `ValidationError.name` to the corresponding Formik field name.
 *
 * The backend returns `PascalCase` names, optionally with a `Normalized` suffix
 * (e.g. `"EmailNormalized"`, `"UsernameNormalized"`, `"FirstName"`).
 * This function strips the `Normalized` suffix and lowercases the first character.
 *
 * Examples:
 *   "EmailNormalized" → "email"
 *   "UsernameNormalized" → "username"
 *   "PasswordNormalized" → "password"
 *   "FirstName" → "firstName"
 *   "LastName" → "lastName"
 *   "Roles" → "roles"
 */
function toFormFieldName(name: string): string {
  const stripped = name.replace(/normalized$/i, '')
  return stripped.charAt(0).toLowerCase() + stripped.slice(1)
}

/**
 * Formats a single `ValidationError` into a localized message string.
 *
 * Attempts to look up `error.server.{code}` in the translation dictionary.
 * Falls back to `error.reason` if no translation key exists.
 * The property name is localized via `t(name)`.
 */
function getFieldErrorMessage(
  error: ValidationError,
  t: (key: string, vars?: Record<string, string | number>) => string,
): string {
  const fieldName = t(toFormFieldName(error.name))
  const key = `error.server.${error.code}`
  const translated = t(key, { propertyName: fieldName })
  // If the translation returned the key itself, it doesn't exist — fall back
  return translated !== key ? translated : error.reason
}

/**
 * Extracts a human-readable title and message list from any RTK error shape.
 */
export function getApiErrorMessages(
  error: ApiError,
  t: (key: string, vars?: Record<string, string | number>) => string,
  ignoreStatuses: number[] = [],
): { title: string; messages: string[] } | null {
  if (!error) return null

  // Determine the status and data from the error shape
  let status: number | string | undefined
  let data: unknown | undefined

  if (isFetchBaseQueryError(error)) {
    status = error.status
    data = typeof error.status === 'number' ? error.data : undefined
  }

  // Numeric HTTP status
  if (typeof status === 'number' && !ignoreStatuses.includes(status)) {
    // 400 with validation errors
    if (status === 400 && data && typeof data === 'object') {
      const obj = data as Record<string, unknown>
      const validationErrors = obj.errors
      if (Array.isArray(validationErrors) && validationErrors.length > 0) {
        const msgs = validationErrors.map((e: ValidationError) => getFieldErrorMessage(e, t))
        return { title: t('error.400.title'), messages: msgs }
      }
      // 400 without structured errors — try to show the data as-is
      const msg = getErrorMessage(error)
      return {
        title: t('error.400.title'),
        messages: msg ? [msg] : [JSON.stringify(data)],
      }
    }
    if (status === 401) {
      return { title: t('error.401.title'), messages: [t('error.401.message')] }
    }
    if (status === 403) {
      return { title: t('error.403.title'), messages: [t('error.403.message')] }
    }
    if (status === 404) {
      return { title: t('error.404.title'), messages: [t('error.404.message')] }
    }
    if (status === 413) {
      return { title: t('error.413.title'), messages: [t('error.413.message')] }
    }
    if (status === 415) {
      return { title: t('error.415.title'), messages: [t('error.415.message')] }
    }
    if (status === 500) {
      return { title: t('error.500.title'), messages: [t('error.500.message')] }
    }
    // Unknown status — try to get a message from data
    const msg = getErrorMessage(error)
    return {
      title: t('common.error'),
      messages: msg ? [msg] : [t('error.500.message')],
    }
  }

  // Plain { messages: string[] } object
  if ('messages' in error && Array.isArray((error as Record<string, unknown>).messages)) {
    return {
      title: t('common.error'),
      messages: (error as { messages: string[] }).messages,
    }
  }

  // SerializedError or other unknown shapes
  const msg = getErrorMessage(error)
  return {
    title: t('common.error'),
    messages: msg ? [msg] : [t('error.500.message')],
  }
}
