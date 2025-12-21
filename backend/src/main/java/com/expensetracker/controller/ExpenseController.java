package com.expensetracker.controller;

import com.expensetracker.dto.ExpenseDTO;
import com.expensetracker.model.Expense;
import com.expensetracker.service.ExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @GetMapping
    public ResponseEntity<List<ExpenseDTO>> getExpenses(
            @RequestParam(required = false) String month,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String paymentType) {

        if (month != null && year != null && (categoryId != null || paymentType != null)) {
            return ResponseEntity.ok(expenseService.getExpensesByMonthYearAndFilters(month, year, categoryId, paymentType));
        } else if (month != null && year != null) {
            return ResponseEntity.ok(expenseService.getExpensesByMonthAndYear(month, year));
        } else if (categoryId != null) {
            return ResponseEntity.ok(expenseService.getExpensesByCategory(categoryId));
        } else if (paymentType != null) {
            return ResponseEntity.ok(expenseService.getExpensesByPaymentType(paymentType));
        } else {
            return ResponseEntity.ok(expenseService.getAllExpenses());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExpenseDTO> getExpenseById(@PathVariable Long id) {
        return expenseService.getExpenseById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ExpenseDTO> createExpense(@Valid @RequestBody Expense expense) {
        ExpenseDTO created = expenseService.createExpense(expense);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpenseDTO> updateExpense(@PathVariable Long id, 
                                                    @Valid @RequestBody Expense expense) {
        try {
            ExpenseDTO updated = expenseService.updateExpense(id, expense);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.noContent().build();
    }
}

