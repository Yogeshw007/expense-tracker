// Dashboard Page

let monthlySummary = [];
let stats = {};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const currentMonth = getCurrentMonth();
    const currentYear = getCurrentYear();
    
    document.getElementById('currentMonthYear').textContent = 
        `${getMonthName(currentMonth)} ${currentYear} - Overview of your expenses`;
    
    loadDashboard();
});

// Load dashboard data
async function loadDashboard() {
    try {
        const currentMonth = getCurrentMonth();
        const currentYear = getCurrentYear();
        
        const [summaryData, statsData] = await Promise.all([
            apiCall(API.analytics.monthly(currentMonth, currentYear)),
            apiCall(API.analytics.stats())
        ]);
        
        monthlySummary = summaryData;
        stats = statsData;
        
        updateStats();
        renderCategoryBreakdown();
    } catch (error) {
        showError('Failed to load dashboard data');
        console.error(error);
    }
}

// Update stats cards
function updateStats() {
    const totalBudget = monthlySummary.reduce((sum, cat) => sum + cat.monthlyLimit, 0);
    const totalSpent = monthlySummary.reduce((sum, cat) => sum + cat.totalSpent, 0);
    const totalRemaining = totalBudget - totalSpent;
    
    document.getElementById('totalBudget').textContent = formatCurrency(totalBudget);
    document.getElementById('totalSpent').textContent = formatCurrency(totalSpent);
    document.getElementById('totalRemaining').textContent = formatCurrency(totalRemaining);
    document.getElementById('totalCategories').textContent = stats.totalCategories || 0;
    
    // Update remaining color
    const remainingElement = document.getElementById('totalRemaining');
    if (totalRemaining < 0) {
        remainingElement.style.color = '#EF4444';
    } else {
        remainingElement.style.color = '#10B981';
    }
}

// Render category breakdown
function renderCategoryBreakdown() {
    const container = document.getElementById('categoryBreakdown');

    if (monthlySummary.length === 0) {
        container.innerHTML = '<p class="text-center text-muted">No categories found</p>';
        return;
    }

    container.innerHTML = monthlySummary.map(category => {
        const percentage = (category.totalSpent / category.monthlyLimit) * 100;
        const isOverBudget = percentage > 100;

        const iconClass = category.icon || getCategoryIcon(category.name);
        const iconColor = category.color || getCategoryIconColor(category.name);
        const bgColor = getCategoryBackgroundColor(category.name);

        return `
            <div class="category-item">
                <div class="category-header">
                    <div class="category-name">
                        <i class="fas ${iconClass} category-icon" style="background-color: ${bgColor}; color: ${iconColor};"></i>
                        <span>${category.name}</span>
                    </div>
                    <div class="category-amount">
                        ${formatCurrency(category.totalSpent)} / ${formatCurrency(category.monthlyLimit)}
                    </div>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill ${isOverBudget ? 'over-budget' : ''}"
                         style="width: ${Math.min(percentage, 100)}%"></div>
                </div>
                ${isOverBudget ? `
                    <p class="over-budget-text">
                        ⚠️ Over budget by ${formatCurrency(category.totalSpent - category.monthlyLimit)}
                    </p>
                ` : ''}
            </div>
        `;
    }).join('');
}

// Quick Add Form functionality
let categoriesData = [];

// Load categories for dropdown
async function loadCategoriesForQuickAdd() {
    try {
        console.log('Loading categories for Quick Add...');
        const categories = await apiCall(API.categories.getAll());
        categoriesData = categories;

        console.log('Categories loaded:', categories.length);

        const categorySelect = document.getElementById('categorySelect');
        if (categorySelect) {
            categorySelect.innerHTML = '<option value="">Select Category</option>';

            if (categories && categories.length > 0) {
                categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.id;
                    // Use monthlyLimit from API response
                    const limit = category.monthlyLimit || category.budgetLimit || 0;
                    option.textContent = `${category.name} (₹${limit.toLocaleString()})`;
                    categorySelect.appendChild(option);
                });
                console.log('✅ Categories populated in dropdown:', categories.length);
            } else {
                console.warn('⚠️ No categories found');
                const option = document.createElement('option');
                option.value = '';
                option.textContent = 'No categories available - Create one first';
                option.disabled = true;
                categorySelect.appendChild(option);
            }
        } else {
            console.error('❌ Category select element not found');
        }
    } catch (error) {
        console.error('❌ Error loading categories:', error);
        const categorySelect = document.getElementById('categorySelect');
        if (categorySelect) {
            categorySelect.innerHTML = '<option value="">Error loading categories</option>';
        }
    }
}

// Handle action type change
const actionTypeSelect = document.getElementById('actionType');
if (actionTypeSelect) {
    actionTypeSelect.addEventListener('change', async function() {
        const actionType = this.value;
        const categoryGroup = document.getElementById('categoryGroup');
        const categorySelect = document.getElementById('categorySelect');
        const newCategoryName = document.getElementById('newCategoryName');
        const amountGroup = document.getElementById('amountGroup');
        const amountLabel = document.getElementById('amountLabel');
        const amountInput = document.getElementById('amount');
        const quickAddBtn = document.getElementById('quickAddBtn');

        if (actionType === 'expense') {
            // Reload categories to ensure fresh data
            await loadCategoriesForQuickAdd();

            // Show category dropdown, hide new category input
            categoryGroup.style.display = 'block';
            categorySelect.style.display = 'block';
            newCategoryName.style.display = 'none';
            categorySelect.required = true;
            newCategoryName.required = false;

            // Update category label to show count
            const categoryLabel = categoryGroup.querySelector('label');
            if (categoryLabel && categoriesData.length > 0) {
                categoryLabel.innerHTML = `<i class="fas fa-tag"></i> Category <span style="color: #fbbf24; font-size: 0.85em;">(${categoriesData.length} available)</span>`;
            }

            // Show amount field
            amountGroup.style.display = 'block';
            amountLabel.textContent = 'Amount Spent';
            amountInput.placeholder = 'Enter amount spent';
            amountInput.required = true;

            // Update button
            quickAddBtn.innerHTML = '<i class="fas fa-plus-circle"></i> Add Expense';

            console.log('💸 Add Expense mode - Categories:', categoriesData.length);

        } else if (actionType === 'category') {
            // Hide category dropdown, show new category input
            categoryGroup.style.display = 'block';
            categorySelect.style.display = 'none';
            newCategoryName.style.display = 'block';
            categorySelect.required = false;
            newCategoryName.required = true;

            // Show amount field
            amountGroup.style.display = 'block';
            amountLabel.textContent = 'Budget Limit';
            amountInput.placeholder = 'Enter budget limit';
            amountInput.required = true;

            // Update button
            quickAddBtn.innerHTML = '<i class="fas fa-plus-circle"></i> Create Category';

            console.log('📁 New Category mode');

        } else {
            // Hide all fields
            categoryGroup.style.display = 'none';
            amountGroup.style.display = 'none';
            quickAddBtn.innerHTML = '<i class="fas fa-plus-circle"></i> Add';
        }
    });
}

// Handle quick add form submission
const quickAddForm = document.getElementById('quickAddForm');
if (quickAddForm) {
    quickAddForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const actionType = document.getElementById('actionType').value;
        const quickAddBtn = document.getElementById('quickAddBtn');
        const originalBtnText = quickAddBtn.innerHTML;

        try {
            quickAddBtn.disabled = true;
            quickAddBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

            if (actionType === 'expense') {
                // Add expense
                const categoryId = document.getElementById('categorySelect').value;
                const amount = parseFloat(document.getElementById('amount').value);

                if (!categoryId || !amount) {
                    throw new Error('Please fill all fields');
                }

                const category = categoriesData.find(c => c.id == categoryId);

                const expense = {
                    description: `Quick expense - ${category.name}`,
                    amount: amount,
                    date: new Date().toISOString().split('T')[0],
                    category: { id: categoryId }
                };

                await apiCall(API.expenses.create(), {
                    method: 'POST',
                    body: JSON.stringify(expense)
                });
                showNotification('✅ Expense added successfully!', 'success');

            } else if (actionType === 'category') {
                // Add category
                const categoryName = document.getElementById('newCategoryName').value;
                const budgetLimit = parseFloat(document.getElementById('amount').value);

                if (!categoryName || !budgetLimit) {
                    throw new Error('Please fill all fields');
                }

                const category = {
                    name: categoryName,
                    monthlyLimit: budgetLimit  // API expects monthlyLimit, not budgetLimit
                };

                await apiCall(API.categories.create(), {
                    method: 'POST',
                    body: JSON.stringify(category)
                });
                showNotification('✅ Category created successfully!', 'success');

                // Reload categories dropdown
                await loadCategoriesForQuickAdd();
            }

            // Reset form
            this.reset();
            document.getElementById('categoryGroup').style.display = 'none';
            document.getElementById('amountGroup').style.display = 'none';

            // Reload dashboard data
            loadDashboard();

        } catch (error) {
            console.error('Error:', error);
            showNotification('❌ ' + (error.message || 'Failed to process request'), 'error');
        } finally {
            quickAddBtn.disabled = false;
            quickAddBtn.innerHTML = originalBtnText;
        }
    });
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 5rem;
        right: 2rem;
        background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        font-weight: 600;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Wake up server function
async function wakeUpServer() {
    const statusDiv = document.getElementById('serverStatus');
    const statusText = document.getElementById('statusText');
    const wakeUpButton = document.getElementById('wakeUpButton');

    // Show status indicator
    statusDiv.style.display = 'block';
    statusText.textContent = 'Waking up server...';
    wakeUpButton.disabled = true;
    wakeUpButton.style.opacity = '0.5';

    try {
        // Ping the server multiple times to ensure it wakes up
        statusText.textContent = 'Pinging server (1/3)...';
        await fetch(`${API_BASE_URL}/categories`, { method: 'GET' }).catch(() => {});

        await new Promise(resolve => setTimeout(resolve, 2000));

        statusText.textContent = 'Pinging server (2/3)...';
        await fetch(`${API_BASE_URL}/analytics/stats`, { method: 'GET' }).catch(() => {});

        await new Promise(resolve => setTimeout(resolve, 2000));

        statusText.textContent = 'Verifying server status (3/3)...';
        const response = await fetch(`${API_BASE_URL}/categories`);

        if (response.ok) {
            statusText.innerHTML = '<i class="fas fa-check-circle"></i> Server is UP!';
            statusDiv.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';

            // Reload dashboard data
            setTimeout(() => {
                loadDashboardData();
                statusDiv.style.display = 'none';
                statusDiv.style.background = 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)';
            }, 2000);
        } else {
            throw new Error('Server not responding');
        }
    } catch (error) {
        statusText.innerHTML = '<i class="fas fa-exclamation-circle"></i> Server is still starting... Please wait 30 seconds and try again.';
        statusDiv.style.background = 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)';

        setTimeout(() => {
            statusDiv.style.display = 'none';
            statusDiv.style.background = 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)';
        }, 5000);
    } finally {
        wakeUpButton.disabled = false;
        wakeUpButton.style.opacity = '1';
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadCategoriesForQuickAdd();

    // Hide category and amount fields initially
    const categoryGroup = document.getElementById('categoryGroup');
    const amountGroup = document.getElementById('amountGroup');
    if (categoryGroup) categoryGroup.style.display = 'none';
    if (amountGroup) amountGroup.style.display = 'none';
});

