package com.vti.specification;

import com.vti.entity.Product;
import com.vti.entity.Product_;
import com.vti.form.ProductFilterForm;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public class ProductSpecification {
    public static Specification<Product> buildWhere(ProductFilterForm form) {
        if (form == null) {
            return null;
        }
        return hasNameLike(form.getSearch());
    }

    private static Specification<Product> hasNameLike(String search) {
        return (root, query, builder) -> {
            if (!StringUtils.hasText(search)) {
                return null;
            }
            return builder.like(root.get(Product_.name), "%" + search.trim() + "%");
        };
    }
}
