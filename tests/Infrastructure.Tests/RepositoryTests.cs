using Application.DTOs.Products;
using Domain.Entities;
using FluentAssertions;
using Infrastructure.Persistence;
using Infrastructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Tests;

public class RepositoryTests
{
    private static ApplicationDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new ApplicationDbContext(options);
    }

    [Fact]
    public async Task ProductRepository_Should_Return_Paged_Data()
    {
        await using var dbContext = CreateDbContext();
        dbContext.Products.Add(new Product { ProductName = "A", CreatedBy = "t", CreatedOn = DateTime.UtcNow });
        dbContext.Products.Add(new Product { ProductName = "B", CreatedBy = "t", CreatedOn = DateTime.UtcNow });
        await dbContext.SaveChangesAsync();

        var repository = new ProductRepository(dbContext);
        var result = await repository.GetPagedAsync(new ProductQueryRequest { PageNumber = 1, PageSize = 10 });

        result.TotalCount.Should().Be(2);
        result.Data.Should().HaveCount(2);
    }
}