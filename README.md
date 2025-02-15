# FastEndpointsTool

## Prerequisites

- .NET 9.0
- PostgreSQL

## Installation

To install the FastEndpointsTool globally using the .NET CLI, run the following command:

```sh
dotnet tool install --global FastEndpointsTool
```

## Checking the Version

To check the version of the FastEndpointsTool, run the following command:

```sh
dotnet fet -v
```

or

```sh
dotnet fet --version
```
## Create a New Project

To create a new project using the FastEndpointsTool, run the following command:

```sh
dotnet fet cp -n {name} -o {path}
```

- `-n {name}`: Specifies the name of the new project.
- `-o {path}`: (Optional) Specifies the output directory for the new project.

## Change Connection Strings

By default, the FastEndpointsTool sets up connection strings for PostgreSQL in the `appsettings.json` and `appsettings.Testing.json` files. To change the connection strings, follow these steps:

1. Go to Source directory, create `appsettings.Development.json` file copy from `appsettings.json` and update the connection string.

2. Open the `appsettings.Development.json` file. Update the `DefaultConnection` and `Hangfire` connection strings with your PostgreSQL connection details:

    ```json
    {
      "ConnectionStrings": {
        "DefaultConnection": "Host=your_host;Database=your_db;Username=your_user;Password=your_password"
      },
      "Hangfire": {
        "Storage": {
          "ConnectionString": "Host=your_host;Database=your_db;Username=your_user;Password=your_password"    
        } 
      }
    }
    ```

3. Open the `appsettings.Testing.json` file. Update the `DefaultConnection` string with your PostgreSQL connection details:

    ```json
    {
      "ConnectionStrings": {
        "DefaultConnection": "Host=your_host;Database=your_db;Username=your_user;Password=your_password"
      }
    }
    ```

    ## Run the Project

    To run the project, navigate to the Source directory and execute the following command:

    ```sh
    dotnet run
    ```

    Once the project is running, open your browser and go to [http://localhost:5000/swagger/index.html](http://localhost:5000/swagger/index.html) to view the Swagger documentation for the endpoints.

    Default credentials:
    - Username: admin
    - Password: Admin#123

    ## Run the Tests

    To run the tests, navigate to the Tests directory and execute the following command:

    ```sh
    dotnet test
    ```

    ## Project Architecture

    The project follows the REPR (Request-Endpoint-Response) design pattern with a slice architecture approach. This architecture provides:

    - Clear separation of concerns
    - Maintainable and scalable codebase
    - Easy-to-understand endpoint organization
    - Type-safe request/response handling

    ## Example Endpoint Structure

    ```csharp
    public class MyRequest 
    {
        public string FirstName { get; set; }
        public string LastName { get; set; } 
    }

    public class MyResponse 
    {
        public string FullName { get; set; }
        public string Message { get; set; } 
    }

    public class MyEndpoint : Endpoint<MyRequest, MyResponse>
    {
        public override void Configure()
        {
            Post("/hello/world");
            AllowAnonymous();
        }

        public override async Task HandleAsync(MyRequest r, CancellationToken c)
        {
            await SendAsync(new()
            {
                FullName = $"{r.FirstName} {r.LastName}",
                Message = "Welcome to FastEndpoints..."                
            });
        }
    }
    ```


    ## Folder Structure

    This is the folder structure of the project:

    ```
    PointOfSale
    ├── Auth/
    ├── Data/
    ├── ErrorHandling/
    ├── Extensions/
    ├── Features/
    ├── Migrations/
    ├── Services/
    ├── Settings/
    ├── appsettings.json
    ├── appsettings.Testing.json
    ├── HangfireAuthorizationFilter.cs
    ├── Helper.cs
    ├── Meta.cs
    └── Program.cs

    Tests
    ├── Features/
    ├── Seeder/
    ├── Services/
    ├── App.cs
    ├── AppTestsBase.cs
    ├── Meta.cs
    ├── SharedContextCollection.cs
    ├── SharedContextFixture.cs
    ├── xunit.runner.json
    ```

In the Features folder, all endpoints are organized systematically. For example, account-related endpoints such as login, refresh token, user info, change password, forget password, reset password and profile endpoints exist in the Account folder. User-related endpoints are in the Users folder, role-related endpoints in the Roles folder, and permission-related endpoints in the Permissions folder. Each endpoint has its own file, ensuring that everything related to a specific endpoint exists in one place. This approach allows you to confidently modify an endpoint without affecting others.

In a slice architecture, features are organized into dedicated folders. For example, if you need to create an Inventory module, you would create an Inventory folder inside the Features folder, where all inventory-related endpoints reside. This approach is logical, maintainable, and scalable, making it suitable for projects of any size.

## Features  

- **JWT Authentication & Refresh Tokens** – Secure authentication with built-in refresh token handling.  
- **Permissions-Based Authorization** – Fine-grained access control using flexible permissions, ensuring users can only perform authorized actions.  
- **Role & Permission Management** – Define roles and assign permissions dynamically through dedicated CRUD endpoints.  
- **User Management** – Includes endpoints for user CRUD operations, retrieving logged-in user info, changing passwords, and handling forgotten/reset passwords.  
- **Rapid CRUD Generation** – Use the `dotnet fet crud` command to generate fully authorized CRUD endpoints with permissions in one step, maintaining consistency and speeding up development.  
- **Custom Endpoint Creation** – Generate individual endpoints as needed while following a structured convention.  
- **Self-Hosted Background Email Service** – Send emails directly from your own server without relying on third-party services.  
- **Automatic Token Cleanup Jobs**  
  - `delete-expired-auth-tokens` – A recurring job that runs once per day to remove expired authentication tokens. The schedule can be customized.  
  - `delete-expired-tokens` – A recurring job that runs once per day to remove expired tokens used for the "Forgot Password" functionality. The schedule can be customized.  


## Additional Features

For access to more advanced features, please connect with me on LinkedIn (https://www.linkedin.com/in/muhammad-ali-a5481b1b8/):

- **Next.js Integration** - Full integration with Next.js frontend framework
- **Multi-Tenant Architecture** - Support for multiple tenants/organizations
- **Runtime Settings Management** - Dynamic configuration updates without redeployment
- **Error Logging & Monitoring** - Comprehensive error tracking and monitoring
- **User Activity Tracking** - Detailed audit logs of user actions and changes
- **Localization Support** - Multi-language support and content localization


## Star the Project

If you find this project helpful and appreciate the effort put into creating a robust backend template and tool for creating fast endpoints, please consider giving it a star on GitHub. Your support helps make the project more visible to others who might benefit from it.

⭐ Star this repository to show your support! ⭐

Your stars motivate me to:
- Add more features and improvements
- Maintain documentation
- Provide better support
- Create more developer tools

Thank you for your support! 👍


## Documentation

For detailed instructions and guides, please refer to the following documents:

- [CRUD Endpoints Tutorial](documents/crud-endpoints-tutorial.md) - Step-by-step guide for creating CRUD endpoints
- [Endpoint Commands Reference](documents/endpoint-commands.md) - Complete reference for all endpoint generation commands
- [Authentication & Authorization](documents/authentication-authorization.md) - Detailed guide on authentication and authorization
- [Send Email Guide](documents/send-email.md) - Instructions for sending emails using the background email service





