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

        // If DATABASE_URL is set, use it directly without parsing
        if (databaseUrl != null && !databaseUrl.isEmpty()) {
            System.out.println("Original DATABASE_URL: " + databaseUrl.replaceAll(":[^:@]+@", ":****@"));

            // Simply add jdbc: prefix if not present
            if (databaseUrl.startsWith("postgresql://") && !databaseUrl.startsWith("jdbc:")) {
                databaseUrl = "jdbc:" + databaseUrl;
            } else if (databaseUrl.startsWith("postgres://") && !databaseUrl.startsWith("jdbc:")) {
                databaseUrl = databaseUrl.replace("postgres://", "jdbc:postgresql://");
            }

            // CRITICAL FIX: Add port :5432 if missing
            // Check if URL has format: jdbc:postgresql://user:pass@host/database (missing :port)
            // Pattern: @ followed by hostname (no :port) followed by /
            if (databaseUrl.matches(".*@[^:/@]+/.*")) {
                // Port is missing - insert :5432 before the /
                databaseUrl = databaseUrl.replaceFirst("(@[^/]+)/", "$1:5432/");
                System.out.println("Added missing port :5432 to URL");
            }

            System.out.println("Final DATABASE_URL: " + databaseUrl.replaceAll(":[^:@]+@", ":****@"));
            System.out.println("Using URL-embedded credentials (not extracting separately)");
            System.out.println("==============================");

            // Let the JDBC driver parse the URL and extract credentials itself
            // Do NOT extract username/password - they're already in the URL
            // Do NOT set driverClassName when URL has embedded credentials
            return DataSourceBuilder.create()
                    .url(databaseUrl)
                    .build();
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

