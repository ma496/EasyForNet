namespace Backend.Tests.Features.Notifications.Endpoints.Notifications;

using Backend.Features.Notifications.Endpoints.Notifications;

/// <summary>
/// Tests for the <see cref="NotificationGetUnreadCountEndpoint"/> covering unread notification counting.
/// </summary>
public class NotificationGetUnreadCountTests(App app) : NotificationsTestsBase(app)
{
    /// <summary>
    /// Verifies that unread user notifications are counted correctly.
    /// </summary>
    [Fact]
    public async Task GetUnreadCount_WithUnreadUserNotifications()
    {
        await SetAuthTokenAsync();

        var userId = TestUsers.AdminUserId;
        await CreateUserNotificationAsync(userId);
        await CreateUserNotificationAsync(userId);

        var (rsp, res) = await App.Client.GETAsync<NotificationGetUnreadCountEndpoint, NotificationGetUnreadCountResponse>();

        rsp.StatusCode.Should().Be(HttpStatusCode.OK);
        res.Count.Should().BeGreaterThanOrEqualTo(2);
    }

    /// <summary>
    /// Verifies that unread global notifications are counted correctly.
    /// </summary>
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

    /// <summary>
    /// Verifies that unauthenticated requests return 401 Unauthorized.
    /// </summary>
    [Fact]
    public async Task GetUnreadCount_Unauthenticated()
    {
        ClearAuthToken();

        var (rsp, _) = await App.Client.GETAsync<NotificationGetUnreadCountEndpoint, NotificationGetUnreadCountResponse>();

        rsp.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
}
