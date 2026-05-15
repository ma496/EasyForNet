namespace Backend.Tests.Features.Notifications.Endpoints.Notifications;

using Backend.Features.Notifications.Endpoints.Notifications;

public class NotificationListTests(App app) : NotificationsTestsBase(app)
{
    [Fact]
    public async Task List_Notifications_WithUserNotifications()
    {
        await SetAuthTokenAsync();

        var userId = TestUsers.AdminUserId;
        var notification = await CreateUserNotificationAsync(userId);

        var (rsp, res) = await App.Client.GETAsync<NotificationListEndpoint, NotificationListRequest, NotificationListResponse>(
            new()
            {
                Page = 1,
                PageSize = 10000
            });

        rsp.StatusCode.Should().Be(HttpStatusCode.OK);
        res.Items.Should().Contain(x => x.Id == notification.Id);
        res.Items.Should().Contain(x => x.TitleKey == notification.TitleKey);
        res.Items.Should().Contain(x => x.MessageKey == notification.MessageKey);
    }

    [Fact]
    public async Task List_Notifications_WithGlobalNotifications()
    {
        await SetAuthTokenAsync();

        var notification = await CreateGlobalNotificationAsync();

        var (rsp, res) = await App.Client.GETAsync<NotificationListEndpoint, NotificationListRequest, NotificationListResponse>(
            new()
            {
                Page = 1,
                PageSize = 10
            });

        rsp.StatusCode.Should().Be(HttpStatusCode.OK);
        res.Items.Should().Contain(x => x.Id == notification.Id);
        var item = res.Items.First(x => x.Id == notification.Id);
        item.UserId.Should().BeNull();
        item.TitleKey.Should().Be(notification.TitleKey);
        item.MessageKey.Should().Be(notification.MessageKey);
        item.IsRead.Should().BeFalse();
        item.Group.Should().Be(notification.Group);
        item.Type.Should().Be(notification.Type);
    }

    [Fact]
    public async Task List_Notifications_Pagination()
    {
        await SetAuthTokenAsync();

        var userId = TestUsers.AdminUserId;
        for (int i = 0; i < 5; i++)
        {
            await CreateUserNotificationAsync(userId);
        }

        var (rsp, res) = await App.Client.GETAsync<NotificationListEndpoint, NotificationListRequest, NotificationListResponse>(
            new()
            {
                Page = 1,
                PageSize = 2
            });

        rsp.StatusCode.Should().Be(HttpStatusCode.OK);
        res.Items.Count.Should().Be(2);

        var (page2Rsp, page2Res) = await App.Client.GETAsync<NotificationListEndpoint, NotificationListRequest, NotificationListResponse>(
            new()
            {
                Page = 2,
                PageSize = 2
            });

        page2Rsp.StatusCode.Should().Be(HttpStatusCode.OK);
        page2Res.Items.Count.Should().Be(2);
    }

    [Fact]
    public async Task List_Notifications_FilterByIsRead()
    {
        await SetAuthTokenAsync();

        var userId = TestUsers.AdminUserId;
        var unread = await CreateUserNotificationAsync(userId);
        unread.IsRead = false;
        await DbContext.SaveChangesAsync(TestContext.Current.CancellationToken);

        var readNotification = await CreateUserNotificationAsync(userId);
        readNotification.IsRead = true;
        await DbContext.SaveChangesAsync(TestContext.Current.CancellationToken);

        var (unreadRsp, unreadRes) = await App.Client.GETAsync<NotificationListEndpoint, NotificationListRequest, NotificationListResponse>(
            new()
            {
                Page = 1,
                PageSize = 10,
                IsRead = false
            });

        unreadRsp.StatusCode.Should().Be(HttpStatusCode.OK);
        unreadRes.Items.Should().AllSatisfy(x => x.IsRead.Should().BeFalse());

        var (readRsp, readRes) = await App.Client.GETAsync<NotificationListEndpoint, NotificationListRequest, NotificationListResponse>(
            new()
            {
                Page = 1,
                PageSize = 10,
                IsRead = true
            });

        readRsp.StatusCode.Should().Be(HttpStatusCode.OK);
        readRes.Items.Should().AllSatisfy(x => x.IsRead.Should().BeTrue());
    }

    [Fact]
    public async Task List_Notifications_FilterByGroup()
    {
        await SetAuthTokenAsync();

        var userId = TestUsers.AdminUserId;
        var groupName = "test-group";

        var grouped = await CreateUserNotificationAsync(userId);
        grouped.Group = groupName;
        await DbContext.SaveChangesAsync(TestContext.Current.CancellationToken);

        await CreateUserNotificationAsync(userId);

        var (rsp, res) = await App.Client.GETAsync<NotificationListEndpoint, NotificationListRequest, NotificationListResponse>(
            new()
            {
                Page = 1,
                PageSize = 10,
                Group = groupName
            });

        rsp.StatusCode.Should().Be(HttpStatusCode.OK);
        res.Items.Should().AllSatisfy(x => x.Group.Should().Be(groupName));
    }

    [Fact]
    public async Task List_Notifications_Unauthenticated()
    {
        ClearAuthToken();

        var (rsp, _) = await App.Client.GETAsync<NotificationListEndpoint, NotificationListRequest, NotificationListResponse>(
            new()
            {
                Page = 1,
                PageSize = 10
            });

        rsp.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
}
