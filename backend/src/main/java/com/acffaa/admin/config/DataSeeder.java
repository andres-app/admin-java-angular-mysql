package com.acffaa.admin.config;

import com.acffaa.admin.model.AppUser;
import com.acffaa.admin.model.Product;
import com.acffaa.admin.repository.AppUserRepository;
import com.acffaa.admin.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.math.BigDecimal;

@Configuration
public class DataSeeder {
    @Bean
    CommandLineRunner seed(AppUserRepository users, ProductRepository products) {
        return args -> {
            if (users.count() == 0) {
                users.save(new AppUser("Administrador", "admin", "ADMIN", true));
                users.save(new AppUser("María López", "mlopez", "OPERADOR", true));
                users.save(new AppUser("Carlos Vega", "cvega", "CONSULTA", false));
            }
            if (products.count() == 0) {
                products.save(new Product("Producto A", "General", new BigDecimal("25.50"), 18));
                products.save(new Product("Producto B", "Accesorios", new BigDecimal("42.00"), 9));
                products.save(new Product("Producto C", "General", new BigDecimal("15.90"), 24));
            }
        };
    }
}
