using Application.Common.Models;

namespace Application.DTOs.Products;

public class ProductQueryRequest : PagedRequest
{
    public string? Search { get; set; }
    public string? CreatedBy { get; set; }
    public string SortBy { get; set; } = "CreatedOn";
    public string SortOrder { get; set; } = "desc";
}