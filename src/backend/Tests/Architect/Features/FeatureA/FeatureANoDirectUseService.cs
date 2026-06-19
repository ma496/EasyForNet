namespace Backend.Tests.Architect.Features.FeatureA;

using Backend.Attributes;

/// <summary>
/// Interface for a service whose implementation is marked with <see cref="NoDirectUseAttribute"/>.
/// </summary>
public interface IFeatureANoDirectUseService
{
}

/// <summary>
/// Service implementation marked with <see cref="NoDirectUseAttribute"/> to verify that
/// direct instantiation is correctly detected as a violation.
/// </summary>
[NoDirectUse]
public class FeatureANoDirectUseService : IFeatureANoDirectUseService {
    
}