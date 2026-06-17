using Application.Common.Models;
using Application.Interfaces.Services;
using MediatR;

namespace Application.Features.Items.Commands;

public record DeleteItemCommand(int Id) : IRequest<Result>;

public class DeleteItemCommandHandler(IItemService itemService) : IRequestHandler<DeleteItemCommand, Result>
{
    public async Task<Result> Handle(DeleteItemCommand request, CancellationToken cancellationToken)
    {
        await itemService.DeleteAsync(request.Id, cancellationToken);
        return Result.Success("Item deleted");
    }
}