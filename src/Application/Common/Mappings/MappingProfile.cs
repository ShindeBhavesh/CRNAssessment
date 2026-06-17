using Application.DTOs.Items;
using Application.DTOs.Products;
using AutoMapper;
using Domain.Entities;

namespace Application.Common.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Product, ProductResponse>();
        CreateMap<Item, ItemResponse>()
            .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product != null ? src.Product.ProductName : string.Empty));
    }
}