package com.vti.controller;

import com.vti.dto.CategoryDTO;
import com.vti.entity.Category;
import com.vti.form.CategoryCreateForm;
import com.vti.form.CategoryFilterForm;
import com.vti.form.CategoryUpdateForm;
import com.vti.service.ICategoryService;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RestController
@RequestMapping("/api/v1/categories")
public class CategoryController {
    @Autowired
    private ICategoryService service;

    @Autowired
    private ModelMapper mapper;

    @GetMapping
    public Page<CategoryDTO> findAll(Pageable pageable, CategoryFilterForm form) {
        Page<Category> page = service.findAll(pageable, form);
        List<CategoryDTO> dtos = mapper.map(
                page.getContent(),
                new TypeToken<List<CategoryDTO>>() {}.getType()
        );

        for (CategoryDTO categoryDTO : dtos) {
            List<CategoryDTO.ProductDTO> productDTOS = categoryDTO.getProducts();
            for (CategoryDTO.ProductDTO productDTO : productDTOS) {
                productDTO.add(linkTo(methodOn(ProductController.class).findById(productDTO.getId())).withSelfRel());
            }
            categoryDTO.add(linkTo(methodOn(CategoryController.class).findById(categoryDTO.getId())).withSelfRel());
        }

        return new PageImpl<>(dtos, pageable, page.getTotalElements());
    }

    @GetMapping("/{id}")
    public CategoryDTO findById(@PathVariable("id") int id) {
        return mapper.map(service.findById(id), CategoryDTO.class)
                .add(linkTo(methodOn(CategoryController.class).findById(id)).withSelfRel());
    }


    @PostMapping
    public void create(@RequestBody CategoryCreateForm form) {
        service.create(form);
    }

    @PutMapping("/{id}")
    public void update(@PathVariable("id") int id, @RequestBody CategoryUpdateForm form) {
        form.setId(id);
        service.update(form);
    }

    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable("id") int id) {
        service.deleteById(id);
    }
}
