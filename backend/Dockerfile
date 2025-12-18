# Build stage
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build
COPY src ./src
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy the built jar from build stage
COPY --from=build /app/target/expense-tracker-1.0.0.jar app.jar

# Create data directory for H2 database
RUN mkdir -p /app/data

# Expose port (Render will set PORT environment variable)
EXPOSE ${PORT:-8080}

# Run the application
# Use shell form to allow environment variable expansion
CMD java -Xmx512m -Dserver.port=${PORT:-8080} -jar app.jar

