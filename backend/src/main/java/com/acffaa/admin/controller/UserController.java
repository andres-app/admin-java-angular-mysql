package com.acffaa.admin.controller;

import com.acffaa.admin.model.AppUser;
import com.acffaa.admin.repository.AppUserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final AppUserRepository repository;

    public UserController(AppUserRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<AppUser> all() {
        return repository.findAll();
    }

    @PostMapping
    public AppUser create(@RequestBody AppUser user) {
        user.setId(null);
        return repository.save(user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AppUser> update(@PathVariable Long id, @RequestBody AppUser data) {
        return repository.findById(id).map(user -> {
            user.setName(data.getName());
            user.setUsername(data.getUsername());
            user.setRole(data.getRole());
            user.setActive(data.isActive());
            return ResponseEntity.ok(repository.save(user));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repository.existsById(id)) return ResponseEntity.notFound().build();
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
