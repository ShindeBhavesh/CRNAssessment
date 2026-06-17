using Application.Common.Models;
using Application.DTOs.Items;
using Application.Interfaces.Services;
using MediatR;

namespace Application.Features.Items.Queries;

public record GetItemsQuery(ItemQueryRequest Request) : IRequest<Result<PagedResult<ItemResponse>>>;

public class GetItemsQueryHandler(IItemService itemService) : IRequestHandler<GetItemsQuery, Result<PagedResult<ItemResponse>>>
{
    public async Task<Result<PagedResult<ItemResponse>>> Handle(GetItemsQuery request, CancellationToken cancellationToken)
    {
        var result = await itemService.GetPagedAsync(request.Request, cancellationToken);
        return Result<PagedResult<ItemResponse>>.Success(result);
    }
}