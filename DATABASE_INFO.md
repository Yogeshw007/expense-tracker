# Database Configuration

## Database Type
This application uses **H2 Database** in file-based mode for data persistence.

## Database Location
The database file is stored at:
```
expense-tracker-java/backend/data/expensetracker.mv.db
```

## Persistence
- **All data is automatically saved** to the database file
- Data persists across application restarts
- No manual save operation is required

## Database Configuration Details
- **URL**: `jdbc:h2:file:./data/expensetracker`
- **Driver**: H2 Database Engine
- **Username**: `sa`
- **Password**: (empty)
- **Mode**: File-based persistence (data is saved to disk)

## Accessing the Database

### H2 Console (Web Interface)
You can access the H2 database console to view and query data directly:

1. Make sure the backend server is running
2. Open your browser and go to: **http://localhost:8080/h2-console**
3. Use these connection settings:
   - **JDBC URL**: `jdbc:h2:file:./data/expensetracker`
   - **User Name**: `sa`
   - **Password**: (leave empty)
4. Click "Connect"

### Database Tables
The application creates the following tables:
- **categories**: Stores expense categories with monthly limits
- **expenses**: Stores individual expense records

## Backup and Restore

### Backup
To backup your data, simply copy the database file:
```bash
cp backend/data/expensetracker.mv.db backend/data/expensetracker.mv.db.backup
```

### Restore
To restore from a backup:
```bash
# Stop the application first
cp backend/data/expensetracker.mv.db.backup backend/data/expensetracker.mv.db
# Restart the application
```

## Data Retention
- Data is retained indefinitely unless manually deleted
- The database file grows as you add more records
- Regular backups are recommended for important data

## Switching to Another Database (Optional)

If you want to use a different database (MySQL, PostgreSQL, etc.), you can:

1. Add the appropriate database driver dependency to `pom.xml`
2. Update the `application.properties` with new database connection details
3. The application will work with any JDBC-compatible database

Example for MySQL:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/expensetracker
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
```

