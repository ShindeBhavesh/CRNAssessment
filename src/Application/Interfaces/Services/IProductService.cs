using Application.Common.Models;
using Application.DTOs.Products;

namespace Application.Interfaces.Services;

public interface IProductService
{
    Task<PagedResult<ProductResponse>> GetPagedAsync(ProductQueryRequest request, CancellationToken cancellationToken = default);
    Task<ProductResponse> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<ProductResponse> CreateAsync(ProductRequest request, CancellationToken cancellationToken = default);
    Task<ProductResponse> UpdateAsync(int id, ProductRequest request, CancellationToken cancellationToken = default);
    Task DeleteAsync(int id, CancellationToken cancellationToken = default);
}