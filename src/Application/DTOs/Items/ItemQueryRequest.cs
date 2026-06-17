using Application.Common.Models;

namespace Application.DTOs.Items;

public class ItemQueryRequest : PagedRequest
{
    public int? ProductId { get; set; }
}