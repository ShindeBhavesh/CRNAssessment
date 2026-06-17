using Application.DTOs.Products;
using Application.Common.Models;
using Domain.Entities;

namespace Application.Interfaces.Repositories;

public interface IProductRepository
{
    Task<PagedResult<Product>> GetPagedAsync(ProductQueryRequest request, CancellationToken cancellationToken = default);
    Task<Product?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task AddAsync(Product product, CancellationToken cancellationToken = default);
    void Update(Product product);
    void Remove(Product product);
}