# RTK Query Generation and Implementation Guide

This guide outlines the process for generating and implementing RTK Query endpoints. Following these conventions is required for all new and modified RTK Query endpoints.

## 1. Implementation Structure

Follow these explicit coding conventions when creating new API endpoints.

### File Structure
Create the API file and a single DTO file in the relevant feature's `store/api` directory.
- API file: `src/frontend/web/store/api/identity/users/users-api.ts`
- DTO file: `src/frontend/web/store/api/identity/users/users-dtos.ts`

### Code Template
Use the following structure as a standard template for your API definitions. Ensure you import `appApi` from `@/store/api/_app-api` and use `injectEndpoints`.

```typescript
import { appApi } from '@/store/api/_app-api'
import {
  UserCreateRequest,
  UserCreateResponse,
  UserGetRequest,
  UserGetResponse,
  // ... other DTOs
} from './users-dtos'

export const usersApi = appApi
  .enhanceEndpoints({
    addTagTypes: ['Users'], // Only include if CRUD operations require cache invalidation
  })
  .injectEndpoints({
    overrideExisting: false,
    endpoints: (builder) => ({
      userCreate: builder.mutation<UserCreateResponse, UserCreateRequest>({
        query: (input) => ({
          url: '/users',
          method: 'POST',
          body: input,
        }),
        invalidatesTags: ['Users'],
      }),
      userGet: builder.query<UserGetResponse, UserGetRequest>({
        query: (input) => ({
          url: `/users/${input.id}`,
          method: 'GET',
        }),
        providesTags: (result, error, arg) => [{ type: 'Users', id: arg.id }],
      }),
      // ... other endpoints
    }),
  })

export const { 
  useUserCreateMutation, 
  useUserGetQuery,
  // ... export hooks 
} = usersApi
## 4. Formatting

*   **Indentation**: Use **2-space indentation** strictly for all TypeScript (`.ts` and `.tsx`) files.

### Tag Usage
Use `providesTags` and `invalidatesTags` **only when you need them**, for example in CRUD endpoints where cache invalidation is critical to maintain data consistency. If an endpoint does not interact with the cache of other queries, omit the tags to reduce complexity.

## 2. DTO (Data Transfer Object) Creation

Create all required DTOs for a specific group (e.g., users, roles, account) in a single file named `{{group}}-dtos.ts` in the same directory as the API file.

### DTO Guidelines

*   **Type Definitions**: All DTOs must be defined using `interface`, not `type` or `class`. Use `type` only for union types or utility types if absolutely necessary.
*   **Inheritance**: All DTOs should use `interface extends` for inheritance.
    *   **Request Inheritance**: Request DTOs must inherit from `RequestBase` and other relevant base DTOs (e.g., `export interface MyRequest extends RequestBase, BaseDto<string> { ... }`).
    *   **Response Inheritance**: Response DTOs should inherit from relevant base DTOs (e.g., `export interface MyResponse extends BaseDto<string> { ... }`).
*   **Dedicated DTOs**: Each RTK Query endpoint must have its own request and response DTOs defined in the single DTO file. Do not share DTOs between different endpoints.
*   **Immutability**: Do not use the `readonly` keyword for DTO properties.
*   **Backend-to-Frontend Mapping**: When mapping backend DTO base types, use `interface extends`:
    *   `CreatableDto` -> `interface MyDto extends CreatableDto` (from `@/store/api/base/dto/auditable-dto`).
    *   `CreatableDto<Guid>` -> `interface MyDto extends GenericCreatableDto<string>` (from `@/store/api/base/dto/auditable-dto`).
    *   `UpdatableDto` -> `interface MyDto extends UpdatableDto` (from `@/store/api/base/dto/auditable-dto`).
    *   `UpdatableDto<Guid>` -> `interface MyDto extends GenericUpdatableDto<string>` (from `@/store/api/base/dto/auditable-dto`).
    *   `AuditableDto` -> `interface MyDto extends AuditableDto` (from `@/store/api/base/dto/auditable-dto`).
    *   `AuditableDto<Guid>` -> `interface MyDto extends GenericAuditableDto<string>` (from `@/store/api/base/dto/auditable-dto`).
    *   `ListRequestDto<Guid>` -> `interface MyRequest extends ListRequestDto<string>` (from `@/store/api/base/dto/list-request-dto`).
    *   `ListDto<T>` -> `interface MyResponse extends ListDto<T>` (from `@/store/api/base/dto/list-dto`).

### Comprehensive DTO Generation

When processing API endpoints to create DTOs, implement the following comprehensive and rigorous approach:

1.  **Thorough Recursive Analysis**:
    *   Conduct a field-by-field inspection of each request/response type definition with strict type validation.
    *   For nested or complex types, recursively analyze all child structures until reaching primitive types.

2.  **Complete, Independent DTO Definitions**:
    *   Create fully typed DTOs for each distinct type structure.
    *   Implement proper inheritance and composition relationships where applicable.

## 3. Enumerations

If you discover an `Enums.cs` file in the backend `{{feature}}/Core` directory, you must create a corresponding `enum.ts` file in the frontend.

### Location
Create the file in the `web/store/api/{{feature}}` directory (e.g., `src/frontend/web/store/api/identity/enum.ts`).

### Format
Use **String Enums** strictly. Do not use numeric values, even if the backend uses them by default.

**Example:**
```typescript
export enum ProductType {
  Physical = "Physical",
  Digital = "Digital",
  Service = "Service",
}
```