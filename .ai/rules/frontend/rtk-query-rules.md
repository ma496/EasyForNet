# RTK Query Generation and Implementation Guide
 
This guide outlines the process for generating and implementing RTK Query endpoints. Following these conventions is required for all new and modified RTK Query endpoints.
 
## 1. Snippet-Based Generation
 
To accelerate development, a standard RTK Query endpoint snippet is available in `.ai/snippets/frontend/rtk-query/api.txt`. This snippet provides a template for creating, updating, deleting, getting, and listing entities.
 
### How to Use the Snippet
 
1.  **Copy Snippet**: Copy the content of `api.txt` into a new `.ts` file in the relevant feature's `store/api` directory (e.g., `src/frontend/web/store/api/my-feature/my-entities/my-entities-api.ts`).
2.  **Replace Placeholders**: Perform a search-and-replace for the following placeholders:
    *   `{{featureName}}`: The name of the feature (e.g., `Identity`).
    *   `{{entitiesName}}`: The plural name of the entity (e.g., `Users`).
    *   `{{entityName}}`: The singular name of the entity (e.g., `User`).
    *   `{{entitiesNamePascal}}`: The plural PascalCase name of the entity (e.g., `Users`).
    *   `{{entityNamePascal}}`: The singular PascalCase name of the entity (e.g., `User`).
 
## 2. DTO (Data Transfer Object) Creation
 
Before implementing the API file, create all required DTOs in the `dto` directory.
 
### DTO Guidelines
 
*   **Dedicated DTOs**: Each RTK Query endpoint must have its own request and response DTOs. Do not share DTOs between endpoints.
 *   **Immutability**: Do not use the `readonly` keyword for DTO properties.
*   **Backend-to-Frontend Mapping**: When mapping backend DTO base types, adhere to the following:
    *   `CreatableDto` -> `CreatableDto` from `@/store/api/base/dto/auditable-dto`.
    *   `CreatableDto<Guid>` -> `GenericCreatableDto<string>` from `@/store/api/base/dto/auditable-dto`.
    *   `UpdatableDto` -> `UpdatableDto` from `@/store/api/base/dto/auditable-dto`.
    *   `UpdatableDto<Guid>` -> `GenericUpdatableDto<string>` from `@/store/api/base/dto/auditable-dto`.
    *   `AuditableDto` -> `AuditableDto` from `@/store/api/base/dto/auditable-dto`.
    *   `AuditableDto<Guid>` -> `GenericAuditableDto<string>` from `@/store/api/base/dto/auditable-dto`.
    *   `ListRequestDto<Guid>` -> `ListRequestDto<string>` from `@/store/api/base/dto/list-request-dto`.
    *   `ListDto` -> `ListDto` from `@/store/api/base/dto/list-dto`.
 
### Comprehensive DTO Generation
 
When processing API endpoints to create DTOs, implement the following comprehensive and rigorous approach:
 
1.  **Thorough Recursive Analysis**:
    *   Conduct a field-by-field inspection of each request/response type definition with strict type validation.
    *   For nested or complex types, recursively analyze all child structures until reaching primitive types.
    *   Implement circular reference detection with appropriate resolution strategies (e.g., type aliasing).
 
2.  **Complete, Independent DTO Definitions**:
    *   Create fully typed DTOs for each distinct type structure.
    *   Implement proper inheritance and composition relationships where applicable.
 
## 3. Implementation Conventions

*   **`appApi` Import**: Import `appApi` exclusively from `_app-api`. Do not modify the import path.
*   **Automatic Injection**: Endpoints created using the `api.txt` snippet are automatically injected into `store/index.ts` by `appApi`. No manual injection is needed.
*   **Tags Usage**: Use `providesTags` and `invalidatesTags` only when necessary to support cache invalidation or refetch behavior. Avoid adding tags for endpoints that do not require cross-query cache coordination.

By following these guidelines, you will maintain a consistent and robust architecture across the application.