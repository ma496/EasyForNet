using Backend.Attributes;
// ReSharper disable UnusedVariable

namespace Tests.Architect.Features.FeatureA;

[AllowOutside]
public interface IFeatureAAllowOutsideService
{
    void MethodOne(FeatureAOneAllowOutsideModel allowOutsideModel);
    FeatureATwoAllowOutsideModel MethodTwo();
    void MethodThree();
}

[AllowOutside]
public class FeatureAAllowOutsideService : IFeatureAAllowOutsideService 
{
    public void MethodOne(FeatureAOneAllowOutsideModel allowOutsideModel)
    {
    }

    public FeatureATwoAllowOutsideModel MethodTwo()
        => throw new NotImplementedException();

    public void MethodThree()
    {
        var x = new FeatureAOneModel();
    }
}