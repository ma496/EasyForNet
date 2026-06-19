namespace Backend.Tests;

/// <summary>
/// Defines a shared test collection that reuses the same <see cref="SharedContextFixture"/> across multiple test classes.
/// This ensures database seeding and fixture setup runs only once per collection.
/// </summary>
[CollectionDefinition("SharedContext")]
public class SharedContextCollection : ICollectionFixture<SharedContextFixture>
{
}
