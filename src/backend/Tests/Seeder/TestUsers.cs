namespace Backend.Tests.Seeder;

public static class TestUsers
{
    public const string DefaultPassword = "Test#123";

    public static Guid AdminUserId { get; private set; } = default;
    public static Guid TestUserId { get; private set; } = default;
    public static Guid TestOneUserId { get; private set; } = default;
    public static Guid TestTwoUserId { get; private set; } = default;

    public static void SetUserIds(Guid adminUserId, Guid testUserId, Guid testOneUserId, Guid testTwoUserId)
    {
        AdminUserId = adminUserId;
        TestUserId = testUserId;
        TestOneUserId = testOneUserId;
        TestTwoUserId = testTwoUserId;
    }
}
