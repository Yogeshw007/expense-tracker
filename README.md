# 💰 Expense Tracker - Java Spring Boot Edition

A full-stack expense tracking application built with **Java Spring Boot** backend and **plain HTML/CSS/JavaScript** frontend. Track your monthly expenses, set category budgets, and visualize your spending patterns with beautiful charts.

## 🌐 Live Deployment

### 🔗 Application URLs

- **Frontend (Live App):** Coming Soon (Deploy to Netlify)
- **Backend API:** https://expense-tracker-backend-bxuv.onrender.com/api
- **Database:** Neon PostgreSQL (Serverless)
  - Host: `ep-round-dawn-adg743ow-pooler.us-east-1.aws.neon.tech`
  - Database: `neondb`
  - Connection: Secure SSL

### 📡 API Endpoints (Live)

- Categories: https://expense-tracker-backend-bxuv.onrender.com/api/categories
- Expenses: https://expense-tracker-backend-bxuv.onrender.com/api/expenses
- Analytics: https://expense-tracker-backend-bxuv.onrender.com/api/analytics/stats

### 🗄️ Database Information

- **Provider:** Neon (Serverless PostgreSQL)
- **Type:** PostgreSQL 17
- **Storage:** 512 MB (Free Tier)
- **Persistence:** ✅ Permanent (Data never expires)
- **Backups:** Automatic (7-day retention)
- **Region:** AWS US East 1 (N. Virginia)

## ✨ Features

- **📊 Dashboard** - Overview of monthly spending with budget tracking
- **💳 Expense Management** - Add, edit, and delete expenses with ease
- **📈 Analytics** - Visual charts showing spending breakdown and trends
- **🏷️ Category Management** - Create custom categories with monthly limits
- **⚠️ Budget Alerts** - Visual indicators when you exceed category budgets
- **📅 Monthly Tracking** - View expenses by month and year
- **💾 Persistent Data** - H2 database stores all your data locally
- **🎨 Modern UI** - Clean, responsive design with vanilla JavaScript

## 🚀 Quick Start

### Prerequisites

- **Java 17** or higher
- **Maven 3.6+**
- A modern web browser

### Installation & Running

#### Backend (Spring Boot)

```bash
cd expense-tracker-java/backend

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The backend server will start on **http://localhost:8080**

#### Frontend (HTML/CSS/JS)

Simply open the frontend files in a web browser:

```bash
cd expense-tracker-java/frontend

# Option 1: Open directly in browser
open index.html

# Option 2: Use a simple HTTP server (recommended)
# Python 3
python3 -m http.server 3000

# Node.js (if you have http-server installed)
npx http-server -p 3000
```

Then open your browser to: **http://localhost:3000**

## 📁 Project Structure

```
expense-tracker-java/
├── backend/
│   ├── src/main/java/com/expensetracker/
│   │   ├── model/              # Entity classes
│   │   │   ├── Category.java
│   │   │   └── Expense.java
│   │   ├── repository/         # JPA repositories
│   │   │   ├── CategoryRepository.java
│   │   │   └── ExpenseRepository.java
│   │   ├── service/            # Business logic
│   │   │   ├── CategoryService.java
│   │   │   ├── ExpenseService.java
│   │   │   └── AnalyticsService.java
│   │   ├── controller/         # REST controllers
│   │   │   ├── CategoryController.java
│   │   │   ├── ExpenseController.java
│   │   │   └── AnalyticsController.java
│   │   ├── dto/                # Data transfer objects
│   │   ├── config/             # Configuration classes
│   │   └── ExpenseTrackerApplication.java
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
├── frontend/
│   ├── css/
│   │   └── style.css           # All styles
│   ├── js/
│   │   ├── config.js           # API configuration
│   │   ├── utils.js            # Utility functions
│   │   ├── dashboard.js        # Dashboard logic
│   │   ├── expenses.js         # Expenses page logic
│   │   ├── categories.js       # Categories page logic
│   │   └── analytics.js        # Analytics page logic
│   ├── index.html              # Dashboard page
│   ├── expenses.html           # Expenses page
│   ├── analytics.html          # Analytics page
│   └── categories.html         # Categories page
└── README.md
```

## 🛠️ Technology Stack

### Backend
- **Java 17** - Programming language
- **Spring Boot 3.2.0** - Application framework
- **Spring Data JPA** - Data persistence
- **H2 Database** - Embedded database
- **Lombok** - Reduce boilerplate code
- **Maven** - Build tool

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling
- **Vanilla JavaScript** - Logic and interactivity
- **Chart.js** - Data visualization
- **Font Awesome** - Icons

## 📊 API Endpoints

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/{id}` - Get category by ID
- `POST /api/categories` - Create category
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category

### Expenses
- `GET /api/expenses` - Get expenses (with optional filters: month, year, categoryId)
- `GET /api/expenses/{id}` - Get expense by ID
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/{id}` - Update expense
- `DELETE /api/expenses/{id}` - Delete expense

### Analytics
- `GET /api/analytics/monthly?month={month}&year={year}` - Monthly summary
- `GET /api/analytics/breakdown?month={month}&year={year}` - Category breakdown
- `GET /api/analytics/stats` - Overall statistics

## 🎯 Usage Guide

### 1. Set Up Categories

1. Go to **Categories** page
2. Click **Add Category**
3. Enter category name (e.g., "Petrol", "Groceries")
4. Set monthly budget limit
5. Choose a color for visual identification
6. Click **Save**

### 2. Add Expenses

1. Go to **Expenses** page
2. Click **Add Expense**
3. Select category
4. Enter amount and description
5. Choose date
6. Click **Save**

### 3. View Analytics

1. Go to **Analytics** page
2. Select month and year
3. View pie chart for spending distribution
4. View bar chart for budget vs actual comparison
5. Check detailed breakdown table

### 4. Monitor Dashboard

- View current month's budget status
- See total spent vs remaining budget
- Track category-wise spending with progress bars
- Get visual alerts for over-budget categories

## 🗄️ Database

### Production Database (Neon PostgreSQL)

The deployed application uses **Neon PostgreSQL** - a serverless PostgreSQL database with the following benefits:

- ✅ **Permanent Storage** - Data never expires or gets deleted
- ✅ **Automatic Backups** - 7-day point-in-time recovery
- ✅ **Serverless** - Auto-scales and auto-sleeps when inactive
- ✅ **Free Tier** - 512 MB storage, 191.9 compute hours/month
- ✅ **High Availability** - Built on AWS infrastructure

**Connection Details:**
- **Host:** `ep-round-dawn-adg743ow-pooler.us-east-1.aws.neon.tech`
- **Database:** `neondb`
- **SSL Mode:** Required
- **Region:** AWS US East 1

### Local Development Database (H2)

For local development, the application uses **H2** in-memory database. Data is persisted to a file at `./data/expensetracker.mv.db`.

To access the H2 console locally:
1. Navigate to http://localhost:8080/h2-console
2. Use JDBC URL: `jdbc:h2:file:./data/expensetracker`
3. Username: `sa`
4. Password: (leave blank)

## 🔧 Configuration

### Environment Variables (Production)

The application uses the following environment variables on Render:

- `DATABASE_URL` - PostgreSQL connection string from Neon
  ```
  postgresql://neondb_owner:npg_PKD2I0Qgxhku@ep-round-dawn-adg743ow-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
  ```
- `PORT` - Server port (automatically set by Render, defaults to 8080)

### Local Configuration

Edit `backend/src/main/resources/application.properties` to customize:
- Server port
- Database settings (switches between PostgreSQL and H2)
- JPA/Hibernate settings
- CORS configuration

## 🚀 Deployment

### Backend (Render)

The backend is deployed on **Render** with the following configuration:

1. **Service:** Web Service
2. **Build Command:** `mvn clean install`
3. **Start Command:** `java -jar target/expense-tracker-1.0.0.jar`
4. **Environment Variables:**
   - `DATABASE_URL` - Neon PostgreSQL connection string
5. **Auto-Deploy:** Enabled (deploys on git push)

### Frontend (Netlify - Coming Soon)

The frontend will be deployed on **Netlify** with:

1. **Build Directory:** `expense-tracker-java/frontend`
2. **Publish Directory:** `.` (root of frontend folder)
3. **Build Command:** None (static HTML/CSS/JS)

### Database (Neon)

- **Provider:** Neon (https://neon.tech)
- **Plan:** Free Tier
- **Features:** Serverless PostgreSQL, Auto-scaling, Auto-backups

## 📝 License

MIT

## 👨‍💻 Author

Created with ❤️ for better expense management using Java Spring Boot

