using Application.Common.Security;
using Application.Interfaces.Common;
using Application.Interfaces.Repositories;
using Application.Interfaces.Security;
using Application.Interfaces.Services;
using Domain.Constants;
using Domain.Entities;
using Infrastructure.Persistence;
using Infrastructure.Persistence.Repositories;
using Infrastructure.Security;
using Infrastructure.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<JwtSettings>(configuration.GetSection("Jwt"));

        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddIdentity<ApplicationUser, IdentityRole<int>>(options =>
            {
                options.Password.RequireDigit = true;
                options.Password.RequireLowercase = true;
                options.Password.RequireUppercase = true;
                options.Password.RequiredLength = 8;
            })
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

        services.AddScoped<IProductRepository, ProductRepository>();
        services.AddScoped<IItemRepository, ItemRepository>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IProductService, ProductService>();
        services.AddScoped<IItemService, ItemService>();

        services.AddScoped<IJwtTokenService, JwtTokenService>();
        services.AddScoped<IRefreshTokenService, RefreshTokenService>();
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        services.AddHttpContextAccessor();

        return services;
    }

    public static async Task SeedDefaultsAsync(this IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        await dbContext.Database.EnsureCreatedAsync();

        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<int>>>();
        foreach (var role in RoleConstants.All)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole<int>(role));
            }
        }

        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var adminEmail = "admin@pms.local";
        var admin = await userManager.FindByEmailAsync(adminEmail);
        if (admin is null)
        {
            admin = new ApplicationUser
            {
                UserName = "System Admin",
                Email = adminEmail
            };

            var created = await userManager.CreateAsync(admin, "Admin@123");
            if (created.Succeeded)
            {
                await userManager.AddToRoleAsync(admin, RoleConstants.Admin);
            }
        }

        if (!await dbContext.Products.AnyAsync())
        {
            dbContext.Products.AddRange(
                new Product
                {
                    ProductName = "Laptop Pro 16",
                    CreatedBy = "System Admin",
                    CreatedOn = DateTime.UtcNow
                },
                new Product
                {
                    ProductName = "Wireless Keyboard",
                    CreatedBy = "System Admin",
                    CreatedOn = DateTime.UtcNow
                }
            );
            await dbContext.SaveChangesAsync();

            var firstProductId = await dbContext.Products.OrderBy(x => x.Id).Select(x => x.Id).FirstAsync();
            dbContext.Items.Add(new Item { ProductId = firstProductId, Quantity = 10 });
            await dbContext.SaveChangesAsync();
        }
    }
}