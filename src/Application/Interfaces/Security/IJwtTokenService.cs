using Domain.Entities;

namespace Application.Interfaces.Security;

public interface IJwtTokenService
{
    string GenerateAccessToken(ApplicationUser user, IEnumerable<string> roles);
    DateTime GetAccessTokenExpiry();
}