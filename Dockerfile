# 1) Angular se compila dentro del hosting
FROM node:20-alpine AS frontend-builder
WORKDIR /frontend
COPY frontend/package.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# 2) Spring Boot se compila dentro del hosting
FROM maven:3.9.9-eclipse-temurin-21 AS backend-builder
WORKDIR /backend
COPY backend/pom.xml ./
RUN mvn -q -DskipTests dependency:go-offline
COPY backend/src ./src
COPY --from=frontend-builder /frontend/dist/admin-web/browser ./src/main/resources/static
RUN mvn -q -DskipTests package

# 3) Imagen final: solo Java runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=backend-builder /backend/target/admin-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
