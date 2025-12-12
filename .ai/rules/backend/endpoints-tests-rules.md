# Test Generation from Snippets

To accelerate development, code snippets for generating standard CRUD tests are available in the `.ai/snippets/backend/tests/endpoints` directory. These snippets serve as templates and should be used to create new test files.

It is required to strictly follow the backend tests snippets for backend tests creation and modification.

The available snippets are:

*   `create.txt`: For testing the create endpoint.
*   `update.txt`: For testing the update endpoint.
*   `delete.txt`: For testing the delete endpoint.
*   `get.txt`: For testing the get endpoint.
*   `list.txt`: For testing the list endpoint.

## How to use the snippets:

1.  Copy the content of a snippet file (e.g., `create.txt`) into a new `.cs` file within the appropriate feature's `Tests` directory (e.g., `src/backend/Tests/Features/MyFeature/Endpoints/MyEntities/MyEntityCreateTests.cs`).
2.  Perform a search and replace for the following placeholders:
    *   `{{featureName}}`: The name of the feature (e.g., `Identity`).
    *   `{{entitiesName}}`: The plural name of the entity (e.g., `Users`).
    *   `{{entityName}}`: The singular name of the entity (e.g., `User`).
3.  Adjust the properties in the Request and Response DTOs to match your entity's requirements.
4.  Update the assertions in the test methods.
5.  Use `Bogus` for creating request objects. For unique properties, use `.RuleFor(u => u.SomethingUnique, f => $"Value {f.UniqueIndex}")`. Before writing tests, you should read the entity's configuration file to identify which properties have a unique index.

## Implementation Conventions

*   Inject `ITestOutputHelper` in the test class constructor to enable logging within tests.
*   Always pass `CancellationToken` to async methods in tests. Use `TestContext.Current.CancellationToken` to obtain the token.
*   Test method names should be descriptive and follow the pattern: `Action_Condition_ExpectedResult`. For example,         `Create_With_Valid_Input_Returns_Created`.
*   For `Create` endpoint tests, expect a `201 Created` status code for successful creation.
*   For `Update` endpoint tests, expect a `200 OK` status code for successful updates.
*   For `Delete` endpoint tests, expect a `204 No Content` status code for successful deletion.
*   When testing for non-existent entities in `Update` and `Delete` operations, expect a `404 Not Found` status code and a `ProblemDetails` response.
*   When writing tests for uniqueness, create a test case that attempts to violate the unique constraint and assert that a `400 Bad Request` is returned. This ensures that the database index and global error handler are functioning correctly.
*   Always assert the HTTP status code first. If the status code is not the expected one, log the response content for easier debugging. Use `await rsp.Content.ReadAsStringAsync(TestContext.Current.CancellationToken)` to get the raw response body, which is more reliable than trying to deserialize it as a `ProblemDetails` object, especially when the response might not be a valid JSON.
*   After asserting the status code, assert that the entity has been correctly persisted in the database.
*   For `Update` tests, use a private helper method to create the initial entity that will be updated.
*   When testing for validation errors, assert that the property name in the error response is in `camelCase`.
*   When creating dates in tests, use `ToUniversalTime()` to ensure consistency across different time zones.
*   When comparing dates in tests, use `BeCloseTo()` with a reasonable tolerance (e.g., `TimeSpan.FromSeconds(3)`) to avoid flaky tests due to minor timing differences.