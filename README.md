# Web Admin — Java + Angular + MySQL

Este proyecto SÍ contiene:

- Java 21
- Spring Boot
- API REST
- Spring Data JPA / Hibernate
- Angular 19
- MySQL (perfil `mysql`)
- Docker multi-stage

## Lo importante: no necesitas instalar las dependencias en tu PC

El `Dockerfile` hace automáticamente:

1. Descarga Node dentro del entorno de compilación.
2. Instala Angular y sus paquetes.
3. Compila Angular.
4. Descarga Maven/Java dentro del entorno de compilación.
5. Compila Spring Boot.
6. Copia Angular dentro del JAR de Spring Boot.
7. Publica una sola aplicación web.

El resultado final funciona así:

Angular -> /api -> Spring Boot -> JPA -> Base de datos

## Acceso del demo

Usuario: `admin`
Contraseña: `123123`

## Módulos incluidos

- Login
- Dashboard
- CRUD de usuarios
- CRUD de productos
- Buscadores
- Dashboard de stock y valorización
- Diseño responsive

## Base de datos

### Modo 1 — DEMO inmediato

Por defecto usa H2 en memoria, con compatibilidad MySQL. Esto permite desplegarlo y verlo funcionar sin configurar una base externa. Los datos demo se reinician cuando el servicio se reinicia; para persistencia real activa el perfil MySQL.

Variable:

`SPRING_PROFILES_ACTIVE=h2`

### Modo 2 — MySQL real

En el hosting cambia/agrega estas variables:

`SPRING_PROFILES_ACTIVE=mysql`

`DB_URL=jdbc:mysql://HOST:PUERTO/NOMBRE_DB?useSSL=true&serverTimezone=UTC`

`DB_USERNAME=tu_usuario`

`DB_PASSWORD=tu_clave`

No tienes que modificar el código.

## Publicación sin instalar Java/Angular/Node/Maven

Sube esta carpeta completa a un repositorio GitHub desde el navegador y crea un servicio Docker en un hosting compatible con Docker.

El hosting leerá el `Dockerfile` y hará toda la compilación por ti.

## Estructura

```
admin-java-angular-mysql/
├── Dockerfile
├── render.yaml
├── backend/
│   ├── pom.xml
│   └── src/main/...
└── frontend/
    ├── package.json
    ├── angular.json
    └── src/...
```

## Nota de seguridad

El login `admin / 123123` es intencionalmente simple para este proyecto de demostración. Para producción debe reemplazarse por Spring Security + JWT o sesiones seguras, BCrypt y permisos por rol.
