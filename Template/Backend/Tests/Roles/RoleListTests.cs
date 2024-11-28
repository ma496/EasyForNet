using Backend.Features.Roles;
using Backend.Services.Identity;
using Microsoft.EntityFrameworkCore;

namespace Tests.Roles;

public class RoleListTests : AppTestsBase
{
    public RoleListTests(App app) : base(app)
    {
        SetAuthToken().Wait();
    }

    [Fact]
    public async Task List_Roles()
    {
        var permissionService = App.Services.GetRequiredService<IPermissionService>();
        var permissions = await permissionService.Permissions().Take(2).Select(x => x.Id).ToListAsync();

        // Create multiple roles
        for (int i = 0; i < 3; i++)
        {
            await App.Client.POSTAsync<RoleCreateEndpoint, RoleCreateRequest, RoleCreateResponse>(
                new()
                {
                    Name = $"ListRole{i}",
                    Description = $"List Role {i} Description",
                    Permissions = permissions
                });
        }

        // Get list of roles
        var (listRsp, listRes) = await App.Client.GETAsync<RoleListEndpoint, RoleListRequest, List<RoleListResponse>>(
            new()
            {
                Page = 1,
                PageSize = 10
            });

        listRsp.StatusCode.Should().Be(HttpStatusCode.OK);
        listRes.Should().NotBeEmpty();
        listRes.Count.Should().BeGreaterThanOrEqualTo(3);
    }

    [Fact]
    public async Task List_Roles_Pagination()
    {
        var permissionService = App.Services.GetRequiredService<IPermissionService>();
        var permissions = await permissionService.Permissions().Take(2).Select(x => x.Id).ToListAsync();

        // Create multiple roles
        for (int i = 0; i < 5; i++)
        {
            await App.Client.POSTAsync<RoleCreateEndpoint, RoleCreateRequest, RoleCreateResponse>(
                new()
                {
                    Name = $"PageRole{i}",
                    Description = $"Page Role {i} Description",
                    Permissions = permissions
                });
        }

        // Get first page with 2 roles
        var (page1Rsp, page1Res) = await App.Client.GETAsync<RoleListEndpoint, RoleListRequest, List<RoleListResponse>>(
            new()
            {
                Page = 1,
                PageSize = 2
            });

        page1Rsp.StatusCode.Should().Be(HttpStatusCode.OK);
        page1Res.Count.Should().Be(2);

        // Get second page
        var (page2Rsp, page2Res) = await App.Client.GETAsync<RoleListEndpoint, RoleListRequest, List<RoleListResponse>>(
            new()
            {
                Page = 2,
                PageSize = 2
            });

        page2Rsp.StatusCode.Should().Be(HttpStatusCode.OK);
        page2Res.Count.Should().Be(2);
        page2Res.Should().NotBeEquivalentTo(page1Res);
    }
}