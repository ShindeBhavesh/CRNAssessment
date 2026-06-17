using System.Diagnostics;

namespace API.Middleware;

public class PerformanceMiddleware(RequestDelegate next, ILogger<PerformanceMiddleware> logger)
{
    public async Task Invoke(HttpContext context)
    {
        var stopwatch = Stopwatch.StartNew();
        await next(context);
        stopwatch.Stop();
        logger.LogInformation("Request {Path} took {ElapsedMs}ms", context.Request.Path, stopwatch.ElapsedMilliseconds);
    }
}