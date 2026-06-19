namespace Backend.Tests.Architect.Features.FeatureA;

using Backend.Attributes;

/// <summary>
/// Model class decorated with <see cref="AllowOutsideAttribute"/> to verify that
/// AllowOutside models used as return types are not flagged as forbidden dependencies.
/// </summary>
[AllowOutside]
public class FeatureATwoAllowOutsideModel
{
    
}