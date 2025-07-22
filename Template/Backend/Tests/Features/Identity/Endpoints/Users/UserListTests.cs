using Backend;
using Backend.Features.Identity.Endpoints.Users;

namespace Tests.Features.Identity.Endpoints.Users;

public class UserListTests : AppTestsBase
{
    public UserListTests(App app) : base(app)
    {
        SetAuthToken().Wait();
    }

    [Fact]
    public async Task List_Users()
    {
        // Create multiple users
        for (int i = 0; i < 3; i++)
        {
            await App.Client.POSTAsync<UserCreateEndpoint, UserCreateRequest, UserCreateResponse>(
                new()
                {
                    Username = $"listuser{Helper.UniqueNumber()}",
                    Email = $"list{Helper.UniqueNumber()}@example.com",
                    Password = "Password123!",
                    FirstName = $"List{i}",
                    LastName = "User",
                    IsActive = true
                });
        }

        // Get list of users
        var (listRsp, listRes) = await App.Client.GETAsync<UserListEndpoint, UserListRequest, UserListResponse>(
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
    public async Task List_Users_Pagination()
    {
        // Create multiple users
        for (int i = 0; i < 5; i++)
        {
            await App.Client.POSTAsync<UserCreateEndpoint, UserCreateRequest, UserCreateResponse>(
                new()
                {
                    Username = $"pageuser{Helper.UniqueNumber()}",
                    Email = $"page{Helper.UniqueNumber()}@example.com",
                    Password = "Password123!",
                    FirstName = $"Page{i}",
                    LastName = "User",
                    IsActive = true
                });
        }

        // Get first page with 2 users
        var (page1Rsp, page1Res) = await App.Client.GETAsync<UserListEndpoint, UserListRequest, UserListResponse>(
            new()
            {
                Page = 1,
                PageSize = 2
            });

        page1Rsp.StatusCode.Should().Be(HttpStatusCode.OK);
        page1Res.Items.Count.Should().Be(2);

        // Get second page
        var (page2Rsp, page2Res) = await App.Client.GETAsync<UserListEndpoint, UserListRequest, UserListResponse>(
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