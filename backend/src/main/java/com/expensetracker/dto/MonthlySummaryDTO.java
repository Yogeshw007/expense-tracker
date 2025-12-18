package com.expensetracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlySummaryDTO {
    private Long id;
    private String name;
    private String color;
    private Double monthlyLimit;
    private Double totalSpent;
    private Double remaining;
}

