namespace Backend.Features.Identity.Endpoints.Account;

public class AccountGroup : Group
{
    public AccountGroup()
    {
        Configure("account", ep => {});
    }
}
