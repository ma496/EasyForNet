namespace Backend.Features.Permissions;

sealed class PermissionsGroup : Group
{
    public PermissionsGroup()
    {
        Configure("permissions", ep => ep.Description(x => x.WithTags("Permissions")));
    }
}