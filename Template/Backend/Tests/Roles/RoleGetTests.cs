using Backend.Features.Roles;
using Backend.Services.Identity;
using Microsoft.EntityFrameworkCore;

namespace Tests.Roles;

public class RoleGetTests : AppTestsBase
{
    public RoleGetTests(App app) : base(app)
    {
        SetAuthToken().Wait();
    }

    [Fact]
    public async Task Get_Role()
    {
        var permissionService = App.Services.GetRequiredService<IPermissionService>();
        var permissions = await permissionService.Permissions().Take(2).Select(x => x.Id).ToListAsync();

        RoleCreateRequest request = new()
        {
            Name = "GetRole",
            Description = "Get Role Description",
            Permissions = permissions
        };
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
        getRes.Permissions.Should().BeEquivalentTo(request.Permissions);
    }

    [Fact]
    public async Task Get_NonExistent_Role()
    {
        var (getRsp, _) = await App.Client.GETAsync<RoleGetEndpoint, RoleGetRequest, RoleGetResponse>(
            new()
            {
                Id = Guid.NewGuid()
            });

        getRsp.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}