using Application.DTOs.Auth;
using Application.Interfaces.Services;
using Application.Interfaces.Security;
using Domain.Constants;
using Domain.Entities;
using Domain.Exceptions;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services;

public class AuthService(
    UserManager<ApplicationUser> userManager,
    RoleManager<IdentityRole<int>> roleManager,
    IJwtTokenService jwtTokenService,
    IRefreshTokenService refreshTokenService,
    ApplicationDbContext dbContext) : IAuthService
{
    public async Task<AuthResponse> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken = default)
    {
        if (!RoleConstants.All.Contains(request.Role))
        {
            throw new DomainException("Invalid role");
        }

        var exists = await userManager.Users.AnyAsync(x => x.Email == request.Email, cancellationToken);
        if (exists)
        {
            throw new DomainException("Email already registered");
        }

        var user = new ApplicationUser
        {
            UserName = request.FullName,
            Email = request.Email
        };

        var createResult = await userManager.CreateAsync(user, request.Password);
        if (!createResult.Succeeded)
        {
            throw new DomainException(string.Join(", ", createResult.Errors.Select(x => x.Description)));
        }

        if (!await roleManager.RoleExistsAsync(request.Role))
        {
            await roleManager.CreateAsync(new IdentityRole<int>(request.Role));
        }

        await userManager.AddToRoleAsync(user, request.Role);
        return await BuildAuthResponseAsync(user, cancellationToken);
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default)
    {
        var user = await userManager.Users.FirstOrDefaultAsync(x => x.Email == request.Email, cancellationToken)
            ?? throw new DomainException("Invalid credentials");

        var passwordOk = await userManager.CheckPasswordAsync(user, request.Password);
        if (!passwordOk)
        {
            throw new DomainException("Invalid credentials");
        }

        return await BuildAuthResponseAsync(user, cancellationToken);
    }

    public async Task<AuthResponse> RefreshAsync(RefreshRequest request, CancellationToken cancellationToken = default)
    {
        var token = await refreshTokenService.GetValidTokenAsync(request.RefreshToken, cancellationToken)
            ?? throw new DomainException("Invalid refresh token");

        await refreshTokenService.RevokeAsync(token, cancellationToken);
        return await BuildAuthResponseAsync(token.User!, cancellationToken);
    }

    public async Task LogoutAsync(RefreshRequest request, CancellationToken cancellationToken = default)
    {
        var token = await dbContext.RefreshTokens.FirstOrDefaultAsync(x => x.Token == request.RefreshToken, cancellationToken);
        if (token is null)
        {
            return;
        }

        token.IsRevoked = true;
        dbContext.RefreshTokens.Update(token);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    private async Task<AuthResponse> BuildAuthResponseAsync(ApplicationUser user, CancellationToken cancellationToken)
    {
        var roles = await userManager.GetRolesAsync(user);
        var accessToken = jwtTokenService.GenerateAccessToken(user, roles);
        var refreshToken = await refreshTokenService.CreateAsync(user, cancellationToken);

        return new AuthResponse
        {
            Email = user.Email ?? string.Empty,
            Role = roles.FirstOrDefault() ?? RoleConstants.Viewer,
            AccessToken = accessToken,
            AccessTokenExpiresOn = jwtTokenService.GetAccessTokenExpiry(),
            RefreshToken = refreshToken.Token,
            RefreshTokenExpiresOn = refreshToken.ExpiresOn
        };
    }
}