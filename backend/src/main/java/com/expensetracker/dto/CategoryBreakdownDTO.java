package com.expensetracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryBreakdownDTO {
    private Long id;
    private String name;
    private String color;
    private Double totalSpent;
    private Long expenseCount;
}

