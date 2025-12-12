namespace Backend.Tests.Features.Identity.Endpoints.Roles;

using Backend.Features.Identity.Endpoints.Roles;

public class RoleGetTests(App app) : AppTestsBase(app)
{
    [Fact]
    public async Task Get_Role()
    {
        await SetAuthTokenAsync();

        var faker = new Faker<RoleCreateRequest>()
            .RuleFor(u => u.Name, f => f.Internet.UserName() + f.UniqueIndex)
            .RuleFor(u => u.Description, f => f.Lorem.Sentence());
        var request = faker.Generate();
        var (createRsp, createRes) = await App.Client.POSTAsync<RoleCreateEndpoint, RoleCreateRequest, RoleCreateResponse>(request);

        createRsp.StatusCode.Should().Be(HttpStatusCode.OK);

        var (getRsp, getRes) = await App.Client.GETAsync<RoleGetEndpoint, RoleGetRequest, RoleGetResponse>(
            new()
            {
                Id = createRes.Id
            });

        getRsp.StatusCode.Should().Be(HttpStatusCode.OK);
        getRes.Name.Should().Be(request.Name);
        getRes.Description.Should().Be(request.Description);
    }

    [Fact]
    public async Task Get_NonExistent_Role()
    {
        await SetAuthTokenAsync();

        var (getRsp, _) = await App.Client.GETAsync<RoleGetEndpoint, RoleGetRequest, RoleGetResponse>(
            new()
            {
                Id = Guid.NewGuid()
            });

        getRsp.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}