using System.Security.Claims;
using Application.Interfaces.Security;
using Microsoft.AspNetCore.Http;

namespace Infrastructure.Security;

public class CurrentUserService(IHttpContextAccessor httpContextAccessor) : ICurrentUserService
{
    public int? UserId => int.TryParse(httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier), out var id)
        ? id
        : null;

    public string UserName => httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.Name) ?? "system";
    public string Role => httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.Role) ?? "Anonymous";
}