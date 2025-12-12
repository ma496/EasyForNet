namespace Backend.Tests.Features.Identity.Endpoints.Roles;

using Backend.Features.Identity.Core;
using Backend.Features.Identity.Endpoints.Roles;

public class RoleUpdateTests(App app) : AppTestsBase(app)
{
    [Fact]
    public async Task Update_Role()
    {
        await SetAuthTokenAsync();

        var faker = new Faker<RoleCreateRequest>()
            .RuleFor(u => u.Name, f => f.Internet.UserName() + f.UniqueIndex)
            .RuleFor(u => u.Description, f => f.Lorem.Sentence());
        var request = faker.Generate();
        var (createRsp, createRes) = await App.Client.POSTAsync<RoleCreateEndpoint, RoleCreateRequest, RoleCreateResponse>(request);

        createRsp.StatusCode.Should().Be(HttpStatusCode.OK);

        var updateFaker = new Faker<RoleUpdateRequest>()
            .RuleFor(x => x.Id, f => createRes.Id)
            .RuleFor(x => x.Name, f => f.Internet.UserName() + f.UniqueIndex)
            .RuleFor(x => x.Description, f => f.Lorem.Sentence());
        var updateRequest = updateFaker.Generate();
        var (updateRsp, updateRes) = await App.Client.PUTAsync<RoleUpdateEndpoint, RoleUpdateRequest, RoleUpdateResponse>(updateRequest);

        updateRsp.StatusCode.Should().Be(HttpStatusCode.OK);
        updateRes.Name.Should().Be(updateRequest.Name);
        updateRes.Description.Should().Be(updateRequest.Description);
    }

    [Fact]
    public async Task Update_NonExistent_Role()
    {
        await SetAuthTokenAsync();

        var faker = new Faker<RoleUpdateRequest>()
            .RuleFor(u => u.Id, f => Guid.NewGuid())
            .RuleFor(u => u.Name, f => f.Internet.UserName() + f.UniqueIndex)
            .RuleFor(u => u.Description, f => f.Lorem.Sentence());
        var request = faker.Generate();
        var (updateRsp, _) = await App.Client.PUTAsync<RoleUpdateEndpoint, RoleUpdateRequest, RoleUpdateResponse>(request);

        updateRsp.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task Update_Admin_Role_Should_Fail()
    {
        await SetAuthTokenAsync();

        // Get the default role ID - assuming you have a way to identify it
        var defaultRole = await App.Services.GetRequiredService<IRoleService>()
            .Roles()
            .FirstAsync(r => r.Name == "Admin", cancellationToken: TestContext.Current.CancellationToken);

        var faker = new Faker<RoleUpdateRequest>()
            .RuleFor(u => u.Id, f => defaultRole.Id)
            .RuleFor(u => u.Name, f => f.Internet.UserName() + f.UniqueIndex)
            .RuleFor(u => u.Description, f => f.Lorem.Sentence());
        var request = faker.Generate();
        var (updateRsp, res) = await App.Client.PUTAsync<RoleUpdateEndpoint, RoleUpdateRequest, ProblemDetails>(request);

        updateRsp.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        res.Errors.Should().ContainSingle();
        res.Errors.First().Code.Should().Be(ErrorCodes.DefaultRoleCannotBeUpdated);
    }
}