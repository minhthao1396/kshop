package com.vti.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.hateoas.RepresentationModel;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class ProductDTO extends RepresentationModel<ProductDTO> {
    private int id;
    private String name;
    private double price;
    private double salePrice;
    private String thumbnailUrl;
    private String description;
    private String ram;
    private LocalDate createdDate;
    private LocalDate updatedDate;
    private CategoryDTO category;

    @Getter
    @Setter
    @NoArgsConstructor
    public static class CategoryDTO extends RepresentationModel<ProductDTO> {
        private int id;
        private String name;
        private LocalDate createdDate;
        private LocalDate updatedDate;
    }
}