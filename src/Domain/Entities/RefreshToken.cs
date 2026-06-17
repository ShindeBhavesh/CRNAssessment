using Domain.Common;

namespace Domain.Entities;

public class RefreshToken : BaseEntity
{
    public int UserId { get; set; }
    public string Token { get; set; } = string.Empty;
    public DateTime ExpiresOn { get; set; }
    public bool IsRevoked { get; set; }
    public DateTime CreatedOn { get; set; }
    public ApplicationUser? User { get; set; }
}