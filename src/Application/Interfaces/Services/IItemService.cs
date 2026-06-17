using Application.Common.Models;
using Application.DTOs.Items;

namespace Application.Interfaces.Services;

public interface IItemService
{
    Task<PagedResult<ItemResponse>> GetPagedAsync(ItemQueryRequest request, CancellationToken cancellationToken = default);
    Task<ItemResponse> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<ItemResponse> CreateAsync(ItemRequest request, CancellationToken cancellationToken = default);
    Task<ItemResponse> UpdateAsync(int id, ItemUpdateRequest request, CancellationToken cancellationToken = default);
    Task DeleteAsync(int id, CancellationToken cancellationToken = default);
}