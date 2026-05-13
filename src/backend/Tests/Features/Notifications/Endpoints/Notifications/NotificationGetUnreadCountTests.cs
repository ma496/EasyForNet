namespace Backend.Tests.Features.Notifications.Endpoints.Notifications;

using Backend.Features.Notifications.Endpoints.Notifications;

public class NotificationGetUnreadCountTests(App app) : NotificationsTestsBase(app)
{

    [Fact]
    public async Task GetUnreadCount_WithUnreadUserNotifications()
    {
        await SetAuthTokenAsync();

        var userId = await GetCurrentUserIdAsync();
        await CreateUserNotificationAsync(userId);
        await CreateUserNotificationAsync(userId);

        var (rsp, res) = await App.Client.GETAsync<NotificationGetUnreadCountEndpoint, NotificationGetUnreadCountResponse>();

        rsp.StatusCode.Should().Be(HttpStatusCode.OK);
        res.Count.Should().BeGreaterThanOrEqualTo(2);
    }

    [Fact]
    public async Task GetUnreadCount_WithGlobalUnreadNotifications()
    {
        await SetAuthTokenAsync();

        await CreateGlobalNotificationAsync();
        await CreateGlobalNotificationAsync();

        var (rsp, res) = await App.Client.GETAsync<NotificationGetUnreadCountEndpoint, NotificationGetUnreadCountResponse>();

        rsp.StatusCode.Should().Be(HttpStatusCode.OK);
        res.Count.Should().BeGreaterThanOrEqualTo(2);
    }

    [Fact]
    public async Task GetUnreadCount_Unauthenticated()
    {
        ClearAuthToken();

        var (rsp, res) = await App.Client.GETAsync<NotificationGetUnreadCountEndpoint, NotificationGetUnreadCountResponse>();

        rsp.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
}
