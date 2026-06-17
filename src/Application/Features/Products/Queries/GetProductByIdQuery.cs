using Application.Common.Models;
using Application.DTOs.Products;
using Application.Interfaces.Services;
using MediatR;

namespace Application.Features.Products.Queries;

public record GetProductByIdQuery(int Id) : IRequest<Result<ProductResponse>>;

public class GetProductByIdQueryHandler(IProductService productService) : IRequestHandler<GetProductByIdQuery, Result<ProductResponse>>
{
    public async Task<Result<ProductResponse>> Handle(GetProductByIdQuery request, CancellationToken cancellationToken)
    {
        var result = await productService.GetByIdAsync(request.Id, cancellationToken);
        return Result<ProductResponse>.Success(result);
    }
}