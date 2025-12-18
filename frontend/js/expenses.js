// Expenses Page

let expenses = [];
let categories = [];
let editingExpenseId = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    populateYearFilter('yearFilter');
    document.getElementById('monthFilter').value = getCurrentMonth();
    document.getElementById('yearFilter').value = getCurrentYear();
    
    loadCategories();
    loadExpenses();
});

// Load categories
async function loadCategories() {
    try {
        categories = await apiCall(API.categories.getAll());
        populateCategorySelect();
    } catch (error) {
        showError('Failed to load categories');
        console.error(error);
    }
}

// Populate category select
function populateCategorySelect() {
    const select = document.getElementById('categoryId');
    select.innerHTML = '<option value="">Select a category</option>' +
        categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
}

// Load expenses
async function loadExpenses() {
    try {
        const month = document.getElementById('monthFilter').value;
        const year = document.getElementById('yearFilter').value;
        
        expenses = await apiCall(API.expenses.getAll({ month, year }));
        renderExpenses();
        updateTotal();
    } catch (error) {
        showError('Failed to load expenses');
        console.error(error);
    }
}

// Render expenses table
function renderExpenses() {
    const container = document.getElementById('expensesTable');
    
    if (expenses.length === 0) {
        container.innerHTML = '<p class="text-center text-muted">No expenses found</p>';
        return;
    }
    
    container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th style="text-align: right;">Actions</th>
                </tr>
            </thead>
            <tbody>
                ${expenses.map(expense => {
                    const iconClass = expense.icon || getCategoryIcon(expense.categoryName);
                    const iconColor = expense.color || getCategoryIconColor(expense.categoryName);
                    const bgColor = getCategoryBackgroundColor(expense.categoryName);

                    return `
                    <tr>
                        <td>${formatDate(expense.date)}</td>
                        <td>
                            <div style="display: flex; align-items: center; gap: 0.75rem;">
                                <i class="fas ${iconClass} category-icon" style="background-color: ${bgColor}; color: ${iconColor};"></i>
                                <span>${expense.categoryName}</span>
                            </div>
                        </td>
                        <td>${expense.description || '-'}</td>
                        <td style="font-weight: 500;">${formatCurrency(expense.amount)}</td>
                        <td>
                            <div class="table-actions" style="justify-content: flex-end;">
                                <button class="btn-icon" onclick="editExpense(${expense.id})" title="Edit">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn-icon" onclick="deleteExpense(${expense.id})" title="Delete">
                                    <i class="fas fa-trash" style="color: #EF4444;"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
                }).join('')}
            </tbody>
        </table>
    `;
}

// Update total
function updateTotal() {
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    document.getElementById('totalExpenses').textContent = formatCurrency(total);
}

// Open expense modal
function openExpenseModal() {
    editingExpenseId = null;
    document.getElementById('modalTitle').textContent = 'Add Expense';
    document.getElementById('expenseForm').reset();
    document.getElementById('date').valueAsDate = new Date();
    document.getElementById('expenseModal').classList.add('show');
}

// Close expense modal
function closeExpenseModal() {
    document.getElementById('expenseModal').classList.remove('show');
    editingExpenseId = null;
}

// Edit expense
async function editExpense(id) {
    try {
        const expense = expenses.find(e => e.id === id);
        if (!expense) return;
        
        editingExpenseId = id;
        document.getElementById('modalTitle').textContent = 'Edit Expense';
        document.getElementById('categoryId').value = expense.categoryId;
        document.getElementById('amount').value = expense.amount;
        document.getElementById('description').value = expense.description || '';
        document.getElementById('date').value = expense.date;
        document.getElementById('expenseModal').classList.add('show');
    } catch (error) {
        showError('Failed to load expense');
        console.error(error);
    }
}

// Save expense
async function saveExpense(event) {
    event.preventDefault();
    
    const data = {
        category: { id: parseInt(document.getElementById('categoryId').value) },
        amount: parseFloat(document.getElementById('amount').value),
        description: document.getElementById('description').value,
        date: document.getElementById('date').value
    };
    
    try {
        if (editingExpenseId) {
            await apiCall(API.expenses.update(editingExpenseId), {
                method: 'PUT',
                body: JSON.stringify(data)
            });
            showSuccess('Expense updated successfully');
        } else {
            await apiCall(API.expenses.create(), {
                method: 'POST',
                body: JSON.stringify(data)
            });
            showSuccess('Expense added successfully');
        }
        
        closeExpenseModal();
        loadExpenses();
    } catch (error) {
        showError('Failed to save expense');
        console.error(error);
    }
}

// Delete expense
async function deleteExpense(id) {
    if (!confirm('Are you sure you want to delete this expense?')) return;
    
    try {
        await apiCall(API.expenses.delete(id), { method: 'DELETE' });
        showSuccess('Expense deleted successfully');
        loadExpenses();
    } catch (error) {
        showError('Failed to delete expense');
        console.error(error);
    }
}

