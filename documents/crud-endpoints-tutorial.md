# CRUD Endpoints Tutorial

## Setup Requirements

For prerequisites, tool installation, project creation, and connection string configuration, please refer to the following sections in the [README.md](../README.md):

- [Prerequisites](../README.md#prerequisites)
- [Installation](../README.md#installation)
- [Create a New Project](../README.md#create-a-new-project)
- [Change Connection Strings](../README.md#change-connection-strings)

## Creating Product CRUD Endpoints

### Entity

Create a new entity class in the `Source/Data/Entities` folder. For example, `Product.cs`:

```csharp
public class Product : AuditableEntity<Guid>
{
    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public string ImageUrl { get; set; } = null!;
    public bool IsActive { get; set; }
}
```

### AppDbContext

Add Products property to `AppDbContext` class:

```csharp
public DbSet<Product> Products { get; set; }
```

### Add New Migration

Go to `Source` directory and run the following command to add a new migration:

```bash
dotnet ef migrations add AddProduct
```

### Generate Crud Endpoints

In `Source` directory, run the following command to generate CRUD endpoints:

```bash
dotnet fet crud -n Product -pn Products -e Product -dc AppDbContext -auth true
```
Command Explanation:

- `-n Product`: Specifies the name used for endpoint classes (e.g., CreateProductEndpoint, UpdateProductEndpoint, etc.)
- `-pn Products`: Matches the DbSet property name defined in AppDbContext (public DbSet<Product> Products { get; set; })
- `-e Product`: Specifies the entity class name that was created in Data/Entities folder
- `-dc AppDbContext`: Specifies the DbContext class name that contains the entity DbSet
- `-auth true`: Enables permission-based authorization for all generated endpoints

The command will generate the following group and endpoints files in the Features/Products folder and add permissions to Allow and PermissionDefinitionProvider classes:

- `ProductsGroup.cs`: Defines the group for all product endpoints
- `ProductCreateEndpoint.cs`: POST /api/v1/products 
- `ProductUpdateEndpoint.cs`: PUT /api/v1/products/{id}
- `ProductGetEndpoint.cs`: GET /api/v1/products/{id}
- `ProductListEndpoint.cs`: GET /api/v1/products
- `ProductDeleteEndpoint.cs`: DELETE /api/v1/products/{id}
- `Modify Allow.cs`: Adds permissions to Allow class
- `Modify PermissionDefinitionProvider.cs`: Define permissions in PermissionDefinitionProvider.Define method

Each endpoint will include:
- Request/response DTOs
- Validation rules
- Entity mapping
- Database operations
- Permission-based authorization

Now you can run the project with `dotnet run` and test the endpoints.

Default credentials:
- Username: admin
- Password: Admin#123

## Testing Your Endpoints

For instructions on running and testing your endpoints, refer to:
- [Run the Project](../README.md#run-the-project)
- [Run the Tests](../README.md#run-the-tests)
