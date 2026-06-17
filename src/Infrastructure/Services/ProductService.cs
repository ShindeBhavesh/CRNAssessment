using Application.Common.Models;
using Application.DTOs.Products;
using Application.Interfaces.Common;
using Application.Interfaces.Repositories;
using Application.Interfaces.Security;
using Application.Interfaces.Services;
using AutoMapper;
using Domain.Entities;
using Domain.Exceptions;

namespace Infrastructure.Services;

public class ProductService(
    IProductRepository productRepository,
    IUnitOfWork unitOfWork,
    ICurrentUserService currentUserService,
    IMapper mapper) : IProductService
{
    public async Task<PagedResult<ProductResponse>> GetPagedAsync(ProductQueryRequest request, CancellationToken cancellationToken = default)
    {
        var result = await productRepository.GetPagedAsync(request, cancellationToken);
        return new PagedResult<ProductResponse>
        {
            Data = mapper.Map<IReadOnlyList<ProductResponse>>(result.Data),
            TotalCount = result.TotalCount,
            PageNumber = result.PageNumber,
            PageSize = result.PageSize
        };
    }

    public async Task<ProductResponse> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var entity = await productRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException("Product not found");
        return mapper.Map<ProductResponse>(entity);
    }

    public async Task<ProductResponse> CreateAsync(ProductRequest request, CancellationToken cancellationToken = default)
    {
        var entity = new Product
        {
            ProductName = request.ProductName,
            CreatedBy = currentUserService.UserName,
            CreatedOn = DateTime.UtcNow
        };

        await productRepository.AddAsync(entity, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return mapper.Map<ProductResponse>(entity);
    }

    public async Task<ProductResponse> UpdateAsync(int id, ProductRequest request, CancellationToken cancellationToken = default)
    {
        var entity = await productRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException("Product not found");

        entity.ProductName = request.ProductName;
        entity.ModifiedBy = currentUserService.UserName;
        entity.ModifiedOn = DateTime.UtcNow;

        productRepository.Update(entity);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return mapper.Map<ProductResponse>(entity);
    }

    public async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var entity = await productRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException("Product not found");

        productRepository.Remove(entity);
        await unitOfWork.SaveChangesAsync(cancellationToken);
    }
}