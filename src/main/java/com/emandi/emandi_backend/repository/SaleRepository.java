package com.emandi.emandi_backend.repository;
import com.emandi.emandi_backend.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDateTime;
import java.util.List;
public interface SaleRepository extends JpaRepository<Sale, Long> {
    List<Sale> findBySaleDateBetween(LocalDateTime start, LocalDateTime end);
    @Query("SELECT SUM(s.totalAmount) FROM Sale s") Double getTotalRevenue();
    @Query("SELECT COUNT(s) FROM Sale s") Long getTotalSalesCount();
    @Query("SELECT SUM(s.quantitySold) FROM Sale s") Double getTotalQuantitySold();
    @Query("SELECT SUM(s.totalAmount) FROM Sale s WHERE s.paymentStatus = 'PENDING'") Double getTotalPendingPayments();
    @Query("SELECT s.produceLot.cropName, SUM(s.totalAmount), SUM(s.quantitySold) FROM Sale s GROUP BY s.produceLot.cropName ORDER BY SUM(s.totalAmount) DESC")
    List<Object[]> getSalesByCrop();
}