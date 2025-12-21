// Utility Functions

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Get current month
function getCurrentMonth() {
    const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
                   'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
    return months[new Date().getMonth()];
}

// Get current year
function getCurrentYear() {
    return new Date().getFullYear();
}

// Get month name
function getMonthName(month) {
    const months = {
        'JANUARY': 'January', 'FEBRUARY': 'February', 'MARCH': 'March',
        'APRIL': 'April', 'MAY': 'May', 'JUNE': 'June',
        'JULY': 'July', 'AUGUST': 'August', 'SEPTEMBER': 'September',
        'OCTOBER': 'October', 'NOVEMBER': 'November', 'DECEMBER': 'December'
    };
    return months[month] || month;
}

// Populate year filter
function populateYearFilter(selectId) {
    const select = document.getElementById(selectId);
    const currentYear = getCurrentYear();
    
    for (let i = currentYear; i >= currentYear - 5; i--) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        if (i === currentYear) option.selected = true;
        select.appendChild(option);
    }
}

// Show error message
function showError(message) {
    alert('Error: ' + message);
}

// Show success message
function showSuccess(message) {
    alert(message);
}

// API call helper
async function apiCall(url, options = {}) {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Check if response has content
        const text = await response.text();
        return text ? JSON.parse(text) : null;
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

