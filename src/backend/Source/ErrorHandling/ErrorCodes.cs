namespace Backend.ErrorHandling;

public static class ErrorCodes
{
    public const string InternalServerError = "internal_server_error";
    public const string DuplicateValue = "duplicate_value";
    public const string DuplicatePropertyValue = "duplicate_property_value";
    public const string RequiredFieldMissing = "required_field_missing";
    public const string RequiredPropertyFieldMissing = "required_property_field_missing";
    public const string ReferencedRecordNotFound = "referenced_record_not_found";
    public const string InvalidValueProvided = "invalid_value_provided";
    public const string DatabaseError = "database_error";
    public const string InvalidCurrentPassword = "invalid_current_password";
    public const string InvalidToken = "invalid_token";
    public const string TokenExpired = "token_expired";
    public const string PayloadTooLarge = "payload_too_large";
    public const string InvalidUsernamePassword = "invalid_username_password";
    public const string InvalidEmailPassword = "invalid_email_password";
    public const string UserNotActive = "user_not_active";
    public const string UserNotFound = "user_not_found";
    public const string DefaultRolePermissionsCannotBeChanged = "default_role_permissions_cannot_be_changed";
    public const string DefaultRoleCannotBeDeleted = "default_role_cannot_be_deleted";
    public const string DefaultRoleCannotBeUpdated = "default_role_cannot_be_updated";
    public const string DefaultUserCannotBeDeleted = "default_user_cannot_be_deleted";
    public const string DefaultUserCannotBeUpdated = "default_user_cannot_be_updated";
}
