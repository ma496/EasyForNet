namespace Backend.Tests.Features.Identity.Endpoints.Roles;

using Backend.Features.Identity.Endpoints.Roles;

/// <summary>
/// Tests for the <see cref="RoleCreateEndpoint"/> covering validation and successful role creation.
/// </summary>
public class RoleCreateTests(App app) : AppTestsBase(app)
{
    /// <summary>
    /// Verifies that invalid input (empty name, description exceeding max length) returns a 400 Bad Request with appropriate validation errors.
    /// </summary>
    [Fact]
    public async Task Invalid_Input()
    {
        await SetAuthTokenAsync();

        RoleCreateRequest request = new()
        {
            Name = "",
            Description = new string('x', 1025),
        };
        var (rsp, res) = await App.Client.POSTAsync<RoleCreateEndpoint, RoleCreateRequest, ProblemDetails>(request);

        rsp.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        res.Errors.Count().Should().Be(2);
        res.Errors.Select(e => e.Name).Should().Equal("name", "description");
    }

    /// <summary>
    /// Verifies that a valid role creation request returns 200 OK with the correct name and description.
    /// </summary>
    [Fact]
    public async Task Valid_Input()
    {
        await SetAuthTokenAsync();

        var faker = new Faker<RoleCreateRequest>()
            .RuleFor(u => u.Name, f => f.Internet.UserName() + f.UniqueIndex)
            .RuleFor(u => u.Description, f => f.Lorem.Sentence());
        var request = faker.Generate();
        var (rsp, res) = await App.Client.POSTAsync<RoleCreateEndpoint, RoleCreateRequest, RoleCreateResponse>(request);

        rsp.StatusCode.Should().Be(HttpStatusCode.OK);
        res.Name.Should().Be(request.Name);
        res.Description.Should().Be(request.Description);
    }
}
