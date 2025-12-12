namespace Backend.Tests.Features.Identity.Endpoints.Roles;

using Backend.Features.Identity.Core;
using Backend.Features.Identity.Endpoints.Roles;

public class RoleDeleteTests(App app) : AppTestsBase(app)
{
    [Fact]
    public async Task Delete_Role()
    {
        await SetAuthTokenAsync();

        // First create a role
        var faker = new Faker<RoleCreateRequest>()
            .RuleFor(u => u.Name, f => f.Internet.UserName() + f.UniqueIndex)
            .RuleFor(u => u.Description, f => f.Lorem.Sentence());
        var request = faker.Generate();
        var (createRsp, createRes) = await App.Client.POSTAsync<RoleCreateEndpoint, RoleCreateRequest, RoleCreateResponse>(request);

        createRsp.StatusCode.Should().Be(HttpStatusCode.OK);

        // Then delete the role
        var (deleteRsp, deleteRes) = await App.Client.DELETEAsync<RoleDeleteEndpoint, RoleDeleteRequest, RoleDeleteResponse>(
            new()
            {
                Id = createRes.Id
            });

        deleteRsp.StatusCode.Should().Be(HttpStatusCode.OK);
        deleteRes.Success.Should().BeTrue();

        // Verify the role is deleted by trying to get it
        var (getRsp, _) = await App.Client.GETAsync<RoleGetEndpoint, RoleGetRequest, RoleGetResponse>(
            new()
            {
                Id = createRes.Id
            });

        getRsp.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task Delete_NonExistent_Role()
    {
        await SetAuthTokenAsync();

        var (deleteRsp, _) = await App.Client.DELETEAsync<RoleDeleteEndpoint, RoleDeleteRequest, RoleDeleteResponse>(
            new()
            {
                Id = Guid.NewGuid()
            });

        deleteRsp.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task Cannot_Delete_Admin_Role()
    {
        await SetAuthTokenAsync();

        // Get a default role (Test role from seeder)
        var roleService = App.Services.GetRequiredService<IRoleService>();
        var defaultRole = await roleService.GetByNameAsync("Admin");
        defaultRole.Should().NotBeNull();

        // Try to delete the default role
        var (deleteRsp, res) = await App.Client.DELETEAsync<RoleDeleteEndpoint, RoleDeleteRequest, ProblemDetails>(
            new()
            {
                Id = defaultRole!.Id
            });

        deleteRsp.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        res.Errors.Should().ContainSingle();
        res.Errors.First().Code.Should().Be(ErrorCodes.DefaultRoleCannotBeDeleted);
    }
}