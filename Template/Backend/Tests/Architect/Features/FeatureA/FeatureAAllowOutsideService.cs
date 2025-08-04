using Backend.Attributes;

namespace Tests.Architect.Features.FeatureA;

[AllowOutside]
public interface IFeatureAAllowOutsideService
{
    void MethodOne(FeatureAOneModel model);
}

[AllowOutside]
public class FeatureAAllowOutsideService : IFeatureAAllowOutsideService 
{
    public void MethodOne(FeatureAOneModel model)
    {
        throw new NotImplementedException();
    }
}