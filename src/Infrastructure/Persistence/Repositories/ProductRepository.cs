using Application.Common.Models;
using Application.DTOs.Products;
using Application.Interfaces.Repositories;
using Domain.Entities;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories;

public class ProductRepository(ApplicationDbContext dbContext) : IProductRepository
{
    public async Task<PagedResult<Product>> GetPagedAsync(ProductQueryRequest request, CancellationToken cancellationToken = default)
    {
        var query = dbContext.Products.AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            query = query.Where(x => x.ProductName.Contains(request.Search));
        }

        if (!string.IsNullOrWhiteSpace(request.CreatedBy))
        {
            query = query.Where(x => x.CreatedBy == request.CreatedBy);
        }

        query = request.SortBy switch
        {
            "ProductName" when request.SortOrder == "asc" => query.OrderBy(x => x.ProductName),
            "ProductName" => query.OrderByDescending(x => x.ProductName),
            _ when request.SortOrder == "asc" => query.OrderBy(x => x.CreatedOn),
            _ => query.OrderByDescending(x => x.CreatedOn)
        };

        var total = await query.CountAsync(cancellationToken);
        var data = await query.Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        return new PagedResult<Product>
        {
            Data = data,
            TotalCount = total,
            PageNumber = request.PageNumber,
            PageSize = request.PageSize
        };
    }

    public Task<Product?> GetByIdAsync(int id, CancellationToken cancellationToken = default) =>
        dbContext.Products.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

    public Task AddAsync(Product product, CancellationToken cancellationToken = default) =>
        dbContext.Products.AddAsync(product, cancellationToken).AsTask();

    public void Update(Product product) => dbContext.Products.Update(product);

    public void Remove(Product product) => dbContext.Products.Remove(product);
}