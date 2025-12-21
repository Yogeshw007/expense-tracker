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

            // CRITICAL FIX: Neon URLs don't include port, we need to add :5432
            // Format: jdbc:postgresql://user:pass@host/database
            // Need to insert :5432 between host and /database
            // Find the position of @ and the next /
            int atIndex = databaseUrl.lastIndexOf("@");
            int slashIndex = databaseUrl.indexOf("/", atIndex);

            if (atIndex > 0 && slashIndex > atIndex) {
                String beforeHost = databaseUrl.substring(0, atIndex + 1);
                String hostPart = databaseUrl.substring(atIndex + 1, slashIndex);
                String afterHost = databaseUrl.substring(slashIndex);

                // Check if port is already present in hostPart
                if (!hostPart.contains(":")) {
                    // No port found, add :5432
                    databaseUrl = beforeHost + hostPart + ":5432" + afterHost;
                    System.out.println("Added missing port :5432 to URL");
                }
            }

            System.out.println("Final DATABASE_URL: " + databaseUrl.replaceAll(":[^:@]+@", ":****@"));
            System.out.println("==============================");

            // Let Spring Boot auto-configure the datasource
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

