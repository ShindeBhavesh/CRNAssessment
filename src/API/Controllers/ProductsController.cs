using Application.Common.Models;
using Application.DTOs.Products;
using Application.Features.Products.Commands;
using Application.Features.Products.Queries;
using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/products")]
[Authorize]
public class ProductsController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(Result<PagedResult<ProductResponse>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetProducts([FromQuery] ProductQueryRequest request, CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new GetProductsQuery(request), cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(Result<ProductResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetProduct(int id, CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new GetProductByIdQuery(id), cancellationToken);
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Manager")]
    [ProducesResponseType(typeof(Result<ProductResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Create([FromBody] ProductRequest request, CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new CreateProductCommand(request), cancellationToken);
        return Ok(result);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin,Manager")]
    [ProducesResponseType(typeof(Result<ProductResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Update(int id, [FromBody] ProductRequest request, CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new UpdateProductCommand(id, request), cancellationToken);
        return Ok(result);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin,Manager")]
    [ProducesResponseType(typeof(Result), StatusCodes.Status200OK)]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new DeleteProductCommand(id), cancellationToken);
        return Ok(result);
    }
}