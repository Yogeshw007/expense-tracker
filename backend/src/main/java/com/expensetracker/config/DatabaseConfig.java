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

        // If DATABASE_URL is set, fix the URL format
        if (databaseUrl != null && !databaseUrl.isEmpty()) {
            System.out.println("Original DATABASE_URL: " + databaseUrl.replaceAll(":[^:@]+@", ":****@"));
            String username = null;
            String password = null;

            // Neon/Render provides URL as postgresql://... but JDBC needs jdbc:postgresql://...
            if (databaseUrl.startsWith("postgresql://") && !databaseUrl.startsWith("jdbc:")) {
                databaseUrl = "jdbc:" + databaseUrl;
            } else if (databaseUrl.startsWith("postgres://") && !databaseUrl.startsWith("jdbc:")) {
                // Some platforms use postgres:// instead of postgresql://
                databaseUrl = databaseUrl.replace("postgres://", "jdbc:postgresql://");
            }

            // Extract username and password from URL
            try {
                // URL format: jdbc:postgresql://username:password@host:port/database?params
                String urlWithoutJdbc = databaseUrl.replace("jdbc:postgresql://", "");

                // Split by @ to separate credentials from host
                String[] parts = urlWithoutJdbc.split("@");
                if (parts.length == 2) {
                    // Extract credentials
                    String[] credentials = parts[0].split(":");
                    if (credentials.length == 2) {
                        username = credentials[0];
                        password = credentials[1];
                    }

                    // Check if port is missing and add default PostgreSQL port
                    String hostAndDb = parts[1];
                    String host = "";
                    String dbAndParams = "";

                    // If no port specified (no : after hostname before /)
                    if (!hostAndDb.contains(":")) {
                        // Insert :5432 before the /database part
                        int slashIndex = hostAndDb.indexOf("/");
                        if (slashIndex > 0) {
                            host = hostAndDb.substring(0, slashIndex);
                            dbAndParams = hostAndDb.substring(slashIndex);
                            databaseUrl = "jdbc:postgresql://" + username + ":" + password + "@" + host + ":5432" + dbAndParams;
                        }
                    } else {
                        // Port is already specified
                        int slashIndex = hostAndDb.indexOf("/");
                        if (slashIndex > 0) {
                            host = hostAndDb.substring(0, slashIndex);
                            dbAndParams = hostAndDb.substring(slashIndex);
                        }
                    }

                    // NEON SPECIFIC: Add endpoint ID parameter if host contains neon.tech
                    if (host.contains("neon.tech")) {
                        // Extract endpoint ID (first part of hostname before first dot)
                        String endpointId = host.split("\\.")[0];

                        // Check if endpoint parameter already exists
                        if (!databaseUrl.contains("options=endpoint")) {
                            // Add endpoint parameter
                            if (databaseUrl.contains("?")) {
                                // Already has query params, append with &
                                databaseUrl += "&options=endpoint%3D" + endpointId;
                            } else {
                                // No query params, add with ?
                                databaseUrl += "?options=endpoint%3D" + endpointId;
                            }
                        }

                        // Add SSL mode if not present (required for Neon)
                        if (!databaseUrl.contains("sslmode=")) {
                            databaseUrl += "&sslmode=require";
                        }

                        // Disable channel binding to avoid SCRAM issues
                        if (!databaseUrl.contains("sslrootcert=")) {
                            databaseUrl += "&sslrootcert=ALLOW_INVALID";
                        }
                    }
                }
            } catch (Exception e) {
                System.err.println("Error parsing DATABASE_URL: " + e.getMessage());
            }

            // Use extracted credentials or fall back to env vars
            if (username == null) {
                username = System.getenv("SPRING_DATASOURCE_USERNAME");
            }
            if (password == null) {
                password = System.getenv("SPRING_DATASOURCE_PASSWORD");
            }

            // Final fallback
            if (username == null) username = "postgres";
            if (password == null) password = "postgres";

            System.out.println("Final DATABASE_URL: " + databaseUrl.replaceAll(":[^:@]+@", ":****@"));
            System.out.println("Username: " + username);
            System.out.println("Password: " + (password != null ? "****" : "null"));
            System.out.println("==============================");

            return DataSourceBuilder.create()
                    .url(databaseUrl)
                    .username(username)
                    .password(password)
                    .driverClassName("org.postgresql.Driver")
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

