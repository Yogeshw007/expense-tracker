package com.expensetracker.controller;

import com.expensetracker.dto.CategoryBreakdownDTO;
import com.expensetracker.dto.MonthlySummaryDTO;
import com.expensetracker.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/monthly")
    public ResponseEntity<List<MonthlySummaryDTO>> getMonthlySummary(
            @RequestParam String month,
            @RequestParam Integer year) {
        return ResponseEntity.ok(analyticsService.getMonthlySummary(month, year));
    }

    @GetMapping("/breakdown")
    public ResponseEntity<List<CategoryBreakdownDTO>> getCategoryBreakdown(
            @RequestParam String month,
            @RequestParam Integer year) {
        return ResponseEntity.ok(analyticsService.getCategoryBreakdown(month, year));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(analyticsService.getStats());
    }
}

