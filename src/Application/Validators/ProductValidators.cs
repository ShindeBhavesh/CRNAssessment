using Application.DTOs.Products;
using FluentValidation;

namespace Application.Validators;

public class ProductRequestValidator : AbstractValidator<ProductRequest>
{
    public ProductRequestValidator()
    {
        RuleFor(x => x.ProductName).NotEmpty().MaximumLength(255);
    }
}

public class ProductQueryRequestValidator : AbstractValidator<ProductQueryRequest>
{
    public ProductQueryRequestValidator()
    {
        RuleFor(x => x.PageNumber).GreaterThan(0);
        RuleFor(x => x.PageSize).InclusiveBetween(1, 100);
        RuleFor(x => x.SortOrder).Must(x => x is "asc" or "desc");
        RuleFor(x => x.SortBy).Must(x => x is "CreatedOn" or "ProductName");
    }
}