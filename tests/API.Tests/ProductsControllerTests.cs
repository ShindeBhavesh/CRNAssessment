using System.Net;
using FluentAssertions;

namespace API.Tests;

public class ProductsControllerTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;

    public ProductsControllerTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetProducts_Without_Auth_Should_Return_Unauthorized()
    {
        var response = await _client.GetAsync("/api/v1/products");
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
}