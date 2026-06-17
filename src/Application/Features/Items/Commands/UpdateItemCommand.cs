using Application.Common.Models;
using Application.DTOs.Items;
using Application.Interfaces.Services;
using MediatR;

namespace Application.Features.Items.Commands;

public record UpdateItemCommand(int Id, ItemUpdateRequest Request) : IRequest<Result<ItemResponse>>;

public class UpdateItemCommandHandler(IItemService itemService) : IRequestHandler<UpdateItemCommand, Result<ItemResponse>>
{
    public async Task<Result<ItemResponse>> Handle(UpdateItemCommand request, CancellationToken cancellationToken)
    {
        var result = await itemService.UpdateAsync(request.Id, request.Request, cancellationToken);
        return Result<ItemResponse>.Success(result);
    }
}