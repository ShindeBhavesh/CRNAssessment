using Application.Common.Models;
using Application.DTOs.Items;
using Application.Interfaces.Common;
using Application.Interfaces.Repositories;
using Application.Interfaces.Services;
using AutoMapper;
using Domain.Entities;
using Domain.Exceptions;

namespace Infrastructure.Services;

public class ItemService(
    IItemRepository itemRepository,
    IProductRepository productRepository,
    IUnitOfWork unitOfWork,
    IMapper mapper) : IItemService
{
    public async Task<PagedResult<ItemResponse>> GetPagedAsync(ItemQueryRequest request, CancellationToken cancellationToken = default)
    {
        var result = await itemRepository.GetPagedAsync(request, cancellationToken);
        return new PagedResult<ItemResponse>
        {
            Data = mapper.Map<IReadOnlyList<ItemResponse>>(result.Data),
            TotalCount = result.TotalCount,
            PageNumber = result.PageNumber,
            PageSize = result.PageSize
        };
    }

    public async Task<ItemResponse> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var entity = await itemRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException("Item not found");
        return mapper.Map<ItemResponse>(entity);
    }

    public async Task<ItemResponse> CreateAsync(ItemRequest request, CancellationToken cancellationToken = default)
    {
        var product = await productRepository.GetByIdAsync(request.ProductId, cancellationToken);
        if (product is null)
        {
            throw new DomainException("Product does not exist");
        }

        var entity = new Item
        {
            ProductId = request.ProductId,
            Quantity = request.Quantity
        };

        await itemRepository.AddAsync(entity, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        var refreshed = await itemRepository.GetByIdAsync(entity.Id, cancellationToken) ?? entity;
        return mapper.Map<ItemResponse>(refreshed);
    }

    public async Task<ItemResponse> UpdateAsync(int id, ItemUpdateRequest request, CancellationToken cancellationToken = default)
    {
        var entity = await itemRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException("Item not found");

        entity.Quantity = request.Quantity;
        itemRepository.Update(entity);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return mapper.Map<ItemResponse>(entity);
    }

    public async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var entity = await itemRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException("Item not found");

        itemRepository.Remove(entity);
        await unitOfWork.SaveChangesAsync(cancellationToken);
    }
}