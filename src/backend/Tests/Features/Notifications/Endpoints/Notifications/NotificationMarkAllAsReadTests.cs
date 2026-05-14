namespace Backend.Tests.Features.Notifications.Endpoints.Notifications;

using Backend.Features.Identity.Core.Entities;
using Backend.Features.Notifications.Endpoints.Notifications;

public class NotificationMarkAllAsReadTests(App app) : NotificationsTestsBase(app)
{
    [Fact]
    public async Task MarkAllAsRead_Success()
    {
        await SetAuthTokenAsync();

        var faker = new Faker<User>()
            .RuleFor(u => u.Username, f => f.Internet.UserName() + f.UniqueIndex);
        var newUser = await CreateAdminUserAsync($"testuser-{faker.Generate().Username}", TestUsers.DefaultPassword);
        var userNotification1 = await CreateUserNotificationAsync(newUser.Id);
        var userNotification2 = await CreateUserNotificationAsync(newUser.Id);
        var globalNotification = await CreateGlobalNotificationAsync();

        await SetAuthTokenAsync(newUser.Username, TestUsers.DefaultPassword);

        var (rsp, res) = await App.Client.POSTAsync<NotificationMarkAllAsReadEndpoint, NotificationMarkAllAsReadResponse>();

        rsp.StatusCode.Should().Be(HttpStatusCode.OK);
        res.Success.Should().BeTrue();

        DbContext.ChangeTracker.Clear();
        var updatedUserNotification1 = await DbContext.Notifications.FirstOrDefaultAsync(x => x.Id == userNotification1.Id, cancellationToken: TestContext.Current.CancellationToken);
        var updatedUserNotification2 = await DbContext.Notifications.FirstOrDefaultAsync(x => x.Id == userNotification2.Id, cancellationToken: TestContext.Current.CancellationToken);
        var isGlobalNotificationVisited = await DbContext.NotificationVisits.AnyAsync(x => x.NotificationId == globalNotification.Id && x.UserId == newUser.Id, cancellationToken: TestContext.Current.CancellationToken);
        updatedUserNotification1.Should().NotBeNull();
        updatedUserNotification2.Should().NotBeNull();
        updatedUserNotification1.IsRead.Should().BeTrue();
        updatedUserNotification2.IsRead.Should().BeTrue();
        isGlobalNotificationVisited.Should().BeTrue();
    }

    [Fact]
    public async Task MarkAllAsRead_Unauthenticated()
    {
        ClearAuthToken();

        var (rsp, _) = await App.Client.POSTAsync<NotificationMarkAllAsReadEndpoint, NotificationMarkAllAsReadResponse>();

        rsp.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
}
