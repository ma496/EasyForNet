namespace Backend.Base;

public interface IFeature
{
    static abstract void AddServices(IServiceCollection services, ConfigurationManager configuration);
}