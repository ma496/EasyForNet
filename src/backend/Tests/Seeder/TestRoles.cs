namespace Backend.Tests.Seeder;

/// <summary>
/// Stores role IDs created during test data seeding for use across test classes.
/// </summary>
public static class TestRoles
{
    public static Guid AdminRoleId { get; private set; } = default;
    public static Guid TestRoleId { get; private set; } = default;
    public static Guid TestOneRoleId { get; private set; } = default;
    public static Guid TestTwoRoleId { get; private set; } = default;

    /// <summary>
    /// Sets the role IDs after they have been created in the database during seeding.
    /// </summary>
    public static void SetRoleIds(Guid adminRoleId, Guid testRoleId, Guid testOneRoleId, Guid testTwoRoleId)
    {
        AdminRoleId = adminRoleId;
        TestRoleId = testRoleId;
        TestOneRoleId = testOneRoleId;
        TestTwoRoleId = testTwoRoleId;
    }
}
