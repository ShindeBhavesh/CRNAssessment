using Application.Common.Models;
using Application.DTOs.Items;
using Application.Interfaces.Repositories;
using Domain.Entities;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories;

public class ItemRepository(ApplicationDbContext dbContext) : IItemRepository
{
    public async Task<PagedResult<Item>> GetPagedAsync(ItemQueryRequest request, CancellationToken cancellationToken = default)
    {
        var query = dbContext.Items.Include(x => x.Product).AsQueryable();
        if (request.ProductId.HasValue)
        {
            query = query.Where(x => x.ProductId == request.ProductId.Value);
        }

        var total = await query.CountAsync(cancellationToken);
        var data = await query.OrderByDescending(x => x.Id)
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        return new PagedResult<Item>
        {
            Data = data,
            TotalCount = total,
            PageNumber = request.PageNumber,
            PageSize = request.PageSize
        };
    }

    public Task<Item?> GetByIdAsync(int id, CancellationToken cancellationToken = default) =>
        dbContext.Items.Include(x => x.Product).FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

    public Task AddAsync(Item item, CancellationToken cancellationToken = default) =>
        dbContext.Items.AddAsync(item, cancellationToken).AsTask();

    public void Update(Item item) => dbContext.Items.Update(item);

    public void Remove(Item item) => dbContext.Items.Remove(item);
}