using Application.Common.Models;
using Application.DTOs.Items;
using Application.Interfaces.Services;
using MediatR;

namespace Application.Features.Items.Commands;

public record CreateItemCommand(ItemRequest Request) : IRequest<Result<ItemResponse>>;

public class CreateItemCommandHandler(IItemService itemService) : IRequestHandler<CreateItemCommand, Result<ItemResponse>>
{
    public async Task<Result<ItemResponse>> Handle(CreateItemCommand request, CancellationToken cancellationToken)
    {
        var result = await itemService.CreateAsync(request.Request, cancellationToken);
        return Result<ItemResponse>.Success(result);
    }
}