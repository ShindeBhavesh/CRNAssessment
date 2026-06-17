using Application.Common.Models;
using Application.Interfaces.Services;
using MediatR;

namespace Application.Features.Products.Commands;

public record DeleteProductCommand(int Id) : IRequest<Result>;

public class DeleteProductCommandHandler(IProductService productService) : IRequestHandler<DeleteProductCommand, Result>
{
    public async Task<Result> Handle(DeleteProductCommand request, CancellationToken cancellationToken)
    {
        await productService.DeleteAsync(request.Id, cancellationToken);
        return Result.Success("Product deleted");
    }
}