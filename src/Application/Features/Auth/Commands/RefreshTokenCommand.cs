using Application.Common.Models;
using Application.DTOs.Auth;
using Application.Interfaces.Services;
using MediatR;

namespace Application.Features.Auth.Commands;

public record RefreshTokenCommand(RefreshRequest Request) : IRequest<Result<AuthResponse>>;

public class RefreshTokenCommandHandler(IAuthService authService) : IRequestHandler<RefreshTokenCommand, Result<AuthResponse>>
{
    public async Task<Result<AuthResponse>> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        var response = await authService.RefreshAsync(request.Request, cancellationToken);
        return Result<AuthResponse>.Success(response);
    }
}