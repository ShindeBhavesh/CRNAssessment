namespace Domain.Events;

public sealed class ProductCreatedEvent(int productId) : IDomainEvent
{
    public int ProductId { get; } = productId;
    public DateTime OccurredOn { get; } = DateTime.UtcNow;
}