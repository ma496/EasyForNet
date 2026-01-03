# Backend Endpoint Test Rules

All backend endpoint tests must follow these conventions to ensure consistency, reliability, and ease of debugging. These rules are designed to align with the project's testing infrastructure using `FastEndpoints`, `FluentAssertions`, and `Bogus`.

## General Test Class Structure
- **Inheritance:** Test classes must inherit from `AppTestsBase(app)`.
- **Constructor:** Inject `ITestOutputHelper` to enable logging within tests.
- **Async Methods:** Always pass `CancellationToken` to all async methods. Use `TestContext.Current.CancellationToken` to obtain the token.

## Single File Per Endpoint Rule
Every endpoint must have its own dedicated test file. This file contains all the test cases for that specific endpoint. The directory structure of the tests must match the directory structure of the endpoints.

**Example Folder Structure:**
```text
Tests/Features/Identity/Endpoints/Users/
├── UserCreateTests.cs
├── UserUpdateTests.cs
├── UserGetTests.cs
├── UserListTests.cs
└── UserDeleteTests.cs
```

## Naming Conventions
Test method names should be descriptive and follow the pattern: `Action_Condition_ExpectedResult`.
- Example: `Create_With_Valid_Input_Returns_Created`
- Example: `Update_NonExistent_Entity_Returns_NotFound`

## HTTP Status Code Expectations
- **Create:** Expect `201 Created` (`HttpStatusCode.Created`) for successful creation.
- **Update:** Expect `200 OK` (`HttpStatusCode.OK`) for successful updates.
- **Delete:** Expect `204 No Content` (`HttpStatusCode.NoContent`) for successful deletion.
- **Entity Not Found:** Expect `404 Not Found` and a `ProblemDetails` response for `Update` and `Delete` operations on non-existent entities.
- **Validation Errors:** Expect `400 Bad Request` and assert that property names in the error response are in `camelCase`.
  ```csharp
  res.Errors.Select(e => e.Name).Should().Contain("firstName"); // camelCase
  ```
- **Uniqueness Violations:** Create a test case that attempts to violate unique constraints and assert that a `400 Bad Request` is returned.

## Assertions and Logging
1. **Status Code First:** Always assert the HTTP status code first.
2. **Debug on Failure:** If the status code is not as expected, log the raw response content for easier debugging.
   ```csharp
   if (rsp.StatusCode != HttpStatusCode.Created)
   {
       var content = await rsp.Content.ReadAsStringAsync(TestContext.Current.CancellationToken);
       output.WriteLine($"Response Content: {content}");
   }
   rsp.StatusCode.Should().Be(HttpStatusCode.Created);
   ```
3. **Database Persistence:** After asserting the status code, verify that the entity has been correctly persisted or updated in the database using the appropriate service or `DbContext`.

## Testing Write Operations

### Create Endpoint
- Use `Bogus` (Faker) to generate valid test data.
- Ensure all required fields are populated.
- Assert the response body matches the request data.
- Verify existence in the database.

### Update Endpoint
- Use a **private helper method** to create the initial entity that will be updated.
- Modify specific fields and assert they are updated correctly.
- Verify the `404 Not Found` case for non-existent IDs.

### Uniqueness Checks
- Attempt to create or update an entity with a duplicate unique field (e.g., Email, Slug).
- Assert `400 Bad Request` is returned.
- This ensures the database index and global error handler are functioning.

## Working with Dates
- **Creation:** Use `.ToUniversalTime()` when creating dates to ensure consistency across time zones.
- **Comparison:** Use `.BeCloseTo()` with a reasonable tolerance (e.g., `TimeSpan.FromSeconds(3)`) to avoid flaky tests due to minor timing differences between the application and the test runner.
  ```csharp
  res.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(3));
  ```

## Example: User Create Test
```csharp
public class UserCreateTests(App app, ITestOutputHelper output) : AppTestsBase(app)
{
    [Fact]
    public async Task Create_With_Valid_Input_Returns_Created()
    {
        await SetAuthTokenAsync();

        var request = new Faker<UserCreateRequest>()
            .RuleFor(u => u.Username, f => f.Internet.UserName() + f.UniqueIndex)
            .RuleFor(u => u.Email, f => f.Internet.Email() + f.UniqueIndex)
            .RuleFor(u => u.Password, f => "SecurePass123!")
            .RuleFor(u => u.Roles, f => [RoleConst.TestRoleId])
            .Generate();

        var (rsp, res) = await App.Client.POSTAsync<UserCreateEndpoint, UserCreateRequest, UserCreateResponse>(request);

        if (rsp.StatusCode != HttpStatusCode.Created)
        {
            var content = await rsp.Content.ReadAsStringAsync(TestContext.Current.CancellationToken);
            output.WriteLine($"Response Content: {content}");
        }

        rsp.StatusCode.Should().Be(HttpStatusCode.Created);
        res.Username.Should().Be(request.Username);

        // Verify database
        var dbUser = await App.Services.GetRequiredService<IUserService>()
            .GetByIdAsync(res.Id, TestContext.Current.CancellationToken);
        dbUser.Should().NotBeNull();
    }

    [Fact]
    public async Task Create_With_Duplicate_Email_Returns_BadRequest()
    {
        await SetAuthTokenAsync();
        var existingUser = await CreateTestUser();

        var request = new Faker<UserCreateRequest>()
            .RuleFor(u => u.Email, existingUser.Email) // Duplicate
            .Generate();

        var (rsp, _) = await App.Client.POSTAsync<UserCreateEndpoint, UserCreateRequest, ProblemDetails>(request);

        rsp.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}
```
