using System.Net;
using System.Net.Http.Json;
using Application.DTOs.Auth;
using FluentAssertions;

namespace API.Tests;

public class AuthenticationTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;

    public AuthenticationTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Register_Then_Login_Should_Return_Ok()
    {
        var registerPayload = new RegisterRequest
        {
            FullName = "QA User",
            Email = $"qa-{Guid.NewGuid():N}@test.local",
            Password = "Test@1234",
            Role = "Viewer"
        };

        var registerResponse = await _client.PostAsJsonAsync("/api/v1/auth/register", registerPayload);
        registerResponse.StatusCode.Should().Be(HttpStatusCode.OK);

        var loginResponse = await _client.PostAsJsonAsync("/api/v1/auth/login", new LoginRequest
        {
            Email = registerPayload.Email,
            Password = registerPayload.Password
        });

        loginResponse.StatusCode.Should().Be(HttpStatusCode.OK);
    }
}