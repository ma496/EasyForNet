namespace Backend.Tests.Seeder;

/// <summary>
/// Stores user IDs created during test data seeding for use across test classes.
/// </summary>
public static class TestUsers
{
    public const string DefaultPassword = "Test#123";

    public static Guid AdminUserId { get; private set; } = default;
    public static Guid TestUserId { get; private set; } = default;
    public static Guid TestOneUserId { get; private set; } = default;
    public static Guid TestTwoUserId { get; private set; } = default;

    /// <summary>
    /// Sets the user IDs after they have been created in the database during seeding.
    /// </summary>
    public static void SetUserIds(Guid adminUserId, Guid testUserId, Guid testOneUserId, Guid testTwoUserId)
    {
        AdminUserId = adminUserId;
        TestUserId = testUserId;
        TestOneUserId = testOneUserId;
        TestTwoUserId = testTwoUserId;
    }
}
