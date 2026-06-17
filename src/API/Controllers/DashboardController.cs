using Asp.Versioning;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/dashboard")]
[Authorize]
public class DashboardController(ApplicationDbContext dbContext) : ControllerBase
{
    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary(CancellationToken cancellationToken)
    {
        var productCount = await dbContext.Products.CountAsync(cancellationToken);
        var itemCount = await dbContext.Items.CountAsync(cancellationToken);
        var lowStockItems = await dbContext.Items.CountAsync(x => x.Quantity < 30, cancellationToken);
        return Ok(new
        {
            productCount,
            itemCount,
            lowStockItems
        });
    }
}