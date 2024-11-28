using Backend.Features.Roles;
using Backend.Services.Identity;
using Microsoft.EntityFrameworkCore;

namespace Tests.Roles;

public class RoleCreateTests : AppTestsBase
{
    public RoleCreateTests(App app) : base(app)
    {
        SetAuthToken().Wait();
    }

    [Fact]
    public async Task Invalid_Input()
    {
        RoleCreateRequest request = new()
        {
            Name = "",
            Description = new string('x', 1025),
            Permissions = []
        };
        var (rsp, res) = await App.Client.POSTAsync<RoleCreateEndpoint, RoleCreateRequest, ProblemDetails>(request);

        rsp.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        res.Errors.Count().Should().Be(2);
        res.Errors.Select(e => e.Name).Should().Equal("name", "description");
    }

    [Fact]
    public async Task Valid_Input()
    {
        var permissionService = App.Services.GetRequiredService<IPermissionService>();
        var permissions = await permissionService.Permissions().Take(2).Select(x => x.Id).ToListAsync();

        RoleCreateRequest request = new()
        {
            Name = "TestRole",
            Description = "Test Role Description",
            Permissions = permissions
        };
        var (rsp, res) = await App.Client.POSTAsync<RoleCreateEndpoint, RoleCreateRequest, RoleCreateResponse>(request);

        rsp.StatusCode.Should().Be(HttpStatusCode.OK);
        res.Name.Should().Be(request.Name);
        res.Description.Should().Be(request.Description);
        res.Permissions.Should().Equal(request.Permissions);
    }
}