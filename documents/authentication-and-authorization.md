# Authentication & Authorization Implementation

## Overview
The system implements a dual authentication mechanism using both JWT tokens and cookies, with a role-based permission system.

## Authentication

### Token Process

1. Send a POST request to `{{apiUrl}}/account/token` with the following payload: 

```json
{
    "username": "admin",
    "password": "Admin#123"
}
```

2. If the credentials are valid, the server will respond with a JWT token and a refresh token in the response body.

```json
{
    "accessToken": "<JWT Token>",
    "refreshToken": "<Refresh Token>",
    "userId": "<User ID>",
}
```

3. Store the `accessToken` and `refreshToken` in your application's local storage or session storage.

4. Include the `accessToken` in the `Authorization` header of all subsequent API requests:

```
Authorization: Bearer <JWT Token>
```

### Refresh Token Process

1. If the `accessToken` is expired, send a POST request to `{{apiUrl}}/account/refresh-token` with the following payload:

```json
{
    "refreshToken": "<Refresh Token>",
    "userId": "<User ID>"
}
```

2. If the refresh token is valid, the server will respond with a new `accessToken` and a new `refreshToken` in the response body.

```json
{
    "accessToken": "<New JWT Token>",
    "refreshToken": "<New Refresh Token>",
    "userId": "<User ID>"
}
```

3. Update the `accessToken` and `refreshToken` in your application's local storage or session storage.

4. Include the new `accessToken` in the `Authorization` header of all subsequent API requests:

```
Authorization: Bearer <New JWT Token>
```

### Change Expiry Time

1. Change the `AccessTokenValidity` and `RefreshTokenValidity` in the `appsettings.json`, `appsettings.Development.json`, and `appsettings.Testing.json` files. default value is 60 minutes for `AccessTokenValidity` and 168 hours for `RefreshTokenValidity`.

```json
"AccessTokenValidity": "60", // in minutes
"RefreshTokenValidity": "168" // in hours, 168 hours = 7 days
```

## Authorization

### Permission-Based Access Control

The system uses a permission-based access control (PBAC) system to manage user permissions. For example, you want to add permission for product list endpoint, you need to add the following permission in Allow and PermissionDefinitionProvider classes.

1. Add the following permission in the Allow class:

```csharp
public static class Allow
{
    public const string Product_View = "Product.View";
}
```

2. Add the following permission in the PermissionDefinitionProvider.cs file:

```csharp
public class PermissionDefinitionProvider : DefaultPermissionDefinitionProvider
{
    public override void Define(IPermissionDefinitionContext context)
    {
        var productsPermissions = context.AddPermission("Products", "Products");
        productsPermissions.AddChild(Allow.Product_View, "View");
    }
}
```

3. How to use the permission in the endpoint, for example, you want to add the permission for the product list endpoint, you need to add the following code in the endpoint configure method:

```csharp
public override void Configure()
{
    Permissions(Allow.Product_View);
}
```




