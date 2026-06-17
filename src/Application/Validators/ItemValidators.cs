using Application.DTOs.Items;
using FluentValidation;

namespace Application.Validators;

public class ItemRequestValidator : AbstractValidator<ItemRequest>
{
    public ItemRequestValidator()
    {
        RuleFor(x => x.ProductId).GreaterThan(0);
        RuleFor(x => x.Quantity).GreaterThanOrEqualTo(0);
    }
}

public class ItemUpdateRequestValidator : AbstractValidator<ItemUpdateRequest>
{
    public ItemUpdateRequestValidator()
    {
        RuleFor(x => x.Quantity).GreaterThanOrEqualTo(0);
    }
}

public class ItemQueryRequestValidator : AbstractValidator<ItemQueryRequest>
{
    public ItemQueryRequestValidator()
    {
        RuleFor(x => x.PageNumber).GreaterThan(0);
        RuleFor(x => x.PageSize).InclusiveBetween(1, 100);
    }
}