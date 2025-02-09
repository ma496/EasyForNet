# FastEndpointsTool

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
## Creating a New Project

To create a new project using the FastEndpointsTool, run the following command:

```sh
dotnet fet cp -n {name} -o {path}
```

- `-n {name}`: Specifies the name of the new project.
- `-o {path}`: (Optional) Specifies the output directory for the new project.

## Changing Connection Strings

By default, the FastEndpointsTool sets up connection strings for PostgreSQL in the `appsettings.json` and `appsettings.Testing.json` files. To change the connection strings, follow these steps:

1. Open the `appsettings.json` file and locate the `ConnectionStrings` section. Update the `DefaultConnection` string with your PostgreSQL connection details:

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

2. Open the `appsettings.Testing.json` file and locate the `ConnectionStrings` section. Update the `DefaultConnection` string with your PostgreSQL connection details:

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

    ## Run the Tests

    To run the tests, navigate to the Tests directory and execute the following command:

    ```sh
    dotnet test
    ```

    ## Project Architecture and Folder Structure

    The project follows a slice architecture pattern with the following folder structure, for example if project name is PointOfSale:

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



