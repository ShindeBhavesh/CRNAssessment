using Application.Common.Models;
using Application.DTOs.Products;
using Application.Interfaces.Services;
using MediatR;

namespace Application.Features.Products.Commands;

public record CreateProductCommand(ProductRequest Request) : IRequest<Result<ProductResponse>>;

public class CreateProductCommandHandler(IProductService productService) : IRequestHandler<CreateProductCommand, Result<ProductResponse>>
{
    public async Task<Result<ProductResponse>> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        var result = await productService.CreateAsync(request.Request, cancellationToken);
        return Result<ProductResponse>.Success(result);
    }
}