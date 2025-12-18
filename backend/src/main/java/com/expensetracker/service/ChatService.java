package com.expensetracker.service;

import com.expensetracker.dto.ChatResponseDTO;
import com.expensetracker.model.Category;
import com.expensetracker.model.Expense;
import com.expensetracker.repository.CategoryRepository;
import com.expensetracker.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ChatService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private CategoryRepository categoryRepository;

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
            String categoryName = matcher1.group(1);
            double amount = Double.parseDouble(matcher1.group(2));
            return handleExpense(categoryName, amount);
        } else if (matcher2.find()) {
            double amount = Double.parseDouble(matcher2.group(1));
            String categoryName = matcher2.group(2);
            return handleExpense(categoryName, amount);
        }

        // Pattern 2: "new category <name> <limit>" or "create category <name> with limit <amount>"
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
            "• 'spent movie 500' - to add expense\n" +
            "• 'spent 500 on groceries' - to add expense\n" +
            "• 'new category travel 5000' - to create category",
            "error",
            null
        );
    }

    private ChatResponseDTO handleExpense(String categoryName, double amount) {
        // Find category by name (case-insensitive)
        Optional<Category> categoryOpt = categoryRepository.findAll().stream()
            .filter(c -> c.getName().equalsIgnoreCase(categoryName))
            .findFirst();

        if (!categoryOpt.isPresent()) {
            return new ChatResponseDTO(
                "Category '" + categoryName + "' not found. Create it first using: 'new category " + categoryName + " <limit>'",
                "error",
                null
            );
        }

        Category category = categoryOpt.get();
        
        // Create expense
        Expense expense = new Expense();
        expense.setCategory(category);
        expense.setAmount(amount);
        expense.setDate(LocalDate.now());
        expense.setDescription("Added via chat");
        // month and year are set automatically by @PrePersist

        Expense savedExpense = expenseRepository.save(expense);

        return new ChatResponseDTO(
            "✅ Added ₹" + amount + " to " + category.getName() + " category",
            "success",
            savedExpense
        );
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

