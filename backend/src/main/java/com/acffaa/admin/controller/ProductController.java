package com.acffaa.admin.controller;

import com.acffaa.admin.model.Product;
import com.acffaa.admin.repository.ProductRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductRepository repository;

    public ProductController(ProductRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Product> all() {
        return repository.findAll();
    }

    @PostMapping
    public Product create(@RequestBody Product product) {
        product.setId(null);
        return repository.save(product);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> update(@PathVariable Long id, @RequestBody Product data) {
        return repository.findById(id).map(product -> {
            product.setName(data.getName());
            product.setCategory(data.getCategory());
            product.setPrice(data.getPrice());
            product.setStock(data.getStock());
            return ResponseEntity.ok(repository.save(product));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repository.existsById(id)) return ResponseEntity.notFound().build();
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
