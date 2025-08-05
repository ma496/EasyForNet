using Backend.Attributes;

namespace Tests.Architect.Features.FeatureA;

[AllowOutside]
public interface IFeatureAAllowOutsideService
{
    void MethodOne(FeatureAOneAllowOutsideModel allowOutsideModel);
}

[AllowOutside]
public class FeatureAAllowOutsideService : IFeatureAAllowOutsideService 
{
    public void MethodOne(FeatureAOneAllowOutsideModel allowOutsideModel)
    {
        throw new NotImplementedException();
    }
}