using Backend;
using Backend.Features.Roles;
using Backend.Services.Identity;
using Microsoft.EntityFrameworkCore;

namespace Tests.Features.Roles;

public class RoleUpdateTests : AppTestsBase
{
    public RoleUpdateTests(App app) : base(app)
    {
        SetAuthToken().Wait();
    }

    [Fact]
    public async Task Update_Role()
    {
        RoleCreateRequest request = new()
        {
            Name = $"UpdateRole{Helper.UniqueNumber()}",
            Description = "Update Role Description",
        };
        var (createRsp, createRes) = await App.Client.POSTAsync<RoleCreateEndpoint, RoleCreateRequest, RoleCreateResponse>(request);

        createRsp.StatusCode.Should().Be(HttpStatusCode.OK);

        RoleUpdateRequest updateRequest = new()
        {
            Id = createRes.Id,
            Name = $"UpdateRole_Modified{Helper.UniqueNumber()}",
            Description = "Update Role Description Modified",
        };
        var (updateRsp, updateRes) = await App.Client.PUTAsync<RoleUpdateEndpoint, RoleUpdateRequest, RoleUpdateResponse>(updateRequest);

        updateRsp.StatusCode.Should().Be(HttpStatusCode.OK);
        updateRes.Name.Should().Be(updateRequest.Name);
        updateRes.Description.Should().Be(updateRequest.Description);
    }

    [Fact]
    public async Task Update_NonExistent_Role()
    {
        var (updateRsp, _) = await App.Client.PUTAsync<RoleUpdateEndpoint, RoleUpdateRequest, RoleUpdateResponse>(
            new()
            {
                Id = Guid.NewGuid(),
                Name = $"NonExistent{Helper.UniqueNumber()}",
                Description = "Non Existent Role",
            });

        updateRsp.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task Update_Admin_Role_Should_Fail()
    {
        // Get the default role ID - assuming you have a way to identify it
        var defaultRole = await App.Services.GetRequiredService<IRoleService>()
            .Roles()
            .FirstAsync(r => r.Name == "Admin");

        var (updateRsp, res) = await App.Client.PUTAsync<RoleUpdateEndpoint, RoleUpdateRequest, ProblemDetails>(
            new()
            {
                Id = defaultRole.Id,
                Name = $"Modified Default Role{Helper.UniqueNumber()}",
                Description = "Attempt to modify default role",
            });

        updateRsp.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        res.Errors.Should().ContainSingle();
        res.Errors.First().Reason.Should().Be("default_role_cannot_be_updated");
    }
}