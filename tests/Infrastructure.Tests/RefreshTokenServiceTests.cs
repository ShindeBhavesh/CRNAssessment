using Application.Common.Security;
using Domain.Entities;
using FluentAssertions;
using Infrastructure.Persistence;
using Infrastructure.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Infrastructure.Tests;

public class RefreshTokenServiceTests
{
    private static ApplicationDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new ApplicationDbContext(options);
    }

    [Fact]
    public async Task CreateAsync_Should_Persist_Token()
    {
        await using var db = CreateDbContext();
        var settings = Options.Create(new JwtSettings { RefreshTokenDays = 7 });
        var service = new RefreshTokenService(db, settings);

        var user = new ApplicationUser { Id = 11, Email = "u@test.local" };
        var token = await service.CreateAsync(user);

        token.Token.Should().NotBeNullOrWhiteSpace();
        db.RefreshTokens.Count().Should().Be(1);
    }
}