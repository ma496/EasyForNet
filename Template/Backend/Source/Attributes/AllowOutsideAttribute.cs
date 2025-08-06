namespace Backend.Attributes;

/// <summary>
/// When applied to a class within a feature, this attribute allows other features
/// to have a dependency on it.
/// </summary>
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Interface, Inherited = false, AllowMultiple = false)]
public sealed class AllowOutsideAttribute : Attribute
{
}