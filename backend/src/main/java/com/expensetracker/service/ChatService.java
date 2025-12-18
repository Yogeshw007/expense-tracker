package com.expensetracker.service;

import com.expensetracker.dto.ChatResponseDTO;
import com.expensetracker.model.Category;
import com.expensetracker.model.Expense;
import com.expensetracker.repository.CategoryRepository;
import com.expensetracker.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ChatService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    // Smart keyword mapping for category detection
    private static final Map<String, List<String>> CATEGORY_KEYWORDS = new HashMap<String, List<String>>() {{
        put("Food", Arrays.asList("food", "lunch", "dinner", "breakfast", "meal", "restaurant", "pizza", "burger", "coffee", "tea", "snack", "groceries", "grocery", "vegetables", "fruits", "meat", "chicken", "rice", "bread"));
        put("Transport", Arrays.asList("transport", "uber", "ola", "taxi", "cab", "bus", "train", "metro", "fuel", "petrol", "diesel", "gas", "parking", "toll", "auto", "rickshaw"));
        put("Shopping", Arrays.asList("shopping", "clothes", "shoes", "dress", "shirt", "pants", "accessories", "bag", "watch", "electronics", "phone", "laptop", "gadget"));
        put("Entertainment", Arrays.asList("entertainment", "movie", "cinema", "concert", "game", "gaming", "netflix", "spotify", "subscription", "party", "club", "bar"));
        put("Health", Arrays.asList("health", "medicine", "doctor", "hospital", "pharmacy", "medical", "gym", "fitness", "yoga", "therapy", "checkup"));
        put("Bills", Arrays.asList("bill", "electricity", "water", "internet", "wifi", "mobile", "recharge", "rent", "maintenance", "insurance"));
        put("Travel", Arrays.asList("travel", "flight", "hotel", "vacation", "trip", "tour", "booking", "airbnb", "resort"));
        put("Education", Arrays.asList("education", "course", "book", "books", "tuition", "fees", "school", "college", "university", "training"));
    }};

    public ChatResponseDTO processMessage(String message) {
        if (message == null || message.trim().isEmpty()) {
            return new ChatResponseDTO("Please enter a message", "error", null);
        }

        message = message.trim().toLowerCase();

        // Pattern 1: "spent <category> <amount>" or "spent <amount> on <category>"
        // Examples: "spent movie 500", "spent 500 on movie", "spent groceries 1000"
        Pattern spentPattern1 = Pattern.compile("spent\\s+([a-zA-Z]+)\\s+(\\d+(?:\\.\\d+)?)");
        Pattern spentPattern2 = Pattern.compile("spent\\s+(\\d+(?:\\.\\d+)?)\\s+(?:on|for)\\s+([a-zA-Z]+)");

        Matcher matcher1 = spentPattern1.matcher(message);
        Matcher matcher2 = spentPattern2.matcher(message);

        if (matcher1.find()) {
            String keyword = matcher1.group(1);
            double amount = Double.parseDouble(matcher1.group(2));
            return handleExpenseWithKeyword(keyword, amount, message);
        } else if (matcher2.find()) {
            double amount = Double.parseDouble(matcher2.group(1));
            String keyword = matcher2.group(2);
            return handleExpenseWithKeyword(keyword, amount, message);
        }

        // Pattern 3: Quick format "<keyword> <amount>" (e.g., "food 500", "pizza 250")
        Pattern quickPattern = Pattern.compile("^([a-zA-Z]+)\\s+(\\d+(?:\\.\\d+)?)$");
        Matcher quickMatcher = quickPattern.matcher(message);

        if (quickMatcher.find()) {
            String keyword = quickMatcher.group(1);
            double amount = Double.parseDouble(quickMatcher.group(2));
            return handleExpenseWithKeyword(keyword, amount, message);
        }

        // Pattern 4: "new category <name> <limit>" or "create category <name> with limit <amount>"
        // Examples: "new category travel 5000", "create category shopping with limit 3000"
        Pattern newCategoryPattern1 = Pattern.compile("(?:new|create)\\s+category\\s+([a-zA-Z]+)\\s+(\\d+(?:\\.\\d+)?)");
        Pattern newCategoryPattern2 = Pattern.compile("(?:new|create)\\s+category\\s+([a-zA-Z]+)\\s+(?:with\\s+)?limit\\s+(\\d+(?:\\.\\d+)?)");

        Matcher categoryMatcher1 = newCategoryPattern1.matcher(message);
        Matcher categoryMatcher2 = newCategoryPattern2.matcher(message);

        if (categoryMatcher1.find()) {
            String categoryName = categoryMatcher1.group(1);
            double limit = Double.parseDouble(categoryMatcher1.group(2));
            return handleNewCategory(categoryName, limit);
        } else if (categoryMatcher2.find()) {
            String categoryName = categoryMatcher2.group(1);
            double limit = Double.parseDouble(categoryMatcher2.group(2));
            return handleNewCategory(categoryName, limit);
        }

        return new ChatResponseDTO(
            "I didn't understand that. Try:\n" +
            "• 'food 500' - quick add expense\n" +
            "• 'pizza 250' - I'll detect it's food!\n" +
            "• 'uber 150' - I'll detect it's transport!\n" +
            "• 'new category travel 5000' - to create category",
            "error",
            null
        );
    }

    // Smart expense handler with keyword detection
    private ChatResponseDTO handleExpenseWithKeyword(String keyword, double amount, String originalMessage) {
        // First, try to find exact category match
        Optional<Category> exactMatch = categoryRepository.findAll().stream()
            .filter(c -> c.getName().equalsIgnoreCase(keyword))
            .findFirst();

        if (exactMatch.isPresent()) {
            return createExpense(exactMatch.get(), amount, keyword);
        }

        // If no exact match, use smart keyword detection
        String detectedCategory = detectCategoryFromKeyword(keyword);

        if (detectedCategory != null) {
            // Find the detected category in database
            Optional<Category> categoryOpt = categoryRepository.findAll().stream()
                .filter(c -> c.getName().equalsIgnoreCase(detectedCategory))
                .findFirst();

            if (categoryOpt.isPresent()) {
                return createExpense(categoryOpt.get(), amount, keyword);
            } else {
                // Category detected but doesn't exist in DB
                return new ChatResponseDTO(
                    "🤔 I detected '" + keyword + "' as " + detectedCategory + ", but you don't have a '" + detectedCategory + "' category yet.\n\n" +
                    "Create it with: 'new category " + detectedCategory + " 5000'",
                    "error",
                    null
                );
            }
        }

        // No detection possible
        return new ChatResponseDTO(
            "❌ Category '" + keyword + "' not found and I couldn't auto-detect it.\n\n" +
            "Available categories: " + getAvailableCategories() + "\n\n" +
            "Or create it with: 'new category " + keyword + " <limit>'",
            "error",
            null
        );
    }

    // Detect category from keyword using smart mapping
    private String detectCategoryFromKeyword(String keyword) {
        keyword = keyword.toLowerCase();

        for (Map.Entry<String, List<String>> entry : CATEGORY_KEYWORDS.entrySet()) {
            if (entry.getValue().contains(keyword)) {
                return entry.getKey();
            }
        }

        return null;
    }

    // Create expense with smart description
    private ChatResponseDTO createExpense(Category category, double amount, String keyword) {
        Expense expense = new Expense();
        expense.setCategory(category);
        expense.setAmount(amount);
        expense.setDate(LocalDate.now());

        // Smart description based on keyword
        String description = keyword.substring(0, 1).toUpperCase() + keyword.substring(1);
        if (!keyword.equalsIgnoreCase(category.getName())) {
            description += " (" + category.getName() + ")";
        }
        expense.setDescription(description);

        Expense savedExpense = expenseRepository.save(expense);

        return new ChatResponseDTO(
            "✅ Added ₹" + amount + " to " + category.getName() + " category\n" +
            "📝 Description: " + description,
            "success",
            savedExpense
        );
    }

    // Get list of available categories
    private String getAvailableCategories() {
        List<Category> categories = categoryRepository.findAll();
        if (categories.isEmpty()) {
            return "None (create one first!)";
        }

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < categories.size(); i++) {
            sb.append(categories.get(i).getName());
            if (i < categories.size() - 1) {
                sb.append(", ");
            }
        }
        return sb.toString();
    }

    private ChatResponseDTO handleNewCategory(String categoryName, double limit) {
        // Check if category already exists
        Optional<Category> existingCategory = categoryRepository.findAll().stream()
            .filter(c -> c.getName().equalsIgnoreCase(categoryName))
            .findFirst();

        if (existingCategory.isPresent()) {
            return new ChatResponseDTO(
                "Category '" + categoryName + "' already exists",
                "error",
                null
            );
        }

        // Create new category
        Category category = new Category();
        category.setName(categoryName.substring(0, 1).toUpperCase() + categoryName.substring(1));
        category.setMonthlyLimit(limit);
        category.setColor("#3B82F6"); // Default color

        Category savedCategory = categoryRepository.save(category);

        return new ChatResponseDTO(
            "✅ Created category '" + savedCategory.getName() + "' with limit ₹" + limit,
            "success",
            savedCategory
        );
    }
}

