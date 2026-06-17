namespace Application.Common.Models;

public class PagedResult<T>
{
    public IReadOnlyList<T> Data { get; set; } = [];
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }
}