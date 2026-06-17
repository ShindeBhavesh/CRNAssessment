namespace API.Middleware;

public class RequestLoggingMiddleware(RequestDelegate next, ILogger<RequestLoggingMiddleware> logger)
{
    public async Task Invoke(HttpContext context)
    {
        logger.LogInformation("HTTP {Method} {Path}", context.Request.Method, context.Request.Path);
        await next(context);
        logger.LogInformation("HTTP {Method} {Path} responded {StatusCode}", context.Request.Method, context.Request.Path, context.Response.StatusCode);
    }
}