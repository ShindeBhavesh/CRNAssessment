using Application.Common.Models;
using Application.DTOs.Items;
using Application.Features.Items.Commands;
using Application.Features.Items.Queries;
using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/items")]
[Authorize]
public class ItemsController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(Result<PagedResult<ItemResponse>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetItems([FromQuery] ItemQueryRequest request, CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new GetItemsQuery(request), cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(Result<ItemResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetItem(int id, CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new GetItemByIdQuery(id), cancellationToken);
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Manager")]
    [ProducesResponseType(typeof(Result<ItemResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Create([FromBody] ItemRequest request, CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new CreateItemCommand(request), cancellationToken);
        return Ok(result);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin,Manager")]
    [ProducesResponseType(typeof(Result<ItemResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Update(int id, [FromBody] ItemUpdateRequest request, CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new UpdateItemCommand(id, request), cancellationToken);
        return Ok(result);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin,Manager")]
    [ProducesResponseType(typeof(Result), StatusCodes.Status200OK)]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new DeleteItemCommand(id), cancellationToken);
        return Ok(result);
    }
}