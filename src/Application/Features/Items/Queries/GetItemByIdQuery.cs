using Application.Common.Models;
using Application.DTOs.Items;
using Application.Interfaces.Services;
using MediatR;

namespace Application.Features.Items.Queries;

public record GetItemByIdQuery(int Id) : IRequest<Result<ItemResponse>>;

public class GetItemByIdQueryHandler(IItemService itemService) : IRequestHandler<GetItemByIdQuery, Result<ItemResponse>>
{
    public async Task<Result<ItemResponse>> Handle(GetItemByIdQuery request, CancellationToken cancellationToken)
    {
        var result = await itemService.GetByIdAsync(request.Id, cancellationToken);
        return Result<ItemResponse>.Success(result);
    }
}