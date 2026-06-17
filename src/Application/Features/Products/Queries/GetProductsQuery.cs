using Application.Common.Models;
using Application.DTOs.Products;
using Application.Interfaces.Services;
using MediatR;

namespace Application.Features.Products.Queries;

public record GetProductsQuery(ProductQueryRequest Request) : IRequest<Result<PagedResult<ProductResponse>>>;

public class GetProductsQueryHandler(IProductService productService) : IRequestHandler<GetProductsQuery, Result<PagedResult<ProductResponse>>>
{
    public async Task<Result<PagedResult<ProductResponse>>> Handle(GetProductsQuery request, CancellationToken cancellationToken)
    {
        var result = await productService.GetPagedAsync(request.Request, cancellationToken);
        return Result<PagedResult<ProductResponse>>.Success(result);
    }
}