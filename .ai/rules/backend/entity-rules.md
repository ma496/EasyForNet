# Entity

*   **Entities:** All database entities are located in the `Core/Entities` subdirectory of a feature.
    *   Entities should inherit from `BaseEntity` or `AuditableEntity`.
    *   The primary key, `Id`, must be a `Guid`.
    *   **Foreign keys and navigation properties should be placed at the end of the class definition.
*   **Enums:** Before creating a new enum, verify if a suitable enum already exists within the feature. If not, create the new enum in `Core/Enums.cs`.
*   **Entity Configurations:** Entity Framework Core configurations for each entity are located in the `Core/Entities/Configuration` subdirectory of a feature. These configurations should only manually specify the table name (with a schema name). The schema name must match the feature name in lowercase. Indexes and relationships should also be configured here. If an entity contains an `enum` property, it must be configured to be stored as a string in the database using `.HasConversion<string>()`. Relationships should be configured in the configuration class of the entity that contains the foreign key.
    *   **Many-to-Many Relationships:** For many-to-many relationships, a join entity must be created to link the two entities. The relationship must be manually configured in the configuration class for the join entity. This includes setting up the composite primary key and the two one-to-many relationships.
*   **AppDbContext:** New entities must be added to the `AppDbContext` as a `DbSet` property.