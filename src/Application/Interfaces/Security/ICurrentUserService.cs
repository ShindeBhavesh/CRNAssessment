namespace Application.Interfaces.Security;

public interface ICurrentUserService
{
    int? UserId { get; }
    string UserName { get; }
    string Role { get; }
}