// Analytics Page

let pieChart = null;
let barChart = null;
let breakdown = [];
let monthlySummary = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    populateYearFilter('yearFilter');
    document.getElementById('monthFilter').value = getCurrentMonth();
    document.getElementById('yearFilter').value = getCurrentYear();
    
    loadAnalytics();
});

// Load analytics
async function loadAnalytics() {
    try {
        const month = document.getElementById('monthFilter').value;
        const year = document.getElementById('yearFilter').value;
        
        const [breakdownData, summaryData] = await Promise.all([
            apiCall(API.analytics.breakdown(month, year)),
            apiCall(API.analytics.monthly(month, year))
        ]);
        
        breakdown = breakdownData;
        monthlySummary = summaryData;
        
        renderCharts();
        renderBreakdownTable();
    } catch (error) {
        showError('Failed to load analytics');
        console.error(error);
    }
}

// Render charts
function renderCharts() {
    if (breakdown.length === 0) {
        document.getElementById('pieChart').parentElement.innerHTML = 
            '<p class="text-center text-muted">No data available</p>';
        document.getElementById('barChart').parentElement.innerHTML = 
            '<p class="text-center text-muted">No data available</p>';
        return;
    }
    
    renderPieChart();
    renderBarChart();
}

// Render pie chart
function renderPieChart() {
    const ctx = document.getElementById('pieChart').getContext('2d');
    
    if (pieChart) pieChart.destroy();
    
    const totalSpent = breakdown.reduce((sum, item) => sum + item.totalSpent, 0);
    document.getElementById('totalSpent').textContent = formatCurrency(totalSpent);
    
    pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: breakdown.map(item => item.name),
            datasets: [{
                data: breakdown.map(item => item.totalSpent),
                backgroundColor: breakdown.map(item => item.color || getCategoryColor(item.name)),
                borderColor: '#ffffff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + formatCurrency(context.parsed);
                        }
                    }
                }
            }
        }
    });
}

// Render bar chart
function renderBarChart() {
    const ctx = document.getElementById('barChart').getContext('2d');
    
    if (barChart) barChart.destroy();
    
    barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: monthlySummary.map(item => item.name),
            datasets: [
                {
                    label: 'Budget',
                    data: monthlySummary.map(item => item.monthlyLimit),
                    backgroundColor: 'rgba(59, 130, 246, 0.5)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Spent',
                    data: monthlySummary.map(item => item.totalSpent),
                    backgroundColor: monthlySummary.map(item => 
                        item.totalSpent > item.monthlyLimit ? 'rgba(239, 68, 68, 0.5)' : 'rgba(16, 185, 129, 0.5)'
                    ),
                    borderColor: monthlySummary.map(item => 
                        item.totalSpent > item.monthlyLimit ? 'rgba(239, 68, 68, 1)' : 'rgba(16, 185, 129, 1)'
                    ),
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + formatCurrency(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Render breakdown table
function renderBreakdownTable() {
    const container = document.getElementById('breakdownTable');
    
    if (breakdown.length === 0) {
        container.innerHTML = '<p class="text-center text-muted">No data available</p>';
        return;
    }
    
    const totalSpent = breakdown.reduce((sum, item) => sum + item.totalSpent, 0);
    
    container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Category</th>
                    <th>Expenses</th>
                    <th>Amount</th>
                    <th>% of Total</th>
                </tr>
            </thead>
            <tbody>
                ${breakdown.map(item => {
                    const iconClass = item.icon || getCategoryIcon(item.name);
                    const iconColor = item.color || getCategoryIconColor(item.name);
                    const bgColor = getCategoryBackgroundColor(item.name);

                    return `
                    <tr>
                        <td>
                            <div style="display: flex; align-items: center; gap: 0.75rem;">
                                <i class="fas ${iconClass} category-icon" style="background-color: ${bgColor}; color: ${iconColor};"></i>
                                <span style="font-weight: 500;">${item.name}</span>
                            </div>
                        </td>
                        <td>${item.expenseCount}</td>
                        <td style="font-weight: 500;">${formatCurrency(item.totalSpent)}</td>
                        <td>${((item.totalSpent / totalSpent) * 100).toFixed(1)}%</td>
                    </tr>
                `;
                }).join('')}
            </tbody>
        </table>
    `;
}

