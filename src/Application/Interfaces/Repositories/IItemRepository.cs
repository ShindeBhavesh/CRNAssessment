using Application.Common.Models;
using Application.DTOs.Items;
using Domain.Entities;

namespace Application.Interfaces.Repositories;

public interface IItemRepository
{
    Task<PagedResult<Item>> GetPagedAsync(ItemQueryRequest request, CancellationToken cancellationToken = default);
    Task<Item?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task AddAsync(Item item, CancellationToken cancellationToken = default);
    void Update(Item item);
    void Remove(Item item);
}