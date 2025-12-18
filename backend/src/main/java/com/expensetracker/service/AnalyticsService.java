package com.expensetracker.service;

import com.expensetracker.dto.CategoryBreakdownDTO;
import com.expensetracker.dto.MonthlySummaryDTO;
import com.expensetracker.model.Category;
import com.expensetracker.model.Expense;
import com.expensetracker.repository.CategoryRepository;
import com.expensetracker.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final CategoryRepository categoryRepository;
    private final ExpenseRepository expenseRepository;

    public List<MonthlySummaryDTO> getMonthlySummary(String month, Integer year) {
        List<Category> categories = categoryRepository.findAll();
        List<Expense> expenses = expenseRepository.findByMonthAndYear(month, year);

        Map<Long, Double> categoryExpenses = expenses.stream()
                .collect(Collectors.groupingBy(
                        e -> e.getCategory().getId(),
                        Collectors.summingDouble(Expense::getAmount)
                ));

        return categories.stream()
                .map(category -> {
                    Double totalSpent = categoryExpenses.getOrDefault(category.getId(), 0.0);
                    Double remaining = category.getMonthlyLimit() - totalSpent;
                    
                    return new MonthlySummaryDTO(
                            category.getId(),
                            category.getName(),
                            category.getColor(),
                            category.getMonthlyLimit(),
                            totalSpent,
                            remaining
                    );
                })
                .collect(Collectors.toList());
    }

    public List<CategoryBreakdownDTO> getCategoryBreakdown(String month, Integer year) {
        List<Expense> expenses = expenseRepository.findByMonthAndYear(month, year);

        Map<Long, List<Expense>> groupedExpenses = expenses.stream()
                .collect(Collectors.groupingBy(e -> e.getCategory().getId()));

        return groupedExpenses.entrySet().stream()
                .map(entry -> {
                    Category category = entry.getValue().get(0).getCategory();
                    Double totalSpent = entry.getValue().stream()
                            .mapToDouble(Expense::getAmount)
                            .sum();
                    Long count = (long) entry.getValue().size();

                    return new CategoryBreakdownDTO(
                            category.getId(),
                            category.getName(),
                            category.getColor(),
                            totalSpent,
                            count
                    );
                })
                .collect(Collectors.toList());
    }

    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        
        long totalCategories = categoryRepository.count();
        long totalExpenses = expenseRepository.count();
        
        Double totalBudget = categoryRepository.findAll().stream()
                .mapToDouble(Category::getMonthlyLimit)
                .sum();
        
        stats.put("totalCategories", totalCategories);
        stats.put("totalExpenses", totalExpenses);
        stats.put("totalBudget", totalBudget);
        
        return stats;
    }
}

