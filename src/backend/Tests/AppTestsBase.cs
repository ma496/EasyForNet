namespace Backend.Tests;

[Collection("SharedContext")]
public abstract class AppTestsBase(App app) : TestBase<App>
{
    protected readonly App App = app;

    protected async Task SetAuthTokenAsync(string username = "admin", string password = "Admin#123")
    {
        await TestsHelper.SetNewAuthTokenAsync(App.Client, username, password);
    }

    protected void ClearAuthToken()
    {
        App.Client.DefaultRequestHeaders.Authorization = null;
    }
}
