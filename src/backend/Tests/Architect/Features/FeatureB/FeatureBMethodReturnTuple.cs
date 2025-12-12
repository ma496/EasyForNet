namespace Backend.Tests.Architect.Features.FeatureB;

using Backend.Tests.Architect.Features.FeatureA;

public class FeatureBMethodReturnTuple
{
    public (IFeatureAOneService?, FeatureAOneService?) MethodA()
    {
        return (null, null);
    }
}