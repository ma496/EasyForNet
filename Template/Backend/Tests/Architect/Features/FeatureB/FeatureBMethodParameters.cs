using Tests.Architect.Features.FeatureA;

namespace Tests.Architect.Features.FeatureB;

public class FeatureBMethodParameters : FeatureBMethodParametersBaseClass
{
    public void MethodOne(IFeatureAOneService featureAOneService) { }
}

public class FeatureBMethodParametersBaseClass
{
    public void BaseMethodOne(Action<FeatureAOneService> action)
    {}
}