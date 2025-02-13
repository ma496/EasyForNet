# Authentication & Authorization Implementation

## Overview
The system implements a dual authentication mechanism using both JWT tokens and cookies, with a role-based permission system.

## Authentication

### Login Process
1. Send a POST request to `{{apiUrl}}/account/login` with the following payload: 

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

### Logout Process



