namespace Backend.Tests.Features.Notifications.Endpoints.Notifications;

using Backend.Features.Identity.Core.Entities;
using Backend.Features.Notifications.Endpoints.Notifications;

public class NotificationMarkAsUnreadTests(App app) : NotificationsTestsBase(app)
{
    [Fact]
    public async Task MarkAsUnread_UserNotification()
    {
        await SetAuthTokenAsync();

        var userId = TestUsers.AdminUserId;
        var notification = await CreateUserNotificationAsync(userId);
        notification.IsRead = true;
        await DbContext.SaveChangesAsync(TestContext.Current.CancellationToken);

        var (rsp, res) = await App.Client.POSTAsync<NotificationMarkAsUnreadEndpoint, NotificationMarkAsUnreadRequest, NotificationMarkAsUnreadResponse>(
            new() { Id = notification.Id });

        rsp.StatusCode.Should().Be(HttpStatusCode.OK);
        res.Success.Should().BeTrue();
        res.Id.Should().Be(notification.Id);

        DbContext.ChangeTracker.Clear();
        var updated = await DbContext.Notifications.FirstOrDefaultAsync(x => x.Id == notification.Id, cancellationToken: TestContext.Current.CancellationToken);
        updated!.IsRead.Should().BeFalse();
    }

    [Fact]
    public async Task MarkAsUnread_GlobalNotification()
    {
        await SetAuthTokenAsync();

        var userId = TestUsers.AdminUserId;
        var notification = await CreateGlobalNotificationAsync();
        await MarkNotificationVisitedAsync(notification.Id, userId);

        var (rsp, res) = await App.Client.POSTAsync<NotificationMarkAsUnreadEndpoint, NotificationMarkAsUnreadRequest, NotificationMarkAsUnreadResponse>(
            new() { Id = notification.Id });

        rsp.StatusCode.Should().Be(HttpStatusCode.OK);
        res.Success.Should().BeTrue();

        DbContext.ChangeTracker.Clear();
        var isVisited = await DbContext.NotificationVisits.AnyAsync(x => x.NotificationId == notification.Id && x.UserId == userId, cancellationToken: TestContext.Current.CancellationToken);
        isVisited.Should().BeFalse();
    }

    [Fact]
    public async Task MarkAsUnread_AlreadyUnread_UserNotification()
    {
        await SetAuthTokenAsync();

        var userId = TestUsers.AdminUserId;
        var notification = await CreateUserNotificationAsync(userId);
        notification.IsRead = false;
        await DbContext.SaveChangesAsync(TestContext.Current.CancellationToken);

        var (rsp, res) = await App.Client.POSTAsync<NotificationMarkAsUnreadEndpoint, NotificationMarkAsUnreadRequest, NotificationMarkAsUnreadResponse>(
            new() { Id = notification.Id });

        rsp.StatusCode.Should().Be(HttpStatusCode.OK);
        res.Success.Should().BeTrue();
    }

    [Fact]
    public async Task MarkAsUnread_OtherUserNotification_Should_NotFound()
    {
        await SetAuthTokenAsync();

        var faker = new Faker<User>()
            .RuleFor(u => u.Username, f => f.Internet.UserName() + f.UniqueIndex);
        var newUser = await CreateAdminUserAsync($"testuser-{faker.Generate().Username}", TestUsers.DefaultPassword);
        var otherUserNotification = await CreateUserNotificationAsync(newUser.Id);

        var (rsp, _) = await App.Client.POSTAsync<NotificationMarkAsUnreadEndpoint, NotificationMarkAsUnreadRequest, NotificationMarkAsUnreadResponse>(
            new() { Id = otherUserNotification.Id });

        rsp.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task MarkAsUnread_NonExistent_Notification()
    {
        await SetAuthTokenAsync();

        var (rsp, _) = await App.Client.POSTAsync<NotificationMarkAsUnreadEndpoint, NotificationMarkAsUnreadRequest, NotificationMarkAsUnreadResponse>(
            new() { Id = Guid.NewGuid() });

        rsp.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task MarkAsUnread_Unauthenticated()
    {
        ClearAuthToken();

        var (rsp, _) = await App.Client.POSTAsync<NotificationMarkAsUnreadEndpoint, NotificationMarkAsUnreadRequest, NotificationMarkAsUnreadResponse>(
            new() { Id = Guid.NewGuid() });

        rsp.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
}
