namespace Backend.Tests.Architect.Features.FeatureB;

using Backend.Tests.Architect.Features.FeatureA;

// ReSharper disable NotAccessedField.Local
// ReSharper disable UnusedVariable
#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider adding the 'required' modifier or declaring as nullable.


public class FeatureBPropertySet
{
    private IFeatureAOneService _featureAOneService;
    private IFeatureAAllowOutsideService _featureAAllowOutsideService;

    public IFeatureAOneService FeatureAOneService
    {
        set
        {
            _featureAOneService = value;
            var x = new  FeatureAOneService();
        }
    }

    public IFeatureAAllowOutsideService FeatureAAllowOutsideService
    {
        set
        {
            _featureAAllowOutsideService = value;
            var x = new  FeatureAAllowOutsideService();
        }
    }
}