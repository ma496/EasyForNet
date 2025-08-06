using Tests.Architect.Features.FeatureA;

namespace Tests.Architect.Features.FeatureB;

public class FeatureBMethodReturnTuple
{
    public (IFeatureAOneService?, FeatureAOneService?) MethodA()
    {
        return (null, null);
    }
}