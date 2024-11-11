using FastEndpoints;

namespace FastEndpointsSample.Features
{
    public class AdminGroup : Group
    {
        public AdminGroup()
        {
            Configure("admin", ep =>
                ep.Description(x => x.WithTags("Admin")));
        }
    }
}
