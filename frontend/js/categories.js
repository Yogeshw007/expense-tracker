// Categories Page

let categories = [];
let editingCategoryId = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
});

// Load categories
async function loadCategories() {
    try {
        categories = await apiCall(API.categories.getAll());
        renderCategories();
    } catch (error) {
        showError('Failed to load categories');
        console.error(error);
    }
}

// Render categories
function renderCategories() {
    const container = document.getElementById('categoriesGrid');
    
    if (categories.length === 0) {
        container.innerHTML = '<p class="text-center text-muted">No categories found</p>';
        return;
    }
    
    container.innerHTML = categories.map(category => {
        const iconClass = category.icon || getCategoryIcon(category.name);
        const iconColor = category.color || getCategoryIconColor(category.name);
        const bgColor = getCategoryBackgroundColor(category.name);

        return `
        <div class="category-card">
            <div class="category-card-header">
                <div class="category-card-title">
                    <i class="fas ${iconClass} category-icon" style="background-color: ${bgColor}; color: ${iconColor};"></i>
                    <span>${category.name}</span>
                </div>
                <div class="category-card-actions">
                    <button class="btn-icon" onclick="editCategory(${category.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" onclick="deleteCategory(${category.id})" title="Delete">
                        <i class="fas fa-trash" style="color: #EF4444;"></i>
                    </button>
                </div>
            </div>
            <div class="category-card-body">
                <div class="category-info">
                    <span class="category-info-label">Monthly Limit</span>
                    <span class="category-info-value">${formatCurrency(category.monthlyLimit)}</span>
                </div>
                <div class="category-info">
                    <span class="category-info-label">Created</span>
                    <span class="category-info-value">${formatDate(category.createdAt)}</span>
                </div>
            </div>
        </div>
    `;
    }).join('');
}

// Open category modal
function openCategoryModal() {
    editingCategoryId = null;
    document.getElementById('modalTitle').textContent = 'Add Category';
    document.getElementById('categoryForm').reset();
    document.getElementById('categoryModal').classList.add('show');
}

// Close category modal
function closeCategoryModal() {
    document.getElementById('categoryModal').classList.remove('show');
    editingCategoryId = null;
}

// Edit category
async function editCategory(id) {
    try {
        const category = categories.find(c => c.id === id);
        if (!category) return;

        editingCategoryId = id;

        document.getElementById('modalTitle').textContent = 'Edit Category';
        document.getElementById('name').value = category.name;
        document.getElementById('monthlyLimit').value = category.monthlyLimit;

        document.getElementById('categoryModal').classList.add('show');
    } catch (error) {
        showError('Failed to load category');
        console.error(error);
    }
}

// Save category
async function saveCategory(event) {
    event.preventDefault();

    const categoryName = document.getElementById('name').value;
    const data = {
        name: categoryName,
        monthlyLimit: parseFloat(document.getElementById('monthlyLimit').value),
        color: getCategoryColor(categoryName),
        icon: getCategoryIcon(categoryName)
    };

    try {
        if (editingCategoryId) {
            await apiCall(API.categories.update(editingCategoryId), {
                method: 'PUT',
                body: JSON.stringify(data)
            });
            showSuccess('Category updated successfully');
        } else {
            await apiCall(API.categories.create(), {
                method: 'POST',
                body: JSON.stringify(data)
            });
            showSuccess('Category added successfully');
        }
        
        closeCategoryModal();
        loadCategories();
    } catch (error) {
        showError('Failed to save category');
        console.error(error);
    }
}

// Delete category
async function deleteCategory(id) {
    if (!confirm('Are you sure you want to delete this category? All associated expenses will also be deleted.')) return;
    
    try {
        await apiCall(API.categories.delete(id), { method: 'DELETE' });
        showSuccess('Category deleted successfully');
        loadCategories();
    } catch (error) {
        showError('Failed to delete category');
        console.error(error);
    }
}

