using Application.DTOs.Auth;
using Application.DTOs.Products;
using Application.Validators;
using FluentAssertions;

namespace Application.Tests;

public class ValidatorsTests
{
    [Fact]
    public void RegisterValidator_Should_Fail_On_Invalid_Email()
    {
        var validator = new RegisterRequestValidator();
        var result = validator.Validate(new RegisterRequest
        {
            FullName = "A",
            Email = "invalid",
            Password = "short",
            Role = "NoRole"
        });

        result.IsValid.Should().BeFalse();
    }

    [Fact]
    public void ProductValidator_Should_Pass_For_Valid_Request()
    {
        var validator = new ProductRequestValidator();
        var result = validator.Validate(new ProductRequest { ProductName = "Keyboard" });
        result.IsValid.Should().BeTrue();
    }
}