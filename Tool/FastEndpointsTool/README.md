# FastEndpointsTool & Template

## Prerequisites

- .NET 9.0
- PostgreSQL
- Node.js

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

By default, the FastEndpointsTool sets up connection strings for PostgreSQL in the `appsettings.json`, `appsettings.Development.json` and `appsettings.Testing.json` files. To change the connection strings, follow these steps:

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

## Documentation

Check out the [Documentation](../../README.md) for additional information.
