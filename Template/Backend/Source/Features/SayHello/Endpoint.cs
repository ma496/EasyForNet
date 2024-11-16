using Backend.Auth;

namespace Backend.Features.SayHello;

sealed class Endpoint : Endpoint<Request, Response>
{
    public override void Configure()
    {
        Post("/api/hello");
        // AllowAnonymous();
        Roles("Admin");
        // auto generate permission
        AccessControl(keyName: "Article_Delete", behavior: Apply.ToThisEndpoint);
    }

    public override async Task HandleAsync(Request r, CancellationToken c)
    {
        await SendAsync(new()
        {
            Message = $"Hello {r.FirstName} {r.LastName}..."
        });
    }
}