namespace Backend.Features.Users;

sealed class UsersGroup : Group
{
    public UsersGroup()
    {
        Configure("users", ep => ep.Description(x => x.WithTags("Users")));
    }
}


