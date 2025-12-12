# Endpoint Generation from Snippets

To accelerate development, code snippets for generating standard CRUD endpoints are available in the `.ai/snippets/backend/endpoints` directory. These snippets serve as templates and should be used to create new endpoint files.

It is required to strictly follow the backend endpoints snippets for backend endpoints creation and modification.

The available snippets are:
*   `create.txt`: For creating a new entity.
*   `update.txt`: For updating an existing entity.
*   `delete.txt`: For deleting an entity.
*   `get.txt`: For retrieving a single entity by its ID.
*   `list.txt`: For listing/searching entities with pagination.
*   `group.txt`: For grouping endpoints under a common route.

## How to use the snippets:

1.  Copy the content of a snippet file (e.g., `create.txt`) into a new `.cs` file within the appropriate feature's `Endpoints` directory (e.g., `src/backend/Source/Features/MyFeature/Endpoints/MyEntities/MyEntityCreateEndpoint.cs`).
2.  Perform a search and replace for the following placeholders:
    *   `{{featureName}}`: The name of the feature (e.g., `Identity`).
    *   `{{entitiesName}}`: The plural name of the entity (e.g., `Users`).
    *   `{{entityName}}`: The singular name of the entity (e.g., `User`).
    *   `{{entitiesNameLower}}`: The lowercase plural name of the entity, used for routes (e.g., `users`).
    *   `{{IdTypeOfEntity}}`: The type of the entity's ID (e.g., `Guid`).
3.  Adjust the properties in the Request and Response DTOs to match your entity's requirements.
4.  Update the validation rules in the Validator class.

## Implementation Conventions

*   **Uniqueness and Error Handling:**
    *   For properties that must be unique (e.g., a Username or email), rely on unique indexes at the database level instead of performing checks in the application code.
    *   A global error handler is configured to catch database exceptions, such as unique constraint violations, and automatically convert them into a `400 Bad Request` response.

*   **Permissions:**
    *   Permissions are defined as constants in the `Allow` class.
    *   New permissions are configured in the `PermissionDefinitionProvider` class.
    *   You can use permission in the endpoint constructor like that 
        ```csharp
        Permissions(Allow.User_Create);
        ```
*   **Mapperly:**
    *   Mapperly is used for object mapping between DTOs and entities.
    *   When mapping from a request to an entity, use `RequiredMappingStrategy.Source`. If a property in the source (request) should not be mapped to the target (entity), use the `[MapperIgnoreSource]` attribute.
    *   When mapping from an entity to a response, use `RequiredMappingStrategy.Target`. If a property in the target (response) does not exist in the source (entity), use the `[MapperIgnoreTarget]` attribute.