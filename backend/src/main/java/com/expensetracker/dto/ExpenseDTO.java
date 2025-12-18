package com.expensetracker.dto;

import com.expensetracker.model.Expense;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseDTO {
    private Long id;
    private Long categoryId;
    private String categoryName;
    private String color;
    private Double amount;
    private String description;
    private LocalDate date;
    private String month;
    private Integer year;
    private LocalDateTime createdAt;

    public static ExpenseDTO fromEntity(Expense expense) {
        ExpenseDTO dto = new ExpenseDTO();
        dto.setId(expense.getId());
        dto.setCategoryId(expense.getCategory().getId());
        dto.setCategoryName(expense.getCategory().getName());
        dto.setColor(expense.getCategory().getColor());
        dto.setAmount(expense.getAmount());
        dto.setDescription(expense.getDescription());
        dto.setDate(expense.getDate());
        dto.setMonth(expense.getMonth());
        dto.setYear(expense.getYear());
        dto.setCreatedAt(expense.getCreatedAt());
        return dto;
    }
}

