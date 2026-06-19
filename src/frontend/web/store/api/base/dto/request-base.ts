/** Base shape shared by all API request DTOs, allowing the caller to mark certain HTTP status codes as expected (non-error) for the request. */
export interface RequestBase {
  ignoreStatuses?: number[]
}
