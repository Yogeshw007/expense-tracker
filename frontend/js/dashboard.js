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

