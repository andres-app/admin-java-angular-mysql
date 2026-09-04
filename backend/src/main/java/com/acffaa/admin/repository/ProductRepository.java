package com.acffaa.admin.repository;

import com.acffaa.admin.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
