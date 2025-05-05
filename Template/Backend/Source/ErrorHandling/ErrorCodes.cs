namespace Backend.ErrorHandling;

public static class ErrorCodes
{
    public const string DuplicateValue = "duplicate_value";
    public const string DuplicatePropertyValue = "duplicate_property_value";
    public const string RequiredFieldMissing = "required_field_missing";
    public const string RequiredPropertyFieldMissing = "required_property_field_missing";
    public const string ReferencedRecordNotFound = "referenced_record_not_found";
    public const string InvalidValueProvided = "invalid_value_provided";
    public const string DatabaseError = "database_error";
}
