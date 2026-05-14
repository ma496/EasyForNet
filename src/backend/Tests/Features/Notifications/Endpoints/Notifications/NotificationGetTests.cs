namespace Backend.Tests.Features.Notifications.Endpoints.Notifications;

using Backend.Features.Notifications.Endpoints.Notifications;

public class NotificationGetTests(App app) : NotificationsTestsBase(app)
{
    [Fact]
    public async Task Get_UserNotification()
    {
        await SetAuthTokenAsync();

        var userId = await GetCurrentUserIdAsync();
        var notification = await CreateUserNotificationAsync(userId);

        var (rsp, res) = await App.Client.GETAsync<NotificationGetEndpoint, NotificationGetRequest, NotificationGetResponse>(
            new() { Id = notification.Id });

        rsp.StatusCode.Should().Be(HttpStatusCode.OK);
        res.Id.Should().Be(notification.Id);
        res.TitleKey.Should().Be(notification.TitleKey);
        res.MessageKey.Should().Be(notification.MessageKey);
    }

    [Fact]
    public async Task Get_GlobalNotification()
    {
        await SetAuthTokenAsync();

        var notification = await CreateGlobalNotificationAsync();

        var (rsp, res) = await App.Client.GETAsync<NotificationGetEndpoint, NotificationGetRequest, NotificationGetResponse>(
            new() { Id = notification.Id });

        rsp.StatusCode.Should().Be(HttpStatusCode.OK);
        res.Id.Should().Be(notification.Id);
        res.UserId.Should().BeNull();
    }

    [Fact]
    public async Task Get_NonExistent_Notification()
    {
        await SetAuthTokenAsync();

        var (rsp, _) = await App.Client.GETAsync<NotificationGetEndpoint, NotificationGetRequest, NotificationGetResponse>(
            new() { Id = Guid.NewGuid() });

        rsp.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task Get_OtherUserNotification_Should_NotFound()
    {
        await SetAuthTokenAsync();

        var otherUserNotification = await CreateUserNotificationAsync(TestUsers.TestUserId);

        var (rsp, _) = await App.Client.GETAsync<NotificationGetEndpoint, NotificationGetRequest, NotificationGetResponse>(
            new() { Id = otherUserNotification.Id });

        rsp.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task Get_GlobalNotification_Unvisited()
    {
        await SetAuthTokenAsync();

        var notification = await CreateGlobalNotificationAsync();

        var (rsp, res) = await App.Client.GETAsync<NotificationGetEndpoint, NotificationGetRequest, NotificationGetResponse>(
            new() { Id = notification.Id });

        rsp.StatusCode.Should().Be(HttpStatusCode.OK);
        res.IsRead.Should().BeFalse();
    }

    [Fact]
    public async Task Get_GlobalNotification_Visited()
    {
        await SetAuthTokenAsync();

        var userId = await GetCurrentUserIdAsync();
        var notification = await CreateGlobalNotificationAsync();
        await MarkNotificationVisitedAsync(notification.Id, userId);

        var (rsp, res) = await App.Client.GETAsync<NotificationGetEndpoint, NotificationGetRequest, NotificationGetResponse>(
            new() { Id = notification.Id });

        rsp.StatusCode.Should().Be(HttpStatusCode.OK);
        res.IsRead.Should().BeTrue();
    }

    [Fact]
    public async Task Get_Unauthenticated()
    {
        ClearAuthToken();

        var (rsp, _) = await App.Client.GETAsync<NotificationGetEndpoint, NotificationGetRequest, NotificationGetResponse>(
            new() { Id = Guid.NewGuid() });

        rsp.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
}
