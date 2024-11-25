namespace Backend.Features.Roles;

sealed class RolesGroup : Group
{
    public RolesGroup()
    {
        Configure("roles", ep => ep.Description(x => x.WithTags("Roles")));
    }
}


