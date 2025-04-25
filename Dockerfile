# Первый этап: сборка
FROM maven:3.9.5-eclipse-temurin-17 as builder

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

# Второй этап: рантайм
FROM openjdk:17-jdk-slim

WORKDIR /app

COPY --from=builder /app/target/regMedicalTest-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
