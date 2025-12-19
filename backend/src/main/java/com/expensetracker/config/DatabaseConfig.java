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
            // Neon/Render provides URL as postgresql://... but JDBC needs jdbc:postgresql://...
            if (databaseUrl.startsWith("postgresql://") && !databaseUrl.startsWith("jdbc:")) {
                databaseUrl = "jdbc:" + databaseUrl;
            } else if (databaseUrl.startsWith("postgres://") && !databaseUrl.startsWith("jdbc:")) {
                // Some platforms use postgres:// instead of postgresql://
                databaseUrl = databaseUrl.replace("postgres://", "jdbc:postgresql://");
            }
            
            // Extract username and password from URL if present
            String username = System.getenv("SPRING_DATASOURCE_USERNAME");
            String password = System.getenv("SPRING_DATASOURCE_PASSWORD");
            
            // If username/password not in env vars, try to extract from URL
            if (username == null || password == null) {
                try {
                    // URL format: jdbc:postgresql://username:password@host:port/database?params
                    String urlWithoutJdbc = databaseUrl.replace("jdbc:", "");
                    String[] parts = urlWithoutJdbc.split("@");
                    if (parts.length > 1) {
                        String[] credentials = parts[0].replace("postgresql://", "").split(":");
                        if (credentials.length == 2) {
                            username = credentials[0];
                            password = credentials[1];
                        }
                    }
                } catch (Exception e) {
                    // If extraction fails, use defaults
                    username = username != null ? username : "postgres";
                    password = password != null ? password : "postgres";
                }
            }
            
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

