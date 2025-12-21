package com.expensetracker.service;

import com.expensetracker.dto.ExpenseDTO;
import com.expensetracker.model.Category;
import com.expensetracker.model.Expense;
import com.expensetracker.repository.CategoryRepository;
import com.expensetracker.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final CategoryRepository categoryRepository;

    public List<ExpenseDTO> getAllExpenses() {
        return expenseRepository.findAll().stream()
                .map(ExpenseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<ExpenseDTO> getExpensesByMonthAndYear(String month, Integer year) {
        return expenseRepository.findByMonthAndYear(month, year).stream()
                .map(ExpenseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<ExpenseDTO> getExpensesByCategory(Long categoryId) {
        return expenseRepository.findByCategoryId(categoryId).stream()
                .map(ExpenseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<ExpenseDTO> getExpensesByPaymentType(String paymentType) {
        return expenseRepository.findByPaymentType(paymentType).stream()
                .map(ExpenseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<ExpenseDTO> getExpensesByMonthYearAndFilters(String month, Integer year, Long categoryId, String paymentType) {
        return expenseRepository.findByMonthYearAndFilters(month, year, categoryId, paymentType).stream()
                .map(ExpenseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public Optional<ExpenseDTO> getExpenseById(Long id) {
        return expenseRepository.findById(id)
                .map(ExpenseDTO::fromEntity);
    }

    @Transactional
    public ExpenseDTO createExpense(Expense expense) {
        Category category = categoryRepository.findById(expense.getCategory().getId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        
        expense.setCategory(category);
        Expense savedExpense = expenseRepository.save(expense);
        return ExpenseDTO.fromEntity(savedExpense);
    }

    @Transactional
    public ExpenseDTO updateExpense(Long id, Expense expenseDetails) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found with id: " + id));

        if (expenseDetails.getCategory() != null && expenseDetails.getCategory().getId() != null) {
            Category category = categoryRepository.findById(expenseDetails.getCategory().getId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            expense.setCategory(category);
        }

        expense.setAmount(expenseDetails.getAmount());
        expense.setDescription(expenseDetails.getDescription());
        expense.setDate(expenseDetails.getDate());
        expense.setComment(expenseDetails.getComment());
        expense.setPaymentType(expenseDetails.getPaymentType());
        expense.setCardNumber(expenseDetails.getCardNumber());

        Expense updatedExpense = expenseRepository.save(expense);
        return ExpenseDTO.fromEntity(updatedExpense);
    }

    @Transactional
    public void deleteExpense(Long id) {
        expenseRepository.deleteById(id);
    }
}

