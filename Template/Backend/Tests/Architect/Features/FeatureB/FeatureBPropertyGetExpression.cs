using System.Diagnostics.CodeAnalysis;
using Tests.Architect.Features.FeatureA;

namespace Tests.Architect.Features.FeatureB;

[SuppressMessage("Performance", "CA1822:Mark members as static")]
public class FeatureBPropertyGetExpression
{
    public IFeatureAOneService FeatureAOneService => new FeatureAOneService();
    public IFeatureAAllowOutsideService FeatureAAllowOutsideService => new FeatureAAllowOutsideService();
}