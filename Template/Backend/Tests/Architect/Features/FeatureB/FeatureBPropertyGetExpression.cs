namespace Backend.Tests.Architect.Features.FeatureB;

using System.Diagnostics.CodeAnalysis;
using Backend.Tests.Architect.Features.FeatureA;

[SuppressMessage("Performance", "CA1822:Mark members as static")]
public class FeatureBPropertyGetExpression
{
    public IFeatureAOneService FeatureAOneService => new FeatureAOneService();
    public IFeatureAAllowOutsideService FeatureAAllowOutsideService => new FeatureAAllowOutsideService();
}