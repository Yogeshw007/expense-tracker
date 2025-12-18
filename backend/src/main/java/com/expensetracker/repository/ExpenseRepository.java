package com.expensetracker.repository;

import com.expensetracker.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    
    List<Expense> findByMonthAndYear(String month, Integer year);
    
    List<Expense> findByYear(Integer year);
    
    List<Expense> findByCategoryId(Long categoryId);
    
    @Query("SELECT e FROM Expense e WHERE e.month = :month AND e.year = :year AND e.category.id = :categoryId")
    List<Expense> findByMonthYearAndCategory(@Param("month") String month, 
                                             @Param("year") Integer year, 
                                             @Param("categoryId") Long categoryId);
}

