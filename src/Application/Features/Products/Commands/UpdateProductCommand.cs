using Application.Common.Models;
using Application.DTOs.Products;
using Application.Interfaces.Services;
using MediatR;

namespace Application.Features.Products.Commands;

public record UpdateProductCommand(int Id, ProductRequest Request) : IRequest<Result<ProductResponse>>;

public class UpdateProductCommandHandler(IProductService productService) : IRequestHandler<UpdateProductCommand, Result<ProductResponse>>
{
    public async Task<Result<ProductResponse>> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        var result = await productService.UpdateAsync(request.Id, request.Request, cancellationToken);
        return Result<ProductResponse>.Success(result);
    }
}