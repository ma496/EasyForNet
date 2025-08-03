using Tests.Architect.Features.FeatureA;

namespace Tests.Architect.Features.FeatureB;

public class FeatureBMethodParameters
{
    public void MethodOne(IFeatureAOneService featureAOneService, Action<FeatureAOneService> action) { }
}