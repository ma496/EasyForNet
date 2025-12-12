namespace Backend.Tests.Architect.Features.FeatureB;

using Backend.Tests.Architect.Features.FeatureA;

// ReSharper disable ArrangeAccessorOwnerBody


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