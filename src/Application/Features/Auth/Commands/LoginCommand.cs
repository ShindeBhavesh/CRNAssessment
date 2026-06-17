using Application.Common.Models;
using Application.DTOs.Auth;
using Application.Interfaces.Services;
using MediatR;

namespace Application.Features.Auth.Commands;

public record LoginCommand(LoginRequest Request) : IRequest<Result<AuthResponse>>;

public class LoginCommandHandler(IAuthService authService) : IRequestHandler<LoginCommand, Result<AuthResponse>>
{
    public async Task<Result<AuthResponse>> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var response = await authService.LoginAsync(request.Request, cancellationToken);
        return Result<AuthResponse>.Success(response);
    }
}