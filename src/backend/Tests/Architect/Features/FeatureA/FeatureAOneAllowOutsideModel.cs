namespace Backend.Tests.Architect.Features.FeatureA;

using Backend.Attributes;

/// <summary>
/// Model class decorated with <see cref="AllowOutsideAttribute"/> to verify that
/// AllowOutside models are not flagged as forbidden cross-feature dependencies.
/// </summary>
[AllowOutside]
public class FeatureAOneAllowOutsideModel
{
    
}