using Application.Common.Models;
using Application.DTOs.Auth;
using Application.Interfaces.Services;
using MediatR;

namespace Application.Features.Auth.Commands;

public record RegisterCommand(RegisterRequest Request) : IRequest<Result<AuthResponse>>;

public class RegisterCommandHandler(IAuthService authService) : IRequestHandler<RegisterCommand, Result<AuthResponse>>
{
    public async Task<Result<AuthResponse>> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        var response = await authService.RegisterAsync(request.Request, cancellationToken);
        return Result<AuthResponse>.Success(response);
    }
}