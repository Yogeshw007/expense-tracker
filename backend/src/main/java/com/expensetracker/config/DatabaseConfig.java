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

        // If DATABASE_URL is set, fix the URL format
        if (databaseUrl != null && !databaseUrl.isEmpty()) {
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
                    // If no port specified (no : after hostname before /)
                    if (!hostAndDb.contains(":")) {
                        // Insert :5432 before the /database part
                        int slashIndex = hostAndDb.indexOf("/");
                        if (slashIndex > 0) {
                            String host = hostAndDb.substring(0, slashIndex);
                            String dbAndParams = hostAndDb.substring(slashIndex);
                            databaseUrl = "jdbc:postgresql://" + username + ":" + password + "@" + host + ":5432" + dbAndParams;
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

            System.out.println("Connecting to database with URL: " + databaseUrl.replaceAll(":[^:@]+@", ":****@"));

            return DataSourceBuilder.create()
                    .url(databaseUrl)
                    .username(username)
                    .password(password)
                    .driverClassName("org.postgresql.Driver")
                    .build();
        }

        // Fallback to default Spring Boot configuration
        return DataSourceBuilder.create()
                .url("jdbc:postgresql://localhost:5432/expensetracker")
                .username("postgres")
                .password("postgres")
                .driverClassName("org.postgresql.Driver")
                .build();
    }
}

