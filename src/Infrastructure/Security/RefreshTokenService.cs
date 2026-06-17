using Application.Common.Security;
using Application.Interfaces.Security;
using Domain.Entities;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Infrastructure.Security;

public class RefreshTokenService(ApplicationDbContext dbContext, IOptions<JwtSettings> jwtSettings) : IRefreshTokenService
{
    public async Task<RefreshToken> CreateAsync(ApplicationUser user, CancellationToken cancellationToken = default)
    {
        var token = new RefreshToken
        {
            UserId = user.Id,
            Token = Convert.ToBase64String(Guid.NewGuid().ToByteArray()),
            CreatedOn = DateTime.UtcNow,
            ExpiresOn = DateTime.UtcNow.AddDays(jwtSettings.Value.RefreshTokenDays),
            IsRevoked = false
        };

        await dbContext.RefreshTokens.AddAsync(token, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
        return token;
    }

    public Task<RefreshToken?> GetValidTokenAsync(string token, CancellationToken cancellationToken = default) =>
        dbContext.RefreshTokens.Include(x => x.User)
            .FirstOrDefaultAsync(x => x.Token == token && !x.IsRevoked && x.ExpiresOn > DateTime.UtcNow, cancellationToken);

    public async Task RevokeAsync(RefreshToken token, CancellationToken cancellationToken = default)
    {
        token.IsRevoked = true;
        dbContext.RefreshTokens.Update(token);
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}