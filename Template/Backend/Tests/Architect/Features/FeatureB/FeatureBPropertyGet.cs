using Tests.Architect.Features.FeatureA;
// ReSharper disable ArrangeAccessorOwnerBody

namespace Tests.Architect.Features.FeatureB;

public class FeatureBPropertyGet
{
    public IFeatureAOneService FeatureAOneService
    {
        get
        {
            return new FeatureAOneService();
        }
    }

    public IFeatureAAllowOutsideService FeatureAAllowOutsideService
    {
        get
        {
            return new FeatureAAllowOutsideService();
        }
    }
}