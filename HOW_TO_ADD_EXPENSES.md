# 📝 How to Add Expenses

## 🎯 Quick Summary

Your database now has **5 categories** with a total budget of **₹16,700/month**:

| ID | Category | Monthly Limit |
|----|----------|---------------|
| 7 | Broadband & OTT | ₹700 |
| 8 | Fuel | ₹2,000 |
| 9 | House Rent | ₹12,000 |
| 10 | Entertainment | ₹1,000 |
| 11 | Food | ₹1,000 |

---

## 🚀 Method 1: Using the Frontend (Easiest)

### **Step 1: Open Your Frontend**

Go to your Netlify site (or local frontend):
- **Production:** https://your-netlify-site.netlify.app
- **Local:** http://localhost:8000/index.html

### **Step 2: Navigate to Expenses Page**

Click on **"Expenses"** in the navigation menu

### **Step 3: Add Expense**

1. Click **"Add Expense"** button
2. Fill in the form:
   - **Category:** Select from dropdown (Broadband & OTT, Fuel, etc.)
   - **Amount:** Enter amount (e.g., 500)
   - **Description:** Enter description (e.g., "Netflix subscription")
   - **Date:** Select date
3. Click **"Save"**

---

## 💻 Method 2: Using API (Command Line)

### **Add Expense via curl:**

```bash
# Example 1: Add Netflix expense to Broadband & OTT
curl -X POST https://expense-tracker-backend-bxuv.onrender.com/api/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "categoryId": 7,
    "amount": 199,
    "description": "Netflix subscription",
    "expenseDate": "2025-12-19"
  }'

# Example 2: Add petrol expense to Fuel
curl -X POST https://expense-tracker-backend-bxuv.onrender.com/api/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "categoryId": 8,
    "amount": 1500,
    "description": "Petrol for bike",
    "expenseDate": "2025-12-19"
  }'

# Example 3: Add rent to House Rent
curl -X POST https://expense-tracker-backend-bxuv.onrender.com/api/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "categoryId": 9,
    "amount": 12000,
    "description": "Monthly rent",
    "expenseDate": "2025-12-01"
  }'

# Example 4: Add movie expense to Entertainment
curl -X POST https://expense-tracker-backend-bxuv.onrender.com/api/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "categoryId": 10,
    "amount": 500,
    "description": "Movie tickets",
    "expenseDate": "2025-12-19"
  }'

# Example 5: Add food expense
curl -X POST https://expense-tracker-backend-bxuv.onrender.com/api/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "categoryId": 11,
    "amount": 350,
    "description": "Lunch at restaurant",
    "expenseDate": "2025-12-19"
  }'
```

---

## 📊 Method 3: Using the Script

I've created a script to add sample expenses:

```bash
./add-sample-expenses.sh
```

---

## 🔍 View Your Expenses

### **Get All Expenses:**
```bash
curl https://expense-tracker-backend-bxuv.onrender.com/api/expenses
```

### **Get Expenses by Category:**
```bash
# Get all Fuel expenses (category ID 8)
curl https://expense-tracker-backend-bxuv.onrender.com/api/expenses/category/8
```

### **Get Analytics:**
```bash
curl https://expense-tracker-backend-bxuv.onrender.com/api/analytics/stats
```

---

## 📋 API Endpoints Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/expenses` | Get all expenses |
| GET | `/api/expenses/{id}` | Get expense by ID |
| GET | `/api/expenses/category/{categoryId}` | Get expenses by category |
| POST | `/api/expenses` | Create new expense |
| PUT | `/api/expenses/{id}` | Update expense |
| DELETE | `/api/expenses/{id}` | Delete expense |

---

## 🎨 Expense JSON Format

```json
{
  "categoryId": 7,           // Required: Category ID (7-11)
  "amount": 199.00,          // Required: Amount in rupees
  "description": "Netflix",  // Required: Description
  "expenseDate": "2025-12-19" // Required: Date (YYYY-MM-DD)
}
```

---

## ✅ Next Steps

1. ✅ **Categories are set up** (5 categories, ₹16,700 total budget)
2. ⏳ **Add expenses** using one of the methods above
3. ⏳ **View analytics** on the dashboard
4. ⏳ **Track spending** against your budget

---

**Your database is ready! Start adding expenses now!** 🚀

