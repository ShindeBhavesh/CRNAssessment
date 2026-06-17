using Application.Common.Models;
using Application.DTOs.Auth;
using Application.Features.Auth.Commands;
using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/auth")]
public class AuthController(IMediator mediator) : ControllerBase
{
    [HttpPost("register")]
    [ProducesResponseType(typeof(Result<AuthResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request, CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new RegisterCommand(request), cancellationToken);
        return Ok(result);
    }

    [HttpPost("login")]
    [ProducesResponseType(typeof(Result<AuthResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new LoginCommand(request), cancellationToken);
        return Ok(result);
    }

    [HttpPost("refresh")]
    [ProducesResponseType(typeof(Result<AuthResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Refresh([FromBody] RefreshRequest request, CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new RefreshTokenCommand(request), cancellationToken);
        return Ok(result);
    }

    [HttpPost("logout")]
    [ProducesResponseType(typeof(Result), StatusCodes.Status200OK)]
    public async Task<IActionResult> Logout([FromBody] RefreshRequest request, CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new LogoutCommand(request), cancellationToken);
        return Ok(result);
    }
}