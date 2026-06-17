namespace Application.Common.Models;

public class Result
{
    public bool Succeeded { get; set; }
    public string Message { get; set; } = string.Empty;

    public static Result Success(string message = "Success") => new() { Succeeded = true, Message = message };
    public static Result Failure(string message) => new() { Succeeded = false, Message = message };
}

public class Result<T> : Result
{
    public T? Data { get; set; }

    public static Result<T> Success(T data, string message = "Success") => new()
    {
        Succeeded = true,
        Message = message,
        Data = data
    };

    public new static Result<T> Failure(string message) => new() { Succeeded = false, Message = message };
}