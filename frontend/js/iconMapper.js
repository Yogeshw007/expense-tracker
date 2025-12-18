// Icon Mapper - Maps category names to Font Awesome icons
// This automatically assigns appropriate icons based on category names

const CATEGORY_ICON_MAP = {
    // Food & Groceries
    'groceries': 'fa-shopping-cart',
    'grocery': 'fa-shopping-cart',
    'food': 'fa-utensils',
    'restaurant': 'fa-utensils',
    'dining': 'fa-utensils',
    'vegetables': 'fa-carrot',
    'vegetable': 'fa-carrot',
    'fruits': 'fa-apple-alt',
    'fruit': 'fa-apple-alt',
    
    // Transportation
    'petrol': 'fa-gas-pump',
    'fuel': 'fa-gas-pump',
    'gas': 'fa-gas-pump',
    'transport': 'fa-bus',
    'transportation': 'fa-bus',
    'car': 'fa-car',
    'vehicle': 'fa-car',
    'taxi': 'fa-taxi',
    'uber': 'fa-taxi',
    
    // Health & Medical
    'medicine': 'fa-pills',
    'medical': 'fa-briefcase-medical',
    'health': 'fa-heartbeat',
    'hospital': 'fa-hospital',
    'doctor': 'fa-user-md',
    'pharmacy': 'fa-prescription-bottle',
    
    // Utilities & Bills
    'electricity': 'fa-bolt',
    'water': 'fa-tint',
    'internet': 'fa-wifi',
    'phone': 'fa-phone',
    'mobile': 'fa-mobile-alt',
    'rent': 'fa-home',
    'bills': 'fa-file-invoice-dollar',
    'bill': 'fa-file-invoice-dollar',
    
    // Entertainment
    'entertainment': 'fa-film',
    'movie': 'fa-film',
    'movies': 'fa-film',
    'music': 'fa-music',
    'games': 'fa-gamepad',
    'gaming': 'fa-gamepad',
    'sports': 'fa-football-ball',
    
    // Shopping
    'shopping': 'fa-shopping-bag',
    'clothes': 'fa-tshirt',
    'clothing': 'fa-tshirt',
    'fashion': 'fa-tshirt',
    
    // Education
    'education': 'fa-graduation-cap',
    'books': 'fa-book',
    'book': 'fa-book',
    'course': 'fa-chalkboard-teacher',
    'tuition': 'fa-school',
    
    // Personal Care
    'beauty': 'fa-spa',
    'salon': 'fa-cut',
    'haircut': 'fa-cut',
    'gym': 'fa-dumbbell',
    'fitness': 'fa-dumbbell',
    
    // Finance
    'insurance': 'fa-shield-alt',
    'investment': 'fa-chart-line',
    'savings': 'fa-piggy-bank',
    'loan': 'fa-hand-holding-usd',
    
    // Miscellaneous
    'gift': 'fa-gift',
    'gifts': 'fa-gift',
    'donation': 'fa-hand-holding-heart',
    'charity': 'fa-hand-holding-heart',
    'travel': 'fa-plane',
    'vacation': 'fa-umbrella-beach',
    'pet': 'fa-paw',
    'pets': 'fa-paw',
    'coffee': 'fa-coffee',
    'snacks': 'fa-cookie',
};

// Default icon if no match found
const DEFAULT_ICON = 'fa-wallet';

/**
 * Get icon for a category based on its name
 * @param {string} categoryName - The name of the category
 * @returns {string} Font Awesome icon class
 */
function getCategoryIcon(categoryName) {
    if (!categoryName) return DEFAULT_ICON;
    
    const normalizedName = categoryName.toLowerCase().trim();
    
    // Direct match
    if (CATEGORY_ICON_MAP[normalizedName]) {
        return CATEGORY_ICON_MAP[normalizedName];
    }
    
    // Partial match - check if category name contains any keyword
    for (const [keyword, icon] of Object.entries(CATEGORY_ICON_MAP)) {
        if (normalizedName.includes(keyword) || keyword.includes(normalizedName)) {
            return icon;
        }
    }
    
    return DEFAULT_ICON;
}

/**
 * Get color for a category based on its name
 * @param {string} categoryName - The name of the category
 * @returns {string} Hex color code
 */
function getCategoryColor(categoryName) {
    const colorMap = {
        // Food - Green shades
        'groceries': '#10B981',
        'vegetables': '#059669',
        'food': '#34D399',
        
        // Transportation - Red/Orange shades
        'petrol': '#EF4444',
        'fuel': '#DC2626',
        'transport': '#F97316',
        
        // Health - Blue shades
        'medicine': '#3B82F6',
        'medical': '#2563EB',
        'health': '#60A5FA',
        
        // Bills - Purple shades
        'electricity': '#8B5CF6',
        'water': '#6366F1',
        'internet': '#A78BFA',
        'rent': '#7C3AED',
        
        // Entertainment - Pink shades
        'entertainment': '#EC4899',
        'movie': '#F472B6',
        
        // Shopping - Yellow shades
        'shopping': '#F59E0B',
        'clothes': '#FBBF24',
        
        // Default
        'default': '#6B7280'
    };
    
    const normalizedName = categoryName.toLowerCase().trim();
    
    // Direct match
    if (colorMap[normalizedName]) {
        return colorMap[normalizedName];
    }
    
    // Partial match
    for (const [keyword, color] of Object.entries(colorMap)) {
        if (normalizedName.includes(keyword) || keyword.includes(normalizedName)) {
            return color;
        }
    }
    
    return colorMap.default;
}

// Convert hex color to RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// Get background color with opacity for icon circle
function getCategoryBackgroundColor(categoryName) {
    const baseColor = getCategoryColor(categoryName);
    const rgb = hexToRgb(baseColor);
    if (rgb) {
        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`;
    }
    return 'rgba(107, 114, 128, 0.15)'; // default gray with opacity
}

// Get icon color (the actual icon color, not background)
function getCategoryIconColor(categoryName) {
    return getCategoryColor(categoryName); // Use the full color for the icon itself
}

