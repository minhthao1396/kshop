package com.vti.service;

import com.vti.entity.Product;
import com.vti.form.ProductCreateForm;
import com.vti.form.ProductFilterForm;
import com.vti.form.ProductUpdateForm;
import com.vti.repository.IProductRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ProductService implements IProductService {
    @Autowired
    private IProductRepository repository;

    @Autowired
    private ModelMapper mapper;

    @Override
    public Page<Product> findAll(Pageable pageable, ProductFilterForm form) {
        // TODO: 9/16/2022
        return null;
    }

    @Override
    public Product findById(int id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public void create(ProductCreateForm form) {
        repository.save(mapper.map(form, Product.class));
    }

    @Override
    public void update(ProductUpdateForm form) {
        repository.save(mapper.map(form, Product.class));
    }

    @Override
    public void deleteById(int id) {
        repository.deleteById(id);
    }
}
