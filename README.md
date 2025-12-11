# FullStack Template & Tool

A full-stack template built with ASP.NET 10 and Next.js 16, featuring a CLI tool for generating projects and API endpoints.

## Prerequisites

- .NET 10.0
- PostgreSQL
- Node.js

## Installation

To install the EasyForNet tool globally using the .NET CLI, run the following command:

```sh
dotnet tool install --global EasyForNetTool
```

## Checking the Version

To check the version of the EasyForNet tool, run the following command:

```sh
dotnet efn -v
```

or

```sh
dotnet efn --version
```

## Create a New Project

To create a new project using the EasyForNet tool, run the following command:

```sh
dotnet efn cp -n {name} -o {path}
```

- `-n {name}`: Specifies the name of the new project.
- `-o {path}`: (Optional) Specifies the output directory for the new project.

## Change Connection Strings

By default, the EasyForNet sets up connection strings for PostgreSQL in the `appsettings.json`, `appsettings.Development.json` and `appsettings.Testing.json` files. To change the connection strings, follow these steps:

1. Open the `appsettings.Development.json` file. Update the `DefaultConnection` and `Hangfire` connection strings with your PostgreSQL connection details:

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

2. Open the `appsettings.Testing.json` file. Update the `DefaultConnection` string with your PostgreSQL connection details:

    ```json
    {
      "ConnectionStrings": {
        "DefaultConnection": "Host=your_host;Database=your_db;Username=your_user;Password=your_password"
      }
    }
    ```

## Run the Backend Project

To run the project, navigate to the src/backend/Source directory and execute the following command:

```sh
dotnet run
```

Once the project is running, open your browser and go to [http://localhost:5000/swagger/index.html](http://localhost:5000/swagger/index.html) to view the Swagger documentation for the endpoints.

## Run the Frontend Project

To run the project, navigate to the src/frontend/web directory and execute the following command:

```sh
npm run dev
```

Default credentials:

- Username: admin
- Password: Admin#123

## Run the Tests

To run the tests, navigate to the Tests directory and execute the following command:

```sh
dotnet test
```

## Features  

- **JWT Authentication & Refresh Tokens** – Secure authentication with built-in refresh token handling.  
- **Permissions-Based Authorization** – Fine-grained access control using flexible permissions, ensuring users can only perform authorized actions.  
- **Role & Permission Management** – Define roles and assign permissions dynamically through frontend.  
- **User Management** – Includes endpoints and pages for user CRUD operations, changing passwords, and handling forgotten/reset passwords.   
- **Localization** – Support multiple languages.  
- **Self-Hosted Background Email Service** – Send emails directly from your own server without relying on third-party services.  
- **Automatic Token Cleanup Jobs**  
  - `delete-expired-auth-tokens` – A recurring job that runs once per day to remove expired authentication tokens. The schedule can be customized.  
  - `delete-expired-tokens` – A recurring job that runs once per day to remove expired tokens used for the "Forgot Password" functionality. The schedule can be customized.  
  - `delete-unused-files` – A recurring job that runs once per day to remove unused files. The schedule can be customized.

## Custom Development

For custom development, you can connect with me on [LinkedIn](https://www.linkedin.com/in/muhammad-ali-a5481b1b8/)

## Star the Project

If you find this project helpful and appreciate the effort put into creating a robust backend template and tool for creating fast endpoints, please consider giving it a star on GitHub. Your support helps make the project more visible to others who might benefit from it.

⭐ Star this [repository](https://github.com/ma496/EasyForNet) to show your support! ⭐

Your stars motivate me to:

- Add more features and improvements
- Maintain documentation
- Provide better support
- Create more developer tools

Thank you for your support! 👍

## Documentation

Check out the [Documentation](https://github.com/ma496/EasyForNet/wiki) for additional information.
