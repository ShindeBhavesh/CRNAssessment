using Application.Common.Models;
using Application.DTOs.Auth;
using Application.Interfaces.Services;
using MediatR;

namespace Application.Features.Auth.Commands;

public record LogoutCommand(RefreshRequest Request) : IRequest<Result>;

public class LogoutCommandHandler(IAuthService authService) : IRequestHandler<LogoutCommand, Result>
{
    public async Task<Result> Handle(LogoutCommand request, CancellationToken cancellationToken)
    {
        await authService.LogoutAsync(request.Request, cancellationToken);
        return Result.Success("Logged out");
    }
}