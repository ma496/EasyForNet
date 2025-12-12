namespace Backend.Tests.Architect.Features.FeatureA;

using Backend.Attributes;

// ReSharper disable UnusedVariable


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