package com.acffaa.admin.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    public record LoginRequest(String username, String password) {}

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        if ("admin".equals(request.username()) && "123123".equals(request.password())) {
            return ResponseEntity.ok(Map.of(
                "ok", true,
                "name", "Administrador",
                "username", "admin",
                "role", "ADMIN"
            ));
        }
        return ResponseEntity.status(401).body(Map.of("ok", false, "message", "Credenciales inválidas"));
    }
}
