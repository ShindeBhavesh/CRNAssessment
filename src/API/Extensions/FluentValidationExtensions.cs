using FluentValidation.AspNetCore;

namespace API.Extensions;

public static class FluentValidationExtensions
{
    public static IServiceCollection AddFluentValidationConfiguration(this IServiceCollection services)
    {
        services.AddFluentValidationAutoValidation();
        services.AddFluentValidationClientsideAdapters();
        return services;
    }
}