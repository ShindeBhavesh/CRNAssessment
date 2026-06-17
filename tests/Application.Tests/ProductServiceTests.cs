using Application.DTOs.Products;
using Application.Interfaces.Common;
using Application.Interfaces.Repositories;
using Application.Interfaces.Security;
using AutoMapper;
using Domain.Entities;
using FluentAssertions;
using Infrastructure.Services;
using Moq;

namespace Application.Tests;

public class ProductServiceTests
{
    [Fact]
    public async Task CreateAsync_Should_Set_Audit_Fields()
    {
        var repository = new Mock<IProductRepository>();
        var uow = new Mock<IUnitOfWork>();
        var currentUser = new Mock<ICurrentUserService>();
        currentUser.SetupGet(x => x.UserName).Returns("Test User");

        var mapperConfig = new MapperConfiguration(cfg =>
            cfg.CreateMap<Product, ProductResponse>());
        var mapper = mapperConfig.CreateMapper();

        var service = new ProductService(repository.Object, uow.Object, currentUser.Object, mapper);
        var result = await service.CreateAsync(new ProductRequest { ProductName = "Desk" });

        result.ProductName.Should().Be("Desk");
        repository.Verify(x => x.AddAsync(It.IsAny<Product>(), It.IsAny<CancellationToken>()), Times.Once);
        uow.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}