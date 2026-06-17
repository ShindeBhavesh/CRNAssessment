namespace Domain.Constants;

public static class RoleConstants
{
    public const string Admin = "Admin";
    public const string Manager = "Manager";
    public const string Viewer = "Viewer";

    public static readonly string[] All = [Admin, Manager, Viewer];
}