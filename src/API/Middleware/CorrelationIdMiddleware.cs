namespace API.Middleware;

public class CorrelationIdMiddleware(RequestDelegate next)
{
    private const string HeaderName = "X-Correlation-ID";

    public async Task Invoke(HttpContext context)
    {
        if (!context.Request.Headers.TryGetValue(HeaderName, out var correlationId) || string.IsNullOrWhiteSpace(correlationId))
        {
            correlationId = Guid.NewGuid().ToString("N");
        }

        context.TraceIdentifier = correlationId!;
        context.Response.Headers[HeaderName] = correlationId.ToString();
        await next(context);
    }
}