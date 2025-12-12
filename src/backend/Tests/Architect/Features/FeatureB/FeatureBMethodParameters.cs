namespace Backend.Tests.Architect.Features.FeatureB;

using Backend.Tests.Architect.Features.FeatureA;

public class FeatureBMethodParameters : FeatureBMethodParametersBaseClass
{
    public void MethodOne(IFeatureAOneService featureAOneService) { }
}

public class FeatureBMethodParametersBaseClass
{
    public void BaseMethodOne(Action<FeatureAOneService> action)
    {}
}