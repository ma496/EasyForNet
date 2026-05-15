namespace Backend.Tests.Features.Notifications.Endpoints.Notifications;

using Backend.Features.Notifications.Endpoints.Notifications;

public class NotificationDeleteTests(App app) : NotificationsTestsBase(app)
{
    [Fact]
    public async Task Delete_UserNotification()
    {
        await SetAuthTokenAsync();

        var userId = TestUsers.AdminUserId;
        var notification = await CreateUserNotificationAsync(userId);

        var (rsp, res) = await App.Client.DELETEAsync<NotificationDeleteEndpoint, NotificationDeleteRequest, NotificationDeleteResponse>(
            new() { Id = notification.Id });

        rsp.StatusCode.Should().Be(HttpStatusCode.OK);
        res.Success.Should().BeTrue();
        res.Id.Should().Be(notification.Id);

        DbContext.ChangeTracker.Clear();
        var deleted = await DbContext.Notifications.FirstOrDefaultAsync(x => x.Id == notification.Id, cancellationToken: TestContext.Current.CancellationToken);
        deleted.Should().BeNull();
    }

    [Fact]
    public async Task Delete_OtherUserNotification_Should_NotFound()
    {
        await SetAuthTokenAsync();

        var otherUserNotification = await CreateUserNotificationAsync(TestUsers.TestUserId);

        var (rsp, _) = await App.Client.DELETEAsync<NotificationDeleteEndpoint, NotificationDeleteRequest, NotificationDeleteResponse>(
            new() { Id = otherUserNotification.Id });

        rsp.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task Delete_NonExistent_Notification()
    {
        await SetAuthTokenAsync();

        var (rsp, _) = await App.Client.DELETEAsync<NotificationDeleteEndpoint, NotificationDeleteRequest, NotificationDeleteResponse>(
            new() { Id = Guid.NewGuid() });

        rsp.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task Delete_GlobalNotification_Should_NotAllowed()
    {
        await SetAuthTokenAsync();

        var globalNotification = await CreateGlobalNotificationAsync();

        var (rsp, _) = await App.Client.DELETEAsync<NotificationDeleteEndpoint, NotificationDeleteRequest, NotificationDeleteResponse>(
            new() { Id = globalNotification.Id });

        rsp.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task Delete_Unauthenticated()
    {
        ClearAuthToken();
        
        var (rsp, _) = await App.Client.DELETEAsync<NotificationDeleteEndpoint, NotificationDeleteRequest, NotificationDeleteResponse>(
            new() { Id = Guid.NewGuid() });

        rsp.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
}
