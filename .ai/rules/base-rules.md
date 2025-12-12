# Project Overview

This is a full-stack web application with a .NET backend and a Next.js (React) frontend.

## Backend

The backend is a .NET web application built with the following key technologies:

*   **Framework:** ASP.NET Core with FastEndpoints for creating high-performance APIs.
*   **Database:** Entity Framework Core with a PostgreSQL provider.
*   **Background Jobs:** Hangfire is used for background job processing.
*   **Object Mapping:** Mapperly for efficient object-to-object mapping.
*   **Authentication:** FastEndpoints.Security is used for authentication.

The backend project is located in `src/backend`. The main project file is `src/backend/Source/Backend.csproj`.

### Building and Running the Backend

To build the backend, you can use the `dotnet build` command in the `src/backend/Source` directory.

```sh
cd src/backend/Source
dotnet build
```

To run the backend, you can use the `dotnet run` command. Before running the project, check if it is already running. If so, you should not run it again.

#### Build Process

When building the backend, run the `dotnet build` command. You only need to resolve build errors; warnings can be ignored.

```sh
cd src/backend/Source
dotnet run
```

## Frontend

The frontend is a Next.js application using TypeScript. It's located in the `src/frontend/web` directory. The frontend components UI directory is `components/ui`.

Key technologies used in the frontend include:

*   **Framework:** Next.js with React.
*   **UI:** A rich set of UI components and libraries are used, including:
    *   Tailwind CSS for styling.
    *   Headless UI for accessible components.
    *   ApexCharts and FullCalendar for data visualization.
    *   Tippy.js for tooltips.
*   **State Management:** Redux Toolkit is used for managing application state.
*   **Forms:** React Hook Form and Formik are used for building forms, with Yup for validation.
*   **Internationalization:** i18next is used for internationalization.

### Theme Conventions

The project uses a design system defined in `tailwind.config.js`. When applying colors, fonts, or other styles, always use the predefined theme values to ensure a consistent look and feel across the application.

*   **Colors:** The color palette is defined in the `theme.extend.colors` object. Use these colors for text, backgrounds, borders, and other UI elements.
    *   `primary`: The main brand color.
    *   `secondary`: The secondary brand color.
    *   `success`: For success messages and actions.
    *   `danger`: For error messages and destructive actions.
    *   `warning`: For warnings and alerts.
    *   `info`: For informational messages.
    *   `dark`: For dark mode and dark UI elements.
    *   `black`: For text and other dark elements.
    *   `white`: For text and other light elements.


### Building and Running the Frontend

To get started with the frontend, you first need to install the dependencies using `npm install`.

```sh
cd src/frontend/web
npm install
```

To run the frontend in development mode, use the `npm run dev` command. Before running the project, check if it is already running. If so, you should not run it again.

```sh
cd src/frontend/web
npm run dev
```

To build the frontend for production, use the `npm run build` command.

```sh
cd src/frontend/web
npm run build
```

## C# Coding Conventions

*   **Naming Conventions:**
    *   Use `PascalCase` for class names, method names, and properties.
    *   Use `camelCase` for local variables and method parameters.
    *   Prefix private fields with an underscore (`_`) (e.g., `_privateField`).
    *   Prefix interfaces with `I` (e.g., `IService`).
*   **Async Methods:**
    *   Methods that are asynchronous should have the `Async` suffix.
*   **File Organization:**
    *   A class and its corresponding interface should be in the same file, with the interface defined first.
    *   The filename should match the name of the public class it contains.
    *   Files should not have an empty line at the beginning.
    *   Remove unused using namespaces.
*   **Namespace Management:**
    *   Before writing C# code, identify and gather all required namespaces. If these namespaces are already included in the project Meta.cs file, do not add them again to avoid redundancy. Ensure the code remains clean and efficient by referencing only necessary namespaces that are not already present in project Meta.cs.
*   **General Style:**
    *   Use primary constructors where possible to simplify class definitions.
    *   Prefer `class` types for Data Transfer Objects (DTOs).
    *   Use collection expressions for initializing collections (e.g., `List<string> names = [];`).
    *   Use `var` for local variable declarations when the right-hand side of the assignment makes the type obvious.
    *   Use expression-bodied members for simple, single-line methods and properties.
    *   Utilize LINQ for querying and manipulating collections where it enhances readability. Avoid overly complex LINQ chains that are hard to debug.
    *   The Entity Framework Core `DbContext` object should be named `dbContext`.

## TypeScript Coding Conventions

*   **Naming Conventions:**
    *   Use `PascalCase` for type names, interfaces, and React components (e.g., `UserProfile`, `IUser`).
    *   Use `camelCase` for variables, functions, and properties (e.g., `userName`, `getUserProfile`).
*   **File Naming:**
    *   Use `kebab-case` for all `.ts` and `.tsx` files (e.g., `user-profile.tsx`).
*   **Types vs. Interfaces:**
    *   Prefer `interface` for defining object shapes and for public-facing APIs, as they can be extended.
    *   Use `type` for defining primitive aliases, unions, tuples, or more complex types.
*   **Null and Undefined:**
    *   `strictNullChecks` is enabled. Avoid using `null` unless it is meaningful for a specific API. Prefer `undefined` for optional properties and return values.
*   **General Style:**
    *   Use `const` by default and `let` only when a variable needs to be reassigned.
    *   Use arrow functions for component and callback definitions.
    *   Leverage modern TypeScript features like optional chaining (`?.`) and nullish coalescing (`??`).
    *   Organize imports at the top of the file in the following order: external libraries, project-absolute paths, relative paths.