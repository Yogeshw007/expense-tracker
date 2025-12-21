package com.expensetracker.config;

import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

@Configuration
public class DatabaseConfig {

    @Bean
    @Primary
    public DataSource dataSource() {
        String databaseUrl = System.getenv("DATABASE_URL");

        System.out.println("=== DATABASE CONFIGURATION ===");
        System.out.println("DATABASE_URL present: " + (databaseUrl != null && !databaseUrl.isEmpty()));

        // If DATABASE_URL is set, parse it properly
        if (databaseUrl != null && !databaseUrl.isEmpty()) {
            System.out.println("Original DATABASE_URL: " + databaseUrl.replaceAll(":[^:@]+@", ":****@"));

            // Simply add jdbc: prefix if not present
            if (databaseUrl.startsWith("postgresql://") && !databaseUrl.startsWith("jdbc:")) {
                databaseUrl = "jdbc:" + databaseUrl;
            } else if (databaseUrl.startsWith("postgres://") && !databaseUrl.startsWith("jdbc:")) {
                databaseUrl = databaseUrl.replace("postgres://", "jdbc:postgresql://");
            }

            // Parse the URL to extract username, password, host, port, database
            // Format: jdbc:postgresql://username:password@host:port/database?params
            try {
                // Remove jdbc:postgresql:// prefix
                String urlWithoutPrefix = databaseUrl.substring("jdbc:postgresql://".length());

                // Extract credentials (before @)
                int atIndex = urlWithoutPrefix.indexOf("@");
                String credentials = urlWithoutPrefix.substring(0, atIndex);
                String[] credParts = credentials.split(":", 2);
                String username = credParts[0];
                String password = credParts.length > 1 ? credParts[1] : "";

                // Extract host, port, database (after @)
                String remaining = urlWithoutPrefix.substring(atIndex + 1);

                // Check if port exists
                String host;
                String port = "5432"; // default PostgreSQL port
                int slashIndex = remaining.indexOf("/");
                String hostPort = remaining.substring(0, slashIndex);

                if (hostPort.contains(":")) {
                    String[] hostPortParts = hostPort.split(":", 2);
                    host = hostPortParts[0];
                    port = hostPortParts[1];
                } else {
                    host = hostPort;
                }

                // Extract database and params
                String dbAndParams = remaining.substring(slashIndex + 1);

                // Build clean JDBC URL without credentials
                String cleanUrl = "jdbc:postgresql://" + host + ":" + port + "/" + dbAndParams;

                System.out.println("Parsed - Host: " + host + ", Port: " + port + ", User: " + username);
                System.out.println("Clean URL: " + cleanUrl);
                System.out.println("==============================");

                // Build datasource with explicit credentials
                return DataSourceBuilder.create()
                        .url(cleanUrl)
                        .username(username)
                        .password(password)
                        .build();

            } catch (Exception e) {
                System.err.println("ERROR parsing DATABASE_URL: " + e.getMessage());
                e.printStackTrace();
                throw new RuntimeException("Failed to parse DATABASE_URL", e);
            }
        }

        System.out.println("Using default local PostgreSQL configuration");
        System.out.println("==============================");

        // Fallback to default Spring Boot configuration
        return DataSourceBuilder.create()
                .url("jdbc:postgresql://localhost:5432/expensetracker")
                .username("postgres")
                .password("postgres")
                .driverClassName("org.postgresql.Driver")
                .build();
    }
}

