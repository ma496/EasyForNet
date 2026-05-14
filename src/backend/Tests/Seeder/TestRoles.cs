namespace Backend.Tests.Seeder;

public static class TestRoles
{
    public static Guid AdminRoleId { get; private set; } = default;
    public static Guid TestRoleId { get; private set; } = default;
    public static Guid TestOneRoleId { get; private set; } = default;
    public static Guid TestTwoRoleId { get; private set; } = default;

    public static void SetRoleIds(Guid adminRoleId, Guid testRoleId, Guid testOneRoleId, Guid testTwoRoleId)
    {
        AdminRoleId = adminRoleId;
        TestRoleId = testRoleId;
        TestOneRoleId = testOneRoleId;
        TestTwoRoleId = testTwoRoleId;
    }
}
