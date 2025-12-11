namespace Backend.Features.Identity.Endpoints.Users;

sealed class UsersGroup : Group
{
    public UsersGroup()
    {
        Configure("users", ep => {});
    }
}


