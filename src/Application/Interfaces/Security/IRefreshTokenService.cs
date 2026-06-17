using Domain.Entities;

namespace Application.Interfaces.Security;

public interface IRefreshTokenService
{
    Task<RefreshToken> CreateAsync(ApplicationUser user, CancellationToken cancellationToken = default);
    Task<RefreshToken?> GetValidTokenAsync(string token, CancellationToken cancellationToken = default);
    Task RevokeAsync(RefreshToken token, CancellationToken cancellationToken = default);
}