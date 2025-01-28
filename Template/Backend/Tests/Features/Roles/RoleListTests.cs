using Backend;
using Backend.Features.Roles;

namespace Tests.Features.Roles;

public class RoleListTests : AppTestsBase
{
    public RoleListTests(App app) : base(app)
    {
        SetAuthToken().Wait();
    }

    [Fact]
    public async Task List_Roles()
    {
        // Create multiple roles
        for (int i = 0; i < 3; i++)
        {
            await App.Client.POSTAsync<RoleCreateEndpoint, RoleCreateRequest, RoleCreateResponse>(
                new()
                {
                    Name = $"ListRole{Helper.UniqueNumber()}",
                    Description = $"List Role {i} Description",
                });
        }

        // Get list of roles
        var (listRsp, listRes) = await App.Client.GETAsync<RoleListEndpoint, RoleListRequest, RoleListResponse>(
            new()
            {
                Page = 1,
                PageSize = 10
            });

        listRsp.StatusCode.Should().Be(HttpStatusCode.OK);
        listRes.Items.Should().NotBeEmpty();
        listRes.Items.Count.Should().BeGreaterThanOrEqualTo(3);
    }

    [Fact]
    public async Task List_Roles_Pagination()
    {
        // Create multiple roles
        for (int i = 0; i < 5; i++)
        {
            await App.Client.POSTAsync<RoleCreateEndpoint, RoleCreateRequest, RoleCreateResponse>(
                new()
                {
                    Name = $"PageRole{Helper.UniqueNumber()}",
                    Description = $"Page Role {i} Description",
                });
        }

        // Get first page with 2 roles
        var (page1Rsp, page1Res) = await App.Client.GETAsync<RoleListEndpoint, RoleListRequest, RoleListResponse>(
            new()
            {
                Page = 1,
                PageSize = 2
            });

        page1Rsp.StatusCode.Should().Be(HttpStatusCode.OK);
        page1Res.Items.Count.Should().Be(2);

        // Get second page
        var (page2Rsp, page2Res) = await App.Client.GETAsync<RoleListEndpoint, RoleListRequest, RoleListResponse>(
            new()
            {
                Page = 2,
                PageSize = 2
            });

        page2Rsp.StatusCode.Should().Be(HttpStatusCode.OK);
        page2Res.Items.Count.Should().Be(2);
        page2Res.Should().NotBeEquivalentTo(page1Res);
    }
}
